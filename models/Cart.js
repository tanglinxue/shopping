import PublicModel from './Public.js'
// 购物车相关接口
class CartModel extends PublicModel {
  //加入购物车
  addShopCart(data= {}) {
    return this.request({
      url: 'add_shopcart',
      data
    })
  }
  // 购物车列表查询
  shopCartLists(data={}){
	  return this.request({
	    url: 'shopcart_list',
	    data
	  })
  }
  // 移出购物车
  removeShopCart(data={}){
	  return this.request({
	    url: 'del_shopcart',
	    data
	  })
  }
}

export default CartModel
