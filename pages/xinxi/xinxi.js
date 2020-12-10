// pages/xinxi/xinxi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //姓名
    title:'',
    //身份证
    titleGu:''
  },
  handleTitleInput(e){
    let inputValue = e.detail.value;
    if(inputValue.lastIndexOf(' ') != -1){
      inputValue = inputValue.substring(0,inputValue.lastIndexOf(' '));
    }
      this.setData({
        title:inputValue
      })
  },

  // 获取输入的是身份证号
  GuTitleInput(e){
    let value = e.detail.value;
    if(value.lastIndexOf(' ') != -1){
      value = value.substring(0,value.lastIndexOf(' '));
    }
    value = value.replace(/[\u4e00-\u9fa5]/ig,"");//不能出现中文字符
    this.setData({
      titleGu:value
    })
  },

  // 信息认证提交按钮
  saiQian(){
    let _this = this;
    let openId = wx.getStorageSync('openId');
      wx.request({
        //url: 'http://10.0.0.8:8820/user/commitAttestation',
        url: 'https://www.jacknow.top:8820/user/commitAttestation',
        method:"GET",
        data:{
          userId:openId,
          realName:_this.data.title,
          idCardNumber:_this.data.titleGu
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success:res=>{
          if(res.data.resultCode == 1){
            console.log(res)
            wx.navigateBack({
              delta: 1,
            })
          }
        },
        fail:res=>{
          console.log('失败')
        }
      });
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})