import OrderModel from '../../models/Order.js'
const orderModel = new OrderModel()
const app = getApp()
Page({
	data:{
		page:1,
		page_size:10,
		type:0,
		selectArr:['待支付','已支付','待收货','已完成'],
		orderList:[],
		loadingEnd:false
	},
	onLoad(options) {
		if(options.type){
			this.setData({
				type:options.type*1
			})
		}
		orderModel.showLoading('加载订单列表中');
		this.render()
	},
	render(options) {
		// 订单列表查询
		let {type,page,page_size,orderList} = this.data;
		type = type+1;
		let params = {type,page,page_size};
		orderModel.orderLists(params)
			.then(
				res => {
					if (res) {
						let orderList = res.list;
						orderList.forEach(item => {
							item.good_detail.forEach(sItem=>{
								sItem.subgood_id=sItem.good_id;
							})
							
						});
						if (page > 1) {
							orderList = this.data.orderList.concat(orderList)
						}
						this.setData({
							orderList,
							total_pages:res.total_pages
						})
						
						if(!this.data.loadingEnd){
							this.setData({
								loadingEnd:true
							})
						}
					}
					wx.hideLoading()
				}
			)
	},
	// 选择订单类型
	selectOrder(e){
		let type = e.currentTarget.dataset.index;
		this.setData({
			type,
			loadingEnd:false,
			orderList:[],
			page:1
		})
		orderModel.showLoading('加载订单列表中');
		this.render()
	},
	// 下拉加载更多
	onReachBottom() {
		let {
			page,
			total_pages
		} = this.data;
		if (total_pages > page) {
			this.setData({
				page: page + 1
			})
			orderModel.showLoading('加载更多订单中');
			this.render()
		}
	},
	// 去购买
	goBuy(e){
		let {orderList,type} = this.data;
		let index = e.currentTarget.dataset.index*1;
		app.globalData.buyShopObject = orderList[index];
		console.log(app.globalData.buyShopObject)
		if(type){
			wx.navigateTo({
				url: '/pages/cart/pay-order/pay-order?endStatus=true'
			})
		}else{
			wx.navigateTo({
				url: '/pages/cart/pay-order/pay-order'
			})
		}
		
	}

})
