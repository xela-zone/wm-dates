<template>
  <div class="meat-table-container">
    <div class="row middle margin">
      <p class="max secondary-text no-margin">Select pack date shelf life:</p>
      <div class="field label border small" style="min-width: 140px;">
        <select id="entry-count" v-model="days">
          <option value="21">21 Days</option>
          <option value="28">28 Days</option>
        </select>
        <label>Shelf Life</label>
      </div>
    </div>

    <div class="card no-padding no-margin">
      <table class="border medium-space">
        <thead>
          <tr>
            <th class="left-align">Pack Date</th>
            <th class="left-align">Best Before Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in entries" :key="index">
            <td class="left-align" style="font-variant-numeric: tabular-nums;">{{ entry.first }}</td>
            <td class="left-align bold" style="font-variant-numeric: tabular-nums;">{{ entry.second }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      days: 21,
      currentDate: new Date(),
    };
  },
  computed: {
    entries() {
      const count = Number(this.days);
      const base = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        this.currentDate.getDate()
      );

      const formatDate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const result = [];
      for (let i = 20; i >= 0; i--) {
        const packDate = new Date(base.getFullYear(), base.getMonth(), base.getDate() - i);
        const bestBeforeDate = new Date(packDate.getFullYear(), packDate.getMonth(), packDate.getDate() + count);

        result.push({
          first: formatDate(packDate),
          second: formatDate(bestBeforeDate),
        });
      }
      return result;
    }
  },
  mounted() {
    this._timer = setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  },
  beforeUnmount() {
    if (this._timer) {
      clearInterval(this._timer);
    }
  }
};
</script>
