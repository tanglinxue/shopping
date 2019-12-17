import PublishModel from '../../models/Publish.js'
const publishModel = new PublishModel();
const app = getApp();
Page({
	data: {
		good_id: '',
		goodsDetail: {}, //商品详情数据
		showPopup: false, //是否显示底部弹窗
		sharePopup: false, //是否显示分享弹窗
		showType: 1, //弹窗类型
		showErocode: false,
		loadingEnd: false, //是否loading结束
		photoState: false,
		reply: false,
		shopcart_count: 0
	},
	onLoad: function(options) {
		this.setData({
			good_id: options.good_id
		})
		publishModel.showLoading('加载商品详情中')
		this.render()
	},
	onShow() {
		if (this.data.loadingEnd) {
			this.render()
		}
		publishModel.getUserStatus('writePhotosAlbum')
			.then(res => {
				if (res) {
					this.setData({
						photoState: res
					})
				} else {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success: res => {
							this.setData({
								photoState: true
							})
						}
					})
				}
				if (this.data.reply) {
					if (this.data.photoState) {
						publishModel.showLoading('保存图片中')
						this.saveImg(this.data.codeImg)
					} else {
						publishModel.showToast('图片保存失败')
					}
				}
				this.setData({
					reply: false
				})
			})
	},
	// 获取商品详情
	render() {
		const good_id = this.data.good_id;
		publishModel.getGoodDetail({
				good_id
			})
			.then(res => {
				if (res) {
					let data = res.good_info;
					let shopcart_count = res.shopcart_count;
					let newData = {}
					for (let key in data) {
						if (key == 'pic' && data[key]) {
							newData.bannerPics = JSON.parse(data[key])
						} else if (key == 'detail' && data[key]) {
							newData.detailData = JSON.parse(data[key])
						} else if (key == 'classic' && data[key]) {
							newData.classic = JSON.parse(data[key])
						} else {
							newData[key] = data[key]
						}
					}
					if (!newData.stock_num || newData.is_shelf == 2) {
						// 没有库存或者下线
						newData.buyNumber = 0;
						newData.buyNumMax = 0;
						newData.buyNumMin = 0
					} else {
						//有库存并上线
						newData.buyNumber = 1;
						newData.buyNumMax = newData.stock_num;
						newData.buyNumMin = 1
					}

					let classic = newData.classic;
					this.setData({
						goodsDetail: newData,
						classic_type: newData.classic_type,
						classic,
						shopcart_count
					})

				} else {
					wx.switchTab({
						url: '/pages/index/index',
					})
				}

				if (!this.data.loadingEnd) {
					this.setData({
						loadingEnd: true
					})
				}
				wx.hideLoading()

			})
	},
	// 改变购买数
	changeNum(e) {
		let buyNumber = e.detail.buyNumber;
		this.setData({
			'goodsDetail.buyNumber': buyNumber
		})
	},
	// 控制底部弹窗
	controlPopup(e) {
		let {
			showPopup,
			type
		} = e.detail;
		this.setData({
			showPopup,
			showPopupType: type * 1
		})
	},
	// 唤起弹窗
	openDetailPopup() {
		this.setData({
			showPopup: true,
			showPopupType: 3
		})
	},
	// 分享
	getShareBox() {
		let sharePopup = !this.data.sharePopup;
		this.setData({
			sharePopup
		})
	},
	// 分享
	onShareAppMessage() {
		let {
			share_detail_pic,
			good_id,
			share_title
		} = this.data.goodsDetail;
		let rcj = JSON.stringify({
			good_id,
			uid: app.globalData.userInfo.user_id
		})
		rcj = encodeURIComponent(rcj);
		return {
			title: share_title,
			path: `/pages/start/start?rct=1&rcj=${rcj}`,
			imageUrl: share_detail_pic
		}
	},
	// 获取二维码
	getCode() {
		publishModel.showLoading('保存图片中')
		const good_id = this.data.good_id;
		publishModel.drawPoster({
				good_id
			})
			.then(res => {
				if (res) {
					this.setData({
						codeImg: res
					})
					this.saveImg(res)
				}

			})
	},
	// 保存图片
	saveImg(codeImg) {
		let photoState = this.data.photoState;
		if (!photoState) {
			this.setData({
				reply: true
			})
			return
		}
		wx.downloadFile({
			url: codeImg,
			success: (res) => {
				wx.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success: (res) => {
						this.setData({
							showErocode: true,
							sharePopup: false,
						})
						publishModel.showToast('图片保存成功')
					},
					fail: (res) => {
						publishModel.showToast('图片保存失败')
					},
					complete: () => {
						wx.hideLoading()
					}
				})
			}
		})
	},
	// 关闭海报
	closeCode() {
		this.setData({
			showErocode: false
		})
	},
	// 重新计算数量
	addNum() {
		this.setData({
			shopcart_count: this.data.shopcart_count + 1
		})
	}
})
