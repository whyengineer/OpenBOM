<template>
  <div class="table" v-bind:style="{ height: height }">
    <template>
      <el-backtop target=".table" style="z-index: 1000"></el-backtop>
    </template>

    <el-pagination
      class="page"
      layout="prev, pager, next"
      :total="pageTotalNum * 10"
      :current-page.sync="pageNum"
      @current-change="handleCurrentChange"
      background
    >
    </el-pagination>
    <el-row>
      <el-col :span="8">
        <el-select v-model="productValue" @change="productChange" placeholder="请选择" class="option">
          <el-option label="CAP" value="cap"> </el-option>
          <el-option label="RES" value="res"> </el-option>
          <el-option label="DIODE" value="diode"> </el-option>
          <el-option label="CONNECTOR" value="connector"> </el-option>
        </el-select>
      </el-col>
      <el-col :span="2" :offset="14" style="text-align: right">
        <el-button
          class="option"
          icon="el-icon-plus"
          @click="addItem()"
          type="primary"
          plain
          >BOM</el-button
        >
      </el-col>
    </el-row>
    <el-table
      size="mini"
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
          <span>
            <strong>{{ scope.$index + 1 + (pageNum - 1) * eachCnt }}</strong
            >/{{ totalCnt }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="Value" width="180">
      </el-table-column>
      <el-table-column label="Type" width="180">
        <template slot-scope="scope">
          <el-tag size="mini">{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="footprint_path"
        label="Footprint Path"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="footprint" label="Footprint" width="180">
      </el-table-column>
      <el-table-column
        prop="desc"
        label="Description"
        show-overflow-tooltip
        min-width="300"
      >
      </el-table-column>
      <el-table-column label="Symbol" prop="symbol" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="Library Ref"
        prop="library_ref"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="Library Path"
        prop="library_path"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="Datasheet" width="100" align="center">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.datasheet == ''"
            type="primary"
            @click="openDs(scope.row.datasheet)"
            icon="el-icon-document"
            size="mini"
            circle
            plain
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="Vendor1" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.vendor1 }} / {{ scope.row.vendor1_pn }}
        </template>
      </el-table-column>

      <el-table-column label="Vendor2" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.vendor2 }} / {{ scope.row.vendor2_pn }}
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
            icon="el-icon-delete"
            type="danger"
            size="mini"
            circle
            plain
            @click="deleteItem(scope.$index, scope.row)"
          ></el-button>
          <el-button
            icon="el-icon-edit"
            type="warning"
            size="mini"
            circle
            plain
            @click="editItem(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showPdf" width="70%" v-if="showPdf">
      <pdfViewer :url="pdfUrl"></pdfViewer>
    </el-dialog>
    <el-dialog :visible.sync="showAddBom" width="70%" v-if="showAddBom">
      <jlc2Bom
        :config="bomItem"
        :table="productValue"
        :edit="edit"
        @added="add2bomDone"
        @updated="update2bomDone"
      ></jlc2Bom>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer, shell } from "electron";
import pdfViewer from "./pdfViewer";
import products from "./products.js";
import jlc2Bom from "./jlc2bom";
export default {
  name: "Table",
  components: {
    pdfViewer,
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
      delCnt: 0,
      index: 0,
      height: "",
      db: "bom",
      table: "cap",
      tableData: [],
      showPdf: false,
      showAddBom: false,
      bomItem: {},
      pdfUrl: "",
      totalCnt: 0,
      pageNum: 1,
      eachCnt: 30,
      loading: true,
      productValue: "cap",
      productList: products,
      edit: false,
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
    ipcRenderer.on("deleteBomRet", (evt, data) => {
      if (data.status) {
        this.$notify({
          title: "Success",
          message: `Delete ${data.value.value} from BOM ok!`,
          type: "success",
        });
        this.$emit("added", data);
        // this.totalCnt--;
        this.delCnt++;
         this.tableData.splice(this.index, 1);
      } else {
        this.$notify.error({
          title: "Error",
          message: data.err,
        });
      }
    });
    ipcRenderer.on("getBomDataRet", (evt, data) => {
      this.tableData = data.data;
      this.loading = false;
    });
    ipcRenderer.on("bomGetCountRet", (evt, data) => {
      this.totalCnt = data.count;
      ipcRenderer.send("getData", {
        event: "getBomDataRet",
        db: this.db,
        column: this.table,
        start: 0,
        end: this.eachCnt,
      });
    });
    this.loading = true;
    ipcRenderer.send("dbGetCount", {
      event: "bomGetCountRet",
      db: this.db,
      column: this.table,
    });

    // ipcRenderer.send("getData",{db:'jlc',column:'cap',start:0,end:30});
  },
  destroyed() {
    ipcRenderer.removeAllListeners("getBomDataRet");
    ipcRenderer.removeAllListeners("bomGetCountRet");
    ipcRenderer.removeAllListeners("deleteBomRet");
    window.removeEventListener("resize", this.sizeChange);
  },
  methods: {
    add2bomDone() {
      this.showAddBom = false;
    },
    sizeChange() {
      this.height = window.innerHeight - 78 + "px";
    },
    productChange(val) {
      this.search = "";
      this.pageNum = 1;
      this.table = val;
      this.loading = true;
      ipcRenderer.send("dbGetCount", {
        event: "bomGetCountRet",
        db: this.db,
        column: this.table,
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
    editItem(index, val) {
      this.bomItem = val;
      this.edit = true;
      this.index = index;
      this.$nextTick(() => {
        this.showAddBom = true;
      });
    },
    deleteItem(index, val) {
      this.index = index;
      this.$confirm(
        `You are deleting <br>PN: <strong>${val.pn}</strong>, <br>Value: <strong>${val.value}</strong>, <br>Continue?`,
        `Delete ${val.value}`,
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          type: "error",
          center: true,
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          ipcRenderer.send("dbDeleteItem", {
            db: "bom",
            column: this.productValue,
            value: val,
            event: "deleteBomRet",
          });
        })
        .catch(() => {});
    },
    addItem() {
      this.edit = false;
      this.bomItem = {};
      this.$nextTick(() => {
        this.showAddBom = true;
      });
    },
    update2bomDone(val){
      this.showAddBom = false;
      this.$set(this.tableData,this.index,val.value)
    },
    handleCurrentChange(val) {
      this.loading = true;
      ipcRenderer.send("getData", {
        event: "getBomDataRet",
        db: this.db,
        column: this.table,
        start: (val - 1) * this.eachCnt-this.delCnt,
        end: val * this.eachCnt-this.delCnt,
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
