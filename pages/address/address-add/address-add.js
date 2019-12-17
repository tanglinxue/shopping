const app = getApp()
import AddressModel from '../../../models/Address.js'
const addressModel = new AddressModel()
Page({
	data: {
		consignee: '', //收货人名字
		phone: '', //收货人手机
		detail_address: '', //详细地址
		zip_code: '', //邮编
		is_dfeault: 0, //0为不默认，1为默认
		region: ['浙江省', '杭州市', '上城区'],
		addStatus: false, //是否地址授权
		editStatus: false //是否为编辑状态
	},
	onLoad(options) {
		if (options.id) {
			this.setData({
				rec_id: options.id,
				editStatus: true
			})
			this.render()
		}
	},
	// 渲染数据
	render() {
		// 编辑
		if (app.globalData.editAddData) {
			let editAddData = app.globalData.editAddData;
			let {
				consignee,
				phone,
				detail_address,
				zip_code,
				is_default,
				province,
				city,
				area
			} = editAddData;
			let region = [province, city, area];
			this.setData({
				consignee,
				phone,
				detail_address,
				zip_code,
				is_default,
				region
			})
			app.globalData.editAddData = null
		}
	},
	onUnload() {
		app.globalData.editAddData = null
	},
	onShow() {
		this.getAddStatus()
	},
	// 获取地址授权信息
	getAddStatus() {
		addressModel.getUserStatus('address')
			.then(res => {
				if (!res) {
					wx.authorize({
						scope: 'scope.address',
						success: res => {
							this.setData({
								addStatus: true
							})
						}
					})
				} else {
					this.setData({
						addStatus: true
					})
				}
			})

	},
	// 取消
	bindCancel: function() {
		wx.navigateBack({})
	},
	// 地区的选择
	bindRegionChange: function(e) {
		this.setData({
			region: e.detail.value
		})
	},
	// 选择默认地址
	defaultChange(e) {
		let bol = e.detail.value;
		this.setData({
			is_default: bol ? 1 : 0
		})
	},
	// 保存地址
	bindSave: function(e) {
    console.log(e)
    let form_id = e.detail.formId;
		let consignee = e.detail.value.consignee;
		let phone = e.detail.value.phone;
		let detail_address = e.detail.value.detail_address;
		let zip_code = e.detail.value.zip_code;

		if (!consignee) {
			addressModel.showToast('请填写联系人姓名')
			return
		}
		if (!phone) {
			addressModel.showToast('请填写手机号码')
			return
		}

		let {
			is_default,
			region,
			editStatus
		} = this.data;
		let [province, city, area] = region

		if (!detail_address) {
			addressModel.showToast('请填写详细地址')
			return
		}
		if (!zip_code) {
			addressModel.showToast('请填写邮编')
			return
		}
		let params = {
			consignee,
			phone,
			detail_address,
			zip_code,
			is_default,
			type: 1,
			province,
			city,
			area,
      form_id
		}
		// 收货地址添加
		if (editStatus) {
			params.type=2
			params.rec_id = this.data.rec_id;
			addressModel.showLoading('编辑收货地址中');
		} else {
			addressModel.showLoading('添加收货地址中');
		}

		addressModel.receiveInfo(params)
			.then(
				res => {
					if (res) {
						let title = '添加地址成功'
						if(editStatus){
							title = '编辑地址成功'
						}
						addressModel.showToast(title, 'success', 2000, () => {
							app.globalData.selectAddData = params;
							if(!editStatus){
								app.globalData.selectAddData.rec_id = res.rec_id
							}
							addressModel.navBack()
						})
					}else{
						wx.hideLoading()
					}
					
				}
			)


	},


	//从微信读取数据
	readFromWx() {
		let that = this;
		wx.chooseAddress({
			success: (res) => {
				addressModel.showToast('获取信息成功')
				let {
					userName,
					telNumber,
					provinceName,
					cityName,
					countyName,
					detailInfo,
					postalCode
				} = res;
				this.setData({
					consignee: userName,
					phone: telNumber,
					region: [provinceName, cityName, countyName],
					detail_address: detailInfo,
					zip_code: postalCode
				});
			},
			fail: (res) => {
				addressModel.showToast('获取信息失败')
			}
		})
	},
	// 删除收货地址
	deleteAddress() {
		addressModel.showModal('确定要删除该收货地址吗？', '温馨提示', true, () => {
			let params = {
				type: 3,
				rec_id: this.data.rec_id
			}
			addressModel.receiveInfo(params)
				.then(
					res => {
						if (res) {
							addressModel.showToast('删除地址成功', 'none', 2000, () => {
								addressModel.navBack()
							})
						}else{
							wx.hideLoading()
						}
						
					}
				)
		})
	}
})
