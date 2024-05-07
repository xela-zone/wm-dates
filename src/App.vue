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
      <DateComponent :days="2" msg="Deli meat, fresh sea food, Bakery bread" />
      <DateComponent :days="3" msg="produce" />
      <DateComponent :days="5" msg="Commercial bread" />
      <DateComponent :days="7" msg="Dairy, 97 wall" />
      <DateComponent :days="30" msg="Frozen, Pharmacy, Dry Grocery" />
      <JulianComponent/>
    </tbody>
  </table>
  <br>
  <Searcher/>
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
import Searcher from "./components/searcher.vue";
import JulianComponent from "./components/julian-date.vue";
export default {
  name: "App",
  components: {
    DateComponent,
    Searcher,
    JulianComponent,
  },
};
</script>
