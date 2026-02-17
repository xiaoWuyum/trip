import { View, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import './index.scss'
import { listActiveHotels } from '../../services/mockDb'

export default function Index() {
  const [hotels, setHotels] = useState([])

  useEffect(() => {
    setHotels(listActiveHotels())
  }, [])

  return (
    <View className='container'>
      <View className='title'>EasyStay 移动端</View>
      <View className='sub'>当前为纯前端演示数据</View>

      <View className='block'>
        <Text>可预订酒店：{hotels.length} 家</Text>
      </View>

      {hotels.map((h) => (
        <View key={h._id} className='hotel'>
          <View className='hotel-name'>{h.name}</View>
          <View className='hotel-meta'>{h.city} · {h.star} 星 · ¥{h.basePrice}/晚</View>
        </View>
      ))}
    </View>
  )
}

