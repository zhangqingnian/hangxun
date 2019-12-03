<template>
  <div class="content">
    <div class="warp flex-column">
        <div class="item">
            <div class="name">任务名称：</div>
            <div class="val">{{order.taskName}}</div>
        </div>
        <div class="item">
            <div class="name">任务描述：</div>
            <div class="val">{{order.taskDesc}}</div>
        </div>
        <div class="item">
            <div class="name">手机号码：</div>
            <div class="val">{{order.mobile}}</div>
        </div>
        <div class="item">
            <div class="name">预定时间：</div>
            <div class="val">{{order.reservationTime | dateFormat('YYYY-MM-DD HH:mm')}}</div>
        </div>
        <div class="item">
            <div class="name">订单状态：</div>
            <div class="val status">{{order.status | status}}</div>
        </div>
    </div>
    <div class="flex-column">
        <van-button type="primary" size="large" @click="accept" class="mg">接单</van-button>
        <van-button type="primary" size="danger" @click="refuse">拒绝</van-button>
    </div>
    
  </div>
</template>

<script>
import { Button, Toast, Dialog  } from "vant";

export default {
  components:{
      [Button.name]:Button
  },
  data(){
    return {
        order:{}
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
      let id = this.$route.query.id;
      this._getInfo(id)
  },
  methods:{
      accept(){
        this._changeOrder(2)
      },
      refuse(){
        // Dialog.confirm({
        //     title: '提示',
        //     message: '您是确定要拒绝吗？'
        // }).then(() => {
        //     console.log(1)
        // }).catch(() => {
        //     console.log(2)
        // });
        this._changeOrder(4)
      },
    _getInfo(id){
        this.$http.post('/wx/api/vehicleOwnerTaskInfo',{
            id
        }).then(res => {
            console.log(res.data.data)
            let {success, msg, data} = res.data;
            if(success){
                this.order = data
            }
        })
    },
    _changeOrder(status){
        this.$http.post('/wx/api/updateVehicleOwnerTask',{
            id:this.order.id,
            status
        }).then(res => {
            console.log(res.data.data)
            let {success, msg, data} = res.data;
            Toast(msg)
            if(success){
               this.$router.go(-1)
            }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.mg{
    margin: 80px 0;
}
.warp {
  background: #fff;
  justify-content: space-between;
  padding: 20px 24px;
  box-sizing: border-box;
}
.item{ 
   display: flex;
   font-size: 32px;
   color: #333;
   line-height: 48px;
    .name{
        width: 200px;
    }
    .val{
        flex: 1;
    }
}


.device-type {
  font-size: 26px;
  color: #999;
  line-height: 36px;
}

.status{
  color: #57aaf0;
}

</style>