
Page({


	data: {
		shopList: {}, //购物车列表
		allPrice: 0, //总价
		isAllSelect: false,
		haveData: false,
		editStatus: false
	},

	onLoad: function(options) {

	},

	onShow: function() {
		this.updateShopInfo()
	},
	// 更新购物车
	updateShopInfo() {
		let shopInfo = goodModel.getStorage('shopInfo');
		if (shopInfo) {
			let shopList = shopInfo.shopList;
			let haveData = Object.keys(shopList).length ? true : false
			// 计算总价格
			let allPrice = Object.keys(shopList).reduce((prev, next) => {
				if (!shopList[next].active) {
					return prev
				}
				return prev + shopList[next].minPrice * shopList[next].buyNumber
			}, 0)
			// 是否全选
			let isAllSelect = true
			Object.keys(shopList).forEach(item => {
				if (!shopList[item].active) {
					isAllSelect = false
				}
			})
			console.log(shopInfo.shopNum)
			wx.setTabBarBadge({
				index: 2,
				text: shopInfo.shopNum + ''
			})
			this.setData({
				shopList,
				allPrice,
				isAllSelect,
				haveData
			})
		}
	},
	// 全选
	allSelect() {
		console.log('aa')
		let isAllSelect = this.data.isAllSelect;
		isAllSelect = !isAllSelect;
		let shopInfo = goodModel.getStorage('shopInfo');
		if (shopInfo) {
			let shopList = shopInfo.shopList;
			for (let key in shopList) {
				shopList[key].active = isAllSelect
			}
			shopInfo.shopList = shopList
			goodModel.setStorage('shopInfo', shopInfo);
			this.updateShopInfo()
		}
	},
	// 编辑
	editTap() {
		this.setEdit(true)
	},
	//完成
	finishTap() {
		this.setEdit(false)
	},
	// 设置编辑状态
	setEdit(status){
		let shopInfo = goodModel.getStorage('shopInfo');
		if (shopInfo) {
			for(let key in shopInfo.shopList){
				 shopInfo.shopList[key].active=!status
			}
			goodModel.setStorage('shopInfo', shopInfo);
			this.updateShopInfo()
		}
		this.setData({
			editStatus: status
		})
	}

})
