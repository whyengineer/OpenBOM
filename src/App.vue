<template>
  <div id="app">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">Table</el-menu-item>
      <el-menu-item index="2">SearchBuild</el-menu-item>
      
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  data(){
    return {
      activeIndex:'',
      
    }
  },
  methods:{
    handleSelect(val){
      console.log(val)
      if(val=='1'){
        this.$router.push('/')
      }else{
         this.$router.push('/searchBuild')
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
</style>
