import PublicModel from '../../models/Public.js'
const publicModel = new PublicModel();
const app = getApp();
Page({
	data: {
		userStatus: false //是否登录
	},
	onLoad() {	
		this.render()
	},
	render(){
		this.getUserStatus()
	},
	// 获取用户是否登录状态
	getUserStatus() {
		publicModel.getUserStatus()
			.then(res =>
				this.setData({
					userStatus: res
				})
			)
	},
	// 授权
	bindGetUserInfo(e) {
		if (e.detail.errMsg == "getUserInfo:ok") {
			this.setData({
				userStatus: true
			})
			publicModel.showLoading('用户授权中')
			// 获取用户信息
			publicModel.getUserInfo()
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
					//用户授权
					return publicModel.authorUser(params)
				})
				.then(res => {
					wx.hideLoading()
					console.log(res)
				})
		}
	},
	//页面跳转
	jumptap(e){
		let type = e.currentTarget.dataset.type*1;
		console.log(type)
		if (type === 4) {
			//发起商品
			wx.navigateTo({
				url: '/pages/publish/publish'
			})
		} else if (type === 5) {
			//查看商品
			wx.navigateTo({
				url: '/pages/publish/publishList/publishList'
			})
		}
	}
})
