<template>
    <div>
        <input type="search" :value="search" @input="e => search = e.target.value"
            placeholder="Search for a PLU Here...">
        <!--  :value and @input from https://github.com/vuejs/vue/issues/8231#issuecomment-547391171 -->
        <table v-if="FilteredPlus.length < 20">
            <thead>
                <td>Thing</td>
                <td>Number</td>
            </thead>
            <tbody>

                <tr v-for="result in FilteredPlus" v-bind:key="result" @click="showBarcode(result)">
                    <td>
                        {{ plus[result] }}
                    </td>
                    <td>
                        {{ result }}
                    </td>

                </tr>
            </tbody>
        </table>
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
        }
    },
    computed: {
        FilteredPlus() {
            let searchResults = Object.keys(this.plus);

            // take the dictionary plus and filter based on this.search.toLowerCase()
            this.search.toLowerCase().split(' ').forEach(term => {
                searchResults = searchResults.filter(key => this.plus[key].toLowerCase().includes(term))
            });
            // if the search is numbers only, then search keys for matches aswell
            if (this.search.match(/^[0-9]+$/)) {
                searchResults = searchResults.concat(Object.keys(this.plus).filter(key => key.toLowerCase().includes(this.search.toLowerCase())))
            }
            return searchResults

        },

    },

    methods: {
        showBarcode(pluNumber) {
            this.$emit('showBarcode', pluNumber)
        }
    },
    emits: ['showBarcode']

};
</script>

<style></style>