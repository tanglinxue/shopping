import PublicModel from './Public.js'
// 启动页接口类
class StartModel extends PublicModel {
  //获取登录信息
  login(data={}) {
    return this.request({
      url: 'login',
      data
    })
  }
  //获取配置信息
  getconfig(data={}){
	  return this.request({
	    url: 'getconfig',
	    data
	  })
  }

}

export default StartModel
