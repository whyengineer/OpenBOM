<template>
  <div id="app">
    
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1"><img src="./assets/jlc.png" class="logo"></el-menu-item>
      <el-menu-item index="2"><img src="./assets/logo.png" class="logo"></el-menu-item>
      <el-menu-item index="3">Config</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  data(){
    return {
      activeIndex:'1',
      
    }
  },
  methods:{
    handleSelect(val){
      if(val=='1'){
        this.$router.push('/')
      }else if(val=='3'){
        this.$router.push('/config')
      }else if(val=='2'){
        this.$router.push('/bom')
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  
}
body{
  background-color: white;
}
.logo{
  height: 36px;
 
}
</style>
