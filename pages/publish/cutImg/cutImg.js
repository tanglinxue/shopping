import weCropper from '../../../dist/weCropper.js'
import PublishModel from '../../../models/Publish.js'
const publishModel = new PublishModel();
const app = getApp();
const device = wx.getSystemInfoSync()
const width = device.windowWidth;
const height = device.screenHeight - 144 - device.statusBarHeight
Page({
	data: {
		cropperOpt: {
			id: 'cropper',
			width,
			height,
			scale: 2.5,
			zoom: 8,
			cut: {
				x: (width - 360) / 2,
				y: (height - 360) / 2,
				width: 360,
				height: 360
			}
		}
	},
	touchStart(e) {
		this.wecropper.touchStart(e)
	},
	touchMove(e) {
		this.wecropper.touchMove(e)
	},
	touchEnd(e) {
		this.wecropper.touchEnd(e)
	},
	getCropperImage() {
		publishModel.showLoading('裁剪图片中')
		this.wecropper.getCropperImage((src) => src && this.cutImg(src))
	},

	cutImg(src) {
		let that=this;
		publishModel.uploadFile(src).then(
			res => {
				wx.hideLoading();
				let type=that.data.type;
				if(type==1){
					app.globalData.backCutImg = res;
				}else if(type==2){
					app.globalData.cateCutImg = res;
				}
				
				publishModel.navBack()
			}
		)
	},


	onLoad(options) {
		var that = this;
		this.setData({
			type:options.type
		})
		const {
			cropperOpt
		} = this.data;

		new weCropper(cropperOpt)
			.on('ready', (ctx) => {

			})
			.on('beforeImageLoad', (ctx) => {
				wx.showToast({
					title: '上传中',
					icon: 'loading',
					duration: 20000
				})
			})
			.on('imageLoad', (ctx) => {
				wx.hideToast()
			})
			.on('beforeDraw', (ctx, instance) => {

			})
			.updateCanvas()
			
		this.wecropper.pushOrign(app.globalData.cutImg)

	}
})
