
Component({
  properties: {
    banners:Array,
    border:{
      type:Boolean,
      value:false
    }
  },
  data: {
    swiperCurrent: 0,//滑动索引
  },
  methods: {
    //banner滑动
    swiperchange: function (e) {
      this.setData({
        swiperCurrent: e.detail.current
      })
    },
  }
})
