<template>
  <tr>
    <td>
      {{ msg }}
    </td>
    <td>
      {{ expiration }}
    </td>
    <td>
      {{ days }}
    </td>
  </tr>
</template>

<script>
export default {
  name: "DateComponent",
  data() {
    return {date: new Date()}
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
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const target = new Date(this.date);
      target.setDate(target.getDate() + this.days);
      return `(${months[target.getMonth()]}) ${target.getMonth() + 1}/${target.getDate()}/${target.getFullYear()}`;
    },
  },
};
</script>
