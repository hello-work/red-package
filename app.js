//app.js
App({
  onLaunch: function (ops) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          });
        }
      }
    });
  },

  onShow(ops){
    if(ops.scene == 1044){
      console.log(ops);
      this.globalData.shareTicket = ops.shareTicket;
      console.log(JSON.stringify(ops));
      console.log("get-----------------------");
      wx.getShareInfo({
        shareTicket: this.globalData.shareTicket,
        success:res=>{
          console.log('getShareTiket---shareTicket-->' + JSON.stringify(res));
          let js_encryptedData = res.encryptedData;
          let js_iv = res.iv;
          wx.setStorageSync('encryptedData', js_encryptedData);
          wx.setStorageSync('iv', js_iv);
          console.log("end----------------------");
        },fail:res=>{
          console.log("获取信息失败");
        }
      });

    }

    console.log("全局ticket = " + this.globalData.shareTicket);
  },
  
  getShareTiket:function(){
    let _this = this;
    // if(_this.globalData.shareTicket){
    //   wx.getShareInfo({
    //     shareTicket: _this.globalData.shareTicket,
    //     success:res=>{
    //       console.log('getShareTiket---shareTicket-->' + JSON.stringify(res));
    //       let js_encryptedData = res.encryptedData
    //       let js_iv = res.iv
    //       wx.setStorageSync('encryptedData', js_encryptedData)
    //       wx.setStorageSync('iv', js_iv)
    //     },fail:res=>{
    //       console.log("获取信息失败");
    //     }
    //   })
    // }else{
    //   console.log('不存在shareTicket')
    // }
  },
  
  globalData: {
    userInfo: null,
    shareTicket:'',
  }
})