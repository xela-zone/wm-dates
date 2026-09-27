<template>
  <tr>
    <td>
      Day of the Year
    </td>
    <td>
    </td>
    <td>
      {{ julianDate }}
    </td>
  </tr>
</template>

<script>
export default {
  name: "JulianComponent",
  data() {
    return {
      date: new Date()
    };
  },
  props: {
    msg: String,
  },
  computed: {
    julianDate() {
      const now = this.date;
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
      const oneDay = 1000 * 60 * 60 * 24;
      const day = Math.floor(diff / oneDay);
      return `${day}`;
    },
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
};
</script>
