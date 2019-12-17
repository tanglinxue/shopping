import PublicModel from '../../models/Public.js'
const publicModel = new PublicModel();
const app = getApp();
Page({
	data: {
		userStatus: false, //是否登录
		is_own: 0
	},
	onLoad() {
		this.render()
	},
	render() {
		let {
			head_pic,
			nick_name,
			is_own
		} = app.globalData.userInfo;
		this.setData({
			is_own
		})
		if (head_pic) {
			this.setData({
				head_pic
			})
		}
		if (nick_name) {
			this.setData({
				nick_name
			})
		}
		this.getUserStatus()
	},
	// 获取用户是否登录状态
	getUserStatus() {
		publicModel.getUserStatus('userInfo')
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
	jumptap(e) {
		let type = e.currentTarget.dataset.type * 1;
		console.log(type)
		if (type === 1) {
			let index = e.currentTarget.dataset.index * 1;
			// 去往订单列表页
			wx.navigateTo({
				url: `/pages/order-list/order-list?type=${index}`
			})
		} else if (type === 2) {
			//我的地址列表页
			wx.navigateTo({
				url: '/pages/address/address?noSelect=true'
			})
		} else if (type === 3) {
			//发起商品
			wx.navigateTo({
				url: '/pages/publish/publish'
			})
		} else if (type === 4) {
			//查看商品
			wx.navigateTo({
				url: '/pages/publish/publishList/publishList'
			})
		}
	},
	// 分享
	onShareAppMessage() {
		let myShare = app.globalData.myShare;
    let rcj = JSON.stringify({
      uid: app.globalData.userInfo.user_id
    })
    rcj = encodeURIComponent(rcj);
    let path = `/pages/start/start?rct=2&rcj=${rcj}`;
    console.log(path)
		return {
			title: myShare.share_title,
      path,
			imageUrl: myShare.share_pic
		}
	}
})
