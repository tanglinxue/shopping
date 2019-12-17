import PublicModel from './Public.js'
// 地址相关接口
class AddressModel extends PublicModel {
  // 收货地址列表查询
  receiveLists(data={}){
	  return this.request({
	    url: 'receive_list',
	    data
	  })
  }
  //收货地址操作
  receiveInfo(data={}){
	  return this.request({
	    url: 'receive_info',
	    data
	  })
  }
}

export default AddressModel
