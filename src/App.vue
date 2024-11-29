<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {})
onShow(() => {})
onHide(() => {})
</script>
<style lang="scss">
@import url('@/static/iconfont/iconfont.css');
page {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}
@font-face {
  font-family: 'Pen';
  src: url('./static/fonts/粗钢体.ttf') format('truetype');
}

@font-face {
  font-family: 'Handwriting';
  src: url('./static/fonts/手写体.ttf') format('truetype');
}

@font-face {
  font-family: 'Pix';
  src: url('./static/fonts/像素字体.ttf') format('truetype');
}
</style>
