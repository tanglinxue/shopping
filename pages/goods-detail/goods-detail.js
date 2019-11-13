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
        let banners = res.data.pics.map(item => {
          item.picUrl = item.pic;
          return item
        });
        console.log(banners)
        this.setData({
          goodsDetail: res.data,
          banners
        });
      })
  }
})