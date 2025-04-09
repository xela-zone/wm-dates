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
            entries: [], // Reactive property to store the entries
        };
    },
    watch: {
        days() {
            if (this.days === 21) {
                this.entries = this.twentyOneDays();
            } else {
                this.entries = this.twentyEightDays();
            }
        },
    },
    methods: {
        twentyOneDays() {
            const today = new Date();
            return Array.from({ length: this.days }, (_, i) => {
                const date = new Date();
                date.setDate(today.getDate() - (this.days - 1) + i);

                // Always add 21 days to calculate the "Best Before Date"
                const secondDate = new Date(date);
                secondDate.setDate(secondDate.getDate() + 21);

                return {
                    first: date.toISOString().split('T')[0],
                    second: secondDate.toISOString().split('T')[0],
                };
            });
        },
        twentyEightDays() {
            const today = new Date();
            return Array.from({ length: this.days }, (_, i) => {
                const date = new Date();
                date.setDate(today.getDate() - (this.days - 1) + i);

                // Always add 28 days to calculate the "Best Before Date"
                const secondDate = new Date(date);
                secondDate.setDate(secondDate.getDate() + 28);

                return {
                    first: date.toISOString().split('T')[0],
                    second: secondDate.toISOString().split('T')[0],
                };
            });
        },
    },
    mounted() {
        this.entries = this.twentyOneDays(); // Initialize entries on mount
    },
};
</script>

<style scoped>
.controls {
    margin-bottom: 1rem;
}

.meat-date-table {
    width: 100%;
    border-collapse: collapse;
}

.meat-date-table th,
.meat-date-table td {
    border: 1px solid #ddd;
    padding: 8px;
}

.meat-date-table th {
    background-color: #f4f4f4;
    text-align: left;
}
</style>