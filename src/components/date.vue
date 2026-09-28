<template>
  <tr>
    <td class="left-align">
      <b>{{ msg }}</b>
    </td>
    <td class="left-align">
      {{ expiration }}
    </td>
    <td class="right-align">
      <span class="chip small surface-variant">{{ days }}d</span>
    </td>
  </tr>
</template>

<script>
export default {
  name: "DateComponent",
  data() {
    return { date: new Date() }
  },
  mounted() {
    this._timer = setInterval(() => {
      this.date = new Date();
    }, 1000 * 60);
  },
  beforeUnmount() {
    if (this._timer) {
      clearInterval(this._timer);
    }
  },
  props: {
    msg: String,
    days: Number,
  },
  computed: {
    expiration() {
      const now = this.date;
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + this.days);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[target.getMonth()];
      const day = target.getDate();
      const year = target.getFullYear();
      return `(${month}) ${target.getMonth() + 1}/${day}/${year}`;
    }
  }
};
</script>
