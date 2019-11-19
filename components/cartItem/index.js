import Methods from '../../utils/Methods.js'
const methods = new Methods()
Component({
	properties: {
		shopItem: {
			type: Object,
			value: {}
		}
	},
	data:{
		startX:0,
		delBtnWidth: 0
	},
	attached(){
		let delBtnWidth = methods.getEleWidth(120);
		this.setData({
			delBtnWidth
		})
	},
	methods: {
		
		// 改变是否选择
		changeSelect() {
			let {
				id
			} = this.properties.shopItem
			let shopInfo = methods.getStorage('shopInfo');
			shopInfo.shopList[id].active = !shopInfo.shopList[id].active;
			methods.setStorage('shopInfo', shopInfo);
			this.triggerEvent('updateShopInfo', {})
		},
		// 减法
		numJianTap() {
			let {
				buyNumMin,
				buyNumber
			} = this.properties.shopItem;
			if (buyNumber > buyNumMin) {
				buyNumber--;
				this.changeShopInfo(buyNumber)
			}
		},
		// 加法
		numJiaTap() {
			let {
				buyNumber,
				buyNumMax
			} = this.properties.shopItem;
			if (buyNumber < buyNumMax) {
				buyNumber++;
				this.changeShopInfo(buyNumber)
			}
		},
		//删除该商品
		deleteItem(){
			let {
				id
			} = this.properties.shopItem
			let shopInfo = methods.getStorage('shopInfo');
			if(shopInfo.shopList[id]){
				delete shopInfo.shopList[id]
			}
			shopInfo.shopNum = this.total(shopInfo.shopList)
			methods.setStorage('shopInfo', shopInfo);
			this.triggerEvent('updateShopInfo', {})
		},
		// 改变缓存里的购物车
		changeShopInfo(buyNumber) {
			let {
				id
			} = this.properties.shopItem
			let shopInfo = methods.getStorage('shopInfo');
			shopInfo.shopList[id].buyNumber = buyNumber;
			shopInfo.shopNum = this.total(shopInfo.shopList)
			methods.setStorage('shopInfo', shopInfo);
			this.triggerEvent('updateShopInfo', {})
		},
		// 计算总数量
		total(obj){
			let num = Object.keys(obj).reduce((prev,next)=>{
				return prev+obj[next].buyNumber
			},0)
			return num
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
