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
		shopcart_count: 0,
		typeSelectA: -1,
		typeSelectB: -1,
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
			this.setData({
				typeSelectA:-1,
				typeSelectB:-1
			})
			publishModel.showLoading('加载商品详情中')
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
					let classic = newData.classic; //商品数据
					classic.forEach(item => {
						let stock_num = item.classic_stock_num;
						if (!stock_num || stock_num == '0') {
							item.buyNumber = 0;
							item.buyNumMax = 0;
							item.buyNumMin = 0
						} else {
							item.buyNumber = 1;
							item.buyNumMax = stock_num;
							item.buyNumMin = 1
						}
					})
					let classic_type = newData.classic_type; //类型
					// 分类数据
					this.deleteReplace('classics', 'classic_name', classic)
					if (classic_type == 2) {
						// 颜色+分类
						this.deleteReplace('colors', 'colour', classic)
					} else if (classic_type == 3) {
						// 尺码+分类
						this.deleteReplace('sizes', 'size', classic)
					}
					this.setData({
						goodsDetail: newData,
						classic_type,
						classic,
						shopcart_count
					})
					// 选择的数据
					this.classicSelectData()
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
	// 去重
	deleteReplace(name, id, classic) {
		let arr = classic.filter((item, index) => {
			let arrids = []
			classic.forEach((x, i) => {
				arrids.push(x[id])
			})
			return arrids.indexOf(item[id]) === index
		})
		arr.forEach(item => {
			item.canNotSelect = true;
			classic.forEach(item2 => {
				if (item[id] == item2[id]) {
					let stock_num = item2.classic_stock_num;
					if (stock_num != '0') {
						item.canNotSelect = false
					}
				}
			})
		})
		if (id == 'size') {
			arr.sort(function(a, b) {
				return a.size - b.size;
			})
		}

		this.setData({
			[name]: arr
		})
	},
	// 选择的数据
	classicSelectData() {
		let {
			classic,
			classic_type,
			classics,
			typeSelectA,
			typeSelectB
		} = this.data;
		// 默认选择数据
		let selectClassData = classic[0];
		if (classic_type == 1) {
			if (typeSelectA < 0) {
				// 都没选
				selectClassData.des = '请选择 分类';
			}
			if (typeSelectA > -1) {
				// 已经选择
				let selectName = classics[typeSelectA].classic_name;
				let selectCate = classics[typeSelectA];
				selectClassData = selectCate;
				selectClassData.des = `已选:"${selectName}"`;
			}
		} else if (classic_type == 2) {
			// 颜色+分类
			let {
				colors
			} = this.data;
			if (typeSelectA < 0 && typeSelectB < 0) {
				// 都没选
				selectClassData.des = '请选择 分类 颜色';
				this.resetSelectFun('colors', colors, 'colour')
				this.resetSelectFun('classics', classics, 'classic_name')
			}
			if (typeSelectA > -1 && typeSelectB < 0) {
				// 只选了分类
				let selectCate = classics[typeSelectA];
				selectClassData = selectCate;
				this.canNotSelectFun('colors', colors, selectCate, 'colour', 'classic_name')
				this.resetSelectFun('classics', classics, 'classic_name')
				selectClassData.des = '请选择 颜色';
			}
			if (typeSelectA < 0 && typeSelectB > -1) {
				// 只选择了颜色
				let selectCate = colors[typeSelectB];
				selectClassData = selectCate;
				this.canNotSelectFun('classics', classics, selectCate, 'classic_name', 'colour')
				this.resetSelectFun('colors', colors, 'colour')
				selectClassData.des = '请选择 分类';
			}
			if (typeSelectA > -1 && typeSelectB > -1) {
				let selectName = classics[typeSelectA].classic_name;
				let selectColor = colors[typeSelectB].colour;
				this.canNotSelectFun('colors', colors, classics[typeSelectA], 'colour', 'classic_name')
				this.canNotSelectFun('classics', classics, colors[typeSelectB], 'classic_name', 'colour')
				classic.forEach(item => {
					if (item.classic_name == selectName && item.colour == selectColor) {
						selectClassData = item
					}
				})
				selectClassData.des = `已选:"${selectName}" "${selectColor}"`;
			}
		} else if (classic_type == 3) {
			// 尺码+分类
			let {
				sizes
			} = this.data;
			if (typeSelectA < 0 && typeSelectB < 0) {
				// 都没选
				selectClassData.des = '请选择 分类 尺码';
				this.resetSelectFun('sizes', sizes, 'size')
				this.resetSelectFun('classics', classics, 'classic_name')
			}
			if (typeSelectA > -1 && typeSelectB < 0) {
				// 只选了分类
				let selectCate = classics[typeSelectA];
				selectClassData = selectCate;
				this.canNotSelectFun('sizes', sizes, selectCate, 'size', 'classic_name');
				this.resetSelectFun('classics', classics, 'classic_name')
				selectClassData.des = '请选择 尺码';
			}
			if (typeSelectA < 0 && typeSelectB > -1) {
				// 只选择了尺码
				let selectCate = sizes[typeSelectB];
				selectClassData = selectCate;
				this.canNotSelectFun('classics', classics, selectCate, 'classic_name', 'size')
				this.resetSelectFun('sizes', sizes, 'size')
				selectClassData.des = '请选择 分类';
			}
			if (typeSelectA > -1 && typeSelectB > -1) {
				let selectName = classics[typeSelectA].classic_name;
				let selectSize = sizes[typeSelectB].size;
				this.canNotSelectFun('sizes', sizes, classics[typeSelectA], 'size', 'classic_name')
				this.canNotSelectFun('classics', classics, sizes[typeSelectB], 'classic_name', 'size')
				classic.forEach(item => {
					if (item.classic_name == selectName && item.size == selectSize) {
						selectClassData = item
					}
				})
				selectClassData.des = `已选:"${selectName}" "${selectSize}"`;
			}
		}
		this.setData({
			selectClassData
		})
	},
	//恢复原样
	resetSelectFun(name, setCon, type) {
		let classic = this.data.classic;
		setCon.forEach(item => {
			item.canNotSelect = true;
			classic.forEach(item2 => {
				if (item[type] == item2[type]) {
					let stock_num = item2.classic_stock_num;
					if (stock_num != '0') {
						item.canNotSelect = false
					}
				}
			})
		})
		this.setData({
			[name]: setCon
		})
	},
	// 设置不可点击
	canNotSelectFun(name, setCon, selectCate, type1, type2) {
		let classic = this.data.classic;
		setCon.forEach(item => {
			item.canNotSelect = true
			classic.forEach(item2 => {
				if (item[type1] == item2[type1]) {
					if (item2[type2] == selectCate[type2]) {
						let stock_num = item2.classic_stock_num;
						if (stock_num != '0') {
							item.canNotSelect = false
						}
					}
				}
			})


		})
		this.setData({
			[name]: setCon
		})
	},
	//设置选择
	selectTypeFun(e) {
		let {
			type,
			selectTypeSelectA,
			selectTypeSelectB
		} = e.detail;
		let {
			typeSelectA,
			typeSelectB
		} = this.data;
		if (type == 'A') {
			if (typeSelectA > -1 && typeSelectA == selectTypeSelectA) {
				selectTypeSelectA = -1
			}
			this.setData({
				typeSelectA: selectTypeSelectA
			})
		}
		if (type == 'B') {
			if (typeSelectB > -1 && typeSelectB == selectTypeSelectB) {
				selectTypeSelectB = -1
			}
			this.setData({
				typeSelectB: selectTypeSelectB
			})
		}
		this.classicSelectData()
	},

	// 改变购买数
	changeNum(e) {
		let buyNumber = e.detail.buyNumber;
		let selectClassData = this.data.selectClassData;
		selectClassData.buyNumber = buyNumber
		this.setData({
			selectClassData
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
			typeSelectA:-1,
			typeSelectB:-1,
			showPopup:false
		})
		this.render()
	}
})
