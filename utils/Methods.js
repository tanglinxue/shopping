const app = getApp();
import Utils from './Utils'
// 基础方法类
class Methods extends Utils{
	//toast提示
	showToast(title = '温馨提示', icon = 'none', duration = 2000,cb) {
		wx.showToast({
			title,
			icon,
			duration: 2000,
			success:res=>{
				if(cb){
					setTimeout(()=>{
						cb()
					},1000)
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
	showModal(title, content) {
		wx.showModal({
			title,
			content,
			showCancel: false
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
}
export default Methods
