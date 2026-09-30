<template>
  <div class="date-table-container">
    <div class="card no-padding no-margin">
      <table class="border medium-space">
        <thead>
          <tr>
            <th class="left-align">Category</th>
            <th class="center-align" style="white-space: nowrap;">Earliest Expiration</th>
            <th class="right-align" style="white-space: nowrap;">Days</th>
          </tr>
        </thead>
        <tbody>
          <DateComponent :days="0" msg="Today" />
          <DateComponent :days="1" msg="Doughnuts" />
          <DateComponent :days="2" msg="Meat, Service Deli, Bakery" />
          <DateComponent :days="3" msg="Produce" />
          <DateComponent :days="5" msg="Commercial bread" />
          <DateComponent :days="7" msg="Dairy, prepack lunch meat" />
          <DateComponent :days="30" msg="Frozen, Everything else" />
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
