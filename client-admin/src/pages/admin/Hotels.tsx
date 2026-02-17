import { Card, Table, Tag, Button, Space, message, Popconfirm } from 'antd'
import { useRequest } from 'ahooks'
import { listHotels, toggleHotelOnline } from '../../utils/mockDb'

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'orange', text: '审核中' },
  active: { color: 'green', text: '已发布' },
  rejected: { color: 'red', text: '已驳回' },
  offline: { color: 'default', text: '已下线' }
}

export default function Hotels() {
  const { data, loading, refresh } = useRequest(async () => {
    return listHotels()
  })

  const handleToggle = async (id: string, offline: boolean) => {
    toggleHotelOnline(id)
    message.success(offline ? '已恢复上线' : '已强制下线')
    refresh()
  }

  const columns = [
    { title: '酒店名称', dataIndex: 'name' },
    { title: '商户', dataIndex: ['merchant', 'username'] },
    { title: '城市', dataIndex: 'city' },
    { title: '状态', dataIndex: 'status', render: (s: string) => {
      const { color, text } = statusMap[s] || {}
      return <Tag color={color}>{text}</Tag>
    }},
    { title: '操作', key: 'action', render: (_: any, r: any) => (
      <Space>
        <Popconfirm
          title={r.status === 'offline' ? '确认恢复上线？' : '确认强制下线？'}
          onConfirm={() => handleToggle(r._id, r.status === 'offline')}
        >
          <Button type="link" size="small" danger={r.status !== 'offline'}>
            {r.status === 'offline' ? '恢复上线' : '强制下线'}
          </Button>
        </Popconfirm>
      </Space>
    )}
  ]

  return (
    <Card title="酒店综合管理">
      <Table rowKey="_id" loading={loading} columns={columns} dataSource={data} />
    </Card>
  )
}
