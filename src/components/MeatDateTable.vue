<template>
    <div>
        <div class="controls">
            <label for="entry-count"><h2>Meat Pack Date Calculator:</h2></label>
            <select id="entry-count" v-model="days">
                <option value="21">21</option>
                <option value="28">28</option>
            </select>
        </div>
        <table class="meat-date-table">
            <thead>
                <tr>
                    <th>Pack Date</th>
                    <th>Best Before Date</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(entry, index) in entries" :key="index">
                    <td>{{ entry.first }}</td>
                    <td>{{ entry.second }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            days: 21,
        };
    },
    computed: {
        entries() {
            const count = Number(this.days);
            const today = new Date();
            const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const list = [];

            const formatDate = (d) => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            for (let i = 0; i < count; i++) {
                const packDate = new Date(normalizedToday.getFullYear(), normalizedToday.getMonth(), normalizedToday.getDate() - (count - 1) + i);
                const bestBeforeDate = new Date(packDate.getFullYear(), packDate.getMonth(), packDate.getDate() + count);

                list.push({
                    first: formatDate(packDate),
                    second: formatDate(bestBeforeDate),
                });
            }
            return list;
        },
    },
};
</script>

