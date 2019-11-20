import {
	config
} from '../config.js'
import Methods from './Methods'
const app = getApp();
// HTTP相关类
class HTTP extends Methods {
	// 基础请求
	request({
		url,
		data = {},
		method = 'POST'
	}) {
		return new Promise((resolve, reject) => {
			this._request(url, resolve, reject, data, method)
		})
	}
	// 基础请求封装
	_request(url, resolve, reject, data = {}, method = 'POST') {
		// 获取全局用户信息
		let userInfo = app.globalData.userInfo
		if (userInfo && userInfo.user_id) {
			// body公参
			data.user_id = userInfo.user_id
		}
		data.user_id = 'osoT25ewNV82cww5F43JYQgbJwqw'
		let header = {
			'content-type': 'application/json',
		}
		if (userInfo && userInfo.user_token) {
			// header公参
			header.token = userInfo.user_token
		}
		header.token = '4a88e57c8bb3b8961b6cc7fc44672127'
		wx.request({
			url: config.api_base_url + url,
			method,
			data,
			header,
			success: (res) => {
				let {
					statusCode,
					data
				} = res;
				if (statusCode == 200 && data.status == 0) {
					// 成功处理
					resolve(data.data)
				} else {
					// 错误处理
					this.showToast(data.msg)
					resolve(false)
				}
			},
			fail: (err) => {
				this.showToast('网络错误,请重试')
				resolve(false)
			},
			complete: res => {
				console.log(JSON.stringify(data))
				console.log(JSON.stringify(header))
				console.log(config.api_base_url + url)
			}
		})
	}
	// 上传请求
	uploadFile(filePath = '') {
		return new Promise((resolve, reject) => {
			this._uploadFile(resolve, reject, filePath)
		})
	}
	// 上传请求封装
	_uploadFile(resolve, reject, filePath = '') {
		wx.uploadFile({
			url: config.api_base_url + 'upload',
			filePath,
			name: 'image',
			formData: {
				'user': 'test'
			},
			success: (res) => {
				let {
					statusCode,
					data
				} = res;
				data = JSON.parse(data)
				if (statusCode == 200 && data.status == 0) {
					// 成功处理
					resolve(data.data)
				} else {
					// 错误处理
					this.showToast(data.msg)
					resolve(false)
				}
			},
			fail: (err) => {
				this.showToast('网络错误,请重试')
				resolve(false)
			}
		})
	}
	//查询是否登录
	wxLogin() {
		return new Promise((resolve) => {
			wx.login({
				success: res => {
					// 成功处理
					resolve(res)
				},
				fail: err => {
					// 错误处理
					this.showToast('获取code失败')
					resolve(false)
				}
			})
		})
	}
	// 查询是否授权
	getUserStatus() {
		return new Promise((resolve) => {
			wx.getSetting({
				success: res => {
					if (res.authSetting['scope.userInfo']) {
						// 成功处理
						resolve(true)
					} else {
						// 错误处理
						resolve(false)
					}
				},
				fail: err => {
					// 错误处理
					resolve(false)
				}
			})
		})
	}
	// 获取用户信息
	getUserInfo() {
		return new Promise((resolve) => {
			wx.getUserInfo({
				lang: "zh_CN",
				success: res => {
					// 成功处理
					resolve(res)
				},
				fail: err => {
					// 错误处理
					resolve(false)
				}
			})
		})
	}
	// 其它请求
	otherRequest({
		url,
		data = {},
		method = 'GET'
	}) {
		return new Promise((resolve, reject) => {
			this._otherRequest(url, resolve, reject, data, method)
		})
	}
	// 其它请求封装
	_otherRequest(url, resolve, reject, data = {}, method = 'GET') {
		wx.request({
			url: config.other_base_url + url,
			method,
			data: data,
			header: {
				'content-type': 'application/json'
			},
			success: (res) => {
				resolve(res.data)
			}
		})
	}
}

export default HTTP
