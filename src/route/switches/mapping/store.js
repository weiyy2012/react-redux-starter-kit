import {
  observable, computed, action
} from 'mobx'

import Fetch from 'Fetch'
import Api from 'Api'
import 'Arr'

export default class MappingStore {
  @observable isLoading = false
  @observable list = []
  @observable fields = {}
  @observable updateFields = {}
  @observable searchFields = {}

  @observable searchDatas = {}

  @observable visible = false
  @observable params = {}

  @action setSearchDatas(formData) {
    this.searchDatas = formData
  }

  @action getServers(formData) {
    this.isLoading = true
    this.setSearchDatas(formData)
    
    Fetch({
      url: Api.getMappings,
      data: {
        conditions: formData,
        params: {}
      },
      method: 'post',
      success: (data) => {
        this.isLoading = false
        this.list = data.list
        this.fields = data.fields
        this.searchFields = data.search_fields
        this.updateFields = data.update_fields
      },
      error: (data) => {
        this.isLoading = false
      }
    })
  }

  @action deleteServer(formData) {
    this.isLoading = true
    Fetch({
      url: Api.deleteMapping,
      data: {
        conditions: {
          id: formData.id
        },
        params: {}
      },
      method: 'post',
      success: (data) => {
        this.isLoading = false
        this.list = this.list.deleteById(formData.id)
      },
      error: (data) => {
        this.isLoading = false
      }
    })
  }

  // 保存单条
  @action postServer(formData) {
    this.isLoading = true
    Fetch({
      url: Api.postMapping,
      data: {
        conditions: formData,
        params: {}
      },
      method: 'post',
      success: (data) => {
        this.isLoading = false
        this.list.push(data)
      },
      error: (data) => {
        this.isLoading = false
      }
    })
  }

  // 保存多条
  @action postServers(formData) {
    this.isLoading = true
    Fetch({
      url: Api.uploadCsvData,
      data: {
        conditions: formData,
        params: {}
      },
      method: 'post',
      success: (data) => {
        this.isLoading = false
        this.list = data
      },
      error: (data) => {
        this.isLoading = false
      }
    })
  }

  @action putServer(formData) {
    this.isLoading = true
    Fetch({
      url: Api.putMapping,
      data: {
        conditions: formData,
        params: {}
      },
      method: 'post',
      success: (data) => {
        this.isLoading = false
        let index = this.list.getIndexById(data.id)
        this.list[index] = data
      },
      error: (data) => {
        this.isLoading = false
      }
    })
  }

  toggleVisible() {
    this.visible = !this.visible
  }

  setParams(formData) {
    this.params = formData
  }

  toJS() {
    return this.list.map(data => data)
  }

  static fromJS(array = []) {
    return new MappingStore()
  }
}
