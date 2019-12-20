// 商品底部弹窗
import CartModel from '../../models/Cart.js'
const cartModel = new CartModel();
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		goodsDetail:{
			type:Object,
			value:{}
		},
		// 是否显示弹窗
		showPopup: {
			type: Boolean,
			value: false
		},
		// 1立即购买,2购物车,3都显示
		showPopupType: {
			type: Number,
			value: 1
		},
		// 类别
		classic_type: {
			type: Number,
			value: 1
		},
		// 处理好的数据
		classics:{
			type: Array,
			value: []
		},
		// 颜色数据
		colors:{
			type: Array,
			value: []
		},
		// 尺码数据
		sizes:{
			type: Array,
			value: []
		},
		typeSelectA:{
			type:Number,
			value:-1
		},
		typeSelectB:{
			type:Number,
			value:-1
		},
		// 选择的数据
		selectClassData:{
			type:Object,
			value:{}
		}
	},

	methods: {
		// 关闭弹窗
		closePopupTap() {
			this.triggerEvent('closePopup', {
				showPopup: false
			})
		},
		// 减法
		numJianTap() {
			let {
				buyNumMin,
				buyNumber
			} = this.properties.selectClassData;
			if (buyNumber > buyNumMin) {
				buyNumber--;
				this.triggerEvent('changeNum', {
					buyNumber
				})
			}
		},
		// 加法
		numJiaTap() {
			let {
				buyNumber,
				buyNumMax
			} = this.properties.selectClassData;
			if (buyNumber < buyNumMax) {
				buyNumber++;
				this.triggerEvent('changeNum', {
					buyNumber
				})
			}
		},
		// 去购买
		toBuyTap(e) {
			let type = e.currentTarget.dataset.type;
			let {selectClassData,typeSelectA,typeSelectB,classic_type} = this.properties;
			// 分类
			if(classic_type==1){
				if(typeSelectA<0){
					cartModel.showModal(selectClassData.des)
					return
				}
			}
			// 组合
			if(classic_type==2||classic_type==3){
				if(typeSelectA<0||typeSelectB<0){
					cartModel.showModal(selectClassData.des)
					return
				}
			}
			if(type==1){
				// 购买
				if (selectClassData.buyNumber < 1) {
					cartModel.showModal('购买数量不能为0！')
					return;
				}
				let buyShopItem = {
					subgood_id:this.properties.goodsDetail.good_id,
					classic_type,
					good_name:this.properties.goodsDetail.good_name,
					good_num:selectClassData.buyNumber,
					sell_price:selectClassData.classic_sell_prize,
					head_pic:selectClassData.classic_img,
					kinds:selectClassData.classic_name,
					freight:selectClassData.freight,
					cart_classic:selectClassData.classic_name
				}
				if(classic_type==2){
					buyShopItem.kinds = buyShopItem.kinds+';'+selectClassData.colour;
					buyShopItem.cart_colour=selectClassData.colour
				}
				if(classic_type==3){
					buyShopItem.kinds = buyShopItem.kinds+';'+selectClassData.size;
					buyShopItem.cart_size=selectClassData.size
				}
				let shopList = [buyShopItem];
				app.globalData.buyShopList = shopList
				this.closePopupTap();
				wx.navigateTo({
					url: '/pages/cart/pay-order/pay-order'
				})
			}else if(type==2){
				if (selectClassData.buyNumber < 1) {
					cartModel.showModal('加入购物车数量不能为0！')
					return;
				}
				// 加入购物车
				let {
					good_id
				} = this.properties.goodsDetail;
				let {buyNumber,classic_name} = selectClassData;
				let params = {
					good_id,
					good_num:buyNumber,
					cart_classic:classic_name
				}
				if(classic_type==2){
					params.cart_colour=selectClassData.colour
				}else if(classic_type==3){
					params.cart_size= selectClassData.size
				}	
				cartModel.showLoading('加入购物车中...');
				cartModel.addShopCart(params)
					.then(res => {
						wx.hideLoading()
						if (res) {
							cartModel.showToast('加入购物车成功');
							this.triggerEvent('addNum')						
						}
					})
			}
			
		},
		//分类选择
		selectCateA(e){
			let index = e.currentTarget.dataset.index;
			let selectData = this.data.classics[index];
			if(selectData.canNotSelect){
				return
			}
			this.triggerEvent('selectTypeFun', {selectTypeSelectA:index,type:'A'})
		},
		// 分类选择B
		selectCateB(e){
			let index = e.currentTarget.dataset.index;
			let {classic_type} = this.properties;
			let selectData = this.data.colors[index];
			if(classic_type==3){
				selectData = this.data.sizes[index];
			}
			
			if(selectData.canNotSelect){
				return
			}
			this.triggerEvent('selectTypeFun', {selectTypeSelectB:index,type:'B'})
		}
	}
})
