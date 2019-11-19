import {
	StartModel
} from '../../models/start.js'
const startModel = new StartModel();
const app = getApp();
Page({
	data: {
		userStatus: false
	},
	onLoad() {
		this.getUserStatus()
	},
	getUserStatus() {
		startModel.getUserStatus().
		then(res => this.setData({
			userStatus: res
		}))
	},
	bindGetUserInfo(e) {
		console.log(e)
		if (e.detail.errMsg == "getUserInfo:ok") {
			startModel.getUserInfo()
				.then(res => {
					let {
						encryptedData,
						iv
					} = res;
					let {
						country,
						province,
						city
					} = res.userInfo;
					let address = {
						country,
						province,
						city
					};
					address = JSON.stringify(address)
					let {
						session_key
					} = app.globalData.userInfo;
					let params = {
						encryptedData,
						iv,
						address,
						session_key
					};
					return startModel.getUserUpdate(params)
				})
				.then(res => {
					if(res){
						this.setData({
							userStatus:true
						})
					}
				})
		}
	}
})
