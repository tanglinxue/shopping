// 商品底部弹窗
import { GoodModel } from '../../models/good.js'
const goodModel = new GoodModel()
Component({
	/**
	 * 组件的属性列表
	 */
  properties: {
    showPopup: {
      type: Boolean,
      value: false
    },
    goodsDetail: {
      type: Object,
      value: {}
    },
    showType: {
      type: Number,
      value: 1
    }
  },
	/**
	 * 组件的方法列表
	 */
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
        buyNumMin, buyNumber
      } = this.properties.goodsDetail;
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
      } = this.properties.goodsDetail;
      if (buyNumber < buyNumMax) {
        buyNumber++;
        this.triggerEvent('changeNum', {
          buyNumber
        })
      }
    },
    /**
  * 加入购物车
  */
    addShopCar: function () {
      let { buyNumber, id, name, characteristic, minPrice, pic} = this.properties.goodsDetail
      if (buyNumber < 1) {
        wx.showModal({
          title: '提示',
          content: '购买数量不能为0！',
          showCancel: false
        })
        return;
      }
      let shopInfo = goodModel.getStorage('shopInfo');
      if (!shopInfo) {
        shopInfo = {
          shopList:{},
          shopNum: 0
        }
      }

      if (shopInfo.shopList[id]){
        shopInfo.shopList[id].number += buyNumber;
      }else{
        shopInfo.shopList[id]={
          name, characteristic, minPrice, pic, active: true, number: buyNumber
        }
      }
      shopInfo.shopNum += buyNumber;
      goodModel.setStorage('shopInfo', shopInfo)
      this.triggerEvent('changeNum', {
        buyNumber:1
      })
      this.closePopupTap();
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      })
    },
  }
})
