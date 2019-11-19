import {
	StartModel
} from '../../models/start.js'
const startModel = new StartModel();
const app = getApp();
Page({

	data: {

	},

	onLoad: function(options) {
		startModel.wxLogin().then(
			res => {
				let params = {
					code: res.code
				}
				return startModel.login(params)
			}
		).then(res => {
			console.log(res)
			app.globalData.userInfo = res;
			return startModel.getconfig()
		}).then(res => {
			
			let category_info= res.category_info;
			app.globalData.category_info = category_info
			wx.switchTab({
				url: '/pages/index/index',
			})
		})

	},

})
