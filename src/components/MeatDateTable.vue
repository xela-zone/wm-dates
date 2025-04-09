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
            entries: [], // Non-reactive property to store the entries
            days: 21,
        };
    },
    watch: {
        days() {
                if (this.days === "21") {
                    this.entries = this.twentyOneDays();
                } else {
                    this.entries = this.twentyEightDays();
                }
        },
    },
    methods: {
        twentyOneDays() {
            const today = new Date();
            const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Normalize to midnight
            const entries = []; // Start with a fresh array
            for (let i = 0; i < 21; i++) {
                // Create a new date for the "Pack Date"
                const date = new Date(normalizedToday.getFullYear(), normalizedToday.getMonth(), normalizedToday.getDate() - (21 - 1) + i);

                // Create a new date for the "Best Before Date" by adding 21 days
                const secondDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 21);

                entries.push({
                    first: date.toISOString().split('T')[0],
                    second: secondDate.toISOString().split('T')[0],
                });
            }
            return entries; // Return the new array
        },
        twentyEightDays() {
            const today = new Date();
            const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Normalize to midnight
            const entries = []; // Start with a fresh array
            for (let i = 0; i < 28; i++) {
                // Create a new date for the "Pack Date"
                const date = new Date(normalizedToday.getFullYear(), normalizedToday.getMonth(), normalizedToday.getDate() - (28 - 1) + i);

                // Create a new date for the "Best Before Date" by adding 28 days
                const secondDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 28);

                entries.push({
                    first: date.toISOString().split('T')[0],
                    second: secondDate.toISOString().split('T')[0],
                });
            }
            return entries; // Return the new array
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