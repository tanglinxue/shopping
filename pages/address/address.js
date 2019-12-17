import AddressModel from '../../models/Address.js'
const addressModel = new AddressModel()
const app = getApp()
Page({
	data: {
		addressList: [], //地址列表
		page: 1,
		page_size: 10,
		loadingEnd: false, //是否loading结束
		firstStatus: true,
		noSelect: false //是否需要选择
	},
	onLoad(options) {
		if (options.noSelect) {
			this.setData({
				noSelect: true
			})
		}
	},
	onShow() {
		app.globalData.selectAddData = null;
		this.setData({
			page: 1
		})
		this.render()
	},
	// 选择收货地址
	selectTap(e) {
		if (this.data.noSelect) {
			return
		}
		let index = e.currentTarget.dataset.index;
		app.globalData.selectAddData = this.data.addressList[index];
		addressModel.navBack()
	},
	// 增加收货地址
	addAddess() {
		wx.navigateTo({
			url: "/pages/address/address-add/address-add"
		})
	},
	// 编辑收货地址
	editAddess(e) {
		let index = e.currentTarget.dataset.index;
		let addressList = this.data.addressList
		let id = addressList[index].rec_id;
		app.globalData.editAddData = addressList[index];
		wx.navigateTo({
			url: `/pages/address/address-add/address-add?id=${id}`
		})
	},
	// 收获地址查询
	getAddLists() {
		let {
			page,
			page_size
		} = this.data;
		addressModel.showLoading('加载收货地址列表中')
		let params = {
			page,
			page_size
		}
		addressModel.receiveLists(params)
			.then(
				res => {
					if (res) {
						let addressList = res.list;
						let total_pages = res.total_pages;
						this.setData({
							addressList,
							total_pages
						})
					}
					if (!this.data.loadingEnd) {
						this.setData({
							loadingEnd: true
						})
					}
					wx.hideLoading()
				}
			)
	},
	render() {
		if (this.data.firstStatus) {
			addressModel.showLoading('加载收货地址列表中')
		} else {
			this.setData({
				firstStatus: false
			})
		}
		this.getAddLists()
	},
	// 下拉加载更多
	onReachBottom() {
		let {
			page,
			page_size,
			total_pages
		} = this.data;
		if (total_pages > page) {
			this.setData({
				page: page + 1
			})
			addressModel.showLoading('加载更多收货地址中')
			this.getAddLists()
		}
	}

})
