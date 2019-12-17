const app = getApp();
import Utils from './Utils'
// 基础方法类
class Methods extends Utils {
	//toast提示
	showToast(title = '温馨提示', icon = 'none', duration = 2000, cb) {
		wx.showToast({
			title,
			icon,
			duration: 2000,
			success: res => {
				if (cb) {
					setTimeout(() => {
						cb()
					}, 1000)
				}
			}
		})
	}
	//showLoading提示
	showLoading(title = '数据加载中') {
		wx.showLoading({
			title
		})
	}
	//modal提示
	showModal(content, title = '温馨提示', bol = false, cb) {
		wx.showModal({
			title,
			content,
			showCancel: bol,
			success(res) {
				if (res.confirm) {
					cb && cb()
				}
			}
		})
	}
	//获取元素自适应后的实际宽度
	getEleWidth(w) {
		let real = 0;
		try {
			let res = wx.getSystemInfoSync().windowWidth;
			let scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
			real = Math.floor(res / scale);
			return real;
		} catch (e) {
			return false;
		}
	}
	// 获取状态栏高度等其他设备信息
	getSystemInfo() {
		try {
			let res = wx.getSystemInfoSync();
      console.log(res)
      let { statusBarHeight,windowHeight} =res;
      let titleBarHeight = 0;
			if (res.model.indexOf('iPhone') !== -1) {
        titleBarHeight = 44
			} else {
				titleBarHeight = 48
			}
			  app.globalData.titleBarHeight = titleBarHeight;
			  console.log(res)
			  app.globalData.bodyHeight = windowHeight - statusBarHeight - titleBarHeight;
			app.globalData.statusBarHeight = statusBarHeight;
      app.globalData.SDKVersion = res.SDKVersion
			return real;
		} catch (e) {
			return false;
		}
	}


	// 返回
	navBack() {
		if (getCurrentPages().length != 1) {
			wx.navigateBack();
		}
	}
	// 设置缓存和全局变量
	setStorage(key, con) {
		wx.setStorageSync(key, con);
		app.globalData.key = con
	}
	// 获取全局变量或者缓存
	getStorage(key) {
		if (app.globalData.key) {
			return app.globalData.key
		}
		if (wx.getStorageSync(key)) {
			return wx.getStorageSync(key)
		}
		return false
	}
	// 判断是否在数组中
	isStrInArray(item, arr) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] == item) {
				return true;
			}
		}
		return false;
	}
}
export default Methods
