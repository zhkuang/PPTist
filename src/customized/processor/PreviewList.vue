<template>
  <div class="preview-list">
    <p class="preview-list-title">
      <span>{{label + '(' + language + ')'}}</span>
      <span class="export-btn" @click="exportImg">导出</span>
      <span class="export-btn" @click="startTranslate">开始翻译</span>
    </p>
    <div ref="imageThumbnailsRef" class="preview-wrapper">
      <div class="preview-item-wrapper" v-for="(item, index) in previewList" :key="index">
        <screen-slide
          class="preview-item"
          :language="language"
          :slide="item.slide"
          :size="1000"
          :translating="translating"
          :animationIndex="item.animationIndex"
          :turnSlideToId="turnSlideToId"
          :manualExitFullscreen="manualExitFullscreen"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useSlidesStore} from '@/store'
import {storeToRefs} from 'pinia'
import {computed, onMounted, ref, watchEffect} from 'vue'
import ScreenSlide from '@/customized/views/Screen/ScreenSlide.vue'
import useExport from "@/hooks/useExport";

const imageThumbnailsRef = ref<HTMLElement>()
const { exportImage, exporting } = useExport()
const slidesStore = useSlidesStore()
const { slides } = storeToRefs(slidesStore)

const props = defineProps<{
  language: string,
  label: string,
}>()

const translating = ref(false)

const previewList = computed(() => {
  const list = []
  slides.value.forEach(slide => {
    list.push({
      slide: slide,
      animationIndex: 0,
    })
    if (slide.animations && slide.animations.length > 0) {
      slide.animations.forEach((animation, index) => {
        list.push({
          slide: JSON.parse(JSON.stringify(slide)),
          animationIndex: index + 1,
        })
      })
    }
  })
  return list
})

const exportImg = () => {
  if (!imageThumbnailsRef.value) return
  exportImage(imageThumbnailsRef.value, 'jpeg', 1, true)
}

const startTranslate = () => {
  translating.value = true
}

const turnSlideToId = (id: string) => {
}

const manualExitFullscreen = () => {
}

</script>

<style lang="scss" scoped>
.preview-list {
  text-align: center;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  .preview-list-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .export-btn {
    cursor: pointer;
    color: #409eff;
    margin-left: 20px;
  }
}
</style>
