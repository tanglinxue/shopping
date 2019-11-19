import PublishModel from '../../models/Publish.js'
const publishModel = new PublishModel();
const app = getApp();
Page({
  data: {
    id: 0,
    goodsDetail: {},
    banners: [],
    showPopup: false, //是否显示底部弹窗
    sharePopup: false, //是否显示分享弹窗
    showType: 1,
    allShopNum: 0 //全部购物数量
  },
  onLoad: function(options) {
    this.setData({
      good_id: options.good_id
    })
    this.render()
  },
  // 获取商品详情
  render() {
    publishModel.showLoading('加载商品中')
    const good_id = this.data.good_id;
    publishModel.getGoodDetail({
        good_id
      })
      .then(res => {
        if (res) {
          let data = res.good_info;
          let newData = {}
          for (let key in data) {
            if (key == 'pic' && data[key]) {
              newData.bannerPics = JSON.parse(data[key])
            } else if (key == 'detail' && data[key]) {
              newData.detailData = JSON.parse(data[key])
            } else {
              newData[key] = data[key]
            }
          }

          this.setData({
            ...newData
          })
          wx.hideLoading()
        }

      })
  },
  // 控制底部弹窗
  controlPopup(e) {
    let showPopup = e.detail.showPopup;
    let showType = 1;
    if (showPopup) {
      showType = e.detail.type * 1;
    }
    this.setData({
      showPopup,
      showType
    })
  },
  // 改变购买数
  changeNum(e) {
    let buyNumber = e.detail.buyNumber;
    if (e.detail.type && e.detail.type == 1) {
      this.updateAllShopNum()
    }
    this.setData({
      'goodsDetail.buyNumber': buyNumber
    })
  },
  getShareBox() {
    let sharePopup = !this.data.sharePopup;
    console.log(sharePopup)
    this.setData({
      sharePopup
    })
  }
})