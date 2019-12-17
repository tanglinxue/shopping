import CartModel from '../../models/Cart.js'
const cartModel = new CartModel()
Component({
	properties: {
		shopItem: {
			type: Object,
			value: {}
		}
	},
	data:{
		startX:0,
		delBtnWidth: 0,
		selectImg:'https://cdn.it120.cc/apifactory/2018/03/07/d14e39b0a699114fe29c1a8614f6dbec.png',
		noSelectImg:'https://cdn.it120.cc/apifactory/2018/03/07/8ecdab31cfc3ccda44edd7bebfbdd45f.png'
	},
	attached(){
		let delBtnWidth = cartModel.getEleWidth(120);
		this.setData({
			delBtnWidth
		})
	},
	methods: {
		
		// 改变是否选择
		changeSelect() {
			let {
				good_id,
				active
			} = this.properties.shopItem
			this.setData({
				'shopItem.active':!active
			})

			this.triggerEvent('updateShopInfo', {type:'activeChange',good_id})
		},
		// 减法
		numJianTap() {
			let {
				buyNumMin,
				buyNumber,
				good_id
			} = this.properties.shopItem;
			if (buyNumber > buyNumMin) {
				buyNumber--;
				this.setData({
					'shopItem.buyNumber':buyNumber
				})
				this.triggerEvent('updateShopInfo', {type:'numberChange',buyNumber,good_id})
			}
		},
		// 加法
		numJiaTap() {
			let {
				buyNumber,
				buyNumMax,
				good_id
			} = this.properties.shopItem;
			if (buyNumber < buyNumMax) {
				buyNumber++;
				this.setData({
					'shopItem.buyNumber':buyNumber
				})
				this.triggerEvent('updateShopInfo', {type:'numberChange',buyNumber,good_id})
			}
		},
		//删除该商品
		deleteItem(){
			let {
				good_id
			} = this.properties.shopItem
			cartModel.showModal('确定要移除该商品吗?','温馨提示',true,()=>{
				cartModel.showLoading('移除商品中...');
				let good_ids = JSON.stringify([good_id])
				cartModel.removeShopCart({good_id:good_ids})
					.then(res=>{
						wx.hideLoading()
						if(res){
							this.triggerEvent('updateShopInfo', {type:'delete',good_id});
							cartModel.showToast('移除成功')
						}						
					})
			})
		},
		// 移动相关开始
		touchS: function(e) {
			if (e.touches.length == 1) {
				this.setData({
					startX: e.touches[0].clientX
				});
			}
		},
		touchM: function(e) {
			if (e.touches.length == 1) {
				let moveX = e.touches[0].clientX;
				let disX = this.data.startX - moveX;
				let delBtnWidth = this.data.delBtnWidth;
				let left = "";
				if (disX == 0 || disX < 0) { //如果移动距离小于等于0，container位置不变
					left = "margin-left:0px";
				} else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
					left = "margin-left:-" + delBtnWidth + "px";
				}
				this.setData({
					left
				})
			}
		},

		touchE: function(e) {
			if (e.changedTouches.length == 1) {
				var endX = e.changedTouches[0].clientX;
				var disX = this.data.startX - endX;
				var delBtnWidth = this.data.delBtnWidth;
				//如果距离小于删除按钮的1/2，不显示删除按钮
				var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
				this.setData({
					left
				})
			}
		},
		// 移动相关结束
	}
})
