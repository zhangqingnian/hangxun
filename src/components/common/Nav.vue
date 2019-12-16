<template>
  <div class="content">
      <div class="item bg1" v-if="isRed" @click="routerGo('/merchant')">
          <div class="left">
              <div class="title">商户入驻</div>
              <div class="des">填写你引入的商户资料</div>  
          </div>
          <div class="right icon1"></div>
      </div>
      <div class="item bg2" v-if="isRed"  @click="routerGo('/orderList')">
          <div class="left">
              <div class="title">接单列表</div>
              <div class="des">你引入的商户列表</div>  
          </div>
          <div class="right icon2"></div>
      </div>
      <div class="item bg3" @click="routerGo('/merchantList')">
          <div class="left">
              <div class="title">商户列表</div>
              <div class="des">分配给你的服务订单列表</div>  
          </div>
          <div class="right icon3"></div>
      </div>
      <div class="item bg1"   @click="routerGo('/redflag')">
          <div class="left">
              <div class="title">红旗手</div>
              <div class="des"></div>  
          </div>
          <div class="right icon1"></div>
      </div>
      <div class="item bg2"  @click="routerGo('/toRed')">
          <div class="left">
              <div class="title">生成邀请码</div>
              <div class="des">成为红旗手</div>  
          </div>
          <div class="right icon2"></div>
      </div>
      <!-- <van-button type="info" class="btn" to="/merchant">商户入驻</van-button>
      <van-button type="info" class="btn" to="/orderList">接单列表</van-button>
      <van-button type="info" class="btn" to="/merchantList">商户列表</van-button> -->
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
      isRed: localStorage.getItem("isRed")
    };
  },
  created() {
    //console.log(localStorage.getItem("isRed"));

    var _this = this;
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
                console.log(result);
                let { longitude, latitude, errMsg } = result;
                if (errMsg == "getLocation:ok") {
                  //转换经纬度
                  _this.transformLocation()
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
    //路由跳转
    routerGo(path){
      this.$router.push({
        path
      })
    },
    //向发送经纬度
    sendLonLat(lon, lat) {
      this.$http
        .post("/wx/api/updateEmployeeLonLat", {
          lon, //经
          lat //纬
        })
        .then(res => {
          console.log(res);
        });
    },
    //转换经纬度
    transformLocation() {
      var _this = this;
      //百度坐标转换
      //var _url = "http://api.map.baidu.com/geoconv/v1/?coords="+longitude+","+latitude+"&from=1&to=5&ak=bR9MRWif3mjrq0vc7hS2hVGGP2lbIuYM";
      //高德坐标转换
      var _url =
        "https://restapi.amap.com/v3/assistant/coordinate/convert?key=9dfc5dc06e98f32af2a6f35286ffc9c0&locations=" +
        longitude +
        "," +
        latitude +
        "&coordsys=gps";
      $.ajax({
        url: _url,
        type: "GET",
        dataType: "jsonp", //指定服务器返回的数据类型
        success: function(data) {
          if (data.status != "1") {
            Toast("解析地理位置错误");
          }
          var gaode = data.locations.split(",");
          _this.sendLonLat(gaode[0], gaode[1]);
        }
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
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}
.row {
  margin-top: 30px;
  text-align: center;
}
.item{
  font-family: PingFang-SC-Medium;
  height: 180px;
  border-radius: 20px;
  margin-top: 50px;
  color: #fff;
  box-sizing: border-box;
  padding: 40px 30px 40px 75px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title{
    font-size: 34px;
    line-height: 60px;
  }

  .des{
    font-size:28px;
    line-height: 40px;
  }
}

.bg1{
  background:linear-gradient(90deg,rgba(70,174,247,1) 0%,rgba(29,213,230,1) 100%);
}
.icon1{
  width: 60px;
  height: 60px;
  background:url('../../assets/img/icon1.png') no-repeat;
  background-size: 60px 60px;
}
.icon2{
  width: 50px;
  height: 60px;
  background:url('../../assets/img/icon2.png') no-repeat;
  background-size: 50px 60px;
}
.icon3{
  width: 44px;
  height: 60px;
  background:url('../../assets/img/icon3.png') no-repeat;
  background-size: 44px 60px;
}
.bg2{
  background:linear-gradient(90deg,rgba(255,122,149,1) 0%,rgba(255,182,150,1) 100%);
}
.bg3{
  background:linear-gradient(90deg,rgba(248,199,213,1) 0%,rgba(153,149,239,1) 100%);
}
</style>