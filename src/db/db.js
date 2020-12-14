'use strict';
import { getRepository, createConnection } from "typeorm";
import { Cap } from './entity/jlc/Cap';
import { Res } from './entity/jlc/Res';
import { Diode } from './entity/jlc/Diode';
import { Connector } from './entity/jlc/Connector';
import { ipcMain } from 'electron';
import log from 'electron-log';
import search from './search';
import { BomCap } from './entity/bom/Cap';
import { BomRes } from './entity/bom/Res';
import { BomDiode } from './entity/bom/Diode';
import { BomConnector } from './entity/bom/Connector';
import Store from 'electron-store';

const store = new Store();

export default class Db {
    constructor(win, logEnable = true) {
        this.win = win;
        this.log = logEnable;
        this.repo = {}
        this.connected = {
            jlc: false,
            bom: false,
        }
        this.lastErr = {
            jlc: '',
            bom: ''
        }
        this.search = new search(this.repo)
        // this.repo={
        //     jlc:this.jlc
        // }
        // this.jlc = getConnection('jlc');
        // this.bom = getConnection('bom');
        ipcMain.on('dbConnecStatus', (evt, db) => {
            evt.returnValue = {
                status:this.connected[db],
                msg:this.lastErr[db]
            }
        })
        ipcMain.on('search', (evt, val) => {
            let ret
            if (this.connected[val.db])
                ret = this.search.search(val.db, val.column, val.type, val.msg)
            else
                ret = []
            let parseRet = []
            for (let i in ret) {
                parseRet.push(this.parseJlc(ret[i]))
            }
            evt.reply(val.event, parseRet)
        })
        ipcMain.on('dbDeleteItem', (evt, db) => {
            if (this.connected[db.db]) {
                this.repo[db.db][db.column].delete(db.value.id).then(() => {
                    let ret = db
                    ret.status = true
                    evt.reply(db.event, ret)
                }).catch(err => {
                    log.error(err)
                    let ret = db
                    ret.status = false
                    ret.err = err.message
                    evt.reply(db.event, ret)
                })
            } else {
                let ret = db
                ret.status = false
                ret.err = `${db.db} doesn't connect`
                evt.reply(db.event, ret)
            }

        })
        ipcMain.on('dbCreateItem', (evt, db) => {
            if (this.connected[db.db]) {
                this.repo[db.db][db.column].save(db.value).then(() => {
                    let ret = db
                    ret.status = true
                    evt.reply(db.event, ret)
                }).catch(err => {
                    log.error(err)
                    let ret = db
                    ret.status = false
                    ret.err = err.message
                    evt.reply(db.event, ret)
                })
            } else {
                let ret = db
                ret.status = false
                ret.err = `${db.db} doesn't connect`
                evt.reply(db.event, ret)
            }

        })
        ipcMain.on('dbGetCount', (evt, db) => {
            if (this.connected[db.db]) {
                if((db.buildSearch !=undefined)&&(db.buildSearch)){
                    this.search.buildSearch(db.db, db.column, db.type, () => {
                        log.info("build search ok");
                    })
                }
                this.repo[db.db][db.column].count(db.option != undefined ? db.option : '').then(val => {
                    let ret = db
                    ret.count = val
                    evt.reply(db.event, ret)
                }).catch(err => {
                    log.error(err)
                })
            } else {
                let ret = db
                ret.count = 0
                evt.reply(db.event, ret)
            }
        })
        ipcMain.on('getData', (evt, db) => {
            if (this.connected[db.db]) {
                this.repo[db.db][db.column].find({
                    skip: db.start,
                    take: db.end - db.start,
                    where: db.where != undefined ? db.where : ''
                }).then((val) => {
                    let ret = db
                    ret.data = []
                    for (let i in val) {
                        if(db.db=='jlc')
                            ret.data.push(this.parseJlc(val[i], db.column))
                        else
                            ret.data.push(val[i])
                    }
                    evt.reply(db.event, ret)

                }).catch(err => {
                    log.error(err)
                })
            } else {
                let ret = db
                ret.data = []
                evt.reply(db.event, ret)
            }

        })
    }
    parseJlc(val, g) {
        var a = {
            pn: '',
            vendor: '',
            vendorPn: '',
            vendorUrl: '',
            value: '',
            prices: [],
            imgs: [],
            symbolUrl: '',
            footprint: '',
            fpUrl: '',
            desc: '',
            datasheet: '',
            g: 'cap',
            type: '',
        }
        if (val != null) {
            let svgs = [];
            if (val.svgs != null)
                svgs = val.svgs.split(',');
            a.g = g
            a.pn = val.pn;
            if (val.imgs != null)
                a.imgs = val.imgs.split(',');
            a.vendorPn = val.jlcpn;
            a.vendorUrl = val.jlcurl;
            a.vendor = 'jlc';
            a.desc = val.desc;
            a.footprint = val.footprint;
            if (svgs.length > 0) {
                a.symbolUrl = svgs[0];
            }
            if (svgs.length > 1) {
                a.fpUrl = svgs[1];
            }
            if (val.datasheet != null)
                a.datasheet = val.datasheet;
            a.value = val.value;
            if (val.type_ != null)
                a.type = val.type_;
            if (val.prices != null) {
                const prices = val.prices.split(',');
                a.prices = []
                for (const i in prices) {
                    const m = prices[i].split(':');
                    a.prices.push({
                        num: m[0],
                        price: m[1]
                    });
                }
            }
        }
        // // log.info(a)
        // log.info("return data")
        // evt.reply('data',a)
        return a;



    }
    connectBom(sync) {
        if (store.has('bomConParam')) {
            let bomConParam = store.get('bomConParam')
            bomConParam.logging = this.log
            bomConParam.synchronize = sync
            bomConParam.entities = [BomCap,BomRes,BomDiode,BomConnector]
            createConnection(bomConParam).then(() => {
                this.connected.bom = true;
                log.info("connect bom database ok");

                this.repo.bom = {
                    cap: getRepository(BomCap, 'bom'),
                    res: getRepository(BomRes, 'bom'),
                    diode: getRepository(BomDiode, 'bom'),
                    connector: getRepository(BomConnector, 'bom'),
                }


            }).catch(err => {
                this.lastErr.bom = err;
                this.connected.bom = false
            })
        } else {
            this.lastErr.bom = 'BOM connection parameter empty'
            this.connected.bom = false;
        }
    }
    connectJlc(sync) {
        let jlcConParam = store.get('jlcConParam', {
            name: "jlc",
            type: "mysql",
            host: "www.whyengineer.com",
            port: 3306,
            username: "jlc",
            password: "71451085a",
            database: "jlc",
        })
        jlcConParam.logging = this.log
        jlcConParam.synchronize = sync
        jlcConParam.entities = [Cap, Res, Diode, Connector]
        createConnection(jlcConParam).then(() => {
            this.connected.jlc = true;
            log.info("connect jlc database ok");

            this.repo.jlc = {
                cap: getRepository(Cap, 'jlc'),
                res: getRepository(Res, 'jlc'),
                diode: getRepository(Diode, 'jlc'),
                connector: getRepository(Connector, 'jlc'),
            }


        }).catch(err => {
            this.lastErr.jlc = err
            this.connected.jlc = false;
        })
    }
    connect(sync) {
        this.connectJlc(sync)
        this.connectBom(sync)
    }

}