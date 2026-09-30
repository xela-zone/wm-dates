<template>
  <tr>
    <td class="left-align">
      <span class="bold">{{ msg }}</span>
    </td>
    <td class="center-align" style="white-space: nowrap; font-variant-numeric: tabular-nums;">
      <span
        class="chip small primary bold"
        style="margin: 0 6px 0 0; padding: 0 6px; height: 22px; line-height: 22px; font-size: 0.75rem; letter-spacing: 0.5px;"
      >{{ month.toUpperCase() }}</span>
      <span class="bold" style="font-size: 1.05rem;">{{ formattedDate }}</span>
    </td>
    <td class="right-align" style="white-space: nowrap;">
      <span class="chip small surface-variant bold">{{ days }}d</span>
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
    targetDate() {
      const now = this.date;
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + this.days);
    },
    month() {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months[this.targetDate.getMonth()];
    },
    formattedDate() {
      const t = this.targetDate;
      return `${t.getMonth() + 1}/${t.getDate()}/${t.getFullYear()}`;
    }
  }
};
</script>
