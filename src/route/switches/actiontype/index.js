import {
  inject, observer
} from 'mobx-react'
import {
  Button,
  Popconfirm,
  Modal
} from 'antd'
import {
  Link
} from 'react-router'
import {
  Table
} from 'antd'

import Url from 'Url'
import Api from 'Api'

import SearchTable from './search'
import DataTable from '../../components/table'
import AddActiontypeModal from './add'

@inject(
  'actiontypeStore', 'dashboardStore'
  )
@observer
export default class Actiontypes extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false
    }
  }
  componentWillMount() {
    const bcData = ['首页', '常用信息', '操作类型信息']
    const {dashboardStore} = this.props
    dashboardStore.putDashboard(bcData)
  }
  addActiontype(e) {
    const {actiontypeStore} = this.props
    actiontypeStore.toggleVisible()
    actiontypeStore.setParams({})
  }
  updateActiontype(formData) {
    const {actiontypeStore} = this.props
    actiontypeStore.toggleVisible()
    actiontypeStore.setParams(formData)
  }
  handleDeleteConfirm(formData) {
    const {actiontypeStore} = this.props
    actiontypeStore.deleteServer(formData)
  }
  render() {
    const that = this
    const {actiontypeStore} = this.props
    let dataList = actiontypeStore.toJS()
    console.log(dataList)
    let fields = actiontypeStore.fields
    fields = {
      id: 'ID',
      type: '类型',
      status: '状态',
      c_time: '创建时间',
      user: '创建人'
    }
    let searchFields = actiontypeStore.searchFields
    
    const statusData = ['停用', '启用']

    let tableHeader = _.map(fields, (v, k) => {
      if(k == 'status') {
        return {
          title: v,
          dataIndex: k,
          key: k,
          width: 80,
          render: (text, record, index) => {
            return statusData[text]
          }
        }
      } else {
        return {
          title: v,
          dataIndex: k,
          key: k,
          width: 80,
          render: (text, record, index) => {
            return text
          }
        }
      }
    })
    const columns = _.isEmpty(tableHeader) ? [] : [
      ...tableHeader,
      {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record, index) => {
          return <div>  
            <a href="#" onClick={that.updateActiontype.bind(this,{
              id: record.id
            })}>修改</a>　
            <Popconfirm title="确定要删除这个操作类型吗？" onConfirm={that.handleDeleteConfirm.bind(this, {
              id: record.id
            })}>
              <a href="#">删除</a>
            </Popconfirm>
          </div>  
        }
      } 
    ];

    return(
      <div className="switches-network">
        {searchFields && <div className="table-search">
          <SearchTable searchFields={searchFields} store={actiontypeStore}/>
        </div>}
        <div className="switches-action-type">
          <Button type="primary" onClick={::this.addActiontype}>添加操作类型</Button>
        </div>
        <div className={classNames({"tables": true})}>
          <DataTable columns={columns}
            dataSource={dataList}/>
        </div>
        <AddActiontypeModal />
      </div>
      )
  }
}
