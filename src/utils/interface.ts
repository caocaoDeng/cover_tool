import iconImg from '@/static/icon-img.png'
import iconVideo from '@/static/icon-video.png'

// 性别类型
export const GenderType = [
  {
    label: '未知',
    value: 0,
    color: '#999999',
    icon: 'icon-icon1',
  },
  {
    label: '男',
    value: 1,
    color: '#2b97d0',
    icon: 'icon-icon1',
  },
  {
    label: '女',
    value: 2,
    color: '#ff3ec9',
    icon: 'icon-icon',
  },
] as const

export type Gender = (typeof GenderType)[number]

export type GenderValue = (typeof GenderType)[number]['value']

// 作品上传的媒体类型
export const MediaType = [
  {
    type: 'image',
    name: '图片',
    icon: iconImg,
  },
  {
    type: 'video',
    name: '视频',
    icon: iconVideo,
  },
] as const

export type MediaTypeValue = (typeof MediaType)[number]['type']
