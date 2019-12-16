<template>
  <div class="content">
      <img v-if="src" class="code" :src="src" alt="" @click='show = true'>
      <van-image-preview
      v-model="show"
      :images="images"/>
  </div>
</template>

<script>
import Vue from 'vue';
import {Toast, ImagePreview} from 'vant';
Vue.use(ImagePreview)
export default {
  data(){
    return {
      src:'',
      show:false,
      index:0,
      images:[]
    }
  },
  mounted(){
    this.$http.post('/wx/api/redFlagQRCode').then(res => {
      if(res.data.success){
        this.src= res.data.data;
        this.images.push(res.data.data);
      }else{
        Toast(res.data.msg)
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.content{
  display: flex;
  justify-content: center;
  align-items: center;
}
.code{
  width:400px;
  height: 400px;
  margin-top: -200px;
}
</style>