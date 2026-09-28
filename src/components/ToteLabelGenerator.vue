<template>
  <div class="tote-generator">
    <p class="secondary-text" style="margin-bottom: 12px;">Enter staging letter and 5-digit number to generate the tote QR barcode:</p>

    <div class="grid no-margin" style="gap: 12px; margin-bottom: 16px;">
      <div class="s4 m3 field label border">
        <input
          maxlength="1"
          type="text"
          :value="letter"
          @input="letterHandler"
          style="text-transform: uppercase; text-align: center; font-size: 1.3rem; font-weight: bold;"
          placeholder=" "
        >
        <label>Letter</label>
      </div>

      <div class="s8 m9 field label border">
        <input
          maxlength="5"
          ref="numberInput"
          type="number"
          inputmode="numeric"
          :value="number"
          @input="numberHandler"
          style="font-size: 1.3rem; font-weight: bold; letter-spacing: 2px;"
          placeholder=" "
        >
        <label>5-Digit Tote Number</label>
      </div>
    </div>

    <!-- Scannable Barcode Container (Matches Theme) -->
    <div
      v-if="validTote"
      class="card padding center-align margin"
      @click="reset"
      style="cursor: pointer;"
    >
      <h6 class="no-margin">
        Tote: <span class="bold primary-text" style="font-size: 1.6rem;">{{ toteNumber }}</span>
      </h6>
      <div class="center-align padding">
        <qrcode-vue
          render-as="svg"
          background="transparent"
          :foreground="prefersDark ? '#ffffff' : '#000000'"
          :value="toteNumber"
          :margin="2"
          :size="260"
        ></qrcode-vue>
      </div>
      <button class="border small">
        <i>refresh</i>
        <span>Tap to Reset</span>
      </button>
    </div>

    <div v-else class="card padding center-align margin surface-variant">
      <p class="secondary-text no-margin">Enter 1 letter and a number above to generate the tote barcode.</p>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';

export default {
  name: "ToteLabelGenerator",
  props: {
    prefersDark: Boolean,
  },
  components: {
    QrcodeVue,
  },
  data() {
    return {
      letter: '',
      number: null,
    };
  },
  computed: {
    toteNumber() {
      return this.letter.toUpperCase() + (this.number != null ? String(this.number).padStart(5, '0') : '');
    },
    validTote() {
      return this.letter.length === 1 && this.number > 0;
    }
  },
  methods: {
    reset() {
      this.number = null;
      this.$refs.numberInput?.focus();
    },
    letterHandler(e) {
      this.letter = e.target.value.toUpperCase();
      localStorage.setItem('tote-letter', this.letter);
      if (this.letter.length === 1) {
        this.$refs.numberInput?.focus();
      }
    },
    numberHandler(e) {
      this.number = e.target.value;
      if (this.number && String(this.number).length === 5) {
        this.$refs.numberInput?.blur();
      }
    }
  },
  mounted() {
    this.letter = localStorage.getItem('tote-letter') || '';
  }
};
</script>