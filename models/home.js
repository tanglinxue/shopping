import { HTTP } from '../utils/http-p.js'
// 首页接口
class HomeModel extends HTTP{
  data={}
  //获取产品数据
  getGoodsList(data){
    return this.request({
      url:'shop/goods/list',
      data
    })
  }
  //获取产品数据2
  getGoodsList2(data) {
    return this.request2({
      url: 'prizes_list',
      data
    })
  }
  //获取banner数据
  getHomeBanner(data){
    return this.request({
      url: 'banner/list',
      data
    })
  }
}

export {
  HomeModel
}
