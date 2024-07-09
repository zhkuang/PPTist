<template>
  <div class="main-wrapper">
    <div class="main-content">
      <FileInput accept=".pptist"  @change="files => {
            importSpecificFile(files)
          }">
        <PopoverMenuItem><span style="cursor: pointer;color: #1b89ff;">点击选择 pptist 文件</span></PopoverMenuItem>
      </FileInput>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import useImport from "@/customized/hooks/useImport";

import FileInput from '@/components/FileInput.vue'

const { importSpecificFile } = useImport()

onMounted(() => {
  console.log('Processor is mounted')
})
</script>

<style scoped>
.main-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0;
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
}
</style>
