import PublishModel from '../../../models/publish.js'
const publishModel = new PublishModel();

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList:[]//商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let params = {
      page:1
    }
    publishModel.publishList(params)
      .then(res=>{
        console.log(res)
        let shopList = res.goods_list.data;
        this.setData({
          shopList
        })
      })
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