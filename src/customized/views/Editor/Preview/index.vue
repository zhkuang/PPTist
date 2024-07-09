<template>
  <div class="remark">
    <div
      class="resize-handler"
      @mousedown="$event => resize($event)"
    ></div>
    <div class="preview-panel">
      <div class="preview-wrapper" v-for="item in previewList" :key="item.languageCode">
        <p>{{item.language}}</p>
        <thumbnail-slide
          class="preview-item"
          :language="item.languageCode"
          :slide="item.slide"
          :size="450"
          :visible="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import ThumbnailSlide from '@/customized/views/Editor/Preview/ThumbnailSlide/index.vue'

const props = defineProps<{
  height: number
}>()

const emit = defineEmits<{
  (event: 'update:height', payload: number): void
}>()

const slidesStore = useSlidesStore()
const { currentSlide } = storeToRefs(slidesStore)

const previewList = computed(() => {
  return [{
    language: '英文',
    languageCode: 'en',
    slide: currentSlide.value
  }, {
    language: '日文',
    languageCode: 'jp',
    slide: currentSlide.value
  }]
})

const resize = (e: MouseEvent) => {
  let isMouseDown = true
  const startPageY = e.pageY
  const originHeight = props.height

  document.onmousemove = e => {
    if (!isMouseDown) return

    const currentPageY = e.pageY

    const moveY = currentPageY - startPageY
    let newHeight = -moveY + originHeight

    if (newHeight < 40) newHeight = 40
    if (newHeight > 360) newHeight = 360

    emit('update:height', newHeight)
  }

  document.onmouseup = () => {
    isMouseDown = false
    document.onmousemove = null
    document.onmouseup = null
  }
}
</script>

<style lang="scss" scoped>
.remark {
  position: relative;
  border-top: 1px solid $borderColor;
}
.resize-handler {
  height: 7px;
  position: absolute;
  top: -3px;
  left: 0;
  right: 0;
  cursor: n-resize;
  z-index: 2;
}
.preview-panel {
  display: flex;
  flex-wrap: nowrap;
  padding: 10px;
  flex-direction: row;
  overflow: auto hidden;
  .preview-wrapper {
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: #cccccc 0 0 10px;
    padding-top: 10px;
    .preview-item {
      margin-top: 10px;
      border: 1px solid $borderColor;
    }
  }
}
</style>
