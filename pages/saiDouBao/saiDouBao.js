// pages/saiDouBao/saiDouBao.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //总金额数
    title:'',
    //红包个数
    titleGu:'',
    token:'',
    miZhi:'',
    groupList:[],
    type:0,
    groupId:""
  },

  handleTitleInput(e){
    let inputValue = e.detail.value;
    inputValue = inputValue.replace(/[^0123456789.]/,"");//只能输入数字
    inputValue = inputValue.replace(/\.+/,".");//小数点只能出现一次
    inputValue = inputValue.replace(/[\u4e00-\u9fa5]/ig,"");//不能出现中文字符
    inputValue = inputValue.replace(/^(\-)*(\d+)\.(\d\d).*$/,"$1$2.$3")//保留后两位小数
    //再不是0开头的字符进行修改：‘01’=>1
    if(inputValue.charAt(0) == "0" && inputValue.charAt(1)!="." && inputValue.length >= 2){
      inputValue = inputValue.replace(/0/,"")
    }
    let titleCount = inputValue.length;
    if(titleCount <= 7){
      this.setData({
        title:inputValue,
      })
    }
  },
  GuTitleInput(e){
    let value = e.detail.value;
    value = value.replace(/[^0123456789.]/,"");//只能输入数字
    let valueCount = value.length;
    if(valueCount <= 500){
      this.setData({
        titleGu:value
      })
    }
  },

  //分享按钮
  saiQian(){
    let that = this;
    let title = that.data.title;
    let titleGu = that.data.titleGu;
    let openId = wx.getStorageSync('openId');
    console.log("group id = " + that.data.groupId);
    if(title == ""){
      wx.showToast({
        title: '金额不能为空',
        icon:'none'
      });
    }
      wx.request({
        //url: 'http://10.0.0.8:8820/redPackage/sendRedPackage',
        url: 'https://www.jacknow.top:8820/redPackage/sendRedPackage',
        method:'POST',
        data:{
          userId:openId,
          groupId:that.data.groupId,
          money:title,
          count:titleGu,
        },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success:res=>{
          if(res.data.resultCode == 1){
            console.log(res.data)
          }
          console.log("请求成功")
        },
        fail:res=>{
          console.log("请求失败")
        }
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openId = wx.getStorageSync('openId');
    const miZhi = wx.getStorageSync('minZi');
    var that = this;

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });

    wx.request({
      url: 'https://www.jacknow.top:8820/groupUser/getGroups',
      type:"POST",
      contentType:"application/x-www-form-urlencoded",
      data:{
        userId:openId
      },
      success:function(res){
        that.setData({
          groupList:res.data.data,
          groupId:res.data.data[0].groupId
        });
      },
      fail:function(res){
        console.log("获取群信息失败");
      }

    });
  },

/*选择群 */
chooseGroup: function(e) {
  console.log('picker发送选择改变，携带值为', e.detail.value);
  var index = e.detail.value;
  this.setData({
    type: index,
    groupId:this.data.groupList[index].groupId
  });
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

  //  点不点左上角都无俗谓，点击塞钱进红包按钮，直接就可以分享出去了
  onShareAppMessage: function (e){
    console.log(`这是通过：${e.from}`);
    //分享卡片内容
    return{
      title:'用户:'+this.data.miZhi+'有一个豆沙包分享，来划一下把！',
      path:'/pages/index/index?id='+e.target.dataset.index,
      imageUrl:'/image/notOpen.png',
      // 回调废了，拿不到参数，看官方文档，不要问我
      success:res=>{
        console.log(res);
      }
    }
  }
})