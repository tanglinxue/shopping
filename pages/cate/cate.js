import HomeModel from '../../models/Home.js'
const homeModel = new HomeModel();
const app = getApp()
Page({
	data: {
		page: 1, //页数
		goods_list: [], //商品集合
		category_list: [], //类别集合
		selectCategory: 0,
		type: 1, //1:全部,2:分类
		loadingEnd: false, //是否loading结束
		firstStatus:true,
    page_size: 30,
	},
	// 首次进入
	onLoad() {	
		let {
			statusBarHeight,
			titleBarHeight
		} = app.globalData;
		this.setData({
			statusBarHeight: statusBarHeight || 0,
			titleBarHeight: titleBarHeight || 0
		})
	},
	// 每次刷新页面
	onShow(){
		this.setData({
			page:1
		})
		if(this.data.firstStatus){
			homeModel.showLoading('加载商品中')
		}else{
			this.setData({
				firstStatus:false
			})
		}
		this.getGoodsList()
	},
	//获取商品列表
	getGoodsList() {
		let {
			page,
			type,
			selectCategory,
			category_list,
      page_size
		} = this.data;
		let params = {
			type,
			page,
			page_size
		}
		if (type == 2) {
			params.category_id = category_list[selectCategory].category_id;
		}
		homeModel.getGoodsList(params)
			.then(res => {
				if (res) {
					if (type == 1) {
						// 全部种类
						let category_list = res.category_list;
						category_list.unshift({category_name:'全部'})
						this.setData({
							category_list
						})
					}
					let {
						data: goods_list,
						last_page
					} = res.goods_list;
					if (page > 1) {
						goods_list = this.data.goods_list.concat(goods_list)
					}
					this.setData({
						goods_list,
						last_page
					})
				}
				if (!this.data.loadingEnd) {
					this.setData({
						loadingEnd: true
					})
				}
				wx.hideLoading()
			})
	},
	// 选择类别
	selectCateTap(e) {
		let selectCategory = e.currentTarget.dataset.index;
		let type = 1;
		if (selectCategory) {
			type = 2;
		}
		this.setData({
			selectCategory,
			type,
			page:1
		})
		homeModel.showLoading('加载商品中')
		this.getGoodsList()
	},
	// 下拉加载更多
	onReachBottom() {
		console.log('nihao')
		let {
			page,
			page_size,
			last_page
		} = this.data;
		if (last_page > page) {
			this.setData({
				page: page + 1
			})
			homeModel.showLoading('加载更多商品中')
			this.getGoodsList()
		}
	},
	// 跳转详情
	jumptap(e) {
		let good_id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: `/pages/goods-detail/goods-detail?good_id=${good_id}`
		})
	}

})
