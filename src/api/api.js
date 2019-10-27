import BasicRequest from './index'

class Api extends BasicRequest {
  constructor() {
    super()
  }

  /**
   * 登录
   * @param {String} code 
   */
  login (payload) {
    return this.POST('/login', payload)
  }

  /**
   * 注册
   * @param {String} code 
   */
  register (payload) {
    return this.POST('/api/user/register', payload)
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
  setUserInfo (payload) {
    return this.POST('/api/user/setUserInfo', payload)
  }
  
  /**
   * 设置手机号码
   * @param {Number} phone 
   */
  setUserPhone (payload) {
    return this.POST('/api/user/setUserPhone', payload)
  }

  /**
   * banner查询
   * @param {Number} type // 1-首页、2-合作申请
   */
  getBanner (payload) {
    return this.POST('/api/info/getBanner', payload)
  }

  /**
   * 文章查询
   * @param {Number} type // 1-关于我们、2-注册服务协议、3-广告发布规则、4-文章、5-充值说明
   */
  getArticle (payload) {
    return this.POST('/api/info/getArticle', payload)
  }

  /**
   * 合作申请
   * @param {String} userName
   * @param {Number} userPhone
   */
  addCollaboratesApply (payload) {
    return this.POST('/api/user/addCollaboratesApply', payload)
  }

  /**
   * 广告机查询
   */
  getMachinesList (payload) {
    return this.POST('/api/machines/getMachinesList', payload)
  }

  /**
   * 素材列表
   * @param {Number} materialType // 素材类型 1-竖屏图片、2-横屏图片、3-竖屏视频、4-横屏视频、5-组合素材
   * @param {Number} start // 第几页 从0开始
   * @param {Number} offset // 每页大小
   */
  getMaterialsList (payload) {
    return this.POST('/api/materials/getMaterialsList', payload)
  }

  /**
   * 添加素材
   * @param {String} materialName // 素材名称
   * @param {Number} materialType // 素材类型
   * @param {String} logo // 图片地址
   * @param {String} video // 视频地址
   */
  addMaterials (payload) {
    return this.POST('/api/materials/addMaterials', payload)
  }

  /**
   * 删除素材
   * @param {Number} id
   */
  delMaterials (payload) {
    return this.POST('/api/materials/delMaterials', payload)
  }

  /**
   * 用户信息查询
   */
  getUserInfo (payload) {
    return this.POST('/api/user/getUserInfo', payload)
  }

  /**
   * 添加用户意见
   * @param {String} opinion
   * @param {String} imagePath
   */
  addUserOpinion (payload) {
    return this.POST('/api/user/addUserOpinion', payload)
  }

  /**
   * 用户资产查询
   */
  getUserAssets (payload) {
    return this.POST('/api/user/getUserAssets', payload)
  }

  /**
   * 余额明细
   * @param {Number} szlx 收支类型
   * @param {Number} start 第几页
   * @param {Number} offset 
   */
  getUserAssetsBillList (payload) {
    return this.POST('/api/user/getUserAssetsBillList', payload)
  }

  /**
   * 银行卡列表
   */
  getUseBankList (payload) {
    return this.POST('/api/user/getUseBankList', payload)
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
  addUserBank (payload) {
    return this.POST('/api/user/addUserBank', payload)
  }

  /**
   * 查询银行卡
   * @param {Number} id
   */
  getUseBank (payload) {
    return this.POST('/api/user/getUseBank', payload)
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
  updateUserBank (payload) {
    return this.POST('/api/user/updateUserBank', payload)
  }

  /**
   * 删除银行卡
   * @param {Number} id
   * @param {String} verifyCode
   */
  delUserBank (payload) {
    return this.POST('/api/user/delUserBank', payload)
  }

  /**
   * 用户提现查询
   */
  userCashSearch (payload) {
    return this.POST('/api/user/userCashSearch', payload)
  }

  /**
   * 用户提现
   * @param {Number} amount
   * @param {Number} bankId
   * @param {String} paypwd
   */
  userCash (payload) {
    return this.POST('/api/user/userCash', payload)
  }

  /**
   * 用户充值
   * @param {Number} amount
   */
  userRecharge (payload) {
    return this.POST('/api/user/userRecharge', payload)
  }

  /**
   * 修改支付密码
   * @param {String} newPwd
   * @param {String} verifyCode
   */
  updatePaypwd (payload) {
    return this.POST('/api/user/updatePaypwd', payload)
  }

  /**
   * 用户积分查询
   */
  getUserIntegral (payload) {
    return this.POST('/api/user/getUserIntegral', payload)
  }

  /**
   * 积分明细
   * @param {Number} szlx 收支类型
   * @param {Number} start 第几页
   * @param {Number} offset 
   */
  getUserIntegralBillList (payload) {
    return this.POST('/api/user/getUserIntegralBillList', payload)
  }


}

export default new Api()