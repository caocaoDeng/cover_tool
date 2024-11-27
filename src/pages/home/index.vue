<template>
  <view class="home">
    <view class="preview" :style="cssVariable">
      <image v-if="form.cover" :src="form.cover"></image>
      <view class="debris">
        <view class="debris-item" v-for="item in count"></view>
      </view>
      <text class="text"></text>
    </view>
    <view class="setting">
      <view class="area">
        <view class="name">背景</view>
        <form class="form inline-block">
          <view class="form-item">
            <view class="form-item-label">封面</view>
            <view class="form-item-content">
              <FilePick
                v-model="form.cover"
                action=""
                :mediaType="['image']"></FilePick>
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-label">行:</view>
            <view class="form-item-content warp">
              <view
                class="item"
                v-for="item in 3"
                :key="item"
                @click="setLayout('rows', item)">
                {{ item }}
              </view>
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-label">列:</view>
            <view class="form-item-content warp">
              <view
                class="item"
                v-for="item in 3"
                :key="item"
                @click="setLayout('cols', item)">
                {{ item }}
              </view>
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-label">透明度:</view>
            <view class="form-item-content">
              <slider v-model="form.alpha" :min="0" :max="100" :step="1" />
            </view>
          </view>
        </form>
      </view>
      <view class="area">
        <view class="name">文本</view>
        <form class="form inline-block">
          <view class="form-item">
            <view class="form-item-label">内容:</view>
            <view class="form-item-content">
              <input type="text" v-model="form.text" />
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-label">透明度:</view>
            <view class="form-item-content">
              <slider v-model="form.textAlpha" :min="0" :max="100" :step="1" />
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-label">字体:</view>
            <view class="form-item-content">
              <picker
                :value="curFontIndex"
                :range="fontList"
                @change="onFontChange">
                <view>{{ fontList[curFontIndex] }}</view>
              </picker>
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-label">字体大小:</view>
            <view class="form-item-content">
              <slider v-model="form.fontSize" :min="12" :max="40" :step="2" />
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-label">字体颜色:</view>
            <view class="form-item-content">
              <input type="color" v-model="form.color" />
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-label">字体粗细:</view>
            <view class="form-item-content warp">
              <view
                class="item"
                v-for="{ label, value } in fontWeight"
                :key="value"
                @click="setFontWeight(value)">
                {{ label }}
              </view>
            </view>
          </view>
        </form>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import FilePick from '@/components/FilePick.vue'

type FontFamily = (typeof fontList)[number]

type FontWeightValue = (typeof fontWeight)[number]['value']

interface FormValue {
  rows: number
  cols: number
  cover: string
  alpha: number
  text: string
  color: string
  textAlpha: number
  fontFamily: FontFamily
  fontSize: number
  fontWeight: FontWeightValue
}

const fontList = reactive<string[]>(['1', '2', '3'] as const)

const fontWeight = reactive([
  {
    label: 'normal',
    value: 'normal',
  },
  {
    label: '加粗',
    value: 'bold',
  },
  {
    label: '更粗',
    value: 'bolder',
  },
  {
    label: '更细',
    value: 'lighter',
  },
] as const)

const curFontIndex = ref<number>(0)

const form = reactive<FormValue>({
  rows: 1,
  cols: 3,
  cover: '',
  alpha: 100,
  text: '',
  color: '',
  textAlpha: 100,
  fontSize: 16,
  fontFamily: '1',
  fontWeight: 'normal',
})

const count = computed(() => form.rows * form.cols)

const cssVariable = computed(() => {
  const {
    rows,
    cols,
    alpha,
    color,
    textAlpha,
    fontSize,
    fontFamily,
    fontWeight,
  } = form
  return {
    '--rows': rows,
    '--cols': cols,
    '--alpha': alpha / 100,
    '--textColor': color,
    '--textAlpha': textAlpha,
    '--fontSize': `${fontSize}px`,
    '--fontFamily': fontFamily,
    '--fontWeight': fontWeight,
  }
})

watch(
  curFontIndex,
  (value: number) => {
    form.fontFamily = fontList.find((_, index) => index === value) as FontFamily
  },
  { immediate: true }
)

const setLayout = (type: 'rows' | 'cols', value: number) => (form[type] = value)

const onFontChange = (e: any) => (curFontIndex.value = e.detail.value)

const setFontWeight = (value: FontWeightValue) => (form.fontWeight = value)
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: $uni-bg-color-grey;
}
.preview {
  position: relative;
  height: 0;
  padding-top: 60%;
  border: 1px dashed;
  image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: var(--alpha);
  }
  .debris {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-rows: repeat(var(--rows), 1fr);
    grid-template-columns: repeat(var(--cols), 1fr);
  }
  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgba(var(--textColor), var(--textAlpha));
    font-family: var(--fontFamily);
    font-size: var(--fontSize);
    font-weight: var(--fontWeight);
  }
}
.setting {
  flex: 1;
  padding: $uni-spacing-col-base $uni-spacing-row-base;
}
.area {
  .name {
    font-size: $uni-font-size-lg;
    font-weight: 500;
  }
  .warp {
    display: grid;
    gap: $uni-spacing-row-lg;
    grid-template-columns: repeat(4, 1fr);
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $uni-text-color-grey;
      border: 1px solid $uni-border-color;
      border-radius: $uni-border-radius-lg;
    }
  }
}
.form {
  display: block;
  &-item {
    padding: $uni-spacing-col-lg 0;
    &-label {
      height: max-content;
      font-size: $uni-font-size-base;
      padding: $uni-spacing-col-base $uni-spacing-row-base $uni-spacing-col-base
        0;
    }
  }
  &.inline-block {
    .form-item {
      display: flex;
      &-content {
        flex: 1;
      }
    }
  }
}
</style>
