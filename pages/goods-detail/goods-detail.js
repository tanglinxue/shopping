import { GoodModel } from '../../models/good.js'
const goodModel = new GoodModel()
Page({
  data: {
    id: 0,
    goodsDetail: {},
    banners: [],
    showPopup: false,//是否显示底部弹窗
    showType: 1
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getGoodsDetail()
  },
  // 获取商品详情
  getGoodsDetail() {
    const id = this.data.id;
    goodModel.getGoodDetail({ id })
      .then(res => {
        let data = res.data;
        let banners = data.pics.map(item => {
          item.picUrl = item.pic;
          return item
        });
        let { name, characteristic, minPrice, originalPrice, numberOrders, stores, pic } = data.basicInfo;
        let buyNumber = 0;
        let buyNumMin = 0;
        let buyNumMax = 0
        if (stores) {
          buyNumber = 1;
          buyNumMax = stores;
          buyNumMin = 1
        }

        let goodsDetail = {
          name, characteristic, minPrice, originalPrice, numberOrders, pic, buyNumber, buyNumMin, buyNumMax, id
        }
        console.log(goodsDetail)

        this.setData({
          goodsDetail,
          banners
        });
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
  changeNum(e){
    let buyNumber = e.detail.buyNumber;
    this.setData({
      'goodsDetail.buyNumber': buyNumber
    })
  }
})