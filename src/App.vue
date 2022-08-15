<template>
  <table>
    <thead>
      <td>Category</td>
      <td>Earliest Expiration</td>
      <td>Days</td>
    </thead>
    <tbody>
      <DateComponent :days="0" msg="today"/>
      <DateComponent :days="1" msg="Doughnuts" />
      <DateComponent :days="2" msg="Deli, Bakery bread" />
      <DateComponent :days="3" msg="meat and sea food, produce" />
      <DateComponent :days="5" msg="Commercial bread" />
      <DateComponent :days="7" msg="Dairy, 97 wall" />
      <DateComponent :days="30" msg="Frozen, Pharmacy, Dry Grocery" />
    </tbody>
  </table>
  <br>
  <br>
  <center>
    <picture>
      <source srcset="dark-qrcode.png" media="(prefers-color-scheme:dark)">
    <img src="light-qrcode.png">
  </picture>
  </center>
  
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
