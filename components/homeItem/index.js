// 产品Item组件
Component({
  properties: {
    list: Object
  },
  methods: {
    // 跳到详情页
    jumpTap() {
      const good_id = this.properties.list.good_id
      wx.navigateTo({
        url: `/pages/goods-detail/goods-detail?good_id=${good_id}`
      })
    }
  }
})
