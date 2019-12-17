import HomeModel from '../../models/Home.js'
const homeModel = new HomeModel()
// 首页
Page({
	data: {
		banners: [], //banners集合
		lists: [], //商品集合
		indexMenus: [ //menu数据
			{
        src: '/images/my/cart.png',
				name: '类别'
			},
			{
        src: '/images/my/chat.png',
				name: '购物车'
			},
			{
        src: '/images/my/order.png',
				name: '订单'
			}
		],
		page: 1, //页数
		page_size: 10,
		loadingEnd: false, //是否loading结束
		firstStatus:true
	},
	onShow() {
		this.setData({
			page: 1
		})
		this.render()
	},
	render() {
		if(this.data.firstStatus){
			homeModel.showLoading('加载商品中')
		}else{
			this.setData({
				firstStatus:false
			})
		}
		this.getBanners()
		this.getGoodsList()
	},
	// 获取banner数据
	getBanners() {
		let params = {
			type: 4
		}
		homeModel.getHomeBanner(params)
			.then(res => {
				if (!res) return
				this.setData({
					banners: res.goods_list
				});
			})
	},
	//获取商品列表
	getGoodsList(type) {
		let {
			page,
			page_size
		} = this.data
		let params = {
			type: 1,
			page,
			page_size
		}
		homeModel.getGoodsList(params)
			.then(res => {
				if (res) {
					let {
						data: lists,
						last_page
					} = res.goods_list;
					if (page > 1) {
						lists = this.data.lists.concat(lists)
					}
					this.setData({
						lists,
						last_page
					})
				}
				if (!this.data.loadingEnd) {
					this.setData({
						loadingEnd: true
					})
				}
				if(type&&type=='refresh'){
					wx.stopPullDownRefresh()
				}
				
				wx.hideLoading()
			})
	},
	// 跳转
	jumptap(e) {
		let index = e.currentTarget.dataset.index;
		if (index === 0) {
			//类别
			wx.switchTab({
				url: '/pages/cate/cate'
			})
		} else if (index === 1) {
			//购物车
			wx.switchTab({
				url: '/pages/cart/cart'
			})
		} else if (index === 2) {
			// 订单列表
			wx.navigateTo({
				url: '/pages/order-list/order-list'
			})
		}
	},
	// 下拉加载更多
	onReachBottom() {
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
	// 上啦刷新
	onPullDownRefresh() {
		homeModel.showLoading('刷新数据中');
		this.setData({
			page: 1
		})
		this.getGoodsList('refresh')
	},
})
