<template>

  <h2>Generate a Tote Label</h2>
  <div style="display: flex;">
    <input maxlength=1 type="search" :value="letter" @input="letterHandler" style="width: 2em;"
      placeholder="Set the Letter for the Tote...">
    <input maxlength=5 ref="numberInput" type="number" inputmode="numeric" :value="number"
      @input="e => { number = e.target.value; if (number.length === 5) { this.$refs.numberInput.blur() } }"
      placeholder="Set the Numbers for the Tote...">
  </div>

  <qrcode-vue v-if="validTote" :background="prefersDark ? '#202b38' : '#fff'"
    @click="reset" :foreground="prefersDark ? '#dbdbdb' : '#363636'"
    :value="toteNumber" :margin="2" :size="350"></qrcode-vue>

  <br>

</template>

<script>
import QrcodeVue from 'qrcode.vue'

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
    }
  },
  computed: {
    toteNumber() {
      return this.letter + (this.number != null ? String(this.number).padStart(5, '0') : '')
    },
    validTote() {
      return this.letter.length === 1 && this.number > 0
    }
  },

  methods: {
    reset() {
      this.number = null;
      this.$refs.numberInput?.focus();
    },
    letterHandler(e) {
      this.letter = e.target.value
      localStorage.setItem('tote-letter', this.letter)
      if (this.letter.length === 1) {
        this.$refs.numberInput.focus()
      }
    }
  },
  mounted() {
    this.letter = localStorage.getItem('tote-letter') || ''
  }
};
</script>