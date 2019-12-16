<template>
  <div class="wrapper">
    <div class="top"></div>
    <div class="contents">
      <div class="input mt230 mb80">
        <input type="text" placeholder="请输入手机号码" v-model.trim="mobile" maxlength="11">
        <img class="mobile" src="../assets/img/mobile.png">
      </div>
      <!-- <div class="codewarp mb80">
        <div class="input">
          <input class="code" type="text" placeholder="请输入验证码" v-model.trim="code">
          <img class="mobile" src="../assets/img/check.png">
        </div>
        <div class="getcode" @click="getCode">{{sending ? time+'s后重新发送' :'获取验证码'}}</div>
      </div> -->
      <div class="btn" @click="confirm">生成邀请码</div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      mobile: "",
      code: "",
      password: "",
      confirmPassword: "",
      sending: false,
      time: 60
    };
  },
  computed: {},
  methods: {
    //确定提交
    confirm() {
      if (!this.mobile) {
        Toast("请输入手机号码!");
        return;
      }
      if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.mobile))){
        Toast('您输入手机号不合法!');
        return
      }
      this.$http
        .post("/wx/api/invitatioinCode", {
          mobile:this.mobile
        })
        .then(res => {
          console.log(res);
          let { code, msg } = res.data;
          Toast(msg);
        });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped>
.wrapper {
}
.top {
  width: 100%;
  height: 480px;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: cover;
}

.mb80 {
  margin-bottom: 80px;
}
.mt230 {
  margin-top: 100px;
}
.contents {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input {
  position: relative;
}

.input input {
  width: 700px;
  height: 90px;
  border-radius: 10px;
  border: 1px solid rgba(151, 151, 151, 1);
  box-sizing: border-box;
  padding-left: 100px;
  font-size: 34px;
  line-height: 90px;
}

.codewarp {
  width: 700px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.input .code {
  width: 460px;
}

.getcode {
  width: 200px;
  height: 90px;
  background-color: #4da1e8;
  text-align: center;
  line-height: 90px;
  border-radius: 10px;
  font-size: 34px;
  color: #fff;
}
.mobile {
  position: absolute;
  width: 48px;
  height: 48px;
  left: 20px;
  top: 20px;
}

.btn {
  margin-top: 0px;
  width: 600px;
  height: 100px;
  background: linear-gradient(
    90deg,
    rgba(255, 206, 159, 1),
    rgba(255, 132, 156, 1)
  );
  box-shadow: 0px 3px 6px 0px rgba(1, 35, 73, 0.5);
  border-radius: 40px;
  font-size: 34px;
  font-family: PingFang SC;
  color: #fff;
  line-height: 100px;
  text-align: center;
}
</style>