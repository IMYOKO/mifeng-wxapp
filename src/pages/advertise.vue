<template>
  <view>
    <view class = "banner">
      <view class = "item" :class="select_tag == ''?'selected':''" @tap = "clickTypeItem('')">全部</view>
      <view class = "item" :class="select_tag == 'wait_pay'?'selected':''" @tap = "clickTypeItem('wait_pay')">待支付</view>
      <view class = "item" :class="select_tag == 'wait_market'?'selected':''" @tap = "clickTypeItem('wait_market')">待投放</view>
      <view class = "item" :class="select_tag == 'market_process'?'selected':''" @tap = "clickTypeItem('market_process')">投放中</view>
      <view class = "item" :class="select_tag == 'complete'?'selected':''" @tap = "clickTypeItem('complete')">已完成</view>
    </view>
    <view class = "ct-item" v-for = "(item, index) in contentList" :key = "index" :data-id = "item.id" @tap = "clickDetail">
      <view class = "top">
        <view class = "type" v-if="item.material.type == 1">广告类型：图片</view>
        <view class = "type" v-if = "item.material.type == 2">广告类型：组合</view>
        <view class = "dot"></view>
        <view class = "status" v-if = "item.order_show_status == 'wait_pay'">待支付</view>
        <view class = "status" v-if = "item.order_show_status == 'wait_market'">待投放</view>
        <view class = "status" v-if = "item.order_show_status == 'market_process'">投放中</view>
        <view class = "status" v-if = "item.order_show_status == 'market_finish'">投放结束</view>
        <view class = "status" v-if = "item.order_show_status == 'is_closed'">已关闭</view>
      </view>
      <view class = "middle">
        <image class  = "img" :src="item.material.logo"></image>
        <view class = "m-ct">
          <view class = "m-ct-top">
            <view class = "name">{{item.name}}</view>
            <view class = "mark">{{item.order_items[0].advertise_machine.advertise_machine_label_type.name}}</view>
          </view>
          <view  class = "m-ct-middle">
            <view class = "text">总投放天数</view>
            <view class = "day">{{item.market_days_number}}</view>
          </view>
          <view class = "m-ct-bottom">
            <view class = "text">合计</view>
            <view class = "pri">¥{{item.total_amount}}</view>
          </view>
        </view>
      </view>
      <button class = "btn" v-if = "item.order_show_status == 'wait_pay'" :data-money = "item.total_amount" :data-id = "item.id" @tap.stop = "clickPay">立即支付</button>
    </view>
    <!--加载更多时动画-->
    <bottomLoadMore :show.sync="load_more" message="正在加载"></bottomLoadMore>
    <!--没有更多数据时动画-->
    <bottomNoMore :show.sync="no_more" ></bottomNoMore>
    <!--暂无数据显示-->
    <placeholder :show.sync="is_empty"></placeholder>

    <view class = "pop" v-if = "showPop1">
      <image class = "del" src = "../static/images/ic_home_advertising_machine_close.png"  @tap = "clickHidden"></image>
      <view class = "title">付款详情</view>
      <view class = "item" @tap = "clickSelectPayWay">
        <view class = "ll">付款方式</view>
        <block v-if = "pay_type == 3">
          <image class = "pay-icon" src= "../static/images/ic_home_payment_wechat.png"></image>
          <view class = "pay-text">微信支付</view>
        </block>
        <block v-if = "pay_type == 2">
          <image class = "pay-icon" src= "../static/images/ic_home_payment_wallet.png"></image>
          <view class = "pay-text">余额支付</view>
        </block>
        <block v-if = "pay_type == 4">
          <image class = "pay-icon" src= "../static/images/ic_home_payment_integral.png"></image>
          <view class = "pay-text">积分支付</view>
        </block>
        <image class = "arrow" src = "../static/images/ic_home_open_1.png"></image>
      </view>
      <view class = "item">
        <view class = "ll">需付款</view>
        <view class = "pri">{{payMoney}}元</view>
      </view>
      <button class = "btn" @tap = "clickConfirmPay">确认付款</button>
    </view>
    <view class = "pop" v-if = "showPop2">
      <view class  ="top">
        <image class = "back" src = "../static/images/ic_my_payment_return_3.png" @tap = "clickPopBack"></image>
        <view class = "tit">选择付款方式</view>
      </view>
      <view class = "ct" @tap = "clickPayWay(3)">
        <image class = "ct-icon" src = "../static/images/ic_home_payment_wechat.png"></image>
        <view class = "ct-text">微信支付</view>
      </view>
      <view class = "ct" :class="payMoney>userInfo.money?'grey':''" @tap = "clickPayWay(2)">
        <image class = "ct-icon" src = "../static/images/ic_home_payment_wallet.png"></image>
        <view class = "ct-text">余额支付（余额：¥{{userInfo.money}}）</view>
      </view>
      <view class = "ct" :class="payMoney>userInfo.integral?'grey':''" @tap = "clickPayWay(4)">
        <image class = "ct-icon" src = "../static/images/ic_home_payment_integral.png"></image>
        <view class = "ct-text">积分支付（积分：{{userInfo.integral}}）</view>
      </view>
    </view>
    <view class="modal-mask"   @tap = "clickHidden" catchtouchmove="preventTouchMove" v-if = "showPop1 || showPop2" ></view>
    <view class="modal-mask"   catchtouchmove="preventTouchMove" v-if="showPay"></view>
    <view class = "pop-pay" v-if="showPay">
      <view class = "top">
        <view class = "name">请输入支付密码</view>
        <image class = "xx" src = "../static/images/ic_home_advertising_machine_close.png" @tap = "clickHidden"></image>
      </view>
      <input type="number" style="min-height: 0;max-height: 0;color: #fff;" cursor-spacing = "150rpx"  password :maxlength = "passLength"  :value = "payPassValue"  :focus = "isFocus" @input = "inputPayPass" @blur = "blurPayPass"></input>
        <view class = "num">
          <block v-for = "(item, index) in passLength" :key = "unique">
            <input class = "num-item" password cursor-spacing = "150rpx" :value="payPassValue.length>=index+1?payPassValue[index]:''" disabled  @tap.stop = "clickPassInput"></input>
          </block>
        </view>
      <view class = "forget">忘记支付密码？</view>
    </view>
  </view>
</template>
<script>
import request from '../utils/request';
import checkRole from '../utils/check-role';
import tip from '../utils/tip';
import {
  USER_TOKEN,USER_INFO,USER_SPECICAL_INFO
} from '../utils/constant';
import bottomLoadMore from '../components/common/bottomLoadMore';
import bottomNoMore from '../components/common/bottomNoMore';
import placeholder from '../components/common/placeholder';
export default {
  config: {
    navigationBarTitleText: '蜜蜂广告',
  },
  components: {
    bottomLoadMore:bottomLoadMore,
    bottomNoMore:bottomNoMore,

    placeholder:placeholder
  },

  data() {
    return {
      load_more: false,    //加载更多图案
      no_more: false,       //没有更多数据
      is_empty: false,     //无数据，显示空页面
      page:1,
      //页面列表数据
      contentList:[
        {
          material: {
            type: 1,
            logo: 'http://howtos.makeblock.com/945d9a60ca4411e9a54effa3ca0c4aa7',
          },
          order_items: [
            {
              advertise_machine: {
                advertise_machine_label_type: {
                  name: '餐饮'
                }
              }
            }
          ],
          id: '01',
          name: '广告1',
          market_days_number: 10,
          total_amount: 500,
          order_show_status: 'wait_pay',
          
        }
      ],
      select_tag:'',
      payId:'',         //需要支付的订单id
      payMoney:0,       //需要支付的钱
      showPop1:false,
      showPop2:false,
      pay_type:3,       //支付类型，1为未选， 2，3，4为余额，微信，积分
      userInfo:null,
      showPay:false,
      isFocus:true,
      passLength:6,
      payPassValue:'',   //支付密码输入内容
      inputBan:false
    }
  },
  async onShow(){
    await checkRole();
    //用户信息
    this.userInfo = uni.getStorageSync(USER_INFO) || null;
    this.page = 1;
    this.getOrderList(1,true);
  },

  methods: {
    async getOrderList(page,refresh){
      let that = this;
      const json = await request({
        url:'orders',
        method:'GET',
        data:{
          page:page || 1,
          select_tag:this.select_tag
        }
      });
      if (refresh) {
        that.contentList = json.data.data;
      } else {
        that.contentList = [...that.contentList, ...json.data.data];
      }
      if(json.data.data.length < json.data.per_page  && json.data.data.length != 0){
        //没有更多数据
        that.no_more = true;
      }else{
        that.no_more = false;
      }
      if (that.page == 1 && json.data.data.length == 0) {
      //暂无数据
      that.is_empty = true;
      } else {
        that.is_empty = false;
      }
    },
    inputPayPass(e){
      this.payPassValue = e.detail.value;
      let length = e.detail.value.length
      if(length == 6){
        if(this.inputBan){
          return;
        }
        this.inputBan = true;
        this.callPayOut();
      }
    },
    //失去焦点
    blurPayPass(){
      let that = this;
      that.isFocus = false;
    },
    //点击聚焦
    clickPassInput(){
      let that = this;
      that.isFocus = true;
    },
    clickHidden(){
      this.showPop1 = false;
      this.showPop2 = false;
      this.showPay = false;
    },
    //跳转选择支付方式
    clickSelectPayWay(){
      this.showPop1 = false;
      this.showPop2 = true;
    },
    //选择支付方式
    clickPayWay(pay_type){
      if(pay_type == 2){
        //余额支付
        if(this.payMoney > this.userInfo.money){
          tip.toast('可支付余额不足');
          return;
        }
      }
      if(pay_type == 4){
        //积分支付
        if(this.payMoney > this.userInfo.integral){
          tip.toast('可支付积分不足');
          return;
        }
      }
      this.pay_type = pay_type;
      this.showPop1 = true;
      this.showPop2 = false;
    },
    //弹框返回
    clickPopBack(){
      this.showPop1 = true;
      this.showPop2 = false;
    },
    //确认付款
    async clickConfirmPay(){
      if(this.pay_type == 1){
        tip.toast('请选择支付方式');
        return;
      }
      let that  = this;
      //没有密码
      if(this.pay_type == 2 || this.pay_type == 4){   //余额  积分支付
        if(!this.userInfo.has_password){
            uni.navigateTo({
              url:'/pages-advert/setPayPass'
            })
            return;
          }
        this.showPay = true;
      }else if(this.pay_type == 3){     // 微信支付
        //发起支付通信
        const json =  await request({
          url:'orders/pay',
          method:'POST',
          loading:'',
          data:{
            id:this.payId,
            pay_type:this.pay_type,
            password:this.payPassValue
          }
        }).then(res => {
            that.payPassValue = '';
             wx.requestPayment({
              'timeStamp': res.data.timeStamp,
              'nonceStr': res.data.nonceStr,
              'package': res.data.package,
              'signType': res.data.signType,
              'paySign': res.data.paySign,
              'success': function (res) {
                uni.redirectTo({
                  url:'/pages-advert/paySuccess?id='+that.payId,
                })
              },
              'fail': function (res) {
                // tip.toast('支付取消');
                console.log(res)
              }
            });
          })
          .catch(err=>{
            if(err.code != 0){
              that.inputBan = false;
              that.payPassValue = '';
            }
          });
      }
    },
    //选择头部分类
    clickTypeItem(select_tag){
      this.select_tag = select_tag;
      this.page = 1;
      this.getOrderList(1,true);
    },
    //点击进入详情
    clickDetail(e){
      let id = e.currentTarget.dataset.id;
      uni.navigateTo({
        url:'/pages-advert/adDetail?id='+id
      })
    },
    //立即支付
    clickPay(e){
      this.payId = e.currentTarget.dataset.id;
      this.payMoney = e.currentTarget.dataset.money;
      this.showPop1 = true;
    }
  },
  async callPayOut(){
    let that  = this;
    //发起支付通信
    const json =  await request({
      url:'orders/pay',
      method:'POST',
      loading:'',
      data:{
        id:this.payId,
        pay_type:this.pay_type,
        password:this.payPassValue
      }
    }).then(res => {
        that.payPassValue = '';
        uni.redirectTo({
          url:'/pages-advert/paySuccess?id='+this.payId,
        })
      })
      .catch(err=>{
        if(err.code != 0){
          that.inputBan = false;
          that.payPassValue = '';
          if(err.code == 40301002){
            //密码错误
            wx.showModal({
              title:'密码输入错误',
              content:'',
              cancelText:'忘记密码',
              confirmText:'重新输入',
              confirmColor:'#000000',
              cancelColor:'#000000',
              success: function(res) {
                if(res.confirm){
                  //重新输入
                }else if(res.cancel){
                  //忘记密码
                  uni.navigateTo({
                    url:'updatePayPass'
                  })
                }
              }
            })
          }
        }
      });
    },

      /**
      * 页面相关事件处理函数--监听用户下拉动作
      */
    onPullDownRefresh() {
      this.page = 1;
      this.getOrderList(1,true);
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 1000);
    },

      /**
      * 页面上拉触底事件的处理函数
      */
    onReachBottom() {
      let that = this;
      if ((!that.no_more) && (!that.is_empty)) {
          that.page += 1;
          that.getOrderList(that.page,false);
        }
    }
  }

</script>
<style lang="less">
page{
  padding-top:80rpx;
  box-sizing: border-box;
}
.banner{
  width:100%;
  height:80rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  top:0;
  left:0;
  z-index: 2;
  .item{
    color:#666;
    font-size: 28rpx;
  }
  .selected{
    color:#141414;
    font-weight: bold;
  }
}
.ct-item{
  width:702rpx;
  min-height:360rpx;
  background:rgba(255,255,255,1);
  border-radius:3rpx;
  margin:0 auto;
  margin-top:24rpx;
  padding:0rpx 30rpx 8rpx 24rpx;
  box-sizing: border-box;
  .top{
    width:100%;
    height:80rpx;
    display: flex;
    align-items: center;
    border-bottom:1rpx solid #E5E5E5;
    .type{
      font-size:24rpx;
      font-weight:bold;
      color:rgba(51,51,51,1);
      margin-right: auto;
    }
    .dot{
      width:12rpx;
      height:12rpx;
      border-radius: 50%;
      background:rgba(255,214,2,1);
      margin-right: 10rpx;
    }
    .status{
      font-size:24rpx;
      color:rgba(20,20,20,1);
      font-weight: bold;
    }
  }
  .middle{
    width:100%;
    display: flex;
    margin-top:24rpx;
    .img{
      width:160rpx;
      height:160rpx;
      flex:0 0 auto;
      margin-right: 24rpx;
    }
    .m-ct{
      width:100%;
      .m-ct-top{
        width: 100%;
        display: flex;
        .name{
          width:340rpx;
          word-wrap:break-word;
          font-size:28rpx;
          font-weight:bold;
          color:rgba(20,20,20,1);
          margin-right: auto;
        }
        .mark{
          font-size:22rpx;
          color:rgba(195,83,1,1);
          height:30rpx;
          line-height:30rpx;
          background:rgba(255,242,225,1);
        }
      }
      .m-ct-middle{
        width:100%;
        display:flex;
        align-items: center;
        margin-top:20rpx;
        .day{
          font-size:24rpx;
          color:rgba(153,153,153,1);
        }
      }
      .m-ct-bottom{
        width:100%;
        display: flex;
        align-items: center;
        margin-top:5rpx;
        .pri{
          font-size:24rpx;
          font-weight:bold;
          color:rgba(20,20,20,1);
        }
      }
      .text{
        font-size:24rpx;
        color:rgba(102,102,102,1);
        margin-right: auto;
      }
    }
  }
  .btn{
    width:170rpx;
    height:54rpx;
    line-height:54rpx;
    background:rgba(255,214,2,1);
    border-radius:3rpx;
    font-size:26rpx;
    color:rgba(20,20,20,1);
    margin-left:auto;
    margin-right:0;
    margin-top:20rpx;
  }
}
.pop{
  width:640rpx;
  height:687rpx;
  background:rgba(255,255,255,1);
  border-radius:20rpx;
  position: fixed;
  top:200rpx;
  left:55rpx;
  z-index:99;
  .del{
    width:45rpx;
    height:45rpx;
    position: absolute;
    top:30rpx;
    right:30rpx;
  }
  .title{
    font-size:36rpx;
    font-weight:bold;
    color:rgba(51,51,51,1);
    text-align: center;
    margin-top:56rpx;
  }
  .item{
    width:100%;
    display: flex;
    align-items: center;
    padding:0 30rpx 0 56rpx;
    box-sizing: border-box;
    margin-top:45rpx;
    .ll{
      font-size:26rpx;
      color:rgba(51,51,51,1);
      margin-right: auto;
    }
    .pay-icon{
      width:45rpx;
      height:45rpx;
      margin-right: 10rpx;
    }
    .pay-text{
      font-size:24rpx;
      color:rgba(102,102,102,1);
      margin-right: 22rpx;
    }
    .arrow{
      width:18rpx;
      height:25rpx;
    }
    .pri{
      font-size:36rpx;
      font-weight:bold;
      color:rgba(51,51,51,1);
      margin-right:40rpx;
    }
  }
  .btn{
    width:555rpx;
    height:85rpx;
    line-height:85rpx;
    background:rgba(255,214,2,1);
    border-radius:10rpx;
    font-size:32rpx;
    color:rgba(20,20,20,1);
    margin-top:250rpx;
  }
  .top{
    width:100%;
    height:100rpx;
    display: flex;
    align-items: center;
    padding:0 40rpx;
    box-sizing: border-box;
    border-bottom:1rpx solid rgba(207,207,207,1);
    text-align: center;
    .back{
      width:25rpx;
      height:40rpx;
      flex:0 0 auto;
    }
    .tit{
      width:100rpx;
      flex:1 0 auto;
      text-align: center;
      font-size:36rpx;
      font-weight:bold;
      color:rgba(51,51,51,1);
    }
  }
  .ct{
    width:600rpx;
    height:112rpx;
    padding:0 37rpx;
    box-sizing: border-box;
    display: flex;
    align-items:center;
    font-size:30rpx;
    color:rgba(20,20,20,1);
    border-bottom:1rpx solid rgba(233,233,233,1);
    .ct-icon{
      width:35rpx;
      height:38rpx;
      margin-right:20rpx;
    }
  }
  .grey{
    color:rgba(174,174,174,1);
  }
}
.pop-pay{
  width:640rpx;
  height:500rpx;
  background:rgba(255,255,255,1);
  border-radius:20rpx;
  position: fixed;
  top:220rpx;
  left:55rpx;
  z-index:999;
  .top{
    width:100%;
    height:100rpx;
    display: flex;
    align-items: center;
    padding:0 36rpx;
    box-sizing: border-box;
    border-bottom:1rpx solid #cfcfcf;
    .name{
      width:100rpx;
      font-size:36rpx;
      font-weight:bold;
      color:rgba(51,51,51,1);
      text-align: center;
      flex:1 0 auto;
    }
    .xx{
      width:35rpx;
      height:35rpx;
      flex: 0 0 auto;
    }
  }
  .num{
    font-size:32rpx;
    color:#333;
    display: flex;
    margin-top:20rpx;
    justify-content: space-around;
    padding:0 58rpx;
    box-sizing: border-box;
    .num-item{
      height:74rpx;
      line-height:74rpx;
      width:75rpx;
      text-align: center;
      border:1rpx solid #cfcfcf;
      background:rgba(245,245,245,1);
    }
  }
  .forget{
    font-size:24rpx;
    color:rgba(48,60,66,1);
    text-align:right;
    padding:0 58rpx;
    box-sizing: border-box;
    margin-top:30rpx;
  }
}
.modal-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.5;
  overflow: hidden;
  z-index: 3;
  color: #fff;
}
</style>
