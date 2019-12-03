<template>
  <div class="content">
      <van-cell-group>
          <van-field
            label-width='100px'
            v-model.trim="merchantName"
            required
            label="商户名称"
            placeholder="请输入商户名称"
          />
          <van-field
            label-width='100px'
            v-model.trim="merchantSimpleName"
            label="商户简称"
            placeholder="请输入商户简称"
            required
          />
          <van-field
            label-width='100px'
            @click="level = true"
            :value="levelVal"
            label="商户等级"
            placeholder="请输入商户等级"
            required
            readonly
          />
          <van-field
            @click="one = true"
            :value="oneVal"
            label="商户类型"
            label-width='100px'
            placeholder="请输入类型"
            required
            readonly
          />
          
          
          <van-field
            label-width='100px'
            v-model.trim="contactName"
            label="联系人姓名"
            placeholder="请输入联系人姓名"
            required
          />
          <van-field
            label-width='100px'
            v-model.trim="contactMobile"
            label="联系人手机号"
            maxlength='11'
            placeholder="请输入联系人手机号"
            required
          />
          <van-field
            label-width='100px'
            v-model.trim="telephone"
            label="电话"
            placeholder="请输入电话"
          />
          <van-field
            label-width='100px'
            v-model.trim="address"
            label="地址"
            placeholder="请输入地址"
          />
          <van-field
            label-width='100px'
            v-model.trim="email"
            label="邮箱"
            placeholder="请输入邮箱"
          />
          <van-field
            label-width='100px'
            v-model="remark"
            rows="1"
            autosize
            label="备注"
            type="textarea"
            placeholder="请输入备注"
          />
      </van-cell-group>
      <van-button class="btn" type="primary" size="large" @click="onKeep">保存</van-button>

      <van-popup
        v-model="level"
        position="bottom">
          <van-picker 
            show-toolbar
            title="商户等级"
            @cancel="level = false"
            @confirm="levelConfirm"
            :columns="levelList"  />
      </van-popup>
      <van-popup
        v-model="one"
        position="bottom">
          <van-picker 
            show-toolbar
            title="商户类型"
            @cancel="one = false"
            @confirm="oneConfirm"
            :columns="oneList"  />
      </van-popup>
  </div>
</template>

<script>
import { Field, Cell, CellGroup, Popup, Picker, Button, Toast } from "vant";
export default {
  components:{
    [Button.name]:Button,
    [Field.name]:Field,
    [Popup.name]:Popup,
    [Cell.name]:Cell,
    [CellGroup.name]:CellGroup,
    [Picker.name]:Picker
  },
  data(){
    return {
      level:false,
      one:false,
      two:false,
      levelVal:'',
      merchantLevelId:'',       //商户等级
      oneVal:'',
      merchantTypeId:'',        //商户一级类型   
      twoVal:'',
      secondLevelTypeId:'',     //商户二级类型   
      oneList:[],
      twoList:[],
      levelList:[],
      merchantName:'',          //商户名称
      merchantSimpleName:'',    //商户简称
      contactName:'',           //联系人姓名
      contactMobile:'',         //联系人手机
      telephone:'',             //电话
      address:'',               //地址
      email:'' ,                //邮箱
      remark:''
    }
  },
  computed:{
  },
  mounted(){
    this._getOne()
    this._getLevel()
  },
  methods:{
    levelConfirm(value){
      this.levelVal = value.text;
      this.merchantLevelId = value.id;
      this.level = false
    },
    oneConfirm(value){
      //一级没改变直接返回
      if(this.merchantTypeId == value.id){
        this.one = false;
        return
      }
      this.oneVal = value.text;
      this.merchantTypeId = value.value;
      this.one = false;
    },
    twoConfirm(value, index){
      this.twoVal = value.text;
      this.secondLevelTypeId = value.id;
      this.two = false
    },
    onKeep(){
      let {merchantName, merchantSimpleName, contactName, 
            contactMobile,merchantTypeId,merchantLevelId } = this;
      if(!merchantName){
        Toast('请输入商户名称')
        return
      }
      if(!merchantSimpleName){
        Toast('请输入商户简称')
        return
      }
      if(!merchantLevelId){
        Toast('请选择商户等级')
        return
      }
      if(!merchantTypeId){
        Toast('请选择商户类型')
        return
      }

      if(!contactName){
        Toast('请输入联系人姓名')
        return
      }
      if(!contactMobile){
        Toast('请输入联系人手机号')
        return
      }

      if(!(/^1[3456789]\d{9}$/.test(contactMobile))){ 
        Toast("手机号码有误，请重填");  
        return ; 
      } 

      this._keep()
    },
    //商户等级
    _getLevel(){
      this.$http.post('/wx/api/pageMerchantLevel',{
        start:0,
        limit:20
      }).then(res => {
        if(res.data.success){
          this.levelList = res.data.data.items
          this.levelList.forEach(item => {
            item.text = item.title
          })
        }else{
          Toast('商户等级获取失败')
        }
      })
    },
    //商户类型
    _getOne(){
      this.$http.post('/wx/api/getCommonRange',{
        start:0,
        limit:20,
        searchKey:'SERVICE_TYPE'
      }).then(res => {
        if(res.data.success){
          this.oneList = res.data.data.items
          this.oneList.forEach(item => {
            item.text = item.description
          })
        }else{
          Toast('商户类型获取失败')
        }
      })
    },
    
    _keep(){
      let {
          remark,
          merchantTypeId,        //商户一级类型     
          merchantName,          //商户名称
          merchantSimpleName,    //商户简称
          merchantLevelId,       //商户等级
          contactName,           //联系人姓名
          contactMobile,         //联系人手机
          telephone,             //电话
          address,               //地址
          email                  //邮箱
      } = this;
      this.$http.post('/wx/api/merchantEntering',{
          remark,
          merchantTypeId,        //商户一级类型     
          merchantName,          //商户名称
          merchantSimpleName,    //商户简称
          merchantLevelId,       //商户等级
          contactName,           //联系人姓名
          contactMobile,         //联系人手机
          telephone,             //电话
          address,               //地址
          email                  //邮箱
      }).then(res => {
        console.log(res.data)
        let {success, msg } = res.data;
        Toast(msg)
        if(success){
          this.$router.push({
            path:'/merchantList'
          })
        }
      })
    }
  }
  
}
</script>
<style lang="scss" scoped>
.btn{
  position: fixed;
  bottom: 0;
}
</style>