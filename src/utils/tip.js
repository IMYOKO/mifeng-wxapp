/**
 * 提示与加载工具类
 */
export default class Tips {
  constructor() {
    this.isLoading = false;
  }
  /**
   * 弹出提示框
   */

  static success(title, duration = 1000) {
    uni.showToast({
      title: title,
      icon:'none',
      image: "../static/images/ic_success.png",
      mask: true,
      duration: duration
    });
    if (duration > 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    }
  }
  /**
   * 弹出确认窗口
   */
  static confirm(text, payload = {}, title = "提示") {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: title,
        content: text,
        showCancel: true,
        confirmColor:'#FFD602',
        success: res => {
          if (res.confirm) {
            resolve(payload);
          } else if (res.cancel) {
            reject(payload);
          }
        },
        fail: res => {
          reject(payload);
        }
      });
    });
  }
   /**
   * 弹出modal窗口
   */
  static modal(text,title = "提示",confirmText = "确定",cancelText="取消",payload = {}) {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: title,
        content: text,
        showCancel: true,
        confirmColor:'#4D6AFF',
        confirmText:confirmText,
        cancelText:cancelText,
        success: res => {
          if (res.confirm) {
            resolve(payload);
          } else if (res.cancel) {
            reject(payload);
          }
        },
        fail: res => {
          reject(payload);
        }
      });
    });
  }
   /**
   * 弹出确认窗口
   */
  static confirmNoCancel(text, payload = {}, title = "提示") {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: title,
        content: text,
        showCancel: false,
        success: res => {
          if (res.confirm) {
            resolve(payload);
          } else if (res.cancel) {
            reject(payload);
          }
        },
        fail: res => {
          reject(payload);
        }
      });
    });
  }

  /**
   * 无图标toast
   */
  static toast(title, duration = 1500) {
    uni.showToast({
      title: title,
      icon: "none",
      mask: true,
      duration: duration
    });
    if (duration > 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    }
  }

  /**
   * 警告框
   */
  static alert(title) {
    uni.showToast({
      title: title,
      image: "../images/alert.png",
      mask: true,
      duration: 1500
    });
  }

  /**
   * 错误框
   */

  // static error(title, onHide) {
  //   uni.showToast({
  //     title: title,
  //     image: "../images/error.png",
  //     mask: true,
  //     duration: 1000
  //   });
  //   // 隐藏结束回调
  //   if (onHide) {
  //     setTimeout(() => {
  //       onHide();
  //     }, 1000);
  //   }
  // }

  static error(title, duration=1500) {
    uni.showToast({
      title: title,
      icon: "none",
      mask: true,
      duration: duration
    });
  }

  /**
   * 弹出加载提示
   */
  static loading(title = "加载中") {
    if (Tips.isLoading) {
      return;
    }
    Tips.isLoading = true;
    uni.showLoading({
      title: title,
      mask: true
    });
  }

  /**
   * 加载完毕
   */
  static loaded() {
    if (Tips.isLoading) {
      Tips.isLoading = false;
      uni.hideLoading();
    }
  }

  static share(title, url, desc) {
    return {
      title: title,
      path: url,
      desc: desc,
      success: function(res) {
        Tips.toast("分享成功");
      }
    };
  }
}

/**
 * 静态变量，是否加载中
 */
Tips.isLoading = false;
