'use strict';
import { createConnections, getRepository } from "typeorm";
import { Cap } from './entity/jlc/Cap';
import path from 'path';
import { app, ipcMain } from 'electron';
import log from 'electron-log';
import PDF from 'electron-pdf-window'

export default class Db {
    constructor(win) {
        this.win = win;
        this.repo={}
        this.connected = false;
        ipcMain.on('showPdf', (evt, url) => {
            const pdfWin = new PDF({
                width: 800,
                height: 600
            })
            console.log(url)
            pdfWin.loadURL(url)
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
        // this.win.webContents.send('data',a)
        return a;



    }
    connect(sync) {
        createConnections([{
            name: "jlc",
            type: "mysql",
            host: "www.whyengineer.com",
            port: 3306,
            username: "jlc",
            password: "71451085a",
            database: "jlc",
            entities: [Cap],
            logging: true,
            synchronize: sync
        }, {
            name: "bom",
            type: "sqlite",
            database: path.join(app.getPath('userData'), 'db', 'bom.sqlite'),
            entities: [],
            logging: true,
            synchronize: sync
        }]).then(() => {
            log.info("connect database ok")
            this.connected = true;
            this.repo.jlc= {
                cap: getRepository(Cap, 'jlc')
            }
            // this.repo={
            //     jlc:this.jlc
            // }
            // this.jlc = getConnection('jlc');
            // this.bom = getConnection('bom');

            ipcMain.on('dbGetCount', (evt, db) => {
                log.info(db)
                this.repo[db.db][db.column].count(db.option!=undefined?db.option:'').then(val => {
                    let ret = db
                    ret.count = val
                    this.win.webContents.send('dbGetCountRet', ret)
                }).catch(err => {
                    log.error(err)
                })
            })
            ipcMain.on('getData', (evt, db) => {
                this.repo[db.db][db.column].find({
                    skip: db.start,
                    take: db.end-db.start,
                    where: db.where!=undefined?db.where:''
                }).then((val) => {
                    let ret = db
                    ret.data = []
                    for (let i in val) {
                        ret.data.push(this.parseJlc(val[i], db.column))
                    }
                    this.win.webContents.send('getDataRet', ret)

                }).catch(err => {
                    log.error(err)
                })
            })
        }).catch((err) => {
            this.connected = false;
            log.error(err);
        })
    }

}