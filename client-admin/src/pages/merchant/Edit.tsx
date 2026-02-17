import { Card, Form, Input, InputNumber, Button, Space, message } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { getHotelById, updateHotel } from '../../utils/mockDb'
import { useAuthStore } from '../../stores/auth'

const { TextArea } = Input
export default function Edit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { user } = useAuthStore()

  const { data, loading } = useRequest(async () => {
    if (!id) return null
    return getHotelById(id)
  }, {
    onSuccess(d) {
      if (d) form.setFieldsValue(d)
    }
  })

  const onFinish = async (values: any) => {
    try {
      if (!user) throw new Error('未登录')
      if (!id) throw new Error('参数错误')
      updateHotel(user.id, id, values)
      message.success('保存成功')
      navigate('/merchant/hotels')
    } catch (e: any) {
      message.error(e.message || '保存失败')
    }
  }

  if (loading) return <Card loading />

  return (
    <Card title="编辑酒店">
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={data || undefined}>
        <Form.Item label="酒店名称" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="城市" name="city" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="地址" name="address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="星级" name="star" rules={[{ required: true }]}>
          <InputNumber min={1} max={5} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="简介" name="description">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item label="设施" name="facilities">
          <Input placeholder="用逗号分隔" />
        </Form.Item>
        <Form.Item label="标签" name="tags">
          <Input placeholder="用逗号分隔" />
        </Form.Item>
        <Form.Item label="图片" name="images">
          <Input placeholder="用逗号分隔图片名（演示）" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button onClick={() => navigate(-1)}>返回</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}
