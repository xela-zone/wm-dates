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
    self.setInterval(() => {this.date = new Date()}, 1000*60)

  },
  props: {
    msg: String,
    days: Number,
  },
  computed: {
    expiration() {
      this.date.setDate(this.date.getDate() + this.days);
      return `${this.date.getMonth() + 1 }/${this.date.getDate()}/${this.date.getFullYear()}`;
    },
  },
};
</script>
