<template>
  <tr>
    <td class="left-align">
      <span class="bold">{{ msg }}</span>
    </td>
    <td class="center-align" style="white-space: nowrap; font-variant-numeric: tabular-nums;">
      <span class="secondary-text" style="font-size: 0.85em;">({{ month }})</span>
      <span class="bold" style="margin-left: 4px;">{{ formattedDate }}</span>
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
