<template>
  <div>
      <AdLibraryConfig/>
      <el-divider></el-divider>
      <AdFpConfig/>
  </div>
</template>

<script>
import AdFpConfig from "@/components/adFpConfig.vue"; 
import AdLibraryConfig from "@/components/adLibraryConfig.vue"; 
export default {
    components: {
        AdFpConfig,
        AdLibraryConfig
    },
    data(){
        return{

        }
    }
}
</script>

<style>

</style>