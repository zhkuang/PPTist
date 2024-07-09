<template>
  <div
    class="base-element-text"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
    >
      <div
        class="element-content"
        :style="{
          width: elementInfo.vertical ? 'auto' : elementInfo.width + 'px',
          height: elementInfo.vertical ? elementInfo.height + 'px' : 'auto',
          backgroundColor: elementInfo.fill,
          opacity: elementInfo.opacity,
          textShadow: shadowStyle,
          lineHeight: elementInfo.lineHeight,
          letterSpacing: (elementInfo.wordSpace || 0) + 'px',
          color: elementInfo.defaultColor,
          fontFamily: elementInfo.defaultFontName,
          writingMode: elementInfo.vertical ? 'vertical-rl' : 'horizontal-tb',
        }"
      >
        <ElementOutline
          :width="elementInfo.width"
          :height="elementInfo.height"
          :outline="elementInfo.outline"
        />
        <div
          ref="textElement"
          class="text ProseMirror-static"
          :class="{ 'thumbnail': target === 'thumbnail' }"
          :style="{
            '--paragraphSpace': `${elementInfo.paragraphSpace === undefined ? 5 : elementInfo.paragraphSpace}px`,
          }"
          v-html="content"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, watchEffect} from 'vue'
import type { PPTTextElement } from '@/types/slides'
import ElementOutline from '@/views/components/element/ElementOutline.vue'

import useElementShadow from '@/views/components/element/hooks/useElementShadow'
import { translates } from "@/customized/utils/translate";

const props = defineProps<{
  language?: string
  elementInfo: PPTTextElement
  target?: string
}>()

const cacheContent = ref(props.elementInfo.content)
const content = ref(props.elementInfo.content)
const textElement = ref()

const translateContent = async () => {
  if (!textElement.value) {
    return
  }
  const dom = textElement.value
  const treeWalker = document.createTreeWalker(dom, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  const texts = [];
  while(treeWalker.nextNode()) {
    textNodes.push(treeWalker.currentNode);
    texts.push(treeWalker.currentNode.nodeValue);
    treeWalker.currentNode.nodeValue = '翻译中...'
  }
  const rsl = await translates(texts, props.language || 'en')
  if (rsl && rsl.length === textNodes.length) {
    textNodes.forEach((node, index) => {
      node.nodeValue = rsl[index];
    });
  } else {
    console.error('翻译结果与文本节点数量不匹配');
  }
}

watchEffect(() => {
  if (props.elementInfo.content === cacheContent.value) {
    return
  }
  cacheContent.value = props.elementInfo.content
  content.value = props.elementInfo.content

  nextTick(() => {
    translateContent()
  })
})

const shadow = computed(() => props.elementInfo.shadow)
const { shadowStyle } = useElementShadow(shadow)
</script>

<style lang="scss" scoped>
.base-element-text {
  position: absolute;
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
}
.element-content {
  position: relative;
  padding: 10px;
  line-height: 1.5;
  word-break: break-word;

  .text {
    position: relative;

    &.thumbnail {
      pointer-events: none;
    }
  }
}
</style>
