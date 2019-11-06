import BasicRequest from './index';

class Api extends BasicRequest {
  constructor() {
    super();
  }

  /**
   * 登录
   * @param {String} code
   */
  login(payload) {
    return this.POST('/login', payload);
  }

  /**
   * 注册
   * @param {String} code
   */
  register(payload) {
    return this.POST('/api/user/register', payload);
  }

  /**
   * 设置用户信息
   * @param {String} nickName
   * @param {String} avatarUrl
   * @param {Number} gender
   * @param {String} country
   * @param {String} province
   * @param {String} city
   */
  setUserInfo(payload) {
    return this.POST('/api/user/setUserInfo', payload);
  }

  /**
   * 设置手机号码
   * @param {String} code
   * @param {String} iv
   * @param {String} encryptedData
   */
  setUserPhone(payload) {
    return this.POST('/api/user/setUserPhone', payload);
  }

  /**
   * banner查询
   * @param {Number} type // 1-首页、2-合作申请
   */
  getBanner(payload) {
    return this.POST('/api/info/getBanner', payload);
  }

  /**
   * 文章查询
   * @param {Number} type // 1-关于我们、2-注册服务协议、3-广告发布规则、4-文章、5-充值说明
   */
  getArticle(payload) {
    return this.POST('/api/info/getArticle', payload);
  }

  /**
   * 合作申请
   * @param {String} userName
   * @param {Number} userPhone
   */
  addCollaboratesApply(payload) {
    return this.POST('/api/user/addCollaboratesApply', payload);
  }

  /**
   * 广告机查询
   */
  getMachinesList(payload) {
    return this.POST('/api/machines/getMachinesList', payload);
  }

  /**
   * 素材列表
   * @param {Number} materialType // 素材类型 1-竖屏图片、2-横屏图片、3-竖屏视频、4-横屏视频、5-组合素材
   * @param {Number} start // 第几页 从0开始
   * @param {Number} offset // 每页大小
   */
  getMaterialsList(payload) {
    return this.POST('/api/materials/getMaterialsList', payload);
  }

  /**
   * 添加素材
   * @param {String} materialName // 素材名称
   * @param {Number} materialType // 素材类型
   * @param {String} logo // 图片地址
   * @param {String} video // 视频地址
   */
  addMaterials(payload) {
    return this.POST('/api/materials/addMaterials', payload);
  }

  /**
   * 删除素材
   * @param {String} ids
   */
  delMaterials(payload) {
    return this.POST('/api/materials/delMaterials', payload);
  }

  /**
   * 用户信息查询
   */
  getUserInfo(payload) {
    return this.POST('/api/user/getUserInfo', payload);
  }

  /**
   * 添加用户意见
   * @param {String} opinion
   * @param {String} imagePath
   */
  addUserOpinion(payload) {
    return this.POST('/api/user/addUserOpinion', payload);
  }

  /**
   * 用户资产查询
   */
  getUserAssets(payload) {
    return this.POST('/api/user/getUserAssets', payload);
  }

  /**
   * 余额明细
   * @param {Number} szlx 收支类型
   * @param {Number} start 第几页
   * @param {Number} offset
   */
  getUserAssetsBillList(payload) {
    return this.POST('/api/user/getUserAssetsBillList', payload);
  }

  /**
   * 银行卡列表
   */
  getUserBankList(payload) {
    return this.POST('/api/user/getUserBankList', payload);
  }

  /**
   * 添加银行卡
   * @param {String} bankCard
   * @param {String} bankBranch
   * @param {String} idcard
   * @param {String} bankName
   * @param {String} userName
   * @param {String} verifyCode
   */
  addUserBank(payload) {
    return this.POST('/api/user/addUserBank', payload);
  }

  /**
   * 查询银行卡
   * @param {Number} id
   */
  getUseBank(payload) {
    return this.POST('/api/user/getUseBank', payload);
  }

  /**
   * 编辑银行卡
   * @param {Number} id
   * @param {String} bankCard
   * @param {String} bankBranch
   * @param {String} idcard
   * @param {String} bankName
   * @param {String} userName
   * @param {String} verifyCode
   */
  updateUserBank(payload) {
    return this.POST('/api/user/updateUserBank', payload);
  }

  /**
   * 删除银行卡
   * @param {Number} id
   * @param {String} verifyCode
   */
  delUserBank(payload) {
    return this.POST('/api/user/delUserBank', payload);
  }

  /**
   * 用户提现查询
   */
  userCashSearch(payload) {
    return this.POST('/api/user/userCashSearch', payload);
  }

  /**
   * 用户提现
   * @param {Number} amount
   * @param {Number} bankId
   * @param {String} paypwd
   */
  userCash(payload) {
    return this.POST('/api/user/userCash', payload);
  }

  /**
   * 用户充值
   * @param {Number} amount
   */
  userRecharge(payload) {
    return this.POST('/api/user/userRecharge', payload);
  }

  /**
   * 修改支付密码
   * @param {String} newPwd
   * @param {String} verifyCode
   */
  updatePaypwd(payload) {
    return this.POST('/api/user/updatePaypwd', payload);
  }

  /**
   * 用户积分查询
   */
  getUserIntegral(payload) {
    return this.POST('/api/user/getUserIntegral', payload);
  }

  /**
   * 积分明细
   * @param {Number} szlx 收支类型
   * @param {Number} start 第几页
   * @param {Number} offset
   */
  getUserIntegralBillList(payload) {
    return this.POST('/api/user/getUserIntegralBillList', payload);
  }

  /**
   * 验证码
   * @param {*} payload
   */
  getCode(payload) {
    return this.POST('/api/user/getCode', payload);
  }

  /**
   * 广告机标签查询
   */
  getMachineLabels() {
    return this.POST('/api/machines/getMachineLabels', {});
  }

  /**
   * 查询不可发布日期
   * @param {String[]} machineIds [1, 2, 3]
   */
  checkDate(payload) {
    return this.POST('/api/publishAd/checkDate', payload);
  }

  /**
   * 生成广告订单
   * @param {String[]} machineIds [1, 2, 3]
   * @param {Number} materialId
   * @param {String[]} putDays  发布日期集合 例如: 2019-11-02,2019-11-03,2019-11-04
   * @param {number} dictId 霸屏选项ID 不设置霸屏,则传值0
   */
  addMaterialOrder(payload) {
    return this.POST('/api/publishAd/addMaterialOrder', payload);
  }

  /**
   * 订单支付查询
   * @param {Number} orderId
   */
  orderPaySearch(payload) {
    return this.POST('/api/publishAd/orderPaySearch', payload);
  }

  /**
   * 订单支付
   * @param {Number} orderId
   * @param {Number} payType 1-微信、2-余额、3-积分
   * @param {String} paypwd 当选择余额或积分支付时必填
   */
  orderPay(payload) {
    return this.POST('/api/publishAd/orderPay', payload);
  }

  /**
   * 查询订单列表
   * @param {Number} status 0-待支付、1-待投放、2-投放中、3-投放结束、4-已关闭
   * @param {Number} start 0
   * @param {Number} offset 10
   */
  getMaterialsOrderList(payload) {
    return this.POST('/api/publishAd/getMaterialsOrderList', payload);
  }

  /**
   * 查询订单详情
   * @param {Number} orderId
   */
  getMaterialsOrderDetail(payload) {
    return this.POST('/api/publishAd/getMaterialsOrderDetail', payload);
  }

  /**
   * 校验手机验证码
   */
  checkPaypwdCode(payload) {
    return this.POST('/api/user/checkPaypwdCode', payload);
  }

  /**
   * 字典查询
   */
  getDictData() {
    return this.POST('/api/dictData/getDictData', {
      dictType: 'ad_machine_bppz'
    });
  }

  /**
   * 收益统计
   */
  getUserAdIncome(payload) {
    return this.POST('/api/user/getUserAdIncome', payload);
  }

  /**
   * 收益明细
   */
  getUserAdIncomeList(payload) {
    return this.POST('/api/user/getUserAdIncomeList', payload);
  }

  /**
   * 订单关闭
   * @param {number} orderId
   */
  orderClose(payload) {
    return this.POST('/api/publishAd/orderClose', payload);
  }

  /**
   * 七牛文件上传参数
   */
  getQiniuParam() {
    return this.POST('/api/dictData/getQiniuParam', {});
  }
}

export default new Api();
