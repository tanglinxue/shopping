// components/goodFooter/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopNum:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 唤起底部弹窗
    tobuy(e){
	  let type = e.currentTarget.dataset.type*1
      this.triggerEvent('tobuy', {showPopup:true,type})
    }
  }
})
