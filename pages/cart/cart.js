import CartModel from '../../models/Cart.js'
const cartModel = new CartModel()
const app = getApp()
Page({
	data: {
		shopList: [], //购物车列表
		allPrice: 0, //总价
		isAllSelect: false, //是否全选
		editStatus: false, //是否为编辑状态
		havaActive: false, //是否有选择状态
		loadingEnd: false
	},
	onShow: function() {
		this.setData({
			loadingEnd: false
		})
		this.render()
	},
	render() {
		// 购物车查询
		cartModel.showLoading('加载购物车列表中');
		cartModel.shopCartLists()
			.then(
				res => {
					if (res) {
						let shopList = res.list;
						shopList.forEach(item => {
							if (!item.stock_num || item.is_shelf == 2) {
								// 没有库存或者下线
								item.buyNumber = 0;
								item.buyNumMax = 0;
								item.buyNumMin = 0
							} else {
								//有库存并上线
								item.buyNumber = 1;
								item.buyNumMax = item.stock_num;
								item.buyNumMin = 1
							}
						});
						this.isAllStatus(shopList)
						this.setData({
							shopList
						})
						if (!this.data.loadingEnd) {
							this.setData({
								loadingEnd: true
							})
						}
					}

					wx.hideLoading()
				}
			)
	},
	// 全选
	allSelect() {
		let isAllSelect = this.data.isAllSelect;
		this.setEdit(!isAllSelect)
	},
	// 编辑
	editTap() {
		this.setData({
			editStatus: true
		})
		this.setEdit(false)
	},
	//完成
	finishTap() {
		this.setData({
			editStatus: false
		})
		this.setEdit(true)
	},
	// 设置编辑状态
	setEdit(status) {
		let shopList = this.data.shopList;
		shopList.forEach((item) => {
			item.active = status
		})
		this.isAllStatus(shopList)
	},
	// 更新购物车
	updateShopInfo(e) {
		let shopList = this.data.shopList;
		let {
			good_id,
			type
		} = e.detail;
		if (type == 'activeChange') {
			// 是否选择 
			shopList.forEach(item => {
				if (item.good_id == good_id) {
					item.active = !item.active
				}
			})
		} else if (type == 'numberChange') {

			let buyNumber = e.detail.buyNumber;
			// 数量改变
			shopList.forEach(item => {
				if (item.good_id == good_id) {
					item.buyNumber = buyNumber
				}
			})
		} else if (type == 'delete') {
			// 删除购物车
			shopList.forEach((item, index) => {
				if (item.good_id == good_id) {
					shopList.splice(index, 1)
				}
			})
		}
		this.isAllStatus(shopList)

	},
	// 判断是否全选并计算总价
	isAllStatus(shopList) {
		let isAllSelect = true;
		let allPrice = 0;
		let havaActive = false
		shopList.forEach(item => {
			if (!item.active) {
				isAllSelect = false
			}
			if (item.active) {
				allPrice += item.buyNumber * item.sell_price;
				havaActive = true
			}
		})
		this.setData({
			isAllSelect,
			allPrice: allPrice.toFixed(2),
			shopList,
			havaActive
		})
	},
	// 删除商品
	deleteTap() {
		if (!this.data.havaActive) {
			return
		}
		let good_ids = [];
		let shopList = this.data.shopList;
		let newShopList = []
		shopList.forEach(item => {
			if (item.active) {
				good_ids.push(item.good_id)
			} else {
				newShopList.push(item)
			}
		})
		good_ids = JSON.stringify(good_ids)
		cartModel.showModal('确定要移除这些商品吗?', '温馨提示', true, () => {
			cartModel.showLoading('移除商品中...');
			cartModel.removeShopCart({
					good_id: good_ids
				})
				.then(res => {
					wx.hideLoading()
					if (res) {
						cartModel.showToast('移除成功')
						this.isAllStatus(newShopList)
					}
				})
		})
	},
	// 支付
	toPay() {
		if (!this.data.havaActive) {
			return
		}
		let shopList = this.data.shopList;
		app.globalData.buyShopList = shopList.filter(item => {
			if (item.buyNumber && item.active) {
				return item
			}
		})
		if (!app.globalData.buyShopList.length) {
			cartModel.showToast('购买金额不能为0！')
			return
		}
		wx.navigateTo({
			url: '/pages/cart/pay-order/pay-order'
		})
	}

})
