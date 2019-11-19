import PublishModel from '../../../models/Publish.js'
const publishModel = new PublishModel();
const app = getApp();
Page({
	data: {
		shopList: [], //商品列表
		page: 1
	},
	onLoad: function(options) {
		this.render()
	},
	render() {
		// 加载商品数据
		publishModel.showLoading()
		let page = this.data.page;
		let params = {
			page: 1
		}
		publishModel.publishList(params)
			.then(res => {
				wx.hideLoading()
				let shopList = res.goods_list.data;
				shopList.forEach(item => {
						item.update_time = publishModel.format(item.update_time * 1000, "yyyy-MM-dd HH:mm:ss")
				})
				this.setData({
					shopList
				})
			})
	}
})
