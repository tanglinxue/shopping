import PublishModel from '../../models/Publish.js'
const publishModel = new PublishModel();
const app = getApp();
Page({
  data: {
    good_id: '',
    goodsDetail: {},
    showPopup: false, //是否显示底部弹窗
    sharePopup: false, //是否显示分享弹窗
    showType: 1,//弹窗类型
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
			  if (!data.stock_num || data.is_shelf == 2) {
			  	// 没有库存或者下线
			  	data.buyNumber = 0;
			  	data.buyNumMax = 0;
			  	data.buyNumMin = 0
			  } else {
			  	//有库存并上线
			  	data.buyNumber = 1;
			  	data.buyNumMax = data.stock_num;
			  	data.buyNumMin = 1
			  }
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
    this.setData({
      'goodsDetail.buyNumber': buyNumber
    })
  },
  // 分享
  getShareBox() {
    let sharePopup = !this.data.sharePopup;
    this.setData({
      sharePopup
    })
  }
})