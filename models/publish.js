import PublicModel from './Public.js'
// 发布相关接口
class PublishModel extends PublicModel {
  //发布
  publish(data= {}) {
    return this.request({
      url: 'publish_prize',
      data
    })
  }
  // 修改商品信息
  editPublish(data={}){
	  return this.request({
	    url: 'do_edit_prize',
	    data
	  })
  }
  // 发布列表查询
  publishList(data= {}){
    return this.request({
      url: 'my_prizes_list',
      data
    })
  }
  
}

export default PublishModel
