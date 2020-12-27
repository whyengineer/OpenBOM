<template>
  <div class="form">
    <div class="format">
      <el-checkbox-group v-model="format" @change="formatChange">
        <el-checkbox-button label="OrCAD Cadence"></el-checkbox-button>
        <el-checkbox-button label="Altium Designer"></el-checkbox-button>
      </el-checkbox-group>
    </div>
    <el-form ref="ruleForm" :model="form" label-width="120px" size="medium">
      <el-form-item label="PN" prop="pn" required>
        <el-input v-model="form.pn"></el-input>
      </el-form-item>
      <el-form-item label="Value" prop="value" required>
        <el-input v-model="form.value"></el-input>
      </el-form-item>
      <el-form-item label="Type" prop="type" required>
        <el-input v-model="form.type"></el-input>
      </el-form-item>
      <el-form-item label="Description" prop="desc" required>
        <el-input v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item
        label="Symbol"
        prop="symbol"
        :required="Boolean(formatId & 0x01)"
      >
        <el-col :span="15">
          <el-select
            v-model="symbol_prefix"
            style="width: 95%"
            :disabled="!Boolean(formatId & 0x01)"
          >
            <el-option
              :label="option"
              :value="option"
              v-for="(option, index) in symbol_prefix_options"
              :key="index"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input
            v-model="form.symbol"
            :disabled="!Boolean(formatId & 0x01)"
          ></el-input>
        </el-col>
        <el-col :span="4" class="logo"
          ><img src="./../assets/cadence.png"
        /></el-col>
      </el-form-item>
      <el-form-item label="Footprint Path" prop="footprint_path">
        <el-col :span="15">
          <el-select
            v-model="footprint_path_prefix"
            style="width: 95%"
            :disabled="!Boolean(formatId & 0x02)"
          >
            <el-option
              :label="option"
              :value="option"
              v-for="(option, index) in footprint_path_prefix_options"
              :key="index"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input
            v-model="form.footprint_path"
            :disabled="!Boolean(formatId & 0x02)"
          ></el-input>
        </el-col>
        <el-col :span="4" class="logo"><img src="./../assets/ad.jpg" /></el-col>
      </el-form-item>
      <el-form-item label="Footprint" prop="footprint" required>
        <el-input v-model="form.footprint"></el-input>
      </el-form-item>
      <el-form-item label="Library Path" prop="library_path">
        <el-col :span="15">
          <el-select
            v-model="library_path_prefix"
            style="width: 95%"
            :disabled="!Boolean(formatId & 0x02)"
          >
            <el-option
              :label="option"
              :value="option"
              v-for="(option, index) in library_path_prefix_options"
              :key="index"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input
            v-model="form.library_path"
            :disabled="!Boolean(formatId & 0x02)"
          ></el-input> </el-col
        ><el-col :span="4" class="logo"
          ><img src="./../assets/ad.jpg"
        /></el-col>
      </el-form-item>
      <el-form-item
        label="Library Ref"
        prop="library_ref"
        :required="Boolean(formatId & 0x02)"
      >
        <el-col :span="20">
          <el-input
            v-model="form.library_ref"
            :disabled="!Boolean(formatId & 0x02)"
          ></el-input>
        </el-col>
        <el-col :span="4" class="logo"><img src="./../assets/ad.jpg" /></el-col>
      </el-form-item>
      <el-form-item label="Datasheet" prop="datasheet">
        <el-input v-model="form.datasheet"></el-input>
      </el-form-item>
      <el-form-item label="Vendor1" required>
        <el-col :span="11">
          <el-form-item prop="vendor1_pn">
            <el-input v-model="form.vendor1_pn"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-form-item prop="vendor1">
            <el-input v-model="form.vendor1"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="Vendor2">
        <el-col :span="11">
          <el-form-item prop="vendor2_pn">
            <el-input v-model="form.vendor2_pn"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-form-item prop="vendor2">
            <el-input v-model="form.vendor2"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="submitForm('ruleForm')" v-if="!edit"
          >Add</el-button
        >
        <el-button type="warning" @click="updateForm('ruleForm')" v-else
          >Update</el-button
        >

        <el-button @click="resetForm('ruleForm')">Clear</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";
import Store from "electron-store";
export default {
  data() {
    return {
      store: {},
      library_path_prefix: "",
      library_path_prefix_options: [],
      footprint_path_prefix: "",
      footprint_path_prefix_options: [],
      symbol_prefix: "",
      symbol_prefix_options: [],
      format: ["OrCAD Cadence", "Altium Designer"],
      form: {
        pn: "",
        value: "",
        desc: "",
        type: "",
        datasheet: "",
        footprint: "",
        symbol: "",
        vendor1: "",
        vendor1_pn: "",
        vendor2: "",
        vendor2_pn: "",
        library_ref: "",
        footprint_path: "",
        library_path: "",
      },
    };
  },
  computed: {
    formatId: function () {
      let val = 0;
      if (this.format.indexOf("OrCAD Cadence") != -1) val |= 0x1;
      if (this.format.indexOf("Altium Designer") != -1) val |= 0x2;
      return val;
    },
  },
  mounted() {
    this.store = new Store();
    this.symbol_prefix_options = this.store.get("symbol_prefix_options", []);
    this.library_path_prefix_options = this.store.get(
      "library_path_prefix_options",
      []
    );
    this.footprint_path_prefix_options = this.store.get(
      "footprint_path_prefix_options",
      []
    );
    this.form.desc = this.config.desc;
    this.form.pn = this.config.pn;
    this.form.value = this.config.value;
    this.form.datasheet = this.config.datasheet;
    this.form.footprint = this.config.footprint;

    this.form.type = this.config.type;
    if (this.edit) {
      this.form.library_ref = this.config.library_ref;
      let pos;
      pos = this.config.footprint_path.indexOf(".PcbLib");
      if (pos != -1) {
        this.footprint_path_prefix = this.config.footprint_path.substr(
          0,
          pos + 7
        );
        this.form.footprint_path = this.config.footprint_path.substr(pos + 8);
      }
      pos = this.config.library_path.indexOf(".SchLib");
      if (pos != -1) {
        this.library_path_prefix = this.config.library_path.substr(0, pos + 7);
        this.form.library_path = this.config.library_path.substr(pos + 8);
      }

      pos = this.config.symbol.indexOf(".OLB");
      if (pos != -1) {
        this.symbol_prefix = this.config.symbol.substr(0, pos + 4);
        this.form.symbol = this.config.symbol.substr(pos + 5);
      }
      pos = this.config.symbol.indexOf(".olb");
      if (pos != -1) {
        this.symbol_prefix = this.config.symbol.substr(0, pos + 4);
        this.form.symbol = this.config.symbol.substr(pos + 5);
      }

      this.form.vendor1 = this.config.vendor1;
      this.form.vendor1_pn = this.config.vendor1_pn;
      // this.form.library_path = "";
      // this.form.footprint_path = "";
      // this.symbol_prefix="";
      // this.footprint_path_prefix="";
      // this.library_path_prefix="";
    } else {
      this.form.vendor1 = this.config.vendor;
      this.form.vendor1_pn = this.config.vendorPn;
      this.form.library_ref = ""; /*0402 1.0uF (105) 10% 25V*/
      this.form.library_path = "";
      this.form.footprint_path = "";
    }

    this.$nextTick(() => {
      this.formatChange();
    });
    ipcRenderer.on("dbCreateItemBomRet", (evt, data) => {
      if (data.status) {
        this.$notify({
          title: "Success",
          message: `Add ${data.value.value} to BOM ok!`,
          type: "success",
        });
        this.$emit("added", data);
      } else {
        this.$notify.error({
          title: "Error",
          message: data.err,
        });
      }
    });
    ipcRenderer.on("dbUpdateItemBomRet", (evt, data) => {
      if (data.status) {
        this.$notify({
          title: "Success",
          message: `Update ${data.value.value} to BOM ok!`,
          type: "success",
        });
        this.$emit("updated", data);
      } else {
        this.$notify.error({
          title: "Error",
          message: data.err,
        });
      }
    });
  },
  destroyed() {
    ipcRenderer.removeAllListeners("dbCreateItemBomRet");
    ipcRenderer.removeAllListeners("dbUpdateItemBomRet");
  },

  props: {
    config: Object,
    edit: Boolean,
    table: String,
  },
  methods: {
    convertForm() {
      let val = JSON.parse(JSON.stringify(this.form));
      if (val.library_path != "")
        val.library_path = this.library_path_prefix + "\\" + val.library_path;
      else val.library_path = this.library_path_prefix;

      if (val.footprint_path != "")
        val.footprint_path =
          this.footprint_path_prefix + "\\" + val.footprint_path;
      else val.footprint_path = this.footprint_path_prefix;

      if (val.symbol != "") val.symbol = this.symbol_prefix + "\\" + val.symbol;
      else val.symbol = this.symbol_prefix;

      return val;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          ipcRenderer.send("dbCreateItem", {
            db: "bom",
            column: this.table,
            value: this.convertForm(),
            event: "dbCreateItemBomRet",
          });
        }
      });
    },
    updateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          ipcRenderer.send("dbUpdateItem", {
            db: "bom",
            column: this.table,
            value: this.convertForm(),
            event: "dbUpdateItemBomRet",
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    formatChange() {
      this.$refs.ruleForm.clearValidate();
      // if (this.formatId == 1) {
      //   this.form.library_ref = "";
      //   this.form.library_path = "";
      //   this.form.footprint_path = "";
      // } else if (this.formatId == 2) {
      //   this.form.symbol = "";
      // }
    },
  },
};
</script>
<style scoped>
.line {
  text-align: center;
}
.form {
  margin-left: 50px;
  margin-right: 50px;
}
.format {
  text-align: center;
  margin: 10px;
}
.logo {
  height: 36px;
  line-height: 36px;
  text-align: right;
}
.logo img {
  height: 36px;
  line-height: 36px;
}
</style>