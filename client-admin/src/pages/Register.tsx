import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Form, Input, Button, Card, message, Typography, Radio } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { mockRegister } from '../utils/mockAuth'

const { Title, Text } = Typography

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    background: '#f5f7fa'
  },
  left: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 64px'
  },
  card: {
    width: 420,
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,.08)',
    border: 'none'
  },
  right: {
    flex: 1,
    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brand: {
    textAlign: 'center',
    color: '#fff'
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24
  }
}

export default function Register() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const { user, token } = await mockRegister({ username: values.username, password: values.password, role: values.role })
      setAuth(user, token)
      message.success('注册成功')
      navigate(user.role === 'merchant' ? '/merchant/hotels' : '/admin/audit')
    } catch (e: any) {
      message.error(e.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <Card style={styles.card}>
          <Title level={2} style={{ marginBottom: 32 }}>
            创建账户
          </Title>
          <Form layout="vertical" size="large" onFinish={onFinish} initialValues={{ role: 'merchant' }}>
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input placeholder="用户名" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password placeholder="密码" />
            </Form.Item>
            <Form.Item name="role" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="merchant">商户</Radio>
                <Radio value="admin">管理员</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                注册
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">已有账号？</Text>
              <Link to="/login">立即登录</Link>
            </div>
          </Form>
        </Card>
      </div>
      <div style={styles.right}>
        <div style={styles.brand}>
          <img
            src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=minimalist%20hotel%20logo%20blue%20white%20flat%20icon&image_size=square"
            alt="logo"
            style={styles.logo}
          />
          <Title level={1} style={{ color: '#fff', marginTop: 0 }}>
            易宿酒店后台
          </Title>
          <Text style={{ color: '#fff', fontSize: 16 }}>
            高效管理 · 智能审核 · 一站式运营
          </Text>
        </div>
      </div>
    </div>
  )
}
