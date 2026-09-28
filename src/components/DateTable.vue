<template>
  <div class="date-table-container">
    <div class="row middle margin">
      <h5 class="max bold">Expiration Dates</h5>
      <span class="badge surface-variant">OPD</span>
    </div>

    <div class="card padding no-margin">
      <table class="border stripes medium-space">
        <thead>
          <tr>
            <th class="left-align">Category</th>
            <th class="left-align">Earliest Expiration</th>
            <th class="right-align">Days</th>
          </tr>
        </thead>
        <tbody>
          <DateComponent :days="0" msg="Today" />
          <DateComponent :days="1" msg="Doughnuts" />
          <DateComponent :days="2" msg="Deli meat, fresh seafood, Bakery bread" />
          <DateComponent :days="3" msg="Produce" />
          <DateComponent :days="5" msg="Commercial bread" />
          <DateComponent :days="7" msg="Dairy, 97 wall" />
          <DateComponent :days="30" msg="Frozen, Pharmacy, Dry Grocery" />
          <JulianComponent />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import DateComponent from "./date.vue";
import JulianComponent from "./julian-date.vue";

export default {
  name: "DateTable",
  components: {
    DateComponent,
    JulianComponent
  }
};
</script>
