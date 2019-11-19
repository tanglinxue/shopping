// 商品底部弹窗
import Methods from '../../utils/Methods.js'
const methods = new Methods()
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
			let goodsDetail = this.properties.goodsDetail;
			let {id,buyNumber }= goodsDetail;
			if (buyNumber < 1) {
				methods.showModal('温馨提示', '购买数量不能为0！')
				return;
			}
			let shopInfo = methods.getStorage('shopInfo');
			if (!shopInfo) {
				shopInfo = {
					shopList: {},
					shopNum: 0
				}
			}

			if (shopInfo.shopList[id]) {
				shopInfo.shopList[id].buyNumber += buyNumber;
			} else {
				shopInfo.shopList[id] = {
					...goodsDetail,
					active: true,
				}
			}
			shopInfo.shopNum += buyNumber;
			wx.setTabBarBadge({
				index: 2,
				text:shopInfo.shopNum+''
			})
			methods.setStorage('shopInfo', shopInfo)
			this.triggerEvent('changeNum', {
				buyNumber: 1,
				type:1
			})
			this.closePopupTap();
			methods.showToast('加入购物车成功')
		},
	}
})
