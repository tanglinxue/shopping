const app = getApp();
class Methods {
	// 设置缓存和全局变量
	setStorage(key, con) {
		wx.setStorageSync(key, con);
		app.globalData.key = con
	}
	// 获取全局变量或者缓存
	getStorage(item) {
		if (app.globalData.item) {
			return app.globalData.item
		}
		if (wx.getStorageSync(item)) {
			return wx.getStorageSync(item)
		}
		return false
	}
	// showLoading提示
	//toast提示
	showToast(title = '温馨提示', icon = 'none', duration = 2000) {
		wx.showToast({
			title,
			icon,
			duration: 2000
		})
	}
	showLoading(title = '数据加载中') {
		wx.showLoading({
			title
		})
	}
	//modal提示
	showModal(title, content) {
		wx.showModal({
			title,
			content,
			showCancel: false
		})
	}
	//获取元素自适应后的实际宽度
	getEleWidth(w) {
		var real = 0;
		try {
			var res = wx.getSystemInfoSync().windowWidth;
			var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
			real = Math.floor(res / scale);
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
}
export default Methods
