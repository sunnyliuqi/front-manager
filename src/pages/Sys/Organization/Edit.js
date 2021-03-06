import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Select, Row, Col, Form, Button, Drawer, Spin, TreeSelect, Cascader } from 'antd';
import Authorize from '@/components/Authorize/Authorize'

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

@connect(({ global }) => ({
  dictInfo: global.dictInfo,
}))
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  // 取消
  cancel = () => {
    const { form: { resetFields }, onCancel } = this.props;
    resetFields();
    if (onCancel) {
      onCancel();
    }
  };

  // 保存
  submitForm = () => {
    this.setState({ loading: true });
    const { form: { validateFields }, onOk } = this.props;
    validateFields((err, values) => {
      let data = values;
      if (!err) {
        if (onOk) {
          if(data.srcAreaId &&  data.srcAreaId.length>0){
            data.srcAreaId=data.srcAreaId[data.srcAreaId.length-1]
          }else{
            data.srcAreaId=""
          }
          onOk(data, () => {
            this.setState({ loading: false });
          });
        }
      } else {
        this.setState({ loading: false });
      }
    });
  };

  checkCode=(rule, value, callback,id)=>{
    if(value){
      const { dispatch, form: { getFieldsValue } } = this.props;
      dispatch({
        type: 'sysorganization/checkCode',
        payload: { code:getFieldsValue().code, id},
      }).then(({ result }) => {
        if (result > 0) {
          callback('编码已经存在');
        } else {
          callback();
        }
      });
    }else{
      callback();
    }
  }

  render() {
    const {
      visible,
      current,
      allList,
      managerUsers,
      optionsArea,
      form: { getFieldDecorator,getFieldsValue },
    } = this.props;
    const { loading } = this.state;

    return (
      <div>
        <Drawer
          maskClosable={false}
          width={600}
          title="修改"
          placement="right"
          onClose={this.cancel}
          visible={visible}
        >
          <Spin spinning={loading}>
            <Form style={{ paddingBottom: 15 }}>
              <Row>
                <FormItem style={{ display: 'none' }}>
                  {getFieldDecorator('id', {
                    initialValue: current.id,
                  })(<Input />)}
                </FormItem>
                <Col span="24">
                  <FormItem label="上级机构:" {...formItemLayout}>
                    {getFieldDecorator('supId', {
                      initialValue: current.supId || null,
                    })( <TreeSelect
                      showSearch
                      allowClear
                      style={{  width: 250 }}
                      dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                      treeData={allList}
                      placeholder="请选择上级机构"
                      filterTreeNode={(inputValue, treeNode) => {
                        return treeNode.props.title.indexOf(inputValue) > -1;
                      }}
                      treeDefaultExpandAll
                    />)}
                  </FormItem>
                </Col>


                <Col span="24">
                  <FormItem label="机构编号:" {...formItemLayout}>
                    {getFieldDecorator('code', {
                      initialValue: current.code ,
                      rules: [
                        { 'required': true, 'message': '机构编号不能为空' },
                        { validator: (rule, value, callback)=>this.checkCode(rule, value, callback,current.id) },
                      ],
                    })(<Input maxLength={50} style={{ maxWidth: 250 }} placeholder='请输入机构编号' />)}
                  </FormItem>
                </Col>


                <Col span="24">
                  <FormItem label="机构名称:" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      initialValue: current.name,
                      rules: [
                        { 'required': true, 'message': '机构名称不能为空' },
                      ],
                    })(<Input maxLength={30} style={{ width: 250 }} placeholder='请输入机构名称' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="机构类型:" {...formItemLayout}>
                    {getFieldDecorator('orgType', {
                      initialValue: current.orgType ? current.orgType : '',
                      rules: [
                        { 'required': true, 'message': '机构类型不能为空' },
                      ],
                    })(
                      <Select style={{ width: 250 }} placeholder='请选择机构类型'>
                        <Option value=''>请选择</Option>
                        {
                          (this.props.dictInfo || []).filter(filterItem => filterItem.type === 'org_type').map(item => {
                            return <Option key={item.value} value={item.value}>{item.label}</Option>;
                          })
                        }
                      </Select>)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="负责人:" {...formItemLayout}>
                    {getFieldDecorator('principalCode', {
                      initialValue: current.principalCode,
                      rules: [],
                    })(
                      <Select
                        showSearch
                        style={{ width: 250 }}
                        placeholder="请输入负责人"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {
                          managerUsers.map(item=>{
                            return <Option value={item.userCode}>{item.fullName}</Option>
                          })
                        }
                      </Select>)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="手机号:" {...formItemLayout}>
                    {getFieldDecorator('mobileNum', {
                      initialValue: current.mobileNum,
                      rules: [ { pattern: /^1[0123456789]\d{9}$/,
                        message: '请正确填写您的手机号码!',
                      }],
                    })(<Input maxLength={20} style={{ width: 250 }} placeholder='请输入手机号' />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="归属区域:" {...formItemLayout}>
                    {getFieldDecorator('srcAreaId', {
                      initialValue: current.srcAreaId? current.srcAreaId.split(","):[],
                    })(<Cascader
                      options={optionsArea}
                      changeOnSelect
                      fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                      style={{  width: 250 }}
                      placeholder='请选择归属区域'
                    />)}
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="详细地址:" {...formItemLayout}>
                    {getFieldDecorator('address', {
                      initialValue: current.address,
                      rules: [],
                    })(<Input maxLength={100} style={{ width: 250 }} placeholder='请输入详细地址' />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Spin>
          <div className="drawerFooter">
            <Button onClick={this.cancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Authorize code="SYS_ORGANIZATION_UPDATE">
              <Button loading={loading} onClick={this.submitForm} type="primary">
                保存
              </Button>
            </Authorize>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Edit);
