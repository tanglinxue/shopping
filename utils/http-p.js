import {
	config
} from '../config.js'
import Methods from './Methods'
const app = getApp();

class HTTP extends Methods {
	//查询是否登录
	wxLogin() {
		return new Promise((resolve) => {
			wx.login({
				success: res => {
					resolve(res)
				},
				fail: err => {
					this.showToast(err.errMsg)
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
						resolve(true)
					} else {
						resolve(false)
					}

				},
				fail: err => {
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
					resolve(res)
				},
				fail: err => {
					this.showToast(err.errMsg)
				}
			})
		})
	}
	request({
		url,
		data = {},
		method = 'GET'
	}) {
		return new Promise((resolve, reject) => {
			this._request(url, resolve, reject, data, method)
		})
	}
	_request(url, resolve, reject, data = {}, method = 'GET') {
		wx.request({
			url: config.api_base_url + url,
			method: method,
			data: data,
			header: {
				'content-type': 'application/json'
			},
			success: (res) => {
				const code = res.statusCode.toString()
				if (code.startsWith('2')) {
					resolve(res.data)
				} else {
					reject()
					const error_code = res.data.error_code
				}
			},
			fail: (err) => {
				reject()
			}
		})
	}

	request2({
		url,
		data = {},
		method = 'POST'
	}) {
		return new Promise((resolve, reject) => {
			this._request2(url, resolve, reject, data, method)
		})
	}
	_request2(url, resolve, reject, data = {}, method = 'POST') {
		let userInfo = app.globalData.userInfo
		if (userInfo && userInfo.user_id) {
			data.user_id = userInfo.user_id
		}
		let header = {
			'content-type': 'application/json',
		}
		if (userInfo && userInfo.user_token) {
			header.token = userInfo.user_token
		}
		wx.request({
			url: config.api_base_url2 + url,
			method: method,
			data,
			header,
			success: (res) => {
				//console.log(res)
				let {
					statusCode,
					data
				} = res;
				if (statusCode == 200 && data.status == 0) {
					resolve(data.data)
				} else {
					this.showToast(data.msg, 'none')
					resolve(false)
				}
			},
			fail: (err) => {
				this.showToast(err)
				resolve(false)
			},
			complete: res => {
				console.log(JSON.stringify(data))
				console.log(JSON.stringify(header))
				console.log(config.api_base_url2 + url)
			}
		})
	}
	uploadFile(src = '') {
		return new Promise((resolve, reject) => {
			this._uploadFile(resolve, reject, src)
		})
	}
	_uploadFile(resolve, reject, src = '') {
		wx.uploadFile({
			url: config.api_base_url2 + 'upload',
			filePath: src,
			name: 'image',
			formData: {
				'user': 'test'
			},
			success: (res) => {
				console.log(res)
				let {
					statusCode,
					data
				} = res;
				data = JSON.parse(data)
				if (statusCode == 200 && data.status == 0) {
					resolve(data.data)
				} else {
					this.showToast(data.msg, 'none')
					resolve(false)
				}
			},
			fail: (err) => {
				this.showToast(err)
				resolve(false)
			}
		})
	}
}

export {
	HTTP
}
