<template>
  <div>
    <el-pagination
          layout="prev, pager, next"
          :total="pageTotalNum * 10"
          :current-page.sync="pageNum"
          @current-change="handleCurrentChange"
          background
        >
      </el-pagination>
     {{rightCnt}}/{{totalCnt}}
    
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import products from "./products.js";
import flexSearch from 'flexsearch';
export default {
  data() {
    return {
      index:'',
      db: "jlc",
      table: "cap",
      type: "贴片电容",
      rightCnt:0,
      totalCnt: 0,
      pageNum: 1,
      eachCnt: 500,
      loading: true,
      productValue: ["cap", "贴片电容"],
      productList: products,
    };
  },
  computed: {
    pageTotalNum: function () {
      return Math.ceil(this.totalCnt / this.eachCnt);
    },
  },
  mounted() {
    this.index=flexSearch.create()
    ipcRenderer.on("getDataRet", (evt, data) => {
       for(let i in data.data){
         let val=data.data[i]
         this.index.add(val.pn, val.value+val.footprint+val.desc+val.vendorPn+val.type);
         this.rightCnt+=1
       }
       this.pageNum+=1;
       if(this.pageNum<=this.pageTotalNum)
          this.handleCurrentChange(this.pageNum)
        else{
          console.log(this.index.export());
        }
    });
    ipcRenderer.on("dbGetCountRet", (evt, data) => {
      this.totalCnt = data.count;
      ipcRenderer.send("getData", {
        db: this.db,
        column: this.table,
        start: 0,
        end: this.eachCnt,
        where: {
          type_: this.type,
        },
      });
    });
    this.loading = true;
    ipcRenderer.send("dbGetCount", {
      db: this.db,
      column: this.table,
      option: `type_="${this.type}"`,
    });
    // ipcRenderer.send("getData",{db:'jlc',column:'cap',start:0,end:30});
  },
  destroyed() {
    ipcRenderer.removeAllListeners("getDataRet");
    ipcRenderer.removeAllListeners("dbGetCountRet");

  },
  methods: {
    productChange(val) {
      this.pageNum = 1;
      this.table = val[0];
      this.type = val[1];
      this.loading = true;
      ipcRenderer.send("dbGetCount", {
        db: this.db,
        column: this.table,
        option: `type_="${this.type}"`,
      });
    },
    handleCurrentChange(val) {
      this.loading = true;
      ipcRenderer.send("getData", {
        db: this.db,
        column: this.table,
        start: (val - 1) * this.eachCnt,
        end: val * this.eachCnt,
        where: {
          type_: this.type,
        },
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  opacity: 0.5;
}
.page:hover {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  opacity: 1;
}
.table{
  overflow-y: scroll;
  height: 200px;
}
</style>
