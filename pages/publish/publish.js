import PublishModel from '../../models/Publish.js'
const publishModel = new PublishModel();
const app = getApp();
Page({
	data: {
		defaultPic: 'https://tp.datikeji.com/shop_mall/15740778471281/RQbfyJ5ypETYa5TDbfZwdBJ4HOPqSCHFGuY1qlva.jpeg', //默认图片
		bannerPics: [{
			'prizeImg': "",
			'active': false
		}], //商品banner
		detailData: '', //商品详情
		good_name: '', //商品名称
		sell_price: '', //销售价格
		original_price: '', //原本价格
		stock_num: '', //库存数量
		specifications: '', //规格
		kinds: '', //种类
		sales_volume: '', //销售数量
		decimal: 0, //运费
		weight: '', //权重
		is_shelf: 1, //是否上线
		is_banner: 1, //是否首页展示
		userStatus: false, //是否授权
		category_index: 0, //类别索引
		category_info: [], //类别集合
		classic1: [{
			'classic_name': '',
			'classic_sell_prize': '',
			'classic_original_prize': '0',
			'classic_img': 'https://tp.datikeji.com/shop_mall/15740778471281/RQbfyJ5ypETYa5TDbfZwdBJ4HOPqSCHFGuY1qlva.jpeg',
			'classic_stock_num': ''
		}], //类别1
		classic2: [{
			'classic_name': '',
			'classic_sell_prize': '',
			'classic_original_prize': '0',
			'classic_img': 'https://tp.datikeji.com/shop_mall/15740778471281/RQbfyJ5ypETYa5TDbfZwdBJ4HOPqSCHFGuY1qlva.jpeg',
			'classic_stock_num': '',
			'colour':''
		}], //类别2
		classic3: [{
			'classic_name': '',
			'classic_sell_prize': '',
			'classic_original_prize': '0',
			'classic_img': 'https://tp.datikeji.com/shop_mall/15740778471281/RQbfyJ5ypETYa5TDbfZwdBJ4HOPqSCHFGuY1qlva.jpeg',
			'classic_stock_num': '',
			'size':''
		}], //类别3
		classic:[],
		classic_type: 1,
		classicItemIndex: 0,
		video_url:''//视频地址
	},
	onLoad(options) {
		app.globalData.backCutImg = null;
		app.globalData.cateCutImg = null;
		app.globalData.detailData = null;
		this.setData({
			category_info: app.globalData.category_info,
			classic:this.data.classic1
		})
		this.getUserStatus()
		//假如是编辑
		if (options.good_id) {
			this.setData({
				good_id: options.good_id
			})
			this.render()
		}
	},
	// 初始化接口
	render() {
		publishModel.showLoading('加载商品中')
		// 获取商品详情
		let {
			good_id,
			category_info
		} = this.data;
		publishModel.getGoodDetail({
				good_id
			})
			.then(res => {
				if (res) {
					let data = res.good_info;
					let newData = {}
					for (let key in data) {
						if (key == 'pic' && data[key]) {
							newData.bannerPics = JSON.parse(data[key])
						} else if (key == 'detail' && data[key]) {
							newData.detailData = JSON.parse(data[key])
						} else if (key == 'classic' && data[key]) {
							newData.classic = JSON.parse(data[key])
						} else if (key == 'category_id') {
							category_info.forEach((item, index) => {
								if (data[key] == item.category_id) {
									newData['category_index'] = index
								}
							})
						} else {
							newData[key] = data[key]
						}
					}
					if (newData.detailData) {
						app.globalData.detailData = newData.detailData
					}
					this.setData({
						...newData
					})
					this.renderClassic()
					wx.hideLoading()
				}
			})
	},
	// 获取用户授权状态
	getUserStatus() {
		publishModel.getUserStatus('userInfo').
		then(res => this.setData({
			userStatus: res
		}))
	},
	// 用户进行授权
	bindGetUserInfo(e) {
		if (e.detail.errMsg == "getUserInfo:ok") {
			this.setData({
				userStatus: true
			})
			publishModel.getUserInfo()
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
					return publishModel.authorUser(params)
				})
				.then(res => {
					this.publish()
				})
		}
	},
	onShow() {
		let {
			backCutImg,
			detailData,
			cateCutImg
		} = app.globalData;
		// 设置banner图片
		if (backCutImg) {
			let {
				bannerPics,
				currentIndex
			} = this.data;
			bannerPics[currentIndex].prizeImg = backCutImg;
			bannerPics[currentIndex].active = true;
			this.setData({
				bannerPics
			})
			app.globalData.backCutImg = null;
		}
		// 设置类别图片
		if (cateCutImg) {
			let {
				classic,
				classicItemIndex
			} = this.data;
			classic[classicItemIndex].classic_img = cateCutImg;
			this.setData({
				classic
			})
			this.renderClassic()
			app.globalData.cateCutImg = null;
		}
		//设置详情
		if (detailData) {
			detailData = detailData.map(item => {
				if (item.type == 'text' && typeof(item.textAreaCon) == 'string') {
					item.textAreaCon = item.textAreaCon.split('&hc');
				}
				return item
			})
			this.setData({
				detailData
			})
		}
	},
	// 页面隐藏
	onHide() {
		app.globalData.backCutImg = null;
		app.globalData.cateCutImg = null;
		if (app.globalData.detailData) {
			app.globalData.detailData.forEach((item) => {
				if (item.type == 'text' && typeof(item.textAreaCon) != 'string') {
					item.textAreaCon = item.textAreaCon.join('\n');
				}
			})
		}
		let detailData = this.data.detailData;
		if(detailData.length){
			detailData.forEach((item,index)=>{
				if(item.type=="video"){
					let id = 'video_'+index;
					 wx.createVideoContext(id).stop();
				}
			})
		}
		wx.createVideoContext('video_main').stop();
	},
	// 增加banner图片
	addPic() {
		let bannerPics = this.data.bannerPics;
		bannerPics.push({
			'prizeImg': "",
			'active': false
		})
		this.setData({
			bannerPics
		})
	},
	// 删除banner图片
	deletePic(e) {
		let index = e.currentTarget.dataset.index;
		let bannerPics = this.data.bannerPics;
		bannerPics.splice(index, 1);
		this.setData({
			bannerPics
		})
	},
	// 上传banner图片
	uploadImgTap(e) {
		let index = e.currentTarget.dataset.index;
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: (res) => {
				const src = res.tempFilePaths[0];
				this.setData({
					currentIndex: index,
				})
				app.globalData.cutImg = src;
				wx.navigateTo({
					url: './cutImg/cutImg?type=1'
				})

			}
		})

	},
	// 输入框事件
	inputEvent(e) {
		let name = e.target.dataset.name;
		let value = e.detail.value.trim()
		this.setData({
			[name]: value
		})
	},
	// 是否上线
	onlineChange(e) {
		let bol = e.detail.value;
		this.setData({
			is_shelf: bol ? 1 : 2
		})
	},
	// 是否设置
	onHomeChange(e) {
		let bol = e.detail.value;
		this.setData({
			is_banner: bol ? 1 : 2
		})
	},
	// 选择类别
	bindIdChange(e) {
		this.setData({
			category_index: e.detail.value
		})
	},
	// 去往详情页
	jumptap() {
		wx.navigateTo({
			url: './shop-publish/shop-publish',
		})
	},
	// 发布
	publish() {
		let {
			good_name,
			sell_price,
			original_price,
			stock_num,
			specifications,
			kinds,
			sales_volume,
			weight,
			bannerPics,
			detailData,
			category_index,
			category_info,
			is_shelf,
			is_banner,
			decimal,
			classic,
			classic_type,
			video_url
		} = this.data;
		let category_id = category_info[category_index].category_id;
		let params = {
			good_name,
			sell_price,
			original_price,
			stock_num,
			specifications,
			kinds,
			sales_volume,
			weight,
			category_id,
			is_shelf,
			is_banner,
			decimal,
			classic_type,
			video_url
		}
		bannerPics = bannerPics.filter(item => {
			return item.active
		})
		if (!bannerPics.length) {
			publishModel.showToast('请选择图片');
			return false
		} else if (!good_name) {
			publishModel.showToast('请输入商品名称');
			return false
		} else if (!sell_price) {
			publishModel.showToast('请输入销售价格');
			return false
		} else if (!original_price) {
			publishModel.showToast('请输入原本价格');
			return false
		} else if (!stock_num) {
			publishModel.showToast('请输入库存数量');
			return false
		} else if (!weight) {
			publishModel.showToast('请输入权重');
			return false
		}
		let catePass = true
		// 分类处理
		classic.forEach((item, index) => {
			//名称
			if (!item.classic_name) {
				publishModel.showToast(`请输入分类${index+1}商品名称`);
				catePass = false
			}
			//价格
			if (item.classic_sell_prize == '') {
				publishModel.showToast(`请输入分类${index+1}商品价格`);
				catePass = false
			}
			//原价
			if (item.classic_original_prize == '') {
				publishModel.showToast(`请输入分类${index+1}商品原价`);
				catePass = false
			}
			//库存
			if (item.classic_stock_num == '') {
				publishModel.showToast(`请输入分类${index+1}商品库存数量`);
				catePass = false
			}
			// 第二类
			//颜色
			if (classic_type == 2) {
				if (!item.colour) {
					publishModel.showToast(`请输入分类${index+1}商品颜色`);
					catePass = false
				}
			}
			// 第三类
			//尺寸
			if (classic_type == 3) {
				if (!item.size) {
					publishModel.showToast(`请输入分类${index+1}商品尺寸`);
					catePass = false
				}
			}
		})
		if (!catePass) {
			return
		}
		params.classic = JSON.stringify(classic)
		params.pic = JSON.stringify(bannerPics);
		params.head_pic = bannerPics[0].prizeImg;
		if (detailData && detailData.length) {
			params.detail = JSON.stringify(detailData);
		}

		if (this.data.good_id) {
			params.good_id = this.data.good_id
			publishModel.showLoading('修改商品中')
			publishModel.editPublish(params).then(
				res => {
					if (res) {
						wx.hideLoading()
						let good_id = res.good_id;
						publishModel.showToast('修改成功', 'success', 2000, () => {
							wx.redirectTo({
								url: `/pages/goods-detail/goods-detail?good_id=${good_id}`
							})
						})
					}
				}
			)
		} else {
			publishModel.showLoading('发布商品中')
			publishModel.publish(params).then(
				res => {
					if (res) {
						wx.hideLoading()
						let good_id = res.good_id;
						publishModel.showToast('发布成功', 'success', 2000, () => {
							wx.redirectTo({
								url: `/pages/goods-detail/goods-detail?good_id=${good_id}`
							})
						})
					}

				}
			)
		}

	},
	// 选择分类
	selectCate(e) {
		let index = e.currentTarget.dataset.index;
		let {classic_type,classic1,classic2,classic3,classic} = this.data;
		if (index != classic_type) {
			if (index == 1) {
				classic = classic1
			}
			if (index == 2) {
				classic = classic2
			}
			if (index == 3) {
				classic = classic3
			}
			this.setData({
				classic_type:index,
				classic
			})
		}
	},
	// 添加分类
	addCate() {
		let {classic_type,classic} = this.data;
		let classItem = {
			'classic_name': '',
			'classic_sell_prize': '',
			'classic_original_prize': '0',
			'classic_img': 'https://tp.datikeji.com/shop_mall/15740778471281/RQbfyJ5ypETYa5TDbfZwdBJ4HOPqSCHFGuY1qlva.jpeg',
			'classic_stock_num': ''
		}
		if (classic_type == 2) {
			classItem.colour = ''
		}
		if (classic_type == 3) {
			classItem.size = ''
		}
		classic.push(classItem);
		this.setData({
			classic
		})
		this.renderClassic()
	},
	// 删除分类
	deleteCate(e) {
		let index = e.currentTarget.dataset.index;
		let classic = this.data.classic;
		classic.splice(index, 1);
		this.setData({
			classic,
		})
		this.renderClassic()
	},
	// 输入
	navInputEvent(e) {
		let name = e.target.dataset.name;
		let value = e.detail.value.trim();
		let index = e.currentTarget.dataset.index;
		let classic = this.data.classic;
		classic[index][name] = value
		this.setData({
			classic
		})
		this.renderClassic()
	},
	// 类别图片上传
	uploadImgCateTap(e) {
		let index = e.currentTarget.dataset.index;
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: (res) => {
				const src = res.tempFilePaths[0];
				this.setData({
					classicItemIndex: index,
				})
				app.globalData.cutImg = src;
				wx.navigateTo({
					url: './cutImg/cutImg?type=2'
				})
			}
		})
	},
	// 渲染三个数组
	renderClassic(){
		let {classic_type,classic} = this.data;
		let name = `classic${classic_type}`;
		console.log(classic,name)
		this.setData({
			[name]:classic
		})	
	},
	// 上传视频
	uploadVideoTap(){
		wx.chooseVideo({
			sourceType: ['album', 'camera'],
			compressed: true,
			maxDuration: 60,
			camera: 'back',
			success: res => {
				console.log(res);
				if (res.duration > 30) {
					publishModel.showToast('请上传小于30秒的视频')
					return
				}
				publishModel.showLoading('上传视频中')
				let src = res.tempFilePath;
				publishModel.uploadFile(src).then(
					res => {
						wx.hideLoading()
						this.setData({
							video_url:res
						})
					}
				)
		
			},
			fail: res => {
				console.log(res);
			}
		})
	},
	// 删除视频
	deleteVideo(){
		this.setData({
			video_url:''
		})
	}
})
