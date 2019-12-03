<template>
  <div class="content">
    
    <van-row
      type="flex"
      justify="center"
      class="row"
       v-if='isRed'
    >
      <van-col span="12" >
        <van-button
          type="info"
          class="btn"
          to="/merchant"
        >商户入驻</van-button>
      </van-col>
      
      <van-col span="12">
        <van-button
          type="info"
          class="btn"
          to="/orderList"
        >接单列表</van-button>
      </van-col>
    </van-row>
    <van-row
      type="flex"
      justify="center"
      class="row"
    >
      <van-col span="12">
        <van-button
          type="info"
          class="btn"
          to="/merchantList"
        >商户列表</van-button>
      </van-col>
      <van-col span="12">
      </van-col>
    </van-row>
  </div>
</template>

<script>
import Vue from "vue";
import { Button, Row, Col, Toast } from "vant";
import $ from "jquery";

Vue.use(Button)
  .use(Row)
  .use(Col);
export default {
  props: {},
  data() {
    return {
      isRed:localStorage.getItem("isRed")
    };
  },
  created() {
    console.log(localStorage.getItem("isRed"))

    let _this = this;
    let url = location.href.split("#")[0]; //获取锚点之前的链接
    this.$http
      .post("/wx/sign", {
        url
      })
      .then(res => {
        if (res.data.success) {
          wx.config({
            debug: false, // TODO: 测试阶段使用
            appId: res.data.data.appId,
            timestamp: res.data.data.timestamp,
            nonceStr: res.data.data.nonceStr,
            signature: res.data.data.signature,
            jsApiList: [
              // 所有要调用的 API 都要加到这个列表中
              "getLocation"
            ]
          });

          wx.ready(function() {
            wx.getLocation({
              type: "wgs84", // 坐标类型 默认wgs84
              success: function(result) {
                console.log(result)
                let { longitude, latitude,errMsg } = result;
                if(errMsg == "getLocation:ok"){
                   _this.sendLonLat(longitude, latitude);
                }
               
              },
              cancel: function(res) {
                Toast("用户拒绝授权获取地理位置");
              }
            });
          });
        }
      });
  },
  methods: {
    sendLonLat(lon, lat) {
      this.$http
        .post("/wx/api/updateEmployeeLonLat", {
          lon, //经
          lat //纬
        })
        .then(res => {
          console.log(res);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.row {
  margin-top: 30px;
  text-align: center;
}
</style>