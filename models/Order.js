import PublicModel from './Public.js'
// 地址相关接口
class OrderModel extends PublicModel {
  //订单列表查询
  orderLists(data={}){
	  return this.request({
	    url: 'order_list',
	    data
	  })
  }
}

export default OrderModel
