import React from 'react'
import { ConfigProvider, Layout, Menu } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { UserOutlined, HomeOutlined, AuditOutlined, AppstoreOutlined } from '@ant-design/icons'

const { Header, Sider, Content } = Layout

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  // 根据角色动态生成菜单
  const getMenuItems = () => {
    const base = [{ key: '/', icon: <HomeOutlined />, label: '首页' }]
    if (user?.role === 'merchant') {
      return [
        ...base,
        { key: '/merchant/hotels', icon: <AppstoreOutlined />, label: '我的酒店' },
        { key: '/merchant/create', icon: <AppstoreOutlined />, label: '发布酒店' }
      ]
    }
    if (user?.role === 'admin') {
      return [
        ...base,
        { key: '/admin/audit', icon: <AuditOutlined />, label: '酒店审核' },
        { key: '/admin/hotels', icon: <AppstoreOutlined />, label: '酒店管理' }
      ]
    }
    return base
  }

  const items = getMenuItems()

  return (
    <ConfigProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <div className="logo" style={{ color: '#fff', textAlign: 'center', padding: 16 }}>
            易宿后台
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={items}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingInline: 24 }}>
            <div />
            <div>
              <span style={{ marginRight: 8 }}>欢迎，{user?.username}</span>
              <a onClick={logout}>退出</a>
            </div>
          </Header>
          <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}