import PublishModel from '../../models/publish.js'
const publishModel = new PublishModel();
import {
	StartModel
} from '../../models/start.js'
const startModel = new StartModel();
var app = getApp();
Page({
	data: {
    defaultPic:'https://tp.datikeji.com/shop_mall/15740778471281/RQbfyJ5ypETYa5TDbfZwdBJ4HOPqSCHFGuY1qlva.jpeg',
		bannerPics: [{
			'prizeImg': "https://tp.datikeji.com/1/15453844976901/qXyL85Lp0uvVT2fX3Ay0vuhNMNG4DvZSe9vSdwHN.png",
      'active':false
		}], //商品banner
		detailData: '',
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
		category_index: 0,
		category_info: []
	},

	onLoad(options) {
		app.globalData.backCutImg = null;
		app.globalData.detailData = null;
		this.setData({
			category_info: app.globalData.category_info
		})
		console.log(this.data.category_info)
		this.getUserStatus()
	},
	getUserStatus() {
		startModel.getUserStatus().
		then(res => this.setData({
			userStatus: res
		}))
	},
	bindGetUserInfo(e) {
		if (e.detail.errMsg == "getUserInfo:ok") {
			startModel.getUserInfo()
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
					return startModel.getUserUpdate(params)
				})
				.then(res => {
					if (res) {
						this.setData({
							userStatus: true
						})
					}
				})
		}
	},
	onShow() {
		let {
			backCutImg,
			detailData
		} = app.globalData
		if (backCutImg) {
			let {
				bannerPics,
				currentIndex
			} = this.data;
			bannerPics[currentIndex].prizeImg = backCutImg;
      bannerPics[currentIndex].active = true;
      console.log(bannerPics)
			this.setData({
				bannerPics
			})
			app.globalData.backCutImg = null;
		}
		if (detailData) {
			console.log(detailData)
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
	onHide() {
		app.globalData.backCutImg = null;
    if (app.globalData.detailData) {
      app.globalData.detailData.forEach((item) => {
        if (item.type == 'text') {
          item.textAreaCon = item.textAreaCon.join('\n');
        }
      })
    }
	},
	addPic() {
		let bannerPics = this.data.bannerPics;
		bannerPics.push({
			'prizeImg': "https://tp.datikeji.com/1/15453844976901/qXyL85Lp0uvVT2fX3Ay0vuhNMNG4DvZSe9vSdwHN.png",
      'active': false
		})
		this.setData({
			bannerPics
		})
	},
	// 删除图片
	deletePic(e) {
		let index = e.target.dataset.index;
		let bannerPics = this.data.bannerPics;
		bannerPics.splice(index, 1);
		this.setData({
			bannerPics
		})
	},

	// 输入框事件
	inputEvent(e) {
		console.log(e)
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
	uploadImgTap(e) {
		let index = e.currentTarget.dataset.index;
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: (res) => {
				const src = res.tempFilePaths[0];
				console.log(src)
				this.setData({
					currentIndex: index,
				})
				app.globalData.cutImg = src;

				wx.navigateTo({
					url: 'cutImg/cutImg'
				})

			}
		})

	},
	// 页面跳转
	jumptap() {
		wx.navigateTo({
			url: './shop-publish/shop-publish',
		})
	},
	bindIdChange(e){
		console.log(e)
		this.setData({
			category_index:e.detail.value
		})
	},
	// 验证
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
    bannerPics = bannerPics.filter(item=>{
      return item.active
    })
    if (!bannerPics.length){
      publishModel.showToast('请选择图片');
      return false
    }else if (!good_name) {
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
    if (detailData&&detailData.length){
      params.detail = JSON.stringify(detailData);
     
    }
	
		publishModel.publish(params).then(
			res => {
				console.log(res)
			}
		)
	}


})
