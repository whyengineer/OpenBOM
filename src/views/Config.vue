<template>
  <div>
    <el-container>
      <el-aside width="300px"
        ><el-menu default-active="1" @select="handleSelect">
          <el-menu-item index="1">
            <span slot="title">Database</span>
          </el-menu-item>
          <el-menu-item index="2" class="logo">
            <span slot="title"> OrCAD Cadence</span>
            <img src="./../assets/cadence.png" />
          </el-menu-item>
          <el-menu-item index="3" class="logo">
            <span slot="title">Altium Designer</span>
            <img src="./../assets/ad.jpg" />
          </el-menu-item> </el-menu
      ></el-aside>
      <el-container>
        <el-main>
          <div v-if="active == '1'">
            <DbConfig/>
          </div>
          <div v-else-if="active == '2'">
            <CaConfig/>
          </div>
          <div v-else-if="active == '3'">
            <AdConfig/>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <div class="config"></div>
  </div>
</template>

<script>
import DbConfig from "@/components/dbConfig.vue"; 
import CaConfig from "@/components/cadenceConfig.vue"; 
import AdConfig from "@/components/adConfig.vue";
export default {
  components: {
    DbConfig,
    CaConfig,
    AdConfig
  },
  data() {
    return {
      active: "1",
    };
  },
 
  methods: {
    handleSelect(val) {
      this.active = val;
    },
  },
};
</script>

<style scoped>
.logo {
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
}
.logo img {
  height: 30px;
  line-height: 30px;
  margin-right: 5px;
}
</style>