Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		// 是否显示弹窗
		showErocode: {
			type: Boolean,
			value: false
		},
		codeImg:{
			type:String,
			value:''
		}
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		// 关闭二维码
		closeTap() {
			this.triggerEvent('closeCode', {})
		},
		// 二维码预览
		ecrodenewPrev() {
			wx.previewImage({
				current: this.properties.codeImg, // 当前显示图片的http链接  
				urls: [this.properties.codeImg] // 需要预览的图片http链接列表  
			})
		}
	}
})
