import StartModel from '../../models/Start.js'
const startModel = new StartModel();
const app = getApp();
Page({
	onLoad: function(options) {
		this.render()
	},
	render(){
		startModel.wxLogin().then(
			res => {
				// 获取code
				let params = {
					code: res.code
				}
				return startModel.login(params)
			}
		).then(res => {
			// 将用户信息存入全局
			app.globalData.userInfo = res;
			return startModel.getconfig()
		}).then(res => {
			// 将配置信息存入全局
			app.globalData.category_info = res.category_info;
			// 进入首页
			wx.switchTab({
				url: '/pages/index/index',
			})
		})
	}

})
