import { GoodModel } from '../../models/good.js'
const goodModel = new GoodModel()
Page({
  data: {
    id: 0,
    goodsDetail: {},
    banners: []
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
        let { name, characteristic, minPrice, originalPrice, numberOrders } = data.basicInfo;
        let goodsDetail = {
          name, characteristic, minPrice, originalPrice, numberOrders
        }
        this.setData({
          goodsDetail,
          banners
        });
      })
  }
})