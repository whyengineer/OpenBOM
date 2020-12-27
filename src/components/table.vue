<template>
  <div class="table" v-bind:style="{ height: height }">
    <template>
      <el-backtop target=".table" style="z-index: 1000"></el-backtop>
    </template>
    <div class="page" v-if="search == ''">
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
      <el-col :span="8">
        <el-cascader
          class="option"
          v-model="productValue"
          :options="productList"
          :props="{ expandTrigger: 'hover' }"
          @change="productChange"
        ></el-cascader>
      </el-col>
      <el-col :span="5" :offset="1" style="text-align:center">
        <el-checkbox
          class="option"
          v-model="smt"
          label="JLC SMT/人工焊接"
          border
          disabled
        ></el-checkbox>
      </el-col>
      <el-col :span="8" :offset="1">
        <el-input
          class="option"
          v-model="search"
          placeholder="Search"
          @input="searchChange"
          clearable
          ><template slot="prepend"><i class="el-icon-search"></i></template
        ></el-input>
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
          <span v-if="search == ''">
            <strong>{{ scope.$index + 1 + (pageNum - 1) * eachCnt }}</strong
            >/{{ totalCnt }}
          </span>
          <span v-else>
            {{ scope.$index + 1 }}
          </span>
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
      <el-table-column
        label="Price"
        width="100"
        sortable
        :sort-method="priceSort"
      >
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
            :disabled="scope.row.datasheet==''"
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
    <el-dialog :visible.sync="showPdf" width="70%" v-if="showPdf">
      <pdfViewer :url="pdfUrl"></pdfViewer>
    </el-dialog>
    <el-dialog :visible.sync="showItem" width="70%" v-if="showItem">
      <itemViewer :val="item"></itemViewer>
    </el-dialog>
    <el-dialog :visible.sync="showAddBom" width="70%" v-if="showAddBom">
      <jlc2Bom :config="bomItem" :table="table" :edit="false" @added="add2bomDone"></jlc2Bom>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer, shell } from "electron";
import pdfViewer from "./pdfViewer";
import itemViewer from "./itemViewer";
import products from "./products.js";
import jlc2Bom from "./jlc2bom";
export default {
  name: "Table",
  components: {
    pdfViewer,
    itemViewer,
    jlc2Bom,
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
      smt: false,
      height: "",
      db: "jlc",
      table: "cap",
      type: "贴片电容",
      tableData: [],
      oldData: [],
      showPdf: false,
      showItem: false,
      showAddBom: false,
      bomItem: {},
      item: {},
      pdfUrl: "",
      totalCnt: 0,
      pageNum: 1,
      eachCnt: 30,
      loading: true,
      productValue: ["cap", "贴片电容"],
      productList: products,
      search: "",
    };
  },
  computed: {
    pageTotalNum: function () {
      return Math.ceil(this.totalCnt / this.eachCnt);
    },
  },
  created() {
    window.addEventListener("resize", this.sizeChange);
    this.height = window.innerHeight - 78 + "px";
  },
  mounted() {
    ipcRenderer.on("getDataRet", (evt, data) => {
      this.tableData = data.data;
      this.loading = false;
    });
    ipcRenderer.on("dbGetCountRet", (evt, data) => {
      this.totalCnt = data.count;
      ipcRenderer.send("getData", {
        event: "getDataRet",
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
      event: "dbGetCountRet",
      db: this.db,
      buildSearch: true,
      column: this.table,
      option: `type_="${this.type}"`,
      type: this.type,
    });
    ipcRenderer.on("searchRet", (evt, data) => {
      this.tableData = data;
      this.loading = false;
    });
    // ipcRenderer.send("getData",{db:'jlc',column:'cap',start:0,end:30});
  },
  destroyed() {
    ipcRenderer.removeAllListeners("getDataRet");
    ipcRenderer.removeAllListeners("dbGetCountRet");
    ipcRenderer.removeAllListeners("searchRet");
    window.removeEventListener("resize", this.sizeChange);
  },
  methods: {
    add2bomDone() {
      this.showAddBom = false;
    },
    priceSort(a, b) {
      let priceA = a.prices[0].price.replace("/个", "").replace("/片", "");
      let priceB = b.prices[0].price.replace("/个", "").replace("/片", "");
      return parseFloat(priceA) - parseFloat(priceB);
    },
    searchChange(msg) {
      if (msg != "") {
        this.loading = true;
        ipcRenderer.send("search", {
          event: "searchRet",
          db: this.db,
          column: this.table,
          type: this.type,
          msg: msg,
        });
      } else {
        this.handleCurrentChange(this.pageNum);
      }
    },
    sizeChange() {
      this.height = window.innerHeight - 78 + "px";
    },
    productChange(val) {
      this.search = "";
      this.pageNum = 1;
      this.table = val[0];
      this.type = val[1];
      this.loading = true;
      ipcRenderer.send("dbGetCount", {
        event: "dbGetCountRet",
        buildSearch: true,
        db: this.db,
        column: this.table,
        option: `type_="${this.type}"`,
        type: this.type,
      });
    },
    openItem(val) {
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
      this.bomItem = val;
      this.$nextTick(() => {
        this.showAddBom = true;
      });
    },
    handleCurrentChange(val) {
      this.loading = true;
      ipcRenderer.send("getData", {
        event: "getDataRet",
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
.table {
  overflow-y: scroll;
  height: 200px;
}
.option {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  /* margin-left: 5%;
  margin-right: 10%; */
}
</style>
