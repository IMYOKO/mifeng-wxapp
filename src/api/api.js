import BasicApi from './index'

class Api extends BasicApi {
  constructor() {
    super()
  }

  /**
   * 登录
   * @param {String} code 
   */
  login (data) {
    return this.post('/api/login.htm', data, {})
  }


}

export default new Api()