// components/goodFooter/index.js
Component({
  methods: {
    // 唤起底部弹窗
    tobuy(e){
	  let type = e.currentTarget.dataset.type*1
      this.triggerEvent('tobuy', {showPopup:true,type})
    },
	// 去购物车
	goShopCar(){
		wx.switchTab({
			url:'/pages/cart/cart'
		})
	}
  }
})
