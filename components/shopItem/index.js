
Component({
	properties: {
		shopItem: {
			type: Object,
			value: {}
		}
	},
	methods:{
		jumptap(e){
			// 跳转到发布页
			let id = e.currentTarget.dataset.id;
			wx.navigateTo({
				url:`/pages/publish/publish?good_id=${id}`
			})
		}
	}
})
