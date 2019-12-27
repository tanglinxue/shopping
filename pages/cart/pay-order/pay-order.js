const app = getApp()
import CartModel from '../../../models/Cart.js'
const cartModel = new CartModel()
Page({
	data: {
		goodsList: [], //商品列表
		allGoodsPrice: 0, //总金额
		yunPrice: 0, //运费
		allGoodsAndYunPrice: 0, //金额加运费
		remarks: '', //备注信息
		rec_id: '', //收货id
		curAddressData: null,
		haveAddress: false,
		firstEnter: true,
		type: 1,
		endStatus: false,
		userStatus: false, //是否授权
	},
	onShow() {
		// 不是第一次就加载地址
		if (!this.data.firstEnter) {
			this.render()
		} else {
			this.setData({
				firstEnter: false
			})
		}
	},
	onLoad(options) {
		if (options.endStatus) {
			this.setData({
				endStatus: true
			})
		}
		this.getUserStatus()
		// 设置商品列表及价格
		// 待支付
		if (app.globalData.buyShopObject) {

			let buyShopObject = app.globalData.buyShopObject;
			console.log(buyShopObject)
			let goodsList = buyShopObject.good_detail;
			this.computed(goodsList)
			let selectAddData = buyShopObject.rec_address;
			if (buyShopObject.express_company) {
				this.setData({
					express_company: buyShopObject.express_company,
					deliver_order: buyShopObject.deliver_order
				})
			}
			this.setData({
				curAddressData: selectAddData,
				rec_id: selectAddData.rec_id,
				order_id: buyShopObject.order_id,
				remarks: buyShopObject.remarks,
				type: 2
			})
			app.globalData.buyShopObject = null
		}
		// 未支付
		if (app.globalData.buyShopList) {
			let goodsList = app.globalData.buyShopList;
			this.computed(goodsList)
			app.globalData.buyShopList = null;
			this.render()
		}
	},
	// 获取用户授权状态
	getUserStatus() {
		cartModel.getUserStatus('userInfo').
		then(res => this.setData({
			userStatus: res
		}))
	},
	// 用户进行授权
	bindGetUserInfo(e) {
		if (e.detail.errMsg == "getUserInfo:ok") {
			this.setData({
				userStatus: true
			})
			cartModel.getUserInfo()
				.then(res => {
					let {
						encryptedData,
						iv
					} = res;
					let {
						country,
						province,
						city
					} = res.userInfo;
					let address = {
						country,
						province,
						city
					};
					address = JSON.stringify(address)
					let {
						session_key
					} = app.globalData.userInfo;
					let params = {
						encryptedData,
						iv,
						address,
						session_key
					};
					return cartModel.authorUser(params)
				})
				.then(res => {
					//this.createOrder()
				})
		}
	},
	// 计算价格
	computed(goodsList) {
		let {
			allGoodsPrice,
			yunPrice,
			allGoodsAndYunPrice
		} = this.data;
		let haveNoyun = false;
		goodsList.forEach(item => {
			if (item.good_num) {
				item.buyNumber = item.good_num
			}
			allGoodsPrice += item.sell_price * item.buyNumber;
			let freight = item.freight * 1;
			if (freight > yunPrice) {
				yunPrice = freight
			}
			if (!freight) {
				haveNoyun = true
			}
		});
		if (haveNoyun) {
			yunPrice = 0;
		}
		allGoodsAndYunPrice = allGoodsPrice + yunPrice;
		allGoodsPrice = allGoodsPrice.toFixed(2)
		yunPrice = yunPrice.toFixed(2)
		allGoodsAndYunPrice = allGoodsAndYunPrice.toFixed(2)
		this.setData({
			allGoodsPrice,
			yunPrice,
			allGoodsAndYunPrice,
			goodsList
		});
	},

	render() {

		// 假如选中了地址
		if (app.globalData.selectAddData) {
			let selectAddData = app.globalData.selectAddData;
			this.setData({
				curAddressData: selectAddData,
				rec_id: selectAddData.rec_id
			})
			app.globalData.selectAddData = null
			return
		}
		// 获取收货地址
		cartModel.getconfig({
				type: 1
			})
			.then(res => {
				if (res) {
					let {
						is_exit_rece,
						receive_info
					} = res;
					if (receive_info) {
						this.setData({
							curAddressData: receive_info,
							rec_id: receive_info.rec_id
						})
					} else {
						if (is_exit_rece) {
							this.setData({
								haveAddress: true
							})
						} else {
							this.setData({
								haveAddress: false
							})
						}
					}
				}
			})
	},
	// 备注填写
	remarkEvent(e) {
		this.setData({
			remarks: e.detail.value.trim()
		})
	},
	// 提交订单
	createOrder: function(e) {
		let id = app.globalData.send_goods_submsg;
		if (app.globalData.SDKVersion < '2.8.2') {
			this.buyTap('')
			return
		}
		let tmplIds = [id];
		wx.requestSubscribeMessage({
			tmplIds: tmplIds,
			success: (res) => {
				console.log(res)
				// if (res[id] =='accept'){

				// }
				let form_id = res[id] == 'accept' ? 1 : 2
				this.buyTap(form_id)
			},
			fail: (err) => {
				console.log(err)
			}
		})
	},
	buyTap(form_id) {
		let {
			allGoodsPrice,
			yunPrice,
			allGoodsAndYunPrice,
			remarks,
			curAddressData,
			goodsList,
			type
		} = this.data;
		if (!curAddressData) {
			cartModel.showModal('请先设置您的收货地址！')
			return
		}
		console.log(goodsList)
		let good_info = goodsList.map(item => {
			let {
				buyNumber,
				good_name,
				subgood_id,
				sell_price,
				cart_classic,
				classic_type
			} = item;
			
			let newItem = {
				good_num: buyNumber,
				good_name,
				good_id: subgood_id,
				sell_price,
				cart_classic
			}
			if (classic_type == 2) {
				newItem.cart_colour = item.cart_colour
			}
			if (classic_type == 3) {
				newItem.cart_size = item.cart_size
			}
			return newItem
		})
		console.log(good_info)
		good_info = JSON.stringify(good_info)
		cartModel.showLoading('发起支付中')
		let params = {
			good_info,
			rec_id: curAddressData.rec_id,
			total_money: allGoodsAndYunPrice,
			good_price: allGoodsPrice,
			freight: yunPrice,
			remarks,
			type,
			form_id
		}
		if (type == 2) {
			params.order_id = this.data.order_id
		}
		cartModel.payOrder(params)
			.then(res => {
				if (!res) return;
				console.log(res)
				let {
					timeStamp,
					nonceStr,
					signType,
					paySign
				} = res;
				let _package = res.package;
				wx.requestPayment({
					timeStamp,
					nonceStr,
					package: _package,
					signType,
					paySign,
					success: () => {
						cartModel.showToast('支付成功', 'success', 2000, () => {
							wx.redirectTo({
								url: `../success/success`
							})
						})
					},
					fail: (err) => {
						console.log(err)
						cartModel.showModal('支付失败')
					},
					complete: (res) => {
						console.log(res)
						wx.hideLoading()
					}
				});
			})

	},
	// 添加收货地址
	addAddress: function() {
		if (this.data.endStatus) {
			return
		}
		if (this.data.haveAddress) {
			wx.navigateTo({
				url: "/pages/address/address"
			})
		} else {
			wx.navigateTo({
				url: "/pages/address/address-add/address-add"
			})
		}
	},
	// 选择收货地址
	selectAddress: function() {
		if (this.data.endStatus) {
			return
		}
		wx.navigateTo({
			url: "/pages/address/address"
		})
	}
})
