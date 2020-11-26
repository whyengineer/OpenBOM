<template>
  <div class="table"  v-bind:style="{ height: height}">
      <template>
        <el-backtop target=".table" style="z-index: 1000;" ></el-backtop>
      </template>
      <div class="page">
        <el-pagination
          layout="prev, pager, next"
          :total="pageTotalNum * 10"
          :current-page.sync="pageNum"
          @current-change="handleCurrentChange"
          background
        >
        </el-pagination>
      </div>
      <el-row>
        <el-col :span="12">
          <el-cascader-panel
            class="option"
            v-model="productValue"
            :options="productList"
            :props="{ expandTrigger: 'hover' }"
            @change="productChange"
          ></el-cascader-panel>
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>
      <el-table
        border
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        element-loading-text="Loading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column type="index" width="100">
          <template slot-scope="scope">
            <strong>{{ scope.$index + 1 + (pageNum - 1) * eachCnt }}</strong
            >/{{ totalCnt }}
          </template>
        </el-table-column>
        <el-table-column prop="value" label="Value" width="180">
          <template slot-scope="scope">
            <el-link target="_blank" @click="openItem(scope.row)">{{
              scope.row.value
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="Type" width="180">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="footprint" label="Footprint" width="180">
        </el-table-column>
        <el-table-column prop="desc" label="Description"> </el-table-column>
        <el-table-column label="Price" width="100" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.prices.length > 0">{{
              scope.row.prices[0].price
            }}</span>
            <span v-else>0</span>
          </template>
        </el-table-column>

        <el-table-column label="Datasheet" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="openDs(scope.row.datasheet)"
              icon="el-icon-document"
              circle
              plain
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="Vendor Link" width="124" align="center">
          <template slot-scope="scope">
            <el-link target="_blank" @click="openUrl(scope.row.vendorUrl)"
              ><strong>{{ scope.row.vendor.toUpperCase() }}</strong
              >:{{ scope.row.vendorPn }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          label="Action"
          fixed="right"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-plus"
              size="small"
              @click="add2bom(scope.$index, scope.row)"
              >BOM</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="showPdf" width="50%" v-if="showPdf">
        <pdfViewer :url="pdfUrl"></pdfViewer>
      </el-dialog>
      <el-dialog :visible.sync="showItem" width="50%" v-if="showItem">
        <itemViewer :val="item"></itemViewer>
      </el-dialog>
    
  </div>
</template>

<script>
import { ipcRenderer, shell } from "electron";
import pdfViewer from "./pdfViewer";
import itemViewer from "./itemViewer";
import products from "./products.js";
export default {
  name: "Table",
  components: {
    pdfViewer,
    itemViewer,
  },
  // props: {
  //   db: {
  //     type: String,
  //     default: "jlc",
  //   },
  //   table: {
  //     type: String,
  //     default: "cap",
  //   },
  //   type: {
  //     type: String,
  //     default: "贴片电容",
  //   },
  // },
  data() {
    return {
      height:'',
      db: "jlc",
      table: "cap",
      type: "贴片电容",
      tableData: [],
      showPdf: false,
      showItem: false,
      item: {},
      pdfUrl: "",
      totalCnt: 0,
      pageNum: 1,
      eachCnt: 30,
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
  created(){
    window.addEventListener("resize", this.sizeChange);
    this.height=window.innerHeight-16+'px';
  },
  mounted() {
    ipcRenderer.on("getDataRet", (evt, data) => {
      console.log(data);
      this.tableData = data.data;
      this.loading = false;
    });
    ipcRenderer.on("dbGetCountRet", (evt, data) => {
      this.totalCnt = data.count;
      ipcRenderer.send("getData", {
        db: this.db,
        column: this.table,
        start: 0,
        end: 30,
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
    window.removeEventListener("resize", this.sizeChange);
  },
  methods: {
    sizeChange(){
      this.height=window.innerHeight-16+'px';
    },
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
    openItem(val) {
      console.log(val);
      this.item = JSON.parse(JSON.stringify(val));
      this.$nextTick(() => {
        this.showItem = true;
      });
    },
    openUrl(url) {
      shell.openExternal(url);
    },
    openDs(url) {
      // shell.openExternal(url)
      this.pdfUrl = url;
      this.$nextTick(() => {
        this.showPdf = true;
      });
    },
    add2bom(index, val) {
      console.log(index, val);
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
