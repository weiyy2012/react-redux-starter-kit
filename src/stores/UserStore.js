import {
  observable, computed, reaction, action
} from 'mobx'
import Api from 'Api'

import fetching from '../common/utils/fetch'

export default class UserStore {
  @observable user = {}
  @observable isLoading = false

  @action loginServer(formData) {
    this.isLoading = true
    fetching({
      url: Api.login,
      data: formData,
      success: (data) => {
        this.isLoading = false
        this.user = data
      },
      error: (data) => {
        this.isLoading = false
        this.user = data
      }
    })
  }
  @action registerServer(formData) {
    this.isLoading = true
    fetching({
      url: Api.register,
      data: formData,
      success: (data) => {
        this.isLoading = false
        this.user = data
      },
      error: (data) => {
        this.isLoading = false
        this.user = data
      }
    })
  }
  static fromJS() {
    const userStore = new UserStore()
    return userStore
  }

}