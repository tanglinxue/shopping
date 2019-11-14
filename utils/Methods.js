class Methods{
  setStorage(key,con){
    wx.setStorageSync(key, con);
  }
  getStorage(item){
    if (wx.getStorageSync(item)){
      return wx.getStorageSync(item)
    }
    return false
  }
}
export default Methods