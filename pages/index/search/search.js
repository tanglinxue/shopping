import HomeModel from '../../../models/Home.js'
const homeModel = new HomeModel()
const app = getApp()
Page({
	data: {
		search: true, //搜索状态
		recentShow: true, //显示历史搜索
		recentSearch: [], //历史搜索
		searchValue: '', //搜索值
		lists: [],
		loadingEnd: false, //是否loading结束
		firstStatus: true,
    page:1,
    page_size:10
	},
	onShow: function() {
		this.getRecentSearch();
	},
	// 获取历史搜索
	getRecentSearch: function() {
		let recentSearch = wx.getStorageSync('recentSearch');
		if (recentSearch) {
			this.setData({
				recentSearch
			});
		}
	},
	// 清除历史搜索
	clearHistory: function() {
		wx.clearStorageSync('recentSearch')
		this.setData({
			recentSearch: []
		})
	},
	// 去搜索
	goSearch: function(e) {
		this.search(e)
	},
	// 聚焦
	searchFocus: function() {
		this.setData({
			search: false,
			searchInput: true
		})
	},
	// 取消
	searchClose: function() {
		this.setData({
			search: true,
			searchInput: false,
			recentShow: true
		})
	},
	// 开始搜索
	search: function(e) {
		let that = this
		let keywords;
		e.detail.value ? keywords = e.detail.value : keywords = e.currentTarget.dataset.text,
			that.data.searchValue = keywords;
		if (that.data.searchValue) {
			// 记录最近搜索
			let recentSearch = wx.getStorageSync('recentSearch') || [];
			if (!homeModel.isStrInArray(keywords, recentSearch)) {
				recentSearch.unshift(that.data.searchValue);
				wx.setStorageSync('recentSearch', recentSearch)
				that.setData({
					recentSearch: recentSearch
				})
			}
		}
		this.setData({
			keywords
		})
		homeModel.showLoading('搜索商品中')
		this.getGoodList()

	},
	// 获取商品信息
	getGoodList() {
    this.setData({
      loadingEnd:false
    })
		let {
			page,
			page_size,
			keywords
		} = this.data
		let params = {
			type: 3,
			page,
			page_size,
			good_name: keywords
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
						last_page,
						recentShow: false,
					})
				} else {
					this.setData({
						recentShow: true,
					});
				}
				if (!this.data.loadingEnd) {
					this.setData({
						loadingEnd: true
					})
				}
				wx.hideLoading()
			})
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
			this.getGoodList()
		}
	}

})
