// 商品底部弹窗
import CartModel from '../../models/Cart.js'
const cartModel = new CartModel()
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
		// 展示类型
		showType: {
			type: Number,
			value: 1
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
		/**
		 * 加入购物车
		 */
		addShopCar: function() {
			let {
				good_id,
				buyNumber
			} = this.properties.goodsDetail;
			if (buyNumber < 1) {
				cartModel.showModal('加入购物车数量不能为0！')
				return;
			}
			cartModel.showLoading('加入购物车中...');
			cartModel.removeShopCart({
					good_id
				})
				.then(res => {
					wx.hideLoading()
					this.closePopupTap();
					if(res){
						this.triggerEvent('changeNum', {
							buyNumber:0
						})
						cartModel.showToast('加入购物车成功')
					}	

				})
		},
	}
})
