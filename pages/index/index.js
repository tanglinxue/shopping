import { HomeModel } from '../../models/home.js'
const homeModel = new HomeModel()
Page({
  data: {
    banners: [],//banners集合
    lists: [],//产品集合
    recommendStatus: 1,//产品接口参数
    pageSize: 10,//产品接口参数
    indexMenus: [//menu数据
      { src: 'https://cdn.it120.cc/apifactory/2019/01/15/194c9c85d68360a6da67f25952fb3b1d.png', name: '类别' },
      { src: 'https://cdn.it120.cc/apifactory/2019/01/15/853402dac05c9b25fbe493d5dce44638.png', name: '购物车' },
      { src: 'https://cdn.it120.cc/apifactory/2019/01/15/3e4a6ebb4acfdfc9033c30102b36fef5.png', name: '订单' }
    ]
  },
  onLoad() {
    this.getBanners()
    this.getGoodsList()
  },
  // 获取banner数据
  getBanners() {
    let params = {
      type: 'home'
    }
    homeModel.getHomeBanner(params)
      .then(res => {
        this.setData({
          banners: res.data
        });
      })
  },
  //获取产品数据
  getGoodsList() {
    let { recommendStatus, pageSize } = this.data;
    let params = {
      recommendStatus, pageSize
    }
    homeModel.getGoodsList(params)
      .then(res => {
        let lists = res.data;
        this.setData({
          lists
        })
      })
  }

})