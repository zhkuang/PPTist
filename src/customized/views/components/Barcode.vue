<template>
  <div>
    <canvas ref="canvas" width="200" height="30"></canvas>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import bwipjs from 'bwip-js';

export default {
  props: {
    barcode: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const canvas = ref(null);

    watchEffect(() => {
      if (canvas.value) {
        bwipjs.toCanvas(canvas.value, {
          bcid: 'code128',
          text: props.barcode.toString(),
          scale: 3,
          height: 30,
          barcolor: '#000000',
          includetext: true,
          textxalign: 'center',
        });
      }
    });

    return { canvas };
  }
}
</script>
