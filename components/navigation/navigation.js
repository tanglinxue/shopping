const app = getApp();
import StartModel from '../../models/Start.js'
const startModel = new StartModel();
Component({
	properties: {
		//小程序页面的表头
		title: {
			type: String,
			default: '商城'
		},
		//是否展示返回和主页按钮
		showIcon: {
			type: Boolean,
			default: true
		},
		//是否显示标题
		showTitle: {
			type: Boolean,
			default: true
		},
		//是否显示搜索框
		showSearch: {
			type: Boolean,
			default: true
		},
		// 是否放弃编辑
		edit: {
			type: Boolean,
			default: false
		}
	},

	data: {
		statusBarHeight: 0,
		titleBarHeight: 0,
	},

	ready: function() {
		// 因为很多地方都需要用到，所有保存到全局对象中
		if(!app.globalData.statusBarHeight){
			startModel.getSystemInfo();
		}
		let {statusBarHeight,titleBarHeight} = app.globalData;
		
		this.setData({
			statusBarHeight: statusBarHeight || 0,
			titleBarHeight: titleBarHeight || 0
		});

	},

	methods: {
		// 回退
		headerBack() {
			if (this.properties.edit) {
				wx.showModal({
					title: '您确定放弃编辑吗？',
					content: '退出后信息将丢失',
					confirmText: '确定',
					cancelText: '取消',
					success:(res)=> {
						if (res.confirm) {
							this.backMethod()
						}
					}
				})
			} else {
				this.backMethod()
			}

		},
		// 回退方法
		backMethod(){
			wx.navigateBack({
				delta: 1,
				fail(e) {
					wx.switchTab({
						url: '/pages/index/index'
					})
				}
			})
		},
		// 去首页
		headerHome() {
			wx.switchTab({
				url: '/pages/index/index'
			})
		},
		//去搜索
		headerSearch() {
			wx.navigateTo({
				url: '/pages/index/search/search'
			})
		}
	}
})
