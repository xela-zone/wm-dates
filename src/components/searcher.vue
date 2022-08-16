<template>
    <div>
        <table v-if="FilteredPlus.length < 20">
            <thead>
                <td>Thing</td>
                <td>Number</td>
            </thead>
            <tbody>

                <tr v-for="result in FilteredPlus" v-bind:key="result">
                    <td>
                        {{ plus[result] }}
                    </td>
                    <td>
                        {{ result }}
                    </td>

                </tr>
            </tbody>
        </table>
        <input type="search" :value="search" @input="e => search = e.target.value" placeholder="Search for a PLU Here...">
        <!--  :value and @input from https://github.com/vuejs/vue/issues/8231#issuecomment-547391171 -->
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
            // take the dictionary plus and filter based on this.search.toLowerCase()
            let searchResults = Object.keys(this.plus).filter(key => this.plus[key].toLowerCase().includes(this.search.toLowerCase()))
            // if the search is numbers only, then search keys for matches aswell
            if (this.search.match(/^[0-9]+$/)) {
                searchResults = searchResults.concat(Object.keys(this.plus).filter(key => key.toLowerCase().includes(this.search.toLowerCase())))
            }
            return searchResults

        },
    },
};
</script>

<style>
</style>