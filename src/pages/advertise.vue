<template>
  <view>
    <view class = "banner">
      <view class = "item" :class="status === -1?'selected':''" @tap ="clickTypeItem(-1)">全部</view>
      <view class = "item" :class="status === 0?'selected':''" @tap ="clickTypeItem(0)">待支付</view>
      <view class = "item" :class="status === 1?'selected':''" @tap ="clickTypeItem(1)">待投放</view>
      <view class = "item" :class="status === 2?'selected':''" @tap ="clickTypeItem(2)">投放中</view>
      <view class = "item" :class="status === 3?'selected':''" @tap ="clickTypeItem(3)">已完成</view>
      <view class = "item" :class="status === 4?'selected':''" @tap ="clickTypeItem(4)">已关闭</view>
    </view>
    <view class = "ct-item" v-for = "(item, index) in contentList" :key = "index" :data-id = "item.id" @tap = "clickDetail">
      <view class = "top">
        <view class = "type">广告类型：{{item.materialType === 1 ? '竖屏图片' : item.materialType === 2 ? '横屏图片' : item.materialType === 3 ? '竖屏视频' : item.materialType === 4 ? '横屏视频' : '组合素材'}}</view>
        <view class = "dot"></view>
        <view class = "status">{{item.status === 0 ? '待支付' : item.status === 1 ? '待投放' : item.status === 2 ? '投放中' : item.status === 3 ? '已完成' : '已关闭'}}待支付</view>
      </view>
      <view class = "middle">
        <image class  = "img" :src="item.logo" />
        <view class = "m-ct">
          <view class = "m-ct-top">
            <view class = "name">{{item.materialName}}</view>
            <!-- <view class = "mark">{{item.order_items[0].advertise_machine.advertise_machine_label_type.name}}</view> -->
          </view>
          <view  class = "m-ct-middle">
            <view class = "text">总投放天数</view>
            <view class = "day">{{item.putDays}}</view>
          </view>
          <view class = "m-ct-bottom">
            <view class = "text">合计</view>
            <view class = "pri">¥{{item.amount}}</view>
          </view>
        </view>
      </view>
      <button class = "btn" v-if ="item.order_show_status === 0" :data-money = "item.amount" :data-id = "item.orderId" @tap.stop = "clickPay">立即支付</button>
    </view>
    <!--加载更多时动画-->
    <bottomLoadMore :show.sync="load_more" message="正在加载"></bottomLoadMore>
    <!--没有更多数据时动画-->
    <bottomNoMore :show.sync="no_more" ></bottomNoMore>
    <!--暂无数据显示-->
    <placeholder :show.sync="is_empty"></placeholder>

    <view class = "pop" v-if = "showPop1">
      <image class = "del" src = "../static/images/ic_home_advertising_machine_close.png"  @tap = "clickHidden" />
      <view class = "title">付款详情</view>
      <view class = "item" @tap = "clickSelectPayWay">
        <view class = "ll">付款方式</view>
        <block v-if = "pay_type == 3">
          <image class = "pay-icon" src= "../static/images/ic_home_payment_wechat.png" />
          <view class = "pay-text">微信支付</view>
        </block>
        <block v-if = "pay_type == 2">
          <image class = "pay-icon" src= "../static/images/ic_home_payment_wallet.png" />
          <view class = "pay-text">余额支付</view>
        </block>
        <block v-if = "pay_type == 4">
          <image class = "pay-icon" src= "../static/images/ic_home_payment_integral.png" />
          <view class = "pay-text">积分支付</view>
        </block>
        <image class = "arrow" src = "../static/images/ic_home_open_1.png" />
      </view>
      <view class = "item">
        <view class = "ll">需付款</view>
        <view class = "pri">{{payMoney}}元</view>
      </view>
      <button class = "btn" @tap = "clickConfirmPay">确认付款</button>
    </view>
    <view class = "pop" v-if = "showPop2">
      <view class  ="top">
        <image class = "back" src = "../static/images/ic_my_payment_return_3.png" @tap = "clickPopBack" />
        <view class = "tit">选择付款方式</view>
      </view>
      <view class = "ct" @tap = "clickPayWay(3)">
        <image class = "ct-icon" src = "../static/images/ic_home_payment_wechat.png" />
        <view class = "ct-text">微信支付</view>
      </view>
      <view class = "ct" :class="payMoney>userInfo.money?'grey':''" @tap = "clickPayWay(2)">
        <image class = "ct-icon" src = "../static/images/ic_home_payment_wallet.png" />
        <view class = "ct-text">余额支付（余额：¥{{userInfo.money}}）</view>
      </view>
      <view class = "ct" :class="payMoney>userInfo.integral?'grey':''" @tap = "clickPayWay(4)">
        <image class = "ct-icon" src = "../static/images/ic_home_payment_integral.png" />
        <view class = "ct-text">积分支付（积分：{{userInfo.integral}}）</view>
      </view>
    </view>
    <view class="modal-mask"   @tap = "clickHidden" catchtouchmove="preventTouchMove" v-if = "showPop1 || showPop2" ></view>
    <view class="modal-mask"   catchtouchmove="preventTouchMove" v-if="showPay"></view>
    <view class = "pop-pay" v-if="showPay">
      <view class = "top">
        <view class = "name">请输入支付密码</view>
        <image class = "xx" src = "../static/images/ic_home_advertising_machine_close.png" @tap = "clickHidden" />
      </view>
      <input type="number" style="min-height: 0;max-height: 0;color: #fff;" cursor-spacing = "150rpx"  password :maxlength = "passLength"  :value = "payPassValue"  :focus = "isFocus" @input = "inputPayPass" @blur = "blurPayPass"/ >
        <view class = "num">
          <block v-for = "(item, index) in passLength" :key = "index">
            <input class = "num-item" password cursor-spacing = "150rpx" :value="payPassValue.length>=index+1?payPassValue[index]:''" disabled  @tap.stop = "clickPassInput"/ >
          </block>
        </view>
      <view class = "forget">忘记支付密码？</view>
    </view>
  </view>
</template>
<script>
import request from '../utils/request';
import {checkRole} from '../utils/user';
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
      status: -1,
      load_more: false,    //加载更多图案
      no_more: false,       //没有更多数据
      is_empty: false,     //无数据，显示空页面
      start:0,
      offset: 10,
      //页面列表数据
      contentList:[],
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
    this.start = 0;
    this.getOrderList(0,true);
  },

  methods: {
    async getOrderList(start,refresh){
      try {
        const payload = {
          start,
          offset: this.offset
        }
        if (this.status >= 0) {
          payload.status = this.status
        }
        const res = await this.$server.getMaterialsOrderList(payload)
        if (refresh) {
          this.contentList = res.data.data.item;
        } else {
          this.contentList = [...this.contentList, ...res.data.data.item];
        }
        if(res.data.data.isNext === 0){
          //没有更多数据
          this.no_more = true;
        }else{
          this.no_more = false;
        }
        if (this.start === 0 && res.data.data.item.length === 0) {
          //暂无数据
          this.is_empty = true;
        } else {
          this.is_empty = false;
        }
      } catch (error) {
        
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
      this.isFocus = false;
    },
    //点击聚焦
    clickPassInput(){
      this.isFocus = true;
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
            this.payPassValue = '';
             wx.requestPayment({
              'timeStamp': res.data.timeStamp,
              'nonceStr': res.data.nonceStr,
              'package': res.data.package,
              'signType': res.data.signType,
              'paySign': res.data.paySign,
              'success': function (res) {
                uni.redirectTo({
                  url:'/pages-advert/paySuccess?id='+this.payId,
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
              this.inputBan = false;
              this.payPassValue = '';
            }
          });
      }
    },
    //选择头部分类
    clickTypeItem(status){
      this.status = status;
      this.start = 0;
      this.getOrderList(0,true);
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
        this.payPassValue = '';
        uni.redirectTo({
          url:'/pages-advert/paySuccess?id='+this.payId,
        })
      })
      .catch(err=>{
        if(err.code != 0){
          this.inputBan = false;
          this.payPassValue = '';
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
      this.start = 0;
      this.getOrderList(0,true);
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 1000);
    },

      /**
      * 页面上拉触底事件的处理函数
      */
    onReachBottom() {
      if ((!this.no_more) && (!this.is_empty)) {
          this.start += 1;
          this.getOrderList(this.start,false);
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
