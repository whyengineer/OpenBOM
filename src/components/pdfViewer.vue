<template>
  <div class="pdfViewer">
    <div>
      <el-pagination
        class="page"
        layout="prev, pager, next"
        :total="pageTotalNum * 10"
        :current-page.sync="pageNum"
        @current-change="handleCurrentChange"
        background
      >
      </el-pagination>
      <div class="ctrl">
        <el-button
          icon="el-icon-zoom-in"
          circle
          type="primary"
          @click="zoomin"
        ></el-button>
        <el-button
          icon="el-icon-zoom-out"
          circle
          type="primary"
          @click="zoomout"
        ></el-button>
        <el-button
          icon="el-icon-refresh-right"
          circle
          type="primary"
          @click="clock"
        ></el-button>
        <el-button
          icon="el-icon-refresh-left"
          circle
          type="primary"
          @click="counterClock"
        ></el-button>
        <el-progress v-if="loadedRatio>0&&loadedRatio<1" :text-inside="true" :stroke-width="26" :percentage="Math.floor(100*loadedRatio)" style="padding-top: 10px;"></el-progress>
      </div>
    </div>
    <div v-dragscroll="true" :class='{"grab-bing": zoom > 100 }'> 
        <pdf
        :style="{'width':zoom+'%'}"
        ref="pdf"
        :src="url"
        :page="pageNum"
        :rotate="pageRotate"
        @progress="loadedRatio = $event"
        @page-loaded="pageLoaded($event)"
        @num-pages="pageTotalNum = $event"
        @error="pdfError($event)"
        @link-clicked="page = $event"
        >
        </pdf>
    </div>
  </div>
</template>

<script>
import pdf from "vue-pdf";
import { dragscroll } from 'vue-dragscroll'

export default {
  props: {
    url: String,
  },
  directives: { dragscroll },
  components: {
    pdf,
  },
  data() {
    return {
      zoom: 100,
      pageNum: 1,
      pageTotalNum: 1,
      pageRotate: 0,
      loadedRatio: 0,
      curPageNum: 0,
    };
  },
  methods: {
    // 上一页函数，
    prePage() {
      var page = this.pageNum;
      page = page > 1 ? page - 1 : this.pageTotalNum;
      this.pageNum = page;
    },
    // 下一页函数
    nextPage() {
      var page = this.pageNum;
      page = page < this.pageTotalNum ? page + 1 : 1;
      this.pageNum = page;
    },
    handleCurrentChange(val) {
      this.pageNum = val;
    },
    // 页面顺时针翻转90度。
    clock() {
      this.pageRotate += 90;
    },
    // 页面逆时针翻转90度。
    counterClock() {
      this.pageRotate -= 90;
    },
    // 页面加载回调函数，其中e为当前页数
    pageLoaded(e) {
      this.curPageNum = e;
    },
    // 其他的一些回调函数。
    pdfError(error) {
      console.error(error);
    },
    zoomin(){
      this.zoom+=20
    },
    zoomout(){
      this.zoom-=20
      if(this.zoom<100){
          this.zoom=100
      }
    }
  },
};
</script>
<style scoped>
.ctrl{
    text-align: right;
    padding-right: 100px;
    padding-left: 100px;
    padding-top: 10px;
    padding-bottom: 30px;
}
.page{
  text-align: center;
}
.pdfViewer{
    margin: 50px;
}
.grab-bing {
  overflow: hidden;
  max-height: 90vh;
  cursor : -webkit-grab;
  cursor : -moz-grab;
  cursor : -o-grab;
  cursor : grab;
}


.grab-bing:active {
  overflow: hidden;
  max-height: 90vh;
  cursor : -webkit-grabbing;
  cursor : -moz-grabbing;
  cursor : -o-grabbing;
  cursor : grabbing;
}
</style>