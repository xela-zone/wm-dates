<template>
  <tr>
    <td>
      {{ days }}
    </td>
    <td>
      {{ expiration }}
    </td>
    <td>
      {{ msg }}
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
