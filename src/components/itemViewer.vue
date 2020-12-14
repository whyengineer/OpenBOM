<template>
  <div class="item">
    <h1>{{val.value}}</h1>
    <h2>{{val.footprint}}</h2>
    <div class="img">
      <el-image
        style="width: 150px; height: 150px"
        :src="
          val.imgs.length > 0
            ? val.imgs[0] + '?imageView2/1/w/150/h/150/q/75'
            : ''
        "
        :preview-src-list="val.imgs"
      >
      </el-image>
      <el-image style="width: 150px; height: 150px" :src="val.symbolUrl">
      </el-image>
      <el-image style="width: 150px; height: 150px" :src="val.fpUrl">
      </el-image>
    </div>
    <el-row>
      <el-col :span="10" :offset="1">
        <el-table :data="descTable" stripe style="width: 100%">
          <el-table-column label="Parameter" prop="name" align="center"> </el-table-column>
          <el-table-column label="Value" prop="val" align="center"> </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10" :offset="2">
        <el-table :data="val.prices" stripe style="width: 100%">
          <el-table-column label="Number" prop="num" align="center"> </el-table-column>
          <el-table-column label="Price" prop="price" align="center"> </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    val: {},
  },
  created() {
    this.descTable= [];
    let descs = this.val.desc.split(",");
    for (let i in descs) {
      let b = descs[i].split(":");
      this.descTable.push({
        name: b[0],
        val: b[1],
      });
    }
  },
  data() {
    return {
      descTable: [],
    };
  },
};
</script>
<style scoped>
  .item{
    text-align: left;
    margin: 20px;
  }
  .h1{
    padding-left: 10%;
  }
  .img{
    text-align: center;
  }
</style>