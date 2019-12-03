<template>
  <div class="content">
      <div class="fixed">
        <van-tabs @click="onNav" >
          <van-tab title="待接单"></van-tab>
          <van-tab title="已接单"></van-tab>
        </van-tabs>
      </div>
      <van-list
        class="list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad">
        <div class="item flex-row" v-for="item in list" :key="item.id" @click="onDetail(item.id)">
          <div class="left flex-column">
            <div class="device-name">{{item.taskName}}</div>
            <div class="device-type">{{item.createTime | dateFormat('YYYY-MM-DD HH:mm')}}</div>
          </div>
          <div class="right flex-row">
            <div class="device-state">{{item.status | status}}</div>
            <!-- <img class="right-r" src="../../assets/img/arrow.png"> -->
          </div> 
        </div>
      </van-list>
  </div>
</template>

<script>
import {  List, Toast,Tab, Tabs } from "vant";
export default {
  components:{
      [List.name]:List,
      [Tab.name]:Tab, 
      [Tabs.name]:Tabs
  },
  data(){
    return {
        status:6, //待接单6 已接2
        list: [],
        loading: false,
        finished: false,
    }
  },
  filters:{  //0:失效 1：正常 2：已接单 3：用户取消 4：商家取消 5：已完成 6：已分配，待接单
    status(num){
      switch (num) {
        case 0:
          return '失效'
          break;
        case 1:
          return '正常'
          break;
        case 2:
          return '已接单'
          break;  
        case 3:
          return '用户取消'
          break;
        case 4:
          return '商家取消'
          break;
        case 5:
          return '已完成'
          break;
        case 6:
          return '已分配，待接单'
          break;  
      }
    }
  },

  mounted(){
  },
  methods:{
    onNav(name, title){
      if(title == '待接单'){
        if(this.status == 6) return
        this.status = 6;
        this.list = [];
        this.loading = true ;
        this.finished = false;
        if(this.loading){
            this.onLoad();
        }
      }else {
        if(this.status == 2) return
        this.status = 2;
        this.list = [];
        this.loading = true ;
        this.finished = false;
        if(this.loading){
            this.onLoad();
        }
      }
    },
    onDetail(id){
      this.$router.push({
        path:'/orderDetail',
        query:{
          id
        }
      })
    },
    onLoad() {
      let start = this.list.length;
      this.$http.post('/wx/api/vehicleOwnerTaskList',{
        start,
        limit:20,
        status:this.status
      }).then(res => {
          console.log(res.data.data.items)
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
.content{
  box-sizing: border-box;
  padding-top: 90px;
}
.fixed{
  position: fixed;
  top: 0;
  width: 100%;
}


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
  font-size: 26px;
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