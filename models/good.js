import { HTTP } from '../utils/http-p.js'
// 首页接口
class GoodModel extends HTTP {
  data = {}
  //获取产品数据
  getGoodDetail(data) {
    return this.request({
      url: 'shop/goods/detail',
      data
    })
  }
}

export {
  GoodModel
}
