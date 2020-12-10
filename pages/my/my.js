//pages/my/my.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户登陆态
    userLogin: false,
    //用户名
    userName: "",
    //积分
    integral:0,
    //余额
    balance:0,
    //用户类型：0 普通用户； 1 认证用户
    type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showShareMenu({
    //   withShareTicket: true,
    // });
    wx.hideShareMenu();
  },

   /**
   * 禁止用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '测试一下',
      success: function (res) {
        wx.hideShareMenu()
      },
      fail: function (res) {
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    /**可以获取用户信息 */
    var openId = wx.getStorageSync("openId");
    if(openId){
      that.getUserInfo();
      that.getGroupUserInfo();
      that.setData({
        userLogin:true
      });
    }else{
      console.log("用户没有登陆");
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //发红包
  faHonbao(){
    wx.navigateTo({
      url: '/pages/saiDouBao/saiDouBao',
    })
  },

  //信息认证
  renZhen(){
    wx.navigateTo({
      url: '/pages/xinxi/xinxi',
    })
  },
  
  getGroupUserInfo:function(){
      var that = this;
      var openId = wx.getStorageSync('openId');
      wx.request({
        url: 'https://www.jacknow.top:8820/user/getUserInfo',
        data:{
          userId:openId
        },
        //header: { "Content-Type": "application/x-www-form-urlencoded" },
        success:res=>{
          that.setData({
            integral:res.data.data.integral,
            type:res.data.data.type
          });
        }
      });
    },

  /**
   *登陆函数
   */
  toLogin:function(){
    let that = this;

    /*获取用户信息*/
    that.getUserInfo();
    //登陆
    setTimeout(() => {
      that.login();
    }, 500);
  },

  login:function(){
    let that = this;
    wx.login({
      success(res){
        var code = res.code;
        wx.request({
          url: 'https://www.jacknow.top:8820/user/login',
          //url: 'http://df23b6191b17.ngrok.io/user/login',
          data:{
            code:code,
            userName:that.data.userName
          },
          success:function(res){
            var openId = res.data.data;
            wx.setStorageSync("openId",openId);
            that.setData({
              userLogin:true
            });
            /**从服务器获取用户其他信息 */
            that.getGroupUserInfo();
            let userName = wx.getStorageSync('userName');
            that.onShow();
          }
        });
      },
      fail:function(res){
        console.log('登陆失败');
      }
    });
    
  },

  getUserInfo:function(){
    var that = this;
    wx.getUserInfo({
      success:function(res){
        let userName = res.userInfo.nickName;
        wx.setStorageSync('userName', userName);
        that.setData({
          userName:userName
        });
      },
      fail:function(res){
        console.log("获取用户信息失败");
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

});
