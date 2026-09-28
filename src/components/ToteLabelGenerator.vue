<template>
  <div class="tote-generator">
    <div class="row middle margin">
      <h5 class="max bold">Generate a Tote Label</h5>
      <span class="badge surface-variant">OPD</span>
    </div>

    <p class="secondary-text">Enter staging letter and 5-digit number to generate the tote QR barcode:</p>

    <div class="row margin middle" style="gap: 12px;">
      <div class="field label border round" style="max-width: 110px;">
        <input
          maxlength="1"
          type="text"
          :value="letter"
          @input="letterHandler"
          style="text-transform: uppercase; text-align: center; font-size: 1.5rem; font-weight: bold;"
          placeholder=" "
        >
        <label>Letter</label>
      </div>

      <div class="field label border round max">
        <input
          maxlength="5"
          ref="numberInput"
          type="number"
          inputmode="numeric"
          :value="number"
          @input="numberHandler"
          style="font-size: 1.5rem; font-weight: bold; letter-spacing: 2px;"
          placeholder=" "
        >
        <label>5-Digit Tote Number</label>
      </div>
    </div>

    <div v-if="validTote" class="card padding center-align margin" @click="reset" style="cursor: pointer;">
      <h6>Tote Code: <span class="bold primary-text">{{ toteNumber }}</span></h6>
      <div class="center-align padding">
        <qrcode-vue
          :background="prefersDark ? '#202b38' : '#fff'"
          :foreground="prefersDark ? '#dbdbdb' : '#363636'"
          :value="toteNumber"
          :margin="2"
          :size="280"
        ></qrcode-vue>
      </div>
      <button class="border small margin">
        <i>refresh</i>
        <span>Tap to Reset</span>
      </button>
    </div>
    <div v-else class="card padding center-align margin surface-variant">
      <p>Enter 1 letter and a number above to generate the tote barcode.</p>
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