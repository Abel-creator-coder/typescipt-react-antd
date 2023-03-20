import * as React from 'react';
import DocumentTitle from 'react-document-title';
import { Drawer, Button, Table, Space, Pagination, message, Select, Form, Input, DatePicker } from 'antd';
import { PlusOutlined  } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import '@/styles/home.less';
import { 
  queryTaskList,
  addTask,
  editTask,
  updateTaskStatus,
  deleteTask
} from '@/utils/api';
import { formatDate } from '@/utils/valid';

interface Task {
    _id: number,
    id: number,
    title: string,
    content: string,
    exipre: number,
    createdAt: number,
    auther: string,
    status: number,
}

interface Values {
    _id: number,
    id?: number,
    title: string,
    exipre: any,
    content: string,
    auther:string
}

interface IState {
    total: number,
    pageNo: number,
    pageSize: number,
    loading: boolean,
    textBtn: string,
    title: string,
    visible: boolean,
    currentRowData: Values,
    status: any,
    columns: ColumnsType<Task>,
    dataSource: Task[]
}

interface IProps {
    title: string,
    textBtn: string,
    visible: boolean,
    currentRowData: Values,
    onSubmitDrawer: (values: Values, type: number) => void,
    onCloseDrawer: () => void
}

const AddEditTaskForm: React.FC<IProps> = ({
    title,
    textBtn,
    visible,
    currentRowData,
    onSubmitDrawer,
    onCloseDrawer
}) => {
    const [form] = Form.useForm();

    setTimeout(() => {
        form.setFieldsValue({
            ...currentRowData,
            exipre: moment(currentRowData.exipre)
        });
    }, 100)

    const onSubmit = () => {
        form.validateFields()
        .then((values: any) => {
            if (title === '添加任务') {
                onSubmitDrawer(values, 1);
            } else {
                onSubmitDrawer(values, 2);
            }
        })
        .catch(info => {
            console.log('Validate Failed:', info);
        })
    }

    const onReset = () => {
        form.resetFields();
    }

    const onClose = () => {
        form.resetFields();
        onCloseDrawer();
    }
    
    return (
        <Drawer
            forceRender
            title={ title }
            width={ 600 }
            onClose={ onClose }
            visible={ visible }
            bodyStyle={{ paddingBottom: 80 }}
            maskClosable={ false }
            footer={
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <Button onClick={ onSubmit } type="primary">{ textBtn }</Button>
                    <Button onClick={ onReset }>重置</Button>
                    <Button onClick={ onClose } danger>取消</Button>
                </div>
            }
        >
            <Form
                form={ form }
                layout="vertical"
                name="form_in_modal"
            >
                <Form.Item
                    label="任务名称"
                    name="title"
                    rules={[{ required: true, message: '请输入任务名称' }]}
                >
                    <Input placeholder="请输入任务名称" />
                </Form.Item>
                <Form.Item 
                    label="计划完成时间"
                    name="exipre"
                    rules={[{ required: true, message: '请选择完成日期' }]}
                >
                    <DatePicker placeholder="请选择完成日期" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item 
                    label="任务内容"
                    name="content"
                    rules={[{ required: true, message: '请输入任务内容' }]}
                >
                    <Input.TextArea rows={ 7 } placeholder="请输入任务内容" className="textarea" />
                </Form.Item>
                <Form.Item
                    label="创建者"
                    name="auther"
                    rules={[{ required: true, message: '请输入创建者' }]}
                >
                    <Input placeholder="请输入创建者" />
                </Form.Item>
            </Form>
        </Drawer>

    )
}

class Home extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            loading: false,
            textBtn: '提交',
            title: '添加任务',
            currentRowData: {
                _id: -1,
                id: -1,
                title: '',
                content: '',
                exipre: 0,
                auther: ''
            },
            visible: false,
            dataSource: [],
            status: null,  // 0：待办 1：完成 2：删除
            columns: [
                {
                    title: '序号',
                    key: 'id',
                    align: 'center',
                    render: (text: any, record: any, index: number) => {
                        let num = (this.state.pageNo - 1) * 10 + index + 1;
                        return num;
                    }
                },
                {
                    title: '任务名称',
                    dataIndex: 'title',
                    key: 'title',
                    render: (text: any, record: any, index: number) => {
                        return <div>{ record.title }</div>;
                    }
                },
                {
                    title: '任务内容',
                    dataIndex: 'content',
                    key: 'content'
                },
                {
                    title: '计划完成时间',
                    dataIndex: 'exipre',
                    key: 'exipre',
                    defaultSortOrder: 'descend',
                    sorter: (a, b):any => {
                        const aTimeString = new Date(a.exipre).getTime();
                        const bTimeString = new Date(b.exipre).getTime();
                        return aTimeString - bTimeString;
                    },
                    render: (text: any, record: any) => formatDate(record.exipre)
                },
                {
                    title: '创建时间',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    defaultSortOrder: 'descend',
                    sorter: (a, b):any => {
                        const aTimeString = new Date(a.exipre).getTime();
                        const bTimeString = new Date(b.exipre).getTime();
                        return aTimeString - bTimeString;
                    },
                    render: (text: any, record: any) => formatDate(record.createdAt)
                },
                {
                    title: '创建者',
                    dataIndex: 'auther',
                    key: 'auther'
                },
                {
                    title: '任务状态',
                    dataIndex: 'status',
                    key: 'status',
                    width: 120,
                    render: (text: any, record: any) => {
                        const txt = record.status === 0 ? '待办' : record.status === 1 ? '完成' : '删除';
                        return txt;
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 300,
                    align: 'center',
                    render: (text: any, record: any, index: number) => (
                        <Space size="middle">
                            <Button style={{marginRight: '10px', display: record.status !== 2 ? '' : 'none'  }} onClick={ () => this.editTask(record, index) }>编辑</Button>
                            <Button type="primary" ghost style={{marginRight: '10px', display: record.status !== 2 ? '' : 'none' }} onClick={ () => this.completeTask(record) }>
                                { record.status === 0 ? '完成' : record.status === 1 ? '待办' : null }
                            </Button>
                            <Button danger style={{ display: record.status !== 2 ? '' : 'none'  }} onClick={ () => this.removeTask(record._id) }>删除</Button>
                        </Space>
                    )
                }
            ]
        }
    }

    componentDidMount () {
        this.getTaskList();
    }

    // 获取任务列表数据
    getTaskList = () => {
        const { pageNo, pageSize, status } = this.state;
        this.setState({
            loading: true
        })
  
        let params = {
          pageNo: pageNo,
          pageSize: pageSize,
          status: status
        }
  
        queryTaskList(params)
        .then((res: any) => {
            this.setState({
                loading: false
            })

            if (res.code === 0 && res.data) {
                this.setState({
                    dataSource: res.data.list,
                    total: res.data.count
                })
            } else {
                this.setState({
                    dataSource: [],
                    total: 0
                })
            }
        })
        .catch(() => {
            this.setState({
                loading: false
            })
        })
    }

    // 添加任务对话框
    addTask = () => {
        this.setState({
            title: '添加任务',
            textBtn: '提交',
            visible: true,
            currentRowData: {
                _id: -1,
                id: -1,
                title: '',
                exipre: 0,
                content: '',
                auther: ''
            }
        })
    }

    // 编辑任务对话框
    editTask = (record: any, index: number) => {
        this.setState({
            title: '编辑任务',
            textBtn: '保存',
            visible: true,
            currentRowData: {
                _id: record._id,
                title: record.title,
                exipre: record.exipre,
                content: record.content,
                auther:  record.auther
            }
        })
    }

    // 删除任务
    removeTask = (id: number) => {
        let data = {
            _id: id
        }

        deleteTask(data)
        .then((res: any) => {
            if (res.code === 0) {
                this.setState({
                    pageNo: 1
                }, () => {
                    this.getTaskList();
                    message.success('任务删除成功');
                })
            } else {
                message.error(res.error);
            }
        });
    }

    // 完成/待办任务
    completeTask = (record: any) => {
        let status = record.status === 0 ? 1 : record.status === 1 ? 0 : null;

        let data = {
            _id: record._id,
            status: status
        }

        updateTaskStatus(data)
        .then((res: any) => {
            if (res.code === 0) {
                this.setState({
                    pageNo: 1
                }, () => {
                    this.getTaskList();
                    message.success('更新任务状态成功');
                })
            } else {
               message.error(res.error);
            }
        })
    }

    // 提交添加或编辑表单
    onSubmit = (values: Values, type: number) => {
        const { currentRowData } = this.state;

        if (type === 1) {
            let data = {
                title: values.title,
                exipre: moment(values.exipre).valueOf(),
                content: values.content,
                auther: values.auther,
                status: 0
            }

            addTask(data)
            .then((res: any) => {
              this.setState({
                  visible: false
              })
              if (res.code === 0) {
                this.setState({
                    pageNo: 1
                }, () => {
                    this.getTaskList();
                    message.success(`新增任务 <${values.title}> 成功`);
                })
              } else {
                message.error(res.error);
              }
            })
            .catch(() => {
                this.setState({
                    visible: false
                })
            })

        } else if (type === 2) {
            let data = {
                _id:currentRowData._id,
                title: values.title,
                exipre: moment(values.exipre).valueOf(),
                content: values.content,
                auther: values.auther
            }
  
            editTask(data)
            .then((res: any) => {
                this.setState({
                    visible: false
                })
                if (res.code === 0) {
                    this.setState({
                        pageNo: 1
                    }, () => {
                        this.getTaskList();
                        message.success(`更新任务 <${values.title}> 成功`);
                    })
                } else {
                    message.error(res.error);
                }
            })
            .catch(() => {
                this.setState({
                    visible: false
                })
            })
        }
    }

    // 关闭任务对话框
    onClose = () => {
        this.setState({
            visible: false,
            currentRowData: {
                _id: -1,
                id: -1,
                title: '',
                exipre: 0,
                content: '',
                auther: ''
            }
        })
    }

    // 页码改变的回调，返回改变后的页码
    changePage = (pageNo: number) => {
        this.setState({
            pageNo
        }, () => {
            this.getTaskList();
        })
    }

    // 筛选任务状态
    handleChange = (value: number) => {
        this.setState({
            status: typeof value === 'string' ? null : value,
            pageNo: 1
        }, () => {
            this.getTaskList();
        })
    }

    render () {
        const { 
            total, 
            pageNo, 
            pageSize, 
            loading, 
            dataSource, 
            columns, 
            visible, 
            title,
            textBtn,
            currentRowData 
        } = this.state;
        const { Option } = Select;

        return (
            <DocumentTitle title={'测试'}>
                <div className="home-container">
                    <div className="content clearfix">
                        <div className="list">
                            <h2>任务列表</h2>
                            <div className="list-right">
                                <Space size="middle">
                                    <Select size="large" onChange={ this.handleChange } style={{ width: 160 }} allowClear placeholder="请筛选任务状态">
                                        <Option value=''>全部</Option>
                                        <Option value={ 0 }>待办</Option>
                                        <Option value={ 1 }>完成</Option>
                                    </Select>
                                    <Button type="primary" size="large" onClick={ this.addTask }><PlusOutlined /> 添加任务</Button>
                                </Space>
                            </div>
                        </div>
                        
                        <Table 
                            bordered
                            rowKey={ record => record.id  } 
                            dataSource={ dataSource } 
                            columns={ columns }
                            loading={ loading }
                            pagination={ false } 
                        />
                        <Pagination
                            className="pagination"
                            total={ total }
                            style={{ display: loading && total === 0 ? 'none' : '' }}
                            showTotal={total => `共 ${total} 条数据`}
                            onChange={ this.changePage }
                            current={ pageNo }
                            showSizeChanger={ false }
                            defaultPageSize={ pageSize }
                            hideOnSinglePage={ false }
                        />
                    </div>
                    <AddEditTaskForm
                        title={ title }
                        textBtn={ textBtn } 
                        visible={ visible }
                        currentRowData={ currentRowData }
                        onSubmitDrawer={ this.onSubmit }
                        onCloseDrawer={ this.onClose }
                    />
                </div>
            </DocumentTitle>
        )
    }
}

export default Home