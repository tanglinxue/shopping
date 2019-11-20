import HomeModel from '../../models/Home.js'
const homeModel = new HomeModel()
Page({
	data: {
		page:1,//页数
		goods_list: [], //商品集合
		category_list:[],//类别集合
		selectCategory:0,
	},
	onLoad() {
		this.render()
	},
	render() {
		homeModel.showLoading('加载商品中')
		this.getGoodsList()
	},
	//获取商品列表
	getGoodsList() {
		let page = this.data.page;
		let params = {
			type: 1,
			page
		}
		homeModel.getGoodsList(params)
			.then(res => {
				if (res) {
					let category_list = res.category_list;
					let  goods_list= res.goods_list.data;
					this.setData({
						goods_list,
						category_list
					})
				}
				wx.hideLoading()
			})
	},
	// 选择类别
	selectCateTap(e){
		let selectCategory = e.currentTarget.dataset.index;
		this.setData({
			selectCategory
		})
	},
	// 跳转详情
	jumptap(e){
		let good_id = e.currentTarget.dataset.id;
		wx.navigateTo({
		  url: `/pages/goods-detail/goods-detail?good_id=${good_id}`
		})
	}

})
