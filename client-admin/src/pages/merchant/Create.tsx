import { Card, Steps, Form, Input, InputNumber, Upload, Button, Space, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createHotel } from '../../utils/mockDb'
import { useAuthStore } from '../../stores/auth'

const { Step } = Steps
const { TextArea } = Input
const { Dragger } = Upload

export default function Create() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [form] = Form.useForm()
  const { user } = useAuthStore()

  const next = () => setCurrent(current + 1)
  const prev = () => setCurrent(current - 1)

  const steps = [
    { title: '基本信息', content: <BasicStep form={form} /> },
    { title: '详细信息', content: <DetailStep form={form} /> },
    { title: '图片上传', content: <ImageStep form={form} /> },
    { title: '房型设置', content: <RoomStep form={form} /> }
  ]

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (!user) throw new Error('未登录')
      const images = Array.isArray(values.images) ? values.images.map((f: any) => f?.name).filter(Boolean) : values.images
      createHotel(user.id, { ...values, images })
      message.success('酒店发布成功，等待审核')
      navigate('/merchant/hotels')
    } catch (e: any) {
      message.error(e.response?.data?.message || '提交失败')
    }
  }

  return (
    <Card title="发布酒店">
      <Steps current={current} style={{ marginBottom: 24 }}>
        {steps.map((s) => <Step key={s.title} title={s.title} />)}
      </Steps>
      <div style={{ minHeight: 320 }}>{steps[current].content}</div>
      <div style={{ textAlign: 'right' }}>
        <Space>
          {current > 0 && <Button onClick={prev}>上一步</Button>}
          {current < steps.length - 1 && <Button type="primary" onClick={next}>下一步</Button>}
          {current === steps.length - 1 && <Button type="primary" onClick={handleSubmit}>提交</Button>}
        </Space>
      </div>
    </Card>
  )
}

function BasicStep({ form }: any) {
  return (
    <Form form={form} layout="vertical">
      <Form.Item label="酒店名称" name="name" rules={[{ required: true }]}>
        <Input placeholder="如：易宿精品酒店" />
      </Form.Item>
      <Form.Item label="城市" name="city" rules={[{ required: true }]}>
        <Input placeholder="如：北京" />
      </Form.Item>
      <Form.Item label="详细地址" name="address" rules={[{ required: true }]}>
        <Input placeholder="如：朝阳区建国路 88 号" />
      </Form.Item>
      <Form.Item label="星级" name="star" rules={[{ required: true }]} initialValue={3}>
        <InputNumber min={1} max={5} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="联系电话" name="phone" rules={[{ required: true }]}>
        <Input placeholder="如：010-12345678" />
      </Form.Item>
    </Form>
  )
}

function DetailStep({ form }: any) {
  return (
    <Form form={form} layout="vertical">
      <Form.Item label="酒店简介" name="description" rules={[{ required: true }]}>
        <TextArea rows={4} placeholder="请简要介绍酒店特色" />
      </Form.Item>
      <Form.Item label="设施服务" name="facilities">
        <Input placeholder="如：WiFi、停车场、健身房（用逗号分隔）" />
      </Form.Item>
      <Form.Item label="标签" name="tags">
        <Input placeholder="如：商务、亲子、情侣（用逗号分隔）" />
      </Form.Item>
    </Form>
  )
}

function ImageStep({ form }: any) {
  const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList)
  return (
    <Form form={form} layout="vertical">
      <Form.Item label="酒店图片" name="images" valuePropName="fileList" getValueFromEvent={normFile}>
        <Dragger name="file" multiple listType="picture" beforeUpload={() => false}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p>点击或拖拽上传酒店图片</p>
        </Dragger>
      </Form.Item>
    </Form>
  )
}

function RoomStep({ form }: any) {
  return (
    <Form form={form} layout="vertical">
      <Form.List name="roomTypes">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name }) => (
              <Card key={key} size="small" style={{ marginBottom: 12 }}>
                <Form.Item label="房型名称" name={[name, 'name']} rules={[{ required: true }]}>
                  <Input placeholder="如：豪华大床房" />
                </Form.Item>
                <Form.Item label="面积 (㎡)" name={[name, 'area']}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="床型" name={[name, 'bedType']}>
                  <Input placeholder="如：1.8m 大床" />
                </Form.Item>
                <Form.Item label="基准价格 (元/晚)" name={[name, 'price']} rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="每日库存" name={[name, 'stock']} rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Button size="small" danger onClick={() => remove(name)}>删除房型</Button>
              </Card>
            ))}
            <Button type="dashed" onClick={() => add()} block>添加房型</Button>
          </>
        )}
      </Form.List>
    </Form>
  )
}
