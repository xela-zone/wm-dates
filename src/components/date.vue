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
  name: "HelloWorld",
  props: {
    msg: String,
    days: Number,
  },
  computed: {
    expiration() {
      var result = new Date();
      result.setDate(result.getDate() + this.days);
      return `${result.getMonth()}/${result.getDate()}/${result.getFullYear()}`;
    },
  },
};
</script>
