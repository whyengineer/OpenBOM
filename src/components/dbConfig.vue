<template>
  <div>
    <div>
      <h2>
        Yourself BOM Database<i
          :class="
            bomConnect.status
              ? ['el-icon-success', 'ok']
              : ['el-icon-error', 'error']
          "
        ></i>
      </h2>
      <el-alert
        v-if="!bomConnect.status"
        :title="bomConnect.msg"
        type="error"
        show-icon
        :closable="false"
        class="tip"
      >
      </el-alert>

      <el-form ref="bom" :model="bom" label-width="80px" status-icon>
        <el-form-item label="Name" required prop="name">
          <el-input v-model="bom.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="Type" required prop="type">
          <el-input v-model="bom.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="Host" required prop="host">
          <el-input v-model="bom.host"></el-input>
        </el-form-item>
        <el-form-item label="Port" required prop="port">
          <el-input v-model="bom.port"></el-input>
        </el-form-item>
        <el-form-item label="Username" required prop="username">
          <el-input v-model="bom.username"></el-input>
        </el-form-item>
        <el-form-item label="Password" required prop="password">
          <el-input v-model="bom.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="Database" required prop="database">
          <el-input v-model="bom.database"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeBom('bom')">Apply</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <h2>
        JLC Database<i
          :class="
            jlcConnect.status
              ? ['el-icon-success', 'ok']
              : ['el-icon-error', 'error']
          "
        ></i>
      </h2>
      <el-alert
        title="Can't change these parameters right now!"
        type="info"
        show-icon
        :closable="false"
        class="tip"
      >
      </el-alert>
      <el-form ref="jlcform" :model="jlc" label-width="80px" disabled>
        <el-form-item label="Name">
          <el-input v-model="jlc.name"></el-input>
        </el-form-item>
        <el-form-item label="Type">
          <el-input v-model="jlc.type"></el-input>
        </el-form-item>
        <el-form-item label="Host">
          <el-input v-model="jlc.host"></el-input>
        </el-form-item>
        <el-form-item label="Port">
          <el-input v-model="jlc.port"></el-input>
        </el-form-item>
        <el-form-item label="Username">
          <el-input v-model="jlc.username"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="jlc.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="Database">
          <el-input v-model="jlc.database"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Store from "electron-store";
import { ipcRenderer } from "electron";
const store = new Store();
export default {
  data() {
    return {
      bomConnect: {},
      jlcConnect: {},
      jlc: {
        name: "jlc",
        type: "mysql",
        host: "www.whyengineer.com",
        port: 3306,
        username: "jlc",
        password: "71451085a",
        database: "jlc",
      },
      bom: {
        name: "bom",
        type: "mysql",
        host: "127.0.0.1",
        port: 3306,
        username: "",
        password: "",
        database: "",
      },
    };
  },
  mounted() {
    if (store.has("bomConParam")) this.bom = store.get("bomConParam");
    this.bomConnect = ipcRenderer.sendSync("dbConnecStatus", "bom");
    this.jlcConnect = ipcRenderer.sendSync("dbConnecStatus", "jlc");
  },
  methods: {
    changeBom(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$notify({
            title: "Success",
            message: "Restart app to take effect!",
            type: "success",
            duration: 0,
          });
          store.set("bomConParam", this.bom);
        }
      });
    },
  },
};
</script>

<style scoped>
.tip {
  margin-bottom: 20px;
}
h2 .ok {
  padding: 5px;
  color: #67c23a;
}
h2 .error {
  padding: 5px;
  color: #f56c6c;
}
</style>