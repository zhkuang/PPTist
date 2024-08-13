<template>
  <div class="main-wrapper">
    <div class="main-content" v-if="isEmptySlide">
      <FileInput accept=".pptist"  @change="files => {
            importSpecificFile(files)
          }">
        <span style="cursor: pointer;color: #1b89ff;">点击选择 pptist 文件</span>
      </FileInput>
    </div>
    <div class="preview-wrapper" v-else>
      <preview-list v-for="language in LanguageInfos" :key="language.lang" :language="language.lang" :label="language.label" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watchEffect} from 'vue'
import {LanguageInfos} from '@/customized/store/dictionary'
import useImport from '@/customized/hooks/useImport'
import FileInput from '@/components/FileInput.vue'
import PreviewList from '@/customized/processor/PreviewList.vue'
import {storeToRefs} from 'pinia'
import {useSlidesStore} from '@/store'
import useSlideHandler from "@/hooks/useSlideHandler";
import useAddSlidesOrElements from "@/hooks/useAddSlidesOrElements";

const { importSpecificFile } = useImport()
const { resetSlides } = useSlideHandler()
const { isEmptySlide } = useAddSlidesOrElements()
const { slides } = storeToRefs(useSlidesStore())

onMounted(() => {
  resetSlides()
})
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0;
  overflow: auto;
  .main-content {
    width: 400px;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    box-shadow: #5d5a5a 0 0 10px;
    border-radius: 10px;
  }
  .preview-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow: auto;
    padding: 10px;
    gap: 10px;
  }
}
</style>
