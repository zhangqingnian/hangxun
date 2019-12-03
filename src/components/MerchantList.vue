<template>
  <div class="content">
      <van-list
        class="list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad">
        <div class="item flex-row" v-for="item in list" :key="item.id" @click="onSelect(item)">
          <div class="left flex-column">
            <div class="device-name">{{item.name}}</div>
          </div>
          <div class="right flex-row">
            <div class="device-state">{{item.status ? '正常' : '无效'}}</div>
            <!-- <img class="right-r" src="../../assets/img/arrow.png"> -->
          </div> 
        </div>
      </van-list>
  </div>
</template>

<script>
import {  List, Toast } from "vant";
export default {
  components:{
      [List.name]:List
  },
  data(){
    return {
        list: [],
        loading: false,
        finished: false,
    }
  },
 
  mounted(){

  },
  methods:{
    onSelect(item){
    },
    onLoad() {
      let start = this.list.length;
      this.$http.post('/wx/api/merchantList',{
        start,
        limit:20,
      }).then(res => {
        let {success, msg, data} = res.data;
        if(success){
            let {total, items} = data;
            this.list = this.list.concat(items);
            this.loading = false;
            console.log(this.list.length)
            if (this.list.length >= total) {
              this.finished = true;
            }
        }else{
          Toast(msg)
          this.loading = false;
          this.finished = true;
        }
      })
      
    }
  }
}
</script>
<style lang="scss" scoped>
.list {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.item {
  background: #fff;
  justify-content: space-between;
  padding: 20px 24px;
  box-sizing: border-box;
  margin-top: 25px;
}
.item:first-child { 
  margin-top: 0;
}

.left {
  justify-content: space-between;
}

.right {
  align-items: center;
}

.device-name {
  font-size: 32px;
  color: #000;
  line-height: 48px;
}
.device-type {
  font-size: 26px;
  color: #999;
  line-height: 36px;
}

.device-state {
  color: #57aaf0;
  text-align: right;
}

.section {
  color: #888888;
}
.right-r {
  width: 16px;
  height: 26px;
  margin-left: 30px;
}
.right-l {
  font-size: 34px;
}
</style>