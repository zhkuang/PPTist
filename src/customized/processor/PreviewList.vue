<template>
  <div class="preview-list">
    <p class="preview-list-title">{{label + '(' + language + ')'}}</p>
    <div class="preview-wrapper" v-for="(item, index) in slides" :key="index">
      <thumbnail-slide
          class="preview-item"
          :language="language"
          :slide="item"
          :size="450"
          :visible="true"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useSlidesStore} from '@/store'
import {storeToRefs} from 'pinia'
import {computed} from 'vue'
import ThumbnailSlide from '@/customized/views/Editor/Preview/ThumbnailSlide/index.vue'

const slidesStore = useSlidesStore()
const { slides } = storeToRefs(slidesStore)

const props = defineProps<{
  language: string,
  label: string,
}>()

const previewList = computed(() => {
  return slides.value.map(slide => {
    return {
      slide: slide
    }
  })
})

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
}
</style>