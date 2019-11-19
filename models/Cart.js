import PublicModel from './Public.js'
// 购物车相关接口
class CartModel extends PublicModel {
  //加入购物车
  addShopcart(data= {}) {
    return this.request({
      url: 'add_shopcart',
      data
    })
  }
}

export default CartModel
