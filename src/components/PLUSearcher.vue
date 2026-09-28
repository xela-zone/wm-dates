<template>
  <div class="plu-searcher-view">
    <!-- Generated Barcode Display Card -->
    <div
      v-if="showenPlu"
      class="card padding center-align margin"
      @click="showenPlu = null"
      style="cursor: pointer;"
    >
      <h6 class="no-margin">
        Produce Barcode: <span class="bold primary-text" style="font-size: 1.4rem;">{{ showenPlu }}</span>
      </h6>
      <div class="center-align padding margin" style="background: #ffffff; border-radius: 8px; display: inline-block;">
        <vueBarcode
          :value="showenPlu"
          :options="{ width: 2, height: 90, text: showenPlu, format: 'UPC', lineColor: '#000000', background: '#ffffff' }"
        />
      </div>
      <div>
        <button class="border small">
          <i>close</i>
          <span>Tap to Dismiss</span>
        </button>
      </div>
    </div>
    <div v-else class="card padding center-align margin surface-variant">
      <p class="secondary-text no-margin">Search produce below and tap any entry to generate its scannable barcode.</p>
    </div>

    <Searcher @showBarcode="showBarcode" />
  </div>
</template>

<script>
import Searcher from "./searcher.vue";
import vueBarcode from '@chenfengyuan/vue-barcode';

export default {
  name: "PLUSearcher",
  components: {
    Searcher,
    vueBarcode,
  },
  data() {
    return {
      showenPlu: null,
    };
  },
  methods: {
    showBarcode(pluNumber) {
      this.showenPlu = pluNumber.toString().padStart(11, '0');
    }
  }
};
</script>
