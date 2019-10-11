import BasicRequest from './index'

class Api extends BasicRequest {
  constructor() {
    super()
  }

  /**
   * 登录
   * @param {String} code 
   */
  login (data) {
    return this.POST('/api/login.htm', data)
  }


}

export default new Api()