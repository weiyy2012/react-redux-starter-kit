import {
  toJS
} from 'mobx'
import {
  inject, observer
} from 'mobx-react'
import {
  Table,
  Input,
  Button,
  Form,
  Modal,
  Select,
  Popconfirm,
  Upload,
  Icon
} from 'antd'
const FormItem = Form.Item
const Option = Select.Option

import {ipReg, portReg} from '../../../common/utils/regex'
import {
  checkData, checkServerData
} from '../../components/checkout'

import ModalForm from '../../components/form'

@Form.create()
@inject(
  'dnetStore'
  )
@observer
export default class AddDnet extends React.Component {
  constructor(props) {
    super(props)
  }
  dnetIpExists(rule, value, callback) {
    checkData(rule, value, callback, ipReg, "IP 格式不正确")
  }
  dnetPortExists(rule, value, callback, source, options) {
    checkData(rule, value, callback, portReg, "端口格式不正确")
  }
  handleSubmit(e) {
    const {form, dnetStore} = this.props
    const {validateFields} = form
    const {params} = dnetStore

    validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }

      //var data = _.pickBy(values)
      var data = values
      // DatePicker 插件获取数据格式 为 moment
      data['deadline'] = data['deadline'] && data['deadline'].format('YYYY-MM-DD h:mm:ss')

      form.resetFields()
      this.hideModal()

      if(!_.isEmpty(toJS(dnetStore.params.ids))) {
        dnetStore.putServers({
          ids: toJS(dnetStore.params.ids),
          data: _.pickBy(values)
        })
      } else if(values.id) {
        dnetStore.putServer(data)
      } else {
        dnetStore.postServer(data)
      }
    })
  }
  hideModal() {
    const {dnetStore} = this.props
    dnetStore.toggleVisible()
  }

  render() {
    const {form, dnetStore} = this.props
    const paramsData = dnetStore.params
    const dnet = dnetStore.list.getById(paramsData.id) || {}

    var formDataTitileServer = [{
      type: 'hidden',
      name: 'id',
      label: 'id',
      fieldOptions: {
        initialValue: paramsData.actionType == 'clone' ? undefined : dnet.id
      }
    }, {
      name: 'ext_ip',
      label: '公网IP',
      fieldOptions: {
        initialValue: dnet.ext_ip,
        rules: [
          // { required: true, whitespace: true, message: '请输入公网IP' },
          { validator: ::this.dnetIpExists },
        ],
      },
      placeholder: '如：123.125.114.144'
    }, {
      name: 'ext_port',
      label: '公网端口',
      fieldOptions: {
        initialValue: dnet.ext_port,
        rules: [
          // { required: true, whitespace: true, message: '请输入公网端口' },
          { validator: ::this.dnetPortExists },
        ],
      },
      placeholder: '如：80',
    }, {
      name: 'int_ip',
      label: '内网IP',
      fieldOptions: {
        initialValue: dnet.int_ip,
        rules: [
          // { required: true, whitespace: true, message: '请输入内网IP' },
          { validator: ::this.dnetIpExists },
        ],
      },
      placeholder: '如：192.168.1.1'
    }, {
      name: 'int_port',
      label: '内网端口',
      fieldOptions: {
        initialValue: dnet.int_port,
        rules: [
          // { required: true, whitespace: true, message: '请输入内网端口' },
          { validator: ::this.dnetPortExists },
        ],
      },
      placeholder: '如：80'
    }, {
      name: 'applicant',
      label: '申请人',
      fieldOptions: {
        initialValue: dnet.applicant,
        rules: [
          // { required: true, whitespace: true, message: '请输入申请人' }
        ],
      },
      placeholder: '请输入申请人'
    }, {
      name: 'equipment',
      label: '所属设备',
      fieldOptions: {
        initialValue: dnet.equipment,
        rules: [
          // { required: true, whitespace: true, message: '请输入所属设备' }
        ],
      },
      placeholder: '请输入所属设备'
    }, {
      formType: 'DatePicker',
      name: 'deadline',
      label: '截止日期',
      fieldOptions: {
        initialValue: dnet.deadline
      },
      placeholder: '请输入截止日期'
    }, {
      name: 'remark',
      label: '备注',
      fieldOptions: {
        initialValue: dnet.remark
      },
      placeholder: '请输入备注'
    }]

    return (
      <Modal title="操作D-NET信息"
          visible={dnetStore.visible}
          onCancel={::this.hideModal}
          onOk={::this.handleSubmit}>
        {!_.isEmpty(ids) && <div className="update-ids">
          批量修改的对象 ID 为：<span className="ids-span">{ids.join(',  ')}</span>，<br/>
          请修改对应的字段，不填写字段为不修改字段。
        </div>}
        <Form horizontal>
          <ModalForm form={form}
            store={dnetStore}
            title={formDataTitileServer}/>
        </Form>
      </Modal>)
  }
}