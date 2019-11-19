import HTTP from '../utils/Http.js'
// 公共接口类
class PublicModel extends HTTP {
  // 授权接口
  authorUser(data={}){
    return this.request({
      url: 'get_userinfo',
      data
    })
  }
  //获取商品详情数据
  getGoodDetail(data={}) {
    return this.request({
      url: 'prizes_detail',
      data
    })
  }
}

export default PublicModel
