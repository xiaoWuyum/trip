import { Card, Table, Tag, Button, Space, message, Modal, Input } from 'antd'
import { useRequest } from 'ahooks'
import { useState } from 'react'
import { auditHotel, listHotels } from '../../utils/mockDb'

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待审核' },
  active: { color: 'green', text: '已发布' },
  rejected: { color: 'red', text: '已驳回' },
  offline: { color: 'default', text: '已下线' }
}

export default function Audit() {
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [remark, setRemark] = useState('')
  const { data, loading, refresh } = useRequest(async () => {
    return listHotels({ status: 'pending' })
  })

  const handleAudit = async (id: string, status: 'active' | 'rejected') => {
    if (status === 'rejected' && !remark.trim()) {
      message.warning('请填写驳回原因')
      return
    }
    auditHotel(id, status, remark)
    message.success(status === 'active' ? '审核通过' : '已驳回')
    setRejectId(null)
    setRemark('')
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
    { title: '提交时间', dataIndex: 'createdAt', render: (d: string) => new Date(d).toLocaleString() },
    { title: '操作', key: 'action', render: (_: any, r: any) => (
      <Space>
        <Button type="primary" size="small" onClick={() => handleAudit(r._id, 'active')}>通过</Button>
        <Button size="small" danger onClick={() => { setRejectId(r._id); setRemark('') }}>驳回</Button>
      </Space>
    )}
  ]

  return (
    <>
      <Card title="酒店审核">
        <Table rowKey="_id" loading={loading} columns={columns} dataSource={data} />
      </Card>

      <Modal
        title="驳回原因"
        open={!!rejectId}
        onOk={() => rejectId && handleAudit(rejectId, 'rejected')}
        onCancel={() => setRejectId(null)}
        okButtonProps={{ danger: true }}
      >
        <Input.TextArea
          rows={4}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="请输入驳回原因（必填）"
        />
      </Modal>
    </>
  )
}
