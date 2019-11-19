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
		weight: '', //权重
		is_shelf: 1, //是否上线
		userStatus: false, //是否授权
		category_index: 0, //类别索引
		category_info: [] //类别集合
	},
	onLoad(options) {
		app.globalData.backCutImg = null;
		app.globalData.detailData = null;
		this.setData({
			category_info: app.globalData.category_info
		})
		this.getUserStatus()
		//假如是编辑
		if (options.good_id) {
			this.setData({
				good_id:options.good_id
			})
			this.render()
		}
	},
	// 初始化接口
	render() {
		publishModel.showLoading('加载商品中')
		// 获取商品详情
		let good_id = this.data.good_id;
		publishModel.getGoodDetail({
			good_id
		})
		.then(res=>{
			if(res){
				let data = res.good_info;
				let newData = {}
				for(let key in data){
					if(key=='pic' && data[key]){
						newData.bannerPics = JSON.parse(data[key])
					}else if(key=='detail' && data[key]){
						newData.detailData = JSON.parse(data[key])
					}else{
						newData[key] = data[key]
					}
				}
				
				this.setData({
					...newData
				})
				wx.hideLoading()
			}
		})
	},
	// 获取用户授权状态
	getUserStatus() {
		publishModel.getUserStatus().
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
					console.log(res)
				})
		}
	},
	onShow() {
		let {
			backCutImg,
			detailData
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
		if (app.globalData.detailData) {
			app.globalData.detailData.forEach((item) => {
				if (item.type == 'text' && typeof(item.textAreaCon) != 'string') {
					item.textAreaCon = item.textAreaCon.join('\n');
				}
			})
		}
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
					url: './cutImg/cutImg'
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
			is_shelf
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
			is_shelf
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
		} else if (!specifications) {
			publishModel.showToast('请输入规格');
			return false
		} else if (!kinds) {
			publishModel.showToast('请输入种类');
			return false
		} else if (!sales_volume) {
			publishModel.showToast('请输入销售数量');
			return false
		} else if (!weight) {
			publishModel.showToast('请输入权重');
			return false
		}
		params.pic = JSON.stringify(bannerPics);
		params.head_pic = bannerPics[0].prizeImg;
		if (detailData && detailData.length) {
			params.detail = JSON.stringify(detailData);
		}
		
		if(this.data.good_id){
			params.good_id = this.data.good_id
			publishModel.showLoading('修改商品中')
			publishModel.editPublish(params).then(
				res => {
					wx.hideLoading()
					let good_id = res.good_id;
					publishModel.showToast('修改成功','success',2000,()=>{
						wx.redirectTo({
							url:`/pages/goods-detail/goods-detail?good_id=${good_id}`
						})
					})
				}
			)
		}else{
			publishModel.showLoading('发布商品中')
			publishModel.publish(params).then(
				res => {
					wx.hideLoading()
					let good_id = res.good_id;
					publishModel.showToast('发布成功','success',2000,()=>{
						wx.redirectTo({
							url:`/pages/goods-detail/goods-detail?good_id=${good_id}`
						})
					})
				}
			)
		}
		
	}


})
