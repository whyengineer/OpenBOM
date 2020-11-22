'use strict';
import {createConnections,getConnection,getRepository} from "typeorm";
import { Cap } from './entity/jlc/Cap';
import path from 'path';
import {app,ipcMain} from 'electron';
import log from 'electron-log';

export default class Db {
    constructor(win) {
        this.win = win;
        this.connected = false;
    }
   
    parseJlc(val,g) {

        var a =  {
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
                a.prices=[]
                for (const i in prices) {
                    const m = prices[i].split(':');
                    a.prices.push({
                        num: m[0],
                        price: m[1]
                    });
                }
            }
        }
        log.info(a)
        this.win.webContents.send('data',a)
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
            this.jlc = getConnection('jlc');
            this.bom = getConnection('bom');
            // ipcMain.on('getData',()=>{
            //     this.jlc.manager.findOne(Cap).then((val) => {
            //         this.parseJlc(val, 'cap')
            //     })
            // })
            this.jlc.manager.findOne(Cap).then((val) => {
                this.parseJlc(val, 'cap')
            })
            

        }).catch((err) => {
            this.connected = false;
            log.error(err);
        })
    }

}