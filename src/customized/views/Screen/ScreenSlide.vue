<template>
  <div
    class="screen-slide"
    :style="{
      width: VIEWPORT_SIZE + 'px',
      height: VIEWPORT_SIZE * viewportRatio + 'px',
      transform: `scale(${scale})`,
    }"
  >
    <div class="background" :style="{ ...backgroundStyle }"></div>
    <ScreenElement
      v-for="(element, index) in elements"
      :key="element.id"
      :elementInfo="element"
      :elementIndex="index + 1"
      :animationIndex="animationIndex"
      :turnSlideToId="turnSlideToId"
      :manualExitFullscreen="manualExitFullscreen"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, provide, watchEffect, ref} from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { Slide } from '@/types/slides'
import { injectKeySlideId } from '@/types/injectKey'
import { VIEWPORT_SIZE } from '@/configs/canvas'
import useSlideBackgroundStyle from '@/hooks/useSlideBackgroundStyle'

import ScreenElement from '@/views/Screen/ScreenElement.vue'
import {translatesWithAi} from "@/customized/utils/translate";

const props = defineProps<{
  slide: Slide
  size: number
  language: string
  animationIndex: number
  turnSlideToId: (id: string) => void
  manualExitFullscreen: () => void
}>()

const scale = computed(() => props.size / VIEWPORT_SIZE)
const { viewportRatio } = storeToRefs(useSlidesStore())

const background = computed(() => props.slide.background)
const { backgroundStyle } = useSlideBackgroundStyle(background)

const slideId = computed(() => props.slide.id)
provide(injectKeySlideId, slideId)

let elements = ref(props.slide.elements)

watchEffect(async () => {
  const texts = []
  const elementIds = []
  props.slide.elements.forEach((element, index) => {
    if (element.type === 'text' && element.content) {
      texts.push(element.content)
      elementIds.push(element.id)
    }
  })
  try {
    const translatedTexts = await translatesWithAi(texts, props.language);
    elements.value = elements.value.map((element) => {
      const idx = elementIds.indexOf(element.id);
      if (idx !== -1) {
        return {
          ...element,
          content: translatedTexts[idx] || '<span style="color: red;">翻译失败</span>'
        };
      }
      return element;
    });
  } catch (error) {
    console.error("Error translating texts:", error);
  }
})
</script>

<style lang="scss" scoped>
.screen-slide {
  transform-origin: 0 0;
  overflow: hidden;
  position: relative;
}
.background {
  width: 100%;
  height: 100%;
  background-position: center;
  position: absolute;
}
</style>
