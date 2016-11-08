import {
  inject, observer
} from 'mobx-react'

import AddForm from '../../../components/switches/commonInfoAdd'

@inject(
  'dnatStore'
  )
@observer
export default class AddDnat extends React.Component {
  constructor(props) {
    super(props)
  }
  dnatIpExists(rule, value, callback) {
    if (!value) {
      callback()
    } else {
      if (!ipReg.test(value)) {
        callback([new Error("IP 格式不正确")]);
      } else {
        callback()
      }
    }
  }
  dnatPortExists(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      if (!portReg.test(value)) {
        callback([new Error("端口格式不正确")]);
      } else {
        callback()
      }
    }
  }
  
  render() {
    const {dnatStore} = this.props

    var formType = {
      'deadline': 'DatePicker'
    }

    const paramsData = dnatStore.params
    const dnat = dnatStore.list.getById(paramsData.id) || {}
    let formDataTitileServer = _.map(dnatStore.updateFields, (v, k) => {
      return _.assign({}, {
        formType: formType[k],
        name: k,
        label: v,
        fieldOptions: {
          initialValue: dnat[k],
          rules: [
            // { required: true, whitespace: true, message: '请输入主机名' }
          ],
        },
        placeholder: `请输入${v}`
      })
    })
    formDataTitileServer = [
      {
        type: 'hidden',
        name: 'id',
        label: 'id',
        fieldOptions: {
          initialValue: paramsData.actionType == 'clone' ? undefined : dnat.id
        }
      },
      ...formDataTitileServer
    ]

    return (
      <AddForm
        store={dnatStore}
        title={formDataTitileServer}/>)
  }
}