<template>
  <div class="searcher-container">
    <div class="field label border round prefix suffix margin">
      <i>search</i>
      <input
        type="search"
        :value="search"
        @input="e => search = e.target.value"
        placeholder=" "
      >
      <label>Search Produce Name or PLU...</label>
      <a v-if="search" class="circle transparent" @click="search = ''" role="button">
        <i>close</i>
      </a>
    </div>

    <div v-if="FilteredPlus.length < 20 && FilteredPlus.length > 0" class="card padding no-margin">
      <table class="border stripes medium-space">
        <thead>
          <tr>
            <th class="left-align">Produce Item</th>
            <th class="right-align">PLU Code</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="result in FilteredPlus"
            :key="result"
            @click="showBarcode(result)"
            style="cursor: pointer;"
          >
            <td class="left-align bold">{{ plus[result] }}</td>
            <td class="right-align">
              <span class="chip small primary">{{ result }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else-if="search && FilteredPlus.length >= 20" class="center-align secondary-text margin">
      Too many results ({{ FilteredPlus.length }}). Keep typing to narrow down...
    </p>
    <p v-else-if="search && FilteredPlus.length === 0" class="center-align secondary-text margin">
      No produce found matching "{{ search }}".
    </p>
  </div>
</template>

<script>
import plu from "@/plu";

export default {
  name: "SearcherOfThePlus",
  data() {
    return {
      search: '',
      plus: plu
    };
  },
  methods: {
    showBarcode(plu) {
      this.$emit('showBarcode', plu);
    }
  },
  computed: {
    FilteredPlus() {
      if (!this.search || this.search.trim() === '') {
        return [];
      }
      const query = this.search.toLowerCase();
      const keys = Object.keys(this.plus);

      if (!isNaN(query)) {
        return keys.filter(key => key.includes(query));
      }
      return keys.filter(key => this.plus[key].toLowerCase().includes(query));
    }
  }
};
</script>