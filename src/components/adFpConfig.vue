<template>
  <div>
    <h2>Alitum Designer Footprint Path</h2>
    <div class="knowList">
      <div v-for="(val, index) in footprint_path_prefix_options" :key="index">
        <el-row>
          <el-col :span="14">
            <el-input
              v-model="footprint_path_prefix_options[index]"
              disabled
              plain
              class="item"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="danger"
              icon="el-icon-delete"
              class="but"
              plain
              @click="deletePath(index)"
            ></el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <h3>Add User Define Path</h3>
      <el-row>
        <el-col :span="14" style="margin-bottom: 10px">
          <el-alert
            title="This will list all .PcbLib suffix files."
            type="info"
            effect="dark"
            :closable="false"
          >
          </el-alert>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="14">
          <el-input v-model="path"></el-input>
        </el-col>
        <el-button
          type="primary"
          icon="el-icon-folder-opened"
          class="but"
          plain
          @click="openFolder"
        ></el-button>
      </el-row>
      <div v-for="(val, index) in findOption" :key="index">
        <el-row>
          <el-col :span="14">
            <el-input
              v-model="findOption[index]"
              disabled
              plain
              class="item"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="success"
              icon="el-icon-document-add"
              class="but"
              plain
              @click="addPath(index,findOption[index])"
            ></el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// const { dialog } = require("electron").remote;
// var remote = require('electron').remote;
import { remote } from "electron";
var fs = remote.require("fs");
var dialog = remote.dialog;
import Store from 'electron-store'
const store =new Store()
export default {
  data() {
    return {
      footprint_path_prefix_options: [],
      path: "",
      findOption: [],
    };
  },
  mounted() {
    this.footprint_path_prefix_options=store.get('footprint_path_prefix_options',[])
  },
  methods: {
    deletePath(index) {
      this.footprint_path_prefix_options.splice(index, 1);
      store.set('footprint_path_prefix_options',this.footprint_path_prefix_options)
    },
    addPath(index,val) {
      if(this.footprint_path_prefix_options.indexOf(val)==-1){
        this.footprint_path_prefix_options.push(val);
        store.set('footprint_path_prefix_options',this.footprint_path_prefix_options)
        this.findOption.splice(index, 1);
      }
    },
    openFolder() {
      this.findOption = [];
      var path = dialog.showOpenDialogSync({
        properties: ["openDirectory"],
      });
      this.findOption.push(path[0]);
      fs.readdir(path[0], (err, files) => {
        let needfiles = files.filter((el) => /\.PcbLib$/.test(el));
        for(let i in needfiles){
            this.findOption.push(path[0]+'\\'+needfiles[i])
        }
      });
    },
  },
}; 
</script>

<style scoped>
.item {
  margin-bottom: 5px;
}
.but {
  margin-left: 10px;
}
</style>