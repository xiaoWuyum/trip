import { Card, Table, Tag, Button, Space, message, Popconfirm, Modal } from 'antd'
import { useRequest } from 'ahooks'
import { Link } from 'react-router-dom'
import { listMyHotels, toggleHotelOnline } from '../../utils/mockDb'
import { useAuthStore } from '../../stores/auth'

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'orange', text: '审核中' },
  active: { color: 'green', text: '已发布' },
  rejected: { color: 'red', text: '已驳回' },
  offline: { color: 'default', text: '已下线' }
}

export default function Hotels() {
  const { user } = useAuthStore()
  const { data, loading, refresh } = useRequest(async () => {
    if (!user) return []
    return listMyHotels(user.id)
  })

  const handleToggle = async (id: string, offline: boolean) => {
    toggleHotelOnline(id)
    message.success(offline ? '已上线' : '已下线')
    refresh()
  }

  const columns = [
    { title: '酒店名称', dataIndex: 'name' },
    { title: '城市', dataIndex: 'city' },
    { title: '状态', dataIndex: 'status', render: (s: string) => {
      const { color, text } = statusMap[s] || {}
      return <Tag color={color}>{text}</Tag>
    }},
    { title: '操作', key: 'action', render: (_: any, r: any) => (
      <Space>
        <Link to={`/merchant/edit/${r._id}`}>编辑</Link>
        {r.status === 'rejected' && (
          <Button
            type="link"
            size="small"
            onClick={() => Modal.info({ title: '驳回原因', content: r.auditRemark || '无' })}
          >
            查看原因
          </Button>
        )}
        <Popconfirm
          title={r.status === 'offline' ? '确认上线？' : '确认下线？'}
          onConfirm={() => handleToggle(r._id, r.status === 'offline')}
        >
          <Button type="link" size="small" danger={r.status !== 'offline'}>
            {r.status === 'offline' ? '上线' : '下线'}
          </Button>
        </Popconfirm>
      </Space>
    )}
  ]

  return (
    <Card
      title="我的酒店"
      extra={
        <Link to="/merchant/create">
          <Button type="primary">发布酒店</Button>
        </Link>
      }
    >
      <Table rowKey="_id" loading={loading} columns={columns} dataSource={data} />
    </Card>
  )
}
