Component({
	properties: {
		sharePopup: {
			type: Boolean,
			value: false
		},
		photoState: {
			type: Boolean,
			value: false
		}
	},
	methods: {
		// 关闭弹窗
		closeshare() {
			this.triggerEvent('closeShare', {})
		},
		// 获取二维码
		getcode() {
			this.triggerEvent('getCode', {})
		}
	
	}

})
