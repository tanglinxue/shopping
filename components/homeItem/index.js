// 产品Item组件
Component({
  properties: {
    list: Object
  },
  methods: {
    // 跳到详情页
    jumpTap() {
      const id = this.properties.list.id
      wx.navigateTo({
        url: `/pages/goods-detail/goods-detail?id=${id}`
      })
    }
  }
})
