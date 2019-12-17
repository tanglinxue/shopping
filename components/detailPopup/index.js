// 商品底部弹窗
import CartModel from '../../models/Cart.js'
const cartModel = new CartModel();
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		// 是否显示弹窗
		showPopup: {
			type: Boolean,
			value: false
		},
		// 商品详情
		goodsDetail: {
			type: Object,
			value: {}
		},
		// 1立即购买,2购物车,3都显示
		showPopupType:{
			type: Number,
			value: 1
		},
		// 类别数据
		classic:{
			type:Array,
			value:[]
		},
		// 类别
		classic_type:{
			type:Number,
			value:1
		}
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		// 关闭弹窗
		closePopupTap() {
			this.triggerEvent('closePopup', {
				showPopup: false
			})
		},

		// 减法
		numJianTap() {
			let {
				buyNumMin,
				buyNumber
			} = this.properties.goodsDetail;
			if (buyNumber > buyNumMin) {
				buyNumber--;
				this.triggerEvent('changeNum', {
					buyNumber
				})
			}
		},
		// 加法
		numJiaTap() {
			let {
				buyNumber,
				buyNumMax
			} = this.properties.goodsDetail;
			if (buyNumber < buyNumMax) {
				buyNumber++;
				this.triggerEvent('changeNum', {
					buyNumber
				})
			}
		},

		// 去购买
		toBuyTap() {
			let goodsDetail = this.properties.goodsDetail
			let shopList = [goodsDetail];
			if (goodsDetail.buyNumber < 1) {
				cartModel.showModal('购买数量数量不能为0！')
				return;
			}

			app.globalData.buyShopList = shopList
			this.closePopupTap();
			wx.navigateTo({
				url: '/pages/cart/pay-order/pay-order'
			})
		}
	}
})
