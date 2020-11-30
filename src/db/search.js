
import FlexSearch from 'flexsearch'
import log from 'electron-log'

export default class Search {
    constructor(db, storeMemory=true) {
        this.db = db
        this.fs = {}
        this.map = {}
        this.memory = storeMemory
    }
    search(table, colume, type, msg,limit=20) {
        let key = table + colume + type
        let res1 = this.fs[key].search(msg,limit)
        let res2 = []
        for (let i in res1) {
            if(this.memory){
                res2.push(this.map[this.key].get(res1[i]))
            }else{
                //TODO
            }
        }
        return res2

    }
    buildSearch(table, colume, type, cb = null) {
        this.key = table + colume + type
        if (this.key in this.fs) {
            if (cb != null)
                cb(this.fs[this.key])
        } else {
            this.table = table
            this.colume = colume
            this.type = type
            this.index = 0
            this.count = 0
            this.totalCount = 0
            this.cb = cb
            this.fs[this.key] = new FlexSearch()
            if(this.memory)
                this.map[this.key]= new Map()
            this.db[this.table][this.colume].count(`type_="${this.type}"`).then(val => {
                this.totalCount = val
                this.interFind()
            }).catch(err => {
                log.error(err)
            })
        }
    }
    interFind() {
        this.db[this.table][this.colume].find({
            skip: this.index * 500,
            take: 500,
            where: `type_="${this.type}"`
        }).then((val) => {

            this.count += val.length
            for (let i = 0; i < val.length; i++) {
                let item = val[i]
                if(this.memory)
                    this.map[this.key].set(item.pn,item)
                
                this.fs[this.key].add(item.pn,item.value+';'+item.desc+';'+item.type+';'+item.jlcpn+';'+item.footprint)
            }
            this.index++
            if (this.count >= this.totalCount) {
                /*done*/
                // this.search(this.table, this.colume, this.type, '22pf')
                if (this.cb != null)
                    this.cb(this.fs)
            } else {
                this.interFind()
            }

        }).catch(err => {
            log.error(err)
        })
    }
}