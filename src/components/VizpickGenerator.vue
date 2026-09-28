<template>
  <div class="vizpick-generator">
    <p class="secondary-text" style="margin-bottom: 12px;">
      Enter a 6-digit VizPick Label ID to generate scannable paired ArUco markers, or tap cells to reverse-decode damaged labels:
    </p>

    <!-- Label ID Input -->
    <div class="grid no-margin" style="gap: 12px; margin-bottom: 16px;">
      <div class="s12 field label border">
        <input
          type="number"
          inputmode="numeric"
          v-model="labelInput"
          @input="onLabelInput"
          placeholder=" "
          style="font-size: 1.3rem; font-weight: bold; letter-spacing: 2px;"
        >
        <label>VizPick Label ID (e.g. 680374)</label>
      </div>
    </div>

    <!-- Quick Presets -->
    <div class="margin-bottom" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
      <span class="small-text secondary-text">Sample Tags:</span>
      <button
        v-for="sample in sampleTags"
        :key="sample.id"
        class="chip small surface-variant"
        @click="loadLabel(sample.id)"
      >
        <span>{{ sample.name }}: {{ sample.id }}</span>
      </button>
      <button
        class="chip small primary"
        @click="clearBoth"
      >
        <i>brush</i>
        <span>Draw from Scratch</span>
      </button>
    </div>

    <!-- Dual ArUco Tag Container (White thermal-label container for max camera readability) -->
    <div class="card padding center-align margin thermal-tag-card">
      <div class="tag-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="chip border bold">
          Label ID: <span class="primary-text" style="font-size: 1.2rem; margin-left: 4px;">{{ currentLabelId !== null ? currentLabelId : 'Drawing...' }}</span>
        </span>
        <button class="chip surface-variant small" @click="clearBoth" title="Clear both markers">
          <i>delete_sweep</i>
          <span>Clear All</span>
        </button>
      </div>

      <!-- Paired Markers Container -->
      <div class="markers-pair-wrapper">
        <!-- Left Marker (High 10 bits) -->
        <div class="marker-column">
          <div class="marker-frame">
            <svg
              viewBox="0 0 7 7"
              class="aruco-svg"
              shape-rendering="crispEdges"
            >
              <!-- Outer 1-module solid black border (7x7) -->
              <rect x="0" y="0" width="7" height="7" fill="#000000" />
              <!-- Inner 5x5 interactive data payload -->
              <template v-for="(row, r) in leftGrid" :key="'l-row-' + r">
                <rect
                  v-for="(isWhite, c) in row"
                  :key="'l-' + r + '-' + c"
                  :x="c + 1"
                  :y="r + 1"
                  width="1"
                  height="1"
                  :fill="isWhite ? '#ffffff' : '#000000'"
                  @click="toggleCell('left', r, c)"
                  class="interactive-cell"
                />
              </template>
              <!-- Modified Cell Indicators (dots) -->
              <template v-for="(row, r) in leftModified" :key="'l-mod-row-' + r">
                <template v-for="(isMod, c) in row" :key="'l-mod-' + r + '-' + c">
                  <circle
                    v-if="isMod"
                    :cx="c + 1.5"
                    :cy="r + 1.5"
                    r="0.22"
                    :fill="leftGrid[r][c] ? '#d32f2f' : '#ffeb3b'"
                    style="pointer-events: none;"
                  />
                </template>
              </template>
            </svg>
          </div>
          <div class="marker-info margin-top">
            <div class="bold" style="font-size: 0.95rem;">
              <span v-if="leftMatch.distance === 0">Left Marker #{{ leftMatch.markerId }}</span>
              <span v-else-if="leftMatch.isValid">Left Marker #{{ leftMatch.markerId }}</span>
              <span v-else class="secondary-text">Left (Drawing...)</span>
            </div>
            <div class="match-badge">
              <span v-if="leftMatch.distance === 0" class="chip small primary">
                <i>check</i>
                <span>Exact Match</span>
              </span>
              <button
                v-else-if="leftMatch.distance <= 2"
                class="chip small warning"
                @click="applyFix('left', leftMatch.markerId)"
                title="Tap to autocorrect marker"
              >
                <i>auto_fix_high</i>
                <span>Fix to #{{ leftMatch.markerId }}</span>
              </button>
              <span v-else class="chip small surface-variant secondary-text">
                <i>brush</i>
                <span>Closest: #{{ leftMatch.markerId }} (d:{{ leftMatch.distance }})</span>
              </span>
            </div>
            <div class="marker-actions margin-top">
              <button class="border small" @click="clearMarker('left')" title="Clear to blank grid">
                <i>delete_sweep</i>
                <span>Clear</span>
              </button>
              <button class="border small" @click="invertMarker('left')" title="Invert black and white cells">
                <i>contrast</i>
                <span>Invert</span>
              </button>
              <button
                v-if="hasLeftModifications"
                class="border small"
                @click="resetMarker('left')"
                title="Reset to canonical pattern"
              >
                <i>undo</i>
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Marker (Low 10 bits) -->
        <div class="marker-column">
          <div class="marker-frame">
            <svg
              viewBox="0 0 7 7"
              class="aruco-svg"
              shape-rendering="crispEdges"
            >
              <!-- Outer 1-module solid black border (7x7) -->
              <rect x="0" y="0" width="7" height="7" fill="#000000" />
              <!-- Inner 5x5 interactive data payload -->
              <template v-for="(row, r) in rightGrid" :key="'r-row-' + r">
                <rect
                  v-for="(isWhite, c) in row"
                  :key="'r-' + r + '-' + c"
                  :x="c + 1"
                  :y="r + 1"
                  width="1"
                  height="1"
                  :fill="isWhite ? '#ffffff' : '#000000'"
                  @click="toggleCell('right', r, c)"
                  class="interactive-cell"
                />
              </template>
              <!-- Modified Cell Indicators (dots) -->
              <template v-for="(row, r) in rightModified" :key="'r-mod-row-' + r">
                <template v-for="(isMod, c) in row" :key="'r-mod-' + r + '-' + c">
                  <circle
                    v-if="isMod"
                    :cx="c + 1.5"
                    :cy="r + 1.5"
                    r="0.22"
                    :fill="rightGrid[r][c] ? '#d32f2f' : '#ffeb3b'"
                    style="pointer-events: none;"
                  />
                </template>
              </template>
            </svg>
          </div>
          <div class="marker-info margin-top">
            <div class="bold" style="font-size: 0.95rem;">
              <span v-if="rightMatch.distance === 0">Right Marker #{{ rightMatch.markerId }}</span>
              <span v-else-if="rightMatch.isValid">Right Marker #{{ rightMatch.markerId }}</span>
              <span v-else class="secondary-text">Right (Drawing...)</span>
            </div>
            <div class="match-badge">
              <span v-if="rightMatch.distance === 0" class="chip small primary">
                <i>check</i>
                <span>Exact Match</span>
              </span>
              <button
                v-else-if="rightMatch.distance <= 2"
                class="chip small warning"
                @click="applyFix('right', rightMatch.markerId)"
                title="Tap to autocorrect marker"
              >
                <i>auto_fix_high</i>
                <span>Fix to #{{ rightMatch.markerId }}</span>
              </button>
              <span v-else class="chip small surface-variant secondary-text">
                <i>brush</i>
                <span>Closest: #{{ rightMatch.markerId }} (d:{{ rightMatch.distance }})</span>
              </span>
            </div>
            <div class="marker-actions margin-top">
              <button class="border small" @click="clearMarker('right')" title="Clear to blank grid">
                <i>delete_sweep</i>
                <span>Clear</span>
              </button>
              <button class="border small" @click="invertMarker('right')" title="Invert black and white cells">
                <i>contrast</i>
                <span>Invert</span>
              </button>
              <button
                v-if="hasRightModifications"
                class="border small"
                @click="resetMarker('right')"
                title="Reset to canonical pattern"
              >
                <i>undo</i>
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <p class="small-text secondary-text margin-top" style="margin-bottom: 0;">
        💡 Tap any cell inside either 5×5 grid to flip bits for damaged or torn shelf labels.
      </p>
    </div>

    <!-- History Ring Buffer -->
    <div v-if="history.length > 0" class="card padding margin">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h6 class="no-margin bold">
          <i>history</i>
          <span>Recent Labels</span>
        </h6>
        <button class="circle transparent small" @click="clearHistory" title="Clear History">
          <i>delete</i>
        </button>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button
          v-for="item in history"
          :key="item.labelId"
          class="chip surface-variant"
          @click="loadLabel(item.labelId)"
        >
          <span>{{ item.labelId }} (L:{{ item.left }}, R:{{ item.right }})</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMarkerGrid,
  identifyGrid,
  decodeLabel
} from '@/utils/vizpick.js';

const STORAGE_KEY = 'wm_vizpick_history';
const MAX_HISTORY = 12;

export default {
  name: 'VizpickGenerator',
  data() {
    return {
      labelInput: '680374',
      currentLabelId: 680374,
      leftGrid: Array.from({ length: 5 }, () => Array(5).fill(false)),
      rightGrid: Array.from({ length: 5 }, () => Array(5).fill(false)),
      leftCanonical: Array.from({ length: 5 }, () => Array(5).fill(false)),
      rightCanonical: Array.from({ length: 5 }, () => Array(5).fill(false)),
      leftMatch: { markerId: 664, rotation: 0, distance: 0, isValid: true },
      rightMatch: { markerId: 438, rotation: 0, distance: 0, isValid: true },
      history: [],
      sampleTags: [
        { id: 680374, name: 'Top Tag' },
        { id: 1022150, name: 'Bottom Tag' },
        { id: 496667, name: 'Pallet Tag' }
      ]
    };
  },
  computed: {
    leftModified() {
      if (this.currentLabelId === null) {
        return Array.from({ length: 5 }, () => Array(5).fill(false));
      }
      return this.leftGrid.map((row, r) =>
        row.map((val, c) => val !== this.leftCanonical[r][c])
      );
    },
    rightModified() {
      if (this.currentLabelId === null) {
        return Array.from({ length: 5 }, () => Array(5).fill(false));
      }
      return this.rightGrid.map((row, r) =>
        row.map((val, c) => val !== this.rightCanonical[r][c])
      );
    },
    hasLeftModifications() {
      return this.leftModified.some(row => row.some(cell => cell));
    },
    hasRightModifications() {
      return this.rightModified.some(row => row.some(cell => cell));
    }
  },
  async mounted() {
    this.loadHistoryFromStorage();
    await this.renderLabel(this.currentLabelId);
  },
  methods: {
    async onLabelInput() {
      const val = parseInt(this.labelInput, 10);
      if (!isNaN(val) && val >= 0 && val <= 1048575) {
        this.currentLabelId = val;
        await this.renderLabel(val);
        this.addToHistory(val);
      }
    },
    async loadLabel(id) {
      this.labelInput = id.toString();
      this.currentLabelId = id;
      await this.renderLabel(id);
      this.addToHistory(id);
    },
    async renderLabel(labelId) {
      const leftMarkerId = (labelId >>> 10) & 0x3FF;
      const rightMarkerId = labelId & 0x3FF;

      const [leftG, rightG] = await Promise.all([
        getMarkerGrid(leftMarkerId),
        getMarkerGrid(rightMarkerId)
      ]);

      this.leftGrid = leftG.map(row => [...row]);
      this.leftCanonical = leftG.map(row => [...row]);
      this.leftMatch = { markerId: leftMarkerId, rotation: 0, distance: 0, isValid: true };

      this.rightGrid = rightG.map(row => [...row]);
      this.rightCanonical = rightG.map(row => [...row]);
      this.rightMatch = { markerId: rightMarkerId, rotation: 0, distance: 0, isValid: true };
    },
    async toggleCell(side, r, c) {
      if (side === 'left') {
        this.leftGrid[r][c] = !this.leftGrid[r][c];
        this.leftMatch = await identifyGrid(this.leftGrid, 2);
      } else {
        this.rightGrid[r][c] = !this.rightGrid[r][c];
        this.rightMatch = await identifyGrid(this.rightGrid, 2);
      }
      this.checkBothMarkers();
    },
    async clearMarker(side) {
      if (side === 'left') {
        this.leftGrid = Array.from({ length: 5 }, () => Array(5).fill(false));
        this.leftCanonical = Array.from({ length: 5 }, () => Array(5).fill(false));
        this.leftMatch = await identifyGrid(this.leftGrid, 2);
      } else {
        this.rightGrid = Array.from({ length: 5 }, () => Array(5).fill(false));
        this.rightCanonical = Array.from({ length: 5 }, () => Array(5).fill(false));
        this.rightMatch = await identifyGrid(this.rightGrid, 2);
      }
      this.checkBothMarkers();
    },
    async invertMarker(side) {
      const grid = side === 'left' ? this.leftGrid : this.rightGrid;
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          grid[r][c] = !grid[r][c];
        }
      }
      if (side === 'left') {
        this.leftMatch = await identifyGrid(this.leftGrid, 2);
      } else {
        this.rightMatch = await identifyGrid(this.rightGrid, 2);
      }
      this.checkBothMarkers();
    },
    async clearBoth() {
      this.labelInput = '';
      this.currentLabelId = null;
      this.leftGrid = Array.from({ length: 5 }, () => Array(5).fill(false));
      this.leftCanonical = Array.from({ length: 5 }, () => Array(5).fill(false));
      this.rightGrid = Array.from({ length: 5 }, () => Array(5).fill(false));
      this.rightCanonical = Array.from({ length: 5 }, () => Array(5).fill(false));
      const [lm, rm] = await Promise.all([
        identifyGrid(this.leftGrid, 2),
        identifyGrid(this.rightGrid, 2)
      ]);
      this.leftMatch = lm;
      this.rightMatch = rm;
    },
    async resetMarker(side) {
      if (side === 'left') {
        this.leftGrid = this.leftCanonical.map(row => [...row]);
        this.leftMatch = await identifyGrid(this.leftGrid, 2);
      } else {
        this.rightGrid = this.rightCanonical.map(row => [...row]);
        this.rightMatch = await identifyGrid(this.rightGrid, 2);
      }
      this.checkBothMarkers();
    },
    async applyFix(side, markerId) {
      const canonicalGrid = await getMarkerGrid(markerId);
      if (side === 'left') {
        this.leftGrid = canonicalGrid.map(row => [...row]);
        this.leftCanonical = canonicalGrid.map(row => [...row]);
        this.leftMatch = { markerId, rotation: 0, distance: 0, isValid: true };
      } else {
        this.rightGrid = canonicalGrid.map(row => [...row]);
        this.rightCanonical = canonicalGrid.map(row => [...row]);
        this.rightMatch = { markerId, rotation: 0, distance: 0, isValid: true };
      }
      this.checkBothMarkers();
    },
    checkBothMarkers() {
      if (this.leftMatch.distance === 0 && this.rightMatch.distance === 0 &&
          this.leftMatch.rotation === 0 && this.rightMatch.rotation === 0) {
        const newLabelId = decodeLabel(this.leftMatch.markerId, this.rightMatch.markerId);
        this.currentLabelId = newLabelId;
        this.labelInput = newLabelId.toString();
        this.addToHistory(newLabelId);
      } else if (!this.leftMatch.isValid || !this.rightMatch.isValid) {
        if (this.labelInput === '') {
          this.currentLabelId = null;
        }
      }
    },
    addToHistory(labelId) {
      const left = (labelId >>> 10) & 0x3FF;
      const right = labelId & 0x3FF;

      this.history = this.history.filter(item => item.labelId !== labelId);
      this.history.unshift({ labelId, left, right, timestamp: Date.now() });
      if (this.history.length > MAX_HISTORY) {
        this.history.pop();
      }
      this.saveHistoryToStorage();
    },
    loadHistoryFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          this.history = JSON.parse(raw);
        }
      } catch (e) {
        console.warn('Failed to load VizPick history from storage', e);
      }
    },
    saveHistoryToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history));
      } catch (e) {
        console.warn('Failed to save VizPick history to storage', e);
      }
    },
    clearHistory() {
      this.history = [];
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to remove VizPick history', e);
      }
    }
  }
};
</script>

<style scoped>
.thermal-tag-card {
  background: #ffffff;
  color: #000000;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.markers-pair-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
}

.marker-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 170px;
}

.marker-frame {
  width: 100%;
  aspect-ratio: 1 / 1;
  padding: 6px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aruco-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.interactive-cell {
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.interactive-cell:hover {
  opacity: 0.8;
  stroke: #2196f3;
  stroke-width: 0.05px;
}

.match-badge {
  margin-top: 4px;
  display: flex;
  justify-content: center;
}

.marker-actions {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}

.marker-actions button {
  padding: 2px 6px;
  font-size: 0.75rem;
  height: 28px;
  min-height: 28px;
  margin: 0;
}

.marker-actions button i {
  font-size: 1rem;
}
</style>
