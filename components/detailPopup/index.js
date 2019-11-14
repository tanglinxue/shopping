// 商品底部弹窗
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		showPopup: {
			type: Boolean,
			value: false
		},
		goodsDetail: {
			type: Object,
			value: {}
		},
		showType: {
			type: Number,
			value: 1
		}
	},
	data: {
		buyNumber: 0
	},
	observers: {
		// 决定购买量
		'goodsDetail': function(val) {
			if (val.stores) {
				this.setData({
					buyNumber: 1
				})
			}
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
		// 加入购物车
		toAddShopCar() {

		}
	}
})
