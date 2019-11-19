import PublicModel from './Public.js'
// 首页接口类
class HomeModel extends PublicModel{
  //获取商品数据
  getGoodsList(data={}) {
    return this.request({
      url: 'prizes_list',
      data
    })
  }

  //获取banner数据
  getHomeBanner(data={}){
    return this.otherRequest({
      url: 'banner/list',
      data
    })
  }
}

export default HomeModel
