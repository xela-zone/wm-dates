<template>
  <table>
    <thead>
      <td>Days</td>
      <td>Earliest Expiration</td>
      <td>Category</td>
    </thead>
    <tbody>
      <DateComponent :days="2" msg="Deli, Bakery bread" />
      <DateComponent :days="3" msg="meat and sea food, produce" />
      <DateComponent :days="5" msg="Commercial bread" />
      <DateComponent :days="7" msg="Dairy, 97 wall" />
      <DateComponent :days="30" msg="Frozen, Pharmacy, Dry Grocery" />
    </tbody>
  </table>
</template>

<script>
import DateComponent from "./components/date.vue";

export default {
  name: "App",
  components: {
    DateComponent,
  },
};
</script>
