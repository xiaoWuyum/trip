import { Card } from 'antd'

export default function Home() {
  return (
    <Card title="欢迎使用易宿酒店管理后台">
      <p>请选择左侧菜单开始工作：</p>
      <ul>
        <li>商户：录入并管理您的酒店信息</li>
        <li>管理员：审核酒店、管理平台数据</li>
      </ul>
    </Card>
  )
}