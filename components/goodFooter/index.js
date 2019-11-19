// components/goodFooter/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    allShopNum:{
      type:Number,
      value:0
    }
  },

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
