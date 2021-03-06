// 商品底部弹窗
import CartModel from '../../models/Cart.js'
const cartModel = new CartModel()
Component({
	properties: {
		// 商品详情
		goodsDetail: {
			type: Object,
			value: {}
		},
		// 购物车数量
		shopcart_count: {
			type: Number,
			value: 0
		}
	},
	methods: {
		// 唤起底部弹窗
		tobuy(e) {
			let type = e.currentTarget.dataset.type;
			this.triggerEvent('tobuy', {
				showPopup: true,
				type
			})
		},
		// 去购物车
		goShopCar() {
			wx.switchTab({
				url: '/pages/cart/cart'
			})
		}
	}
})
