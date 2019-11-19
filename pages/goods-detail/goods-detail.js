import {
	GoodModel
} from '../../models/good.js'
const goodModel = new GoodModel()
Page({
	data: {
		id: 0,
		goodsDetail: {},
		banners: [],
		showPopup: false, //是否显示底部弹窗
		sharePopup:false,//是否显示分享弹窗
		showType: 1,
		allShopNum:0//全部购物数量
	},
	onLoad: function(options) {
		this.setData({
			id: options.id
		})
		this.getGoodsDetail()
	},
	onShow(){
		this.updateAllShopNum()
	},
	// 更新购物车
	updateAllShopNum(){
		let res =  goodModel.getStorage('shopInfo');
		if(res){
			this.setData({
				allShopNum:res.shopNum
			})
		}
	},
	// 获取商品详情
	getGoodsDetail() {
		const id = this.data.id;
		goodModel.getGoodDetail({
				id
			})
			.then(res => {
				let data = res.data;
				let banners = data.pics.map(item => {
					item.picUrl = item.pic;
					return item
				});
				let {
					name,
					characteristic,
					minPrice,
					originalPrice,
					numberOrders,
					stores,
					pic
				} = data.basicInfo;
				let buyNumber = stores ? 1 : 0;
				let buyNumMin = stores ? 1 : 0;
				let buyNumMax = stores ? stores : 0
				let goodsDetail = {
					name,
					characteristic,
					minPrice,
					originalPrice,
					numberOrders,
					pic,
					buyNumber,
					buyNumMin,
					buyNumMax,
					id
				}
				this.setData({
					goodsDetail,
					banners
				});
			})
	},
	// 控制底部弹窗
	controlPopup(e) {
		let showPopup = e.detail.showPopup;
		let showType = 1;
		if (showPopup) {
			showType = e.detail.type * 1;
		}
		this.setData({
			showPopup,
			showType
		})
	},
	// 改变购买数
	changeNum(e) {
		let buyNumber = e.detail.buyNumber;
		if(e.detail.type&&e.detail.type==1){
			this.updateAllShopNum()
		}
		this.setData({
			'goodsDetail.buyNumber': buyNumber
		})
	},
	getShareBox(){
		let sharePopup = !this.data.sharePopup;
		console.log(sharePopup)
		this.setData({
			sharePopup
		})
	}
})
