<template>
  <view class="file-picker flex">
    <template v-if="props.showList">
      <view class="file-picker__box" v-for="(url, index) in urls" :key="index">
        <view class="file-picker__box-content">
          <view class="file-picker__box-content-body">
            <image
              v-if="props.mediaType.includes('image')"
              class="media"
              :src="url"
              mode="aspectFill"
              @click.stop="prviewImage(index)"></image>
            <video v-else class="media" :src="url" controls></video>
            <view
              class="icon-del-box flex items-center justify-center"
              @click.stop="removeFile(index)">
              <text class="iconfont icon-shanchu"></text>
            </view>
          </view>
        </view>
      </view>
    </template>
    <view
      v-if="props.self || urls.length < maxCount"
      class="file-picker__box"
      @click="chooseFile">
      <view class="file-picker__box-content">
        <view
          class="file-picker__box-content-body flex items-center justify-center">
          <slot v-if="!props.self || !urls.length">
            <text class="iconfont icon-add1"></text>
          </slot>
          <image
            v-else
            class="media"
            :src="urls.at(-1)"
            mode="widthFix"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { upload } from '@/utils'
import type { MediaTypeValue } from '@/utils/interface'

export interface Props {
  // 上传路径
  action: string
  // 媒体类型
  mediaType: MediaTypeValue[]
  // 是否自动上传
  autoUpload?: boolean
  // 是否在选择器自身上显示
  self?: boolean
  // 数量限制，默认9
  limit?: number
  // 是否禁用
  disabled?: boolean
  // 是否显示图片列表
  showList?: boolean
  // 是否可以预览
  preview?: boolean
}

const props = defineProps<Props>()

const value = defineModel<string[] | string>({ required: true })

const isArray = computed(() => typeof value.value === 'object')

const maxCount = computed(() => {
  if (props.self || !isArray.value) return 1
  return props.limit || 9
})

const urls = computed(() => {
  if (isArray.value) return value.value as string[]
  return value.value ? [value.value as string] : []
})

/**
 * 图片预览
 * @param index 预览起始索引
 */
const prviewImage = (index: number) => {
  if (props.mediaType.includes('video') || !props.preview) return
  uni.previewImage({
    urls: urls.value,
    current: index,
  })
}

/**
 * 删除文件
 * @param index 索引
 */
const removeFile = (index: number) => {
  isArray.value
    ? (value.value as string[]).splice(index, 1)
    : (value.value = '')
}

/**
 * 重新赋值
 * @param urls 文件路径
 */
const setValue = (urls: string[]) => {
  if (props.self) {
    value.value = isArray.value ? urls.slice(-1) : (urls.at(-1) as string)
  } else {
    value.value = isArray.value
      ? [...value.value, ...urls].slice(-maxCount.value)
      : (urls.at(-1) as string)
  }
}

const chooseFile = async () => {
  try {
    if (props.disabled) return
    const count = isArray.value
      ? maxCount.value - urls.value.length
      : maxCount.value
    const res = await uni.chooseMedia({
      count,
      mediaType: props.mediaType,
      // 视频可拍摄长度，单位s
      maxDuration: 30,
    })
    let tempFiles = (res as any).tempFiles as any[]
    tempFiles = tempFiles.map(item => item.tempFilePath)
    if (!props.autoUpload) return setValue(tempFiles)
    const promiseArr = upload({
      action: props.action,
      tempFilePaths: tempFiles,
    })
    const result = await Promise.all(promiseArr || [])
    setValue(result)
  } catch (error: any) {
    uni.showToast({ title: error.errMsg, icon: 'none' })
  }
}
</script>

<style lang="scss">
.file-picker {
  flex-wrap: wrap;
  gap: $uni-spacing-row-base;
  box-sizing: border-box;
  &__box {
    flex-shrink: 0;
    width: 240rpx;
    &-content {
      overflow: hidden;
      position: relative;
      height: 0;
      padding-top: 100%;
      border-radius: $uni-border-radius-lg;
      background-color: $uni-bg-color-grey;
      &-body {
        position: absolute;
        inset: 0;
        .icon-add1 {
          color: $uni-text-color-grey;
          font-size: 60rpx;
        }
        .media {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .icon-del-box {
          position: absolute;
          top: 0;
          right: 0;
          height: 30rpx;
          width: 30rpx;
          color: #fff;
          border-bottom-left-radius: $uni-border-radius-lg;
          background-color: $uni-bg-color-mask;
          .icon-shanchu {
            font-size: $uni-font-size-sm;
          }
        }
      }
    }
  }
}
</style>
