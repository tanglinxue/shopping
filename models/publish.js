import { HTTP } from '../utils/http-p.js'
// 发布相关接口
class PublishModel extends HTTP {
  data = {}
  //获取登录信息
  publish(data) {
    return this.request2({
      url: 'publish_prize',
      data
    })
  }
  publishList(data){
    return this.request2({
      url: 'my_prizes_list',
      data
    })
  }
}

export default PublishModel
