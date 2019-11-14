//加减弹窗
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		buyNumber: {
			type: Number,
			value: 1
		},
		buyNumMax: {
			type: Number,
			value: 10
		}
	},
	data: {
		buyNumMin: 0
	},
	observers:{
		// 决定购买量
		'buyNumber': function(val) {
			if (val) {
				this.setData({
					buyNumMin: 1
				})
			}
		}
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		// 减法
		numJianTap() {
			let {
				buyNumMin
			} = this.data;
			let {
				buyNumber
			} = this.properties;
			if (buyNumber > buyNumMin) {
				buyNumber--;
				this.setData({
					buyNumber
				})
			}
		},
		// 加法
		numJiaTap() {
			let {
				buyNumber,
				buyNumMax
			} = this.properties;
			if (buyNumber < buyNumMax) {
				buyNumber++;
				this.setData({
					buyNumber
				})
			}
		}
	}
})
