<template>
    <div>
        <input type="search" :value="search" @input="e => search = e.target.value"
            placeholder="Search for a PLU Here...">
        <!--  :value and @input from https://github.com/vuejs/vue/issues/8231#issuecomment-547391171 -->
        <table v-if="FilteredPlus.length < 20">
            <thead>
                <tr>
                    <td>Thing</td>
                    <td>Number</td>
                </tr>
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
            const raw = this.search.trim().toLowerCase();
            if (!raw) return Object.keys(this.plus);

            const terms = raw.split(/\s+/).filter(Boolean);
            const isNumeric = /^[0-9]+$/.test(raw);

            return Object.keys(this.plus).filter(key => {
                const desc = this.plus[key].toLowerCase();
                const matchesDesc = terms.length > 0 && terms.every(term => desc.includes(term));
                const matchesKey = isNumeric && key.toLowerCase().includes(raw);
                return matchesDesc || matchesKey;
            });
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