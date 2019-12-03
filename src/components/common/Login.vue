<template>
  <div class="login">
    <div class="content">
      <img class="logo" src="../../assets/img/logo.png"/>
      
      <div class="input">
          <input type="text" placeholder="请输入账号" v-model.trim="userName"  @blur="blurIn"/>
          <img class="mobile" src="../../assets/img/mobile.png">
      </div>
      <div class="input">
          <input type="password" placeholder="请输入密码" v-model.trim="userPwd" @blur="blurIn"/>
          <img class="mobile" src="../../assets/img/password.png">
      </div>
      <!-- <div class="revisePasswordWarp">
          <router-link class="revisePassword" :to="{name:'revisePassword'}">修改密码</router-link>
      </div> -->
      
      <div class="loginBtn" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
import {
  Toast
} from 'vant';
import Cookies from 'js-cookie'
import JSEncrypt from "jsencrypt";  

function getUrlParam(name) { //封装方法
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);

  return null; //返回参数值
}

export default {
  name: 'login',
  data () {
    return {
      key:'',
      userName:'',
      userPwd:''
    }
  },
  created(){
      //后台 cookie的token
      this.$http.post('/wx/getSubmitToken')
      //获取公钥
      this.getKey()
      var code = getUrlParam("code");
      if (!code) {
        var addr ='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa0355ce7acde0af0&redirect_uri=http%3A%2F%2Fwww.admin.hangxun.net%2Fdist%2Fwx_index.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        window.location.href = addr;
      }
      localStorage.setItem('code',code)
  },
  computed: {
        scrollHeight () {
            return document.documentElement.scrollTop || document.body.scrollTop || 0
        }
  },
  methods:{
    blurIn () {
      window.scrollTo(0, Math.max(this.scrollHeight - 1, 0))
    },

    login(){
      let {userName, userPwd} = this;
      if(!userName){
        Toast('请输入账号！');
        return;
      }
      if(!userPwd){
        Toast('请输入密码！');
        return;
      }
      let code = localStorage.getItem('code') || '';
      //密码加密
      userPwd = this.addCode(this.key,userPwd);
      this.$http.post('/wx/wxLogin',{ 
        userName,
        userPwd ,
        code
      }).then(res => {
        console.log(res.data)
        let {success, msg, data} = res.data;
        Toast(msg);
        if(success){
            let {
              currentUser,  //当前用户信息
              isBinding,    //是否绑定微信
              isMilitaryBackground, //是否是军人
              isRedStandardBearer,   //是否是红旗手
              SID,
              SUBMIT_TOKEN
            } = data;
            localStorage.setItem("isRed", isRedStandardBearer);
            Cookies.set('SID',SID);
            Cookies.set('SUBMIT_TOKEN',SUBMIT_TOKEN);
            this.$router.push({
              path:'/nav'
            })  
        }        
      })
    },
    //获取加密公钥
    getKey(){
      this.$http.post('/wx/getPublicKey').then(res => {
        this.key = res.data;

      })
    },
    //加密
    addCode(key, str){
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(key);
        return encrypt.encrypt(str); 
    }
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content{
  display: flex;
  flex-direction: column;
  align-items: center; 
  height: 100vh;
}
.logo{
  width: 384px;
  height: 374px;
  margin: 100px 0 100px 0;
}

.input{
  position: relative;
}

.input:nth-child(2){
  margin-bottom: 80px;
}
.input input{
  width:700px;
  height:90px;
  border-radius:10px;
  border:1px solid rgba(151,151,151,1);
  box-sizing: border-box;
  padding-left: 100px;
  font-size: 34px;
  line-height: 90px;
}

.mobile{
  position: absolute;
  width: 48px;
  height: 48px;
  left: 20px;
  top:20px;
}

.loginBtn{
  margin-top: 100px;
}

.revisePasswordWarp{
  width: 700px;
  text-align: right;
  margin-top: 20px;
}
.revisePassword{
  
  color: #E60213;
  font-size: 24px;
  
}
</style>
