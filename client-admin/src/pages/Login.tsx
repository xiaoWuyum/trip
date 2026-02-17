import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Form, Input, Button, Card, message, Typography } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { mockLogin } from '../utils/mockAuth'

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

export default function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const { user, token } = await mockLogin(values)
      setAuth(user, token)
      message.success('登录成功')
      navigate(user.role === 'merchant' ? '/merchant/hotels' : '/admin/audit')
    } catch (e: any) {
      message.error(e.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* 左侧表单 - 靠左对齐 */}
      <div style={styles.left}>
        <Card style={styles.card}>
          <Title level={2} style={{ marginBottom: 32 }}>
            欢迎回来
          </Title>
          <Form layout="vertical" size="large" onFinish={onFinish}>
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input placeholder="用户名" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password placeholder="密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                登录
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">还没有账号？</Text>
              <Link to="/register">立即注册</Link>
            </div>
          </Form>
        </Card>
      </div>

      {/* 右侧品牌区 */}
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
