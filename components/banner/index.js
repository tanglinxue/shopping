Component({
	properties: {
		banners: Array,
		fromDetail: {
			type: Boolean,
			value: false
		}
	},
	data: {
		swiperCurrent: 0, //滑动索引
	},
	methods: {
		//banner滑动
		swiperchange: function(e) {
			this.setData({
				swiperCurrent: e.detail.current
			})
		},
		// 跳转详情
		jumpTap(e) {
			if (this.properties.fromDetail) {
				return
			}
			let id = e.currentTarget.dataset.id;;
			wx.navigateTo({
				url: `/pages/goods-detail/goods-detail?good_id=${id}`
			})
		}
	}
})
