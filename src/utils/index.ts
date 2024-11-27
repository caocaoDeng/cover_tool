import { GenderType } from './interface'
import type { GenderValue, MediaTypeValue } from './interface'

/**
 * 格式化性别
 * @param value
 * @returns
 */
export const formateGender = (value: GenderValue): string => {
  return GenderType.filter(item => item.value === value)
    .map(item => item.label)
    .join('')
}

/**
 * 文件上传
 * @param action 上传路径
 * @param type 文件类型
 * @param tempFilePaths 临时文件路径
 * @returns Promise<string>[] | undefined
 */
export const upload = ({
  action,
  type = 'image',
  tempFilePaths,
}: {
  action: string
  type?: MediaTypeValue
  tempFilePaths: string[]
}) => {
  try {
    return tempFilePaths.map(async filePath => {
      // 文件名
      const name = 'jingoudiao'.toUpperCase()
      // 随机字符串
      const randomStr = Math.random().toString(16).slice(-6).toUpperCase()
      // 文件名后缀
      const suffix = filePath.split('.')[1]
      // 时间戳
      const timeStamp = new Date().valueOf()
      // 获取媒体宽高信息
      const { width, height } =
        type === 'image'
          ? await uni.getImageInfo({ src: filePath })
          : await uni.getVideoInfo({ src: filePath })
      const result = await uniCloud.uploadFile({
        filePath,
        cloudPath: `${action}/${name}-${randomStr}_${timeStamp}.${suffix}`,
        cloudPathAsRealPath: true,
      })
      return `${result.fileID}?width=${width}&height=${height}`
    })
  } catch (error: any) {
    uni.showToast({ title: error.message, icon: 'none' })
  }
}
