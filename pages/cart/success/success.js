// pages/cart/success/successr.js
Page({

  toOrderList(){
	  // 去往订单列表页
	  wx.navigateTo({
	  	url: `/pages/order-list/order-list?type=1`
	  })
  }
})