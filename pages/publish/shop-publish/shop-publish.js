import PublishModel from '../../../models/Publish.js'
const publishModel = new PublishModel();
import {
	config
} from '../../../config.js'
var app = getApp();
Page({

	data: {
		insertState: true,
		insertArr: [{
			type: 'text',
			textAreaCon: ''
		}],
		first: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		let {
			detailData
		} = app.globalData;
		if (detailData) {
			this.setData({
				insertArr: detailData,
			})
			if (detailData.length > 0) {
				this.setData({
					insertState: false
				})
			}
		}
	},
	// 改变插入状态
	changeInsert() {
		let insertState = this.data.insertState
		if (!insertState) {
			this.pageScrollToBottom()
		}

		this.setData({
			insertState: !insertState
		})
	},
	// 插入文字
	insertTextTap() {
		let insertArr = this.data.insertArr
		insertArr.push({
			type: 'text',
			textAreaCon: ''
		})
		this.setData({
			insertArr,
			insertState: false,
			first: false
		})
		//   this.pageScrollToBottom()
	},
	// 聚焦
	focus() {
		this.setData({
			insertState: false
		})
	},
	bindTextArea(e) {
		let index = e.currentTarget.dataset.index;
		let value = e.detail.value.trim();
		let insertArr = this.data.insertArr;
		insertArr[index].textAreaCon = value

		this.setData({
			insertArr,
			first: false
		})
	},
	// 插入图片
	uploadTap() {
		let num = 0;
		let insertArr = this.data.insertArr;
		insertArr.forEach(item => {
			if (item.type == 'img') {
				num++
			}
		})
		if (num < 9) {
			this.setData({
				first: false
			})
			wx.chooseImage({
				count: 9 - num, // 默认9
				sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: (res) => {
					let tempFiles = res.tempFiles
					for (let i = 0; i < tempFiles.length; i++) {
						let src = tempFiles[i].path;
						publishModel.showLoading('插入图片中。。。')
						this.uploadNet(src)
					}
				}
			})
		} else {
			publishModel.showToast('图片最多插入九张')
		}
	},
	//上传图片到网络
	uploadNet(src) {
		let insertArr = this.data.insertArr;
		let len = insertArr.length;
		insertArr.push({
			type: 'img',
			percent: 0
		})
		this.setData({
			insertArr,
			insertState: false
		})
		this.pageScrollToBottom()
		let uploadTask = wx.uploadFile({
			url: config.api_base_url + 'upload',
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
					let img = data.data
					insertArr[len].img = img;
					this.setData({
						insertArr
					})
					wx.hideLoading()
				} else {
					publishModel.showToast(data.msg, 'none')
				}
			},
			fail: (err) => {
				publishModel.showToast(err)
			}
		})
		uploadTask.onProgressUpdate((res) => {
			insertArr[len].percent = res.progress;
			this.setData({
				insertArr
			})
		})

	},
	// 删除
	deleteTap(e) {
		let index = e.currentTarget.dataset.index;
		let insertArr = this.data.insertArr
		insertArr.splice(index, 1);
		this.setData({
			insertArr,
			first: false
		})
	},
	//向上
	upTap(e) {
		let insertArr = this.data.insertArr
		let index = e.currentTarget.dataset.index;
		let temp = insertArr[index];
		insertArr[index] = insertArr[index - 1];
		insertArr[index - 1] = temp;
		this.setData({
			insertArr,
			first: false
		})
	},
	//向下
	bottomTap(e) {
		let insertArr = this.data.insertArr
		let index = e.currentTarget.dataset.index;
		let temp = insertArr[index];
		insertArr[index] = insertArr[index + 1];
		insertArr[index + 1] = temp;
		this.setData({
			insertArr,
			first: false
		})
	},
	pageScrollToBottom: function() {
		wx.createSelectorQuery().select('#j_page').boundingClientRect(function(rect) {
			// 使页面滚动到底部
			wx.pageScrollTo({
				scrollTop: rect.height
			})
		}).exec()
	},
	// 完成
	completeTap() {
		let insertArr = this.data.insertArr;
		if (insertArr && insertArr.length) {
			let newArr = insertArr.map(item => {
				if (item.type === 'img' && item.percent == 100) {
					return item
				} else if (item.type === 'text') {
					item.textAreaCon = item.textAreaCon.split('\n').join('&hc')
					return item
				}
			})
			app.globalData.detailData = newArr;
			publishModel.navBack();
		}
	}
})
