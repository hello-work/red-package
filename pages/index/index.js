// pages/honBaoLIst/honBaoLIst.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 弹窗显示跟隐藏
    showDialog:false,
    // 红包领取弹窗显示跟隐藏
    heideDialog:false,
    heideDia:false,
    //抢红包的状态值 0:已抢过；1:未抢过
    status:"",
    jinList:[],
    redPackage:[],
    redPackageResult:'',
    count:0,
    quota:0,
    encryptedData:"",
    iv:"",
    //已经抢过的红包标识
    alreadyGet:false,
    //没有抢过红包的标识
    notGet:false,
    //成功抢到红包的标识
    successGet:false,
    //红包已被抢完的标识
    overGet:false,
    money:0,
    userName:"",
    //上拉加载
    pageNo:1,
    end:false,//false 没到底 true 到底了
    pages:0
  },
  
  //弹窗按钮
  toggleDialog(){
    let that = this;
    //抢红包成功
    if(that.data.quota == 1){
      that.setData({
        successGet:true,
        alreadyGet:false,
        notGet:false,
        overGet:false
      });
      //红包已经被抢完
    }else{
      that.setData({
        overGet:true,
        alreadyGet:false,
        notGet:false,
        successGet:false,
      });
    }
  },

  deleteDialog(){
    this.setData({
      alreadyGet:false,
      notGet:false,
      successGet:false,
      overGet:false,
    });
  },
  //拖动功能
  tuoDon(e){
    var touch = e.detail.y;
    var pageY = touch;
    if(pageY >= 120){
      let that = this;
    //抢红包成功
    if(that.data.quota == 1){
      that.setData({
        successGet:true,
        alreadyGet:false,
        notGet:false,
        overGet:false
      });
      //红包已经被抢完
    }else{
      that.setData({
        overGet:true,
        alreadyGet:false,
        notGet:false,
        successGet:false,
      });
    }
    }
  },
  //领取红包
  lingQu(e){
    var uuid = e.currentTarget.dataset.id;
    let encryptedData = wx.getStorageSync('encryptedData');
    let iv = wx.getStorageSync('iv');
    console.log("uuid = " + uuid);
    var that = this;
    var openId = wx.getStorageSync('openId');
    wx.request({
      //url: 'https://10.0.0.8:8820/redPackage/grabRedPackage',
      url: 'https://www.jacknow.top:8820/redPackage/grabRedPackage',
      method:'POST',
      data:{
        userId:openId,
        uuid:uuid,
        encryptedData:encryptedData,
        iv:iv
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success:res=>{
        if(res.data.resultCode == 1){
          console.log(res.data.data);
          let count = res.data.data.count;
          if(count == 1){
            let money = res.data.data.money;
            that.setData({
              alreadyGet:true,
              notGet:false,
              successGet:false,
              overGet:false,
              money:money
            });
            console.log("alreday get = " + that.data.alreadyGet);
          }else if(count == 0){
            let money = res.data.data.money;
            let quota = res.data.data.quota;
            that.setData({
              alreadyGet:false,
              notGet:true,
              successGet:false,
              overGet:false,
              money:money,
              quota:quota
            });
          }
        }
        console.log("count = " + that.data.count);
      }
    });
    
  },

  onReachBottom:function(){
    console.log("上拉加载执行了");
    let _this = this;

    if(_this.data.pageNo == _this.data.pages){
      wx.showToast({
        title: '暂时没有更多豆包了',
        icon:'none',
        mask:true
      })
    }else{
      var pageNo = _this.data.pageNo + 1;
      _this.setData({
       pageNo:pageNo
      })
      this.delayLoad()
    } 
  },
  delayLoad:function(){
    var that = this;
    var encryptedData = wx.getStorageSync('encryptedData');
    var iv = wx.getStorageSync('iv');
    const openId = wx.getStorageSync('openId');
    if(encryptedData == null || encryptedData == "" && iv == null || iv == ""){
      wx.showToast({
        title: '请从群入口进入',
        icon:"loading",
        duration:5000,
        mask:true
      });
    }else{
      if(openId == null || openId == ""){
        wx.showToast({
          title: '请登陆',
          icon:"loading",
          duration:2000,
          mask:true,
          success:function(res){
            wx.switchTab({
              url: '/pages/my/my',
            });
          }
        });
      }else{
        wx.checkSession({
          //session_key未过期
          success: (res) => {
            wx.showLoading({
              title: '加载中',
              mask:true
            })
              wx.request({
                //url: 'http://21168cd639ac.ngrok.io/redPackage/getAvailableRedPackageList',
                url: 'https://www.jacknow.top:8820/redPackage/getAvailableRedPackageList',
                method:"POST",
                data:{
                  userId:openId,
                  encryptedData:encryptedData,
                  iv:iv,
                  pageNo:that.data.pageNo
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success:res=>{
                  if(res.data.resultCode == 1){
                      wx.hideLoading()
                      console.log(res);
                      let old = that.data.jinList;
                      let newData = old.concat(res.data.data);
                      that.setData({
                        jinList:newData,
                      })
                  }else if(res.data.resultCode == -1){
                    console.log("请从群分享的渠道进入");
                  }
                }
              });
          },
          //session_key已过期
          fail:(res)=>{
            console.log("session key invalid");
            that.toLogin();
          }
        });
        
      }
    }
  },

  toLogin:function(){
    var that = this;
    wx.login({
      success(res){
        var code = res.code;
        wx.request({
          url: 'https://www.jacknow.top:8820/user/login',
          data:{
            code:code,
            userName:that.data.userName
          },
          success:function(res){
            console.log("res = " + res);
            var openId = res.data.data;
            wx.setStorageSync("openId",openId);
            that.delayLoad();
          }
        });
      },
      fail:function(res){
        console.log('更新session_key失败');
      }
    });
  },
  delay:function(){
    let that = this;
    var encryptedData = wx.getStorageSync('encryptedData');
    var iv = wx.getStorageSync('iv');
    const openId = wx.getStorageSync('openId');
    // console.log(encryptedData)
    // console.log(iv);
    wx.checkSession({
      success: (res) => {
        wx.request({
          //url: 'http://21168cd639ac.ngrok.io/redPackage/getPageCount',
          url: 'https://www.jacknow.top:8820/redPackage/getPageCount',
          method:"POST",
          data:{
            userId:openId,
            encryptedData:encryptedData,
            iv:iv,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success:res=>{
            // console.log(res);
            if(res.data.resultCode == 1){
              // console.log(res.data)
              that.setData({
                pages:res.data.data
              })
            }
          }
        })
      },
      fail(){
        that.toLogin();
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let userName = wx.getStorageSync('userName');
    that.setData({
      userName:userName
    });
    wx.showToast({
      title: '正在加载',
      icon:"loading",
      duration:2000,
      mask:true
    });

    var timeNum = setTimeout(() => {
      that.delayLoad();
    }, 1000);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let that = this;
    var timeDeley = setTimeout(()=>{
      that.delay();
    },1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  // onReachBottom: function () {

  //},

  /**
   * 用户点击右上角分享
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
  }
});