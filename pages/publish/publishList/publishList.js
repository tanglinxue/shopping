import PublishModel from '../../../models/Publish.js'
const publishModel = new PublishModel();
const app = getApp();
Page({
	data: {
		shopList: [], //商品列表
		page: 1,
		page_size: 10,
		loadingEnd: false, //是否loading结束
		firstStatus: true
	},
	onShow(options) {
		this.setData({
			page: 1
		})
		this.render()
	},
	render() {
		if (this.data.firstStatus) {
			publishModel.showLoading('加载商品列表中')
		} else {
			this.setData({
				firstStatus: false
			})
		}
		this.getGoodsList()
	},
	// 加载商品数据		
	getGoodsList() {

		let {
			page,
			page_size
		} = this.data
		let params = {
			page,
			page_size
		}
		publishModel.publishList(params)
			.then(res => {
				let shopList = res.goods_list.data;
				let last_page = res.goods_list.last_page;
				shopList.forEach(item => {
					item.update_time = publishModel.format(item.update_time * 1000, "yyyy-MM-dd HH:mm:ss")
				})
				if (page > 1) {
					shopList = this.data.shopList.concat(shopList)
				}
				this.setData({
					shopList,
					last_page
				})
				if (!this.data.loadingEnd) {
					this.setData({
						loadingEnd: true
					})
				}
				wx.hideLoading()
			})
	},
	// 添加商品
	addShop() {
		wx.navigateTo({
			url: '/pages/publish/publish'
		})
	},
	// 下拉加载更多
	onReachBottom() {
		let {
			page,
			last_page
		} = this.data;
		if (last_page > page) {
			this.setData({
				page: page + 1
			})
			publishModel.showLoading('加载更多商品中')
			this.getGoodsList()
		}
	}
})
