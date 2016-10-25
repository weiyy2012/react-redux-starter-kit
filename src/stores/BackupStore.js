import {
  observable, computed, action
} from 'mobx'

import Fetch from 'Fetch'
import Api from 'Api'

import Store from './Store'

export default class BackupStore {
  @observable isLoading = false
  @observable backups = []

  @action getBackupsServer(formData) {
    this.isLoading = true
    Fetch({
      url: Api.getBackups,
      data: formData,
      method: 'post',
      success: (data) => {
        this.isLoading = false
        this.backups = data.list.toObjectById()
      },
      error: (data) => {
        this.isLoading = false
      }
    })
  }

  @action getBackupServer(formData) {
    this.isLoading = true
    Fetch({
      url: Api.getBackup,
      data: formData,
      method: 'post',
      success: (data) => {
        this.isLoading = false
        this.backups[data.id] = data
      },
      error: (data) => {
        this.isLoading = false
      }
    })
  }

  static fromJS(array = []) {
    return new BackupStore()
  }
}

