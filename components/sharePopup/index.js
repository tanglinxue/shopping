// components/sharePopup/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
	sharePopup:{
		type:Boolean,
		value:false
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
	  // 关闭弹窗
		closeshare(){
			this.triggerEvent('closeShare', {})
		}
  }
})
