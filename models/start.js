import { HTTP } from '../utils/http-p.js'
// 启动页接口
class StartModel extends HTTP {
  data = {}
  //获取登录信息
  login(data) {
    return this.request2({
      url: 'login',
      data
    })
  }
  // 授权接口
  getUserUpdate(data){
    return this.request2({
      url: 'get_userinfo',
      data
    })
  }
  // 配置信息
  getconfig(data={}){
	  return this.request2({
	    url: 'getconfig',
	    data
	  })
  }

}

export {
  StartModel
}
