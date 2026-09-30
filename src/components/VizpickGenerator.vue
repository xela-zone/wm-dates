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
          @keydown.enter="commitInput"
          placeholder=" "
          style="font-size: 1.3rem; font-weight: bold; letter-spacing: 2px;"
        >
        <label>VizPick Label ID (e.g. 680374)</label>
      </div>
    </div>

    <!-- Dual ArUco Tag Container (White thermal-label container for max camera readability) -->
    <div class="card padding center-align margin thermal-tag-card">
      <div class="tag-header" style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
        <span class="chip border bold" style="margin: 0;">
          Label ID: <span class="primary-text" style="font-size: 1.1rem; margin-left: 4px;">{{ currentLabelId !== null ? currentLabelId : 'Drawing...' }}</span>
        </span>
        <button class="chip surface-variant small" @click="clearBoth" style="margin: 0;" title="Clear both markers to white canvas">
          <i>delete_sweep</i>
          <span>Clear Canvas</span>
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
                  :stroke="isWhite ? '#eeeeee' : '#000000'"
                  stroke-width="0.04"
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
                  :stroke="isWhite ? '#eeeeee' : '#000000'"
                  stroke-width="0.04"
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

    <!-- Pinned Labels (Collapsible dropdown, open by default) -->
    <details open class="card padding margin">
      <summary class="bold" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <i class="primary-text">push_pin</i>
          <span>Pinned Labels ({{ pinned.length }})</span>
        </span>
      </summary>

      <div class="margin-top">
        <p v-if="pinned.length === 0" class="secondary-text small-text center-align" style="margin: 8px 0;">
          No pinned labels yet. Tap <i>push_pin</i> on any recent label to graduate it here with a custom nickname.
        </p>
        <div v-else class="pinned-list" style="display: flex; flex-direction: column; gap: 10px;">
          <div
            v-for="item in pinned"
            :key="item.labelId"
            style="border: 1px solid var(--outline-variant); border-radius: 8px; padding: 10px;"
          >
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                <button
                  class="circle transparent small primary-text"
                  @click="unpin(item.labelId)"
                  title="Unpin (demote to recents)"
                  style="margin: 0; flex-shrink: 0;"
                >
                  <i>push_pin</i>
                </button>
                <div style="min-width: 0;">
                  <a class="bold pointer" @click="loadLabel(item.labelId)" style="font-size: 1.05rem;" title="Load into canvas">
                    {{ item.labelId }}
                  </a>
                  <span class="small-text secondary-text margin-left" style="white-space: nowrap;">
                    L:{{ item.left }} · R:{{ item.right }}
                  </span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                <button
                  class="circle transparent small"
                  @click="loadLabel(item.labelId)"
                  title="Load into canvas"
                  style="margin: 0;"
                >
                  <i>upload</i>
                </button>
                <button
                  class="circle transparent small"
                  @click="deletePinned(item.labelId)"
                  title="Delete pinned label"
                  style="margin: 0;"
                >
                  <i>delete</i>
                </button>
              </div>
            </div>

            <!-- Nickname input full width below the header -->
            <div class="field border small no-margin margin-top" style="height: 2.3rem;">
              <input
                type="text"
                v-model="item.name"
                @change="savePinnedToStorage"
                placeholder="Add nickname / location note..."
                style="font-size: 0.9rem;"
              />
            </div>
          </div>
        </div>
      </div>
    </details>

    <!-- Recent Labels (Clean list without nicknames) -->
    <div v-if="recents.length > 0" class="card padding margin">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h6 class="no-margin bold" style="display: inline-flex; align-items: center; gap: 8px;">
          <i>history</i>
          <span>Recent Labels</span>
        </h6>
        <button class="circle transparent small" @click="clearRecents" title="Clear recents (preserves pinned)" style="margin: 0;">
          <i>delete_sweep</i>
        </button>
      </div>

      <div class="recents-list" style="display: flex; flex-direction: column;">
        <div
          v-for="item in recents"
          :key="item.labelId"
          style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--outline-variant); gap: 8px;"
        >
          <div style="min-width: 0; display: flex; align-items: baseline; gap: 8px;">
            <a class="bold pointer" @click="loadLabel(item.labelId)" style="font-size: 1.05rem;" title="Load into canvas">
              {{ item.labelId }}
            </a>
            <span class="small-text secondary-text" style="white-space: nowrap;">
              L:{{ item.left }} · R:{{ item.right }}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
            <button
              class="circle transparent small"
              @click="pinRecent(item.labelId)"
              title="Pin (graduate to pinned)"
              style="margin: 0;"
            >
              <i>push_pin</i>
            </button>
            <button
              class="circle transparent small"
              @click="loadLabel(item.labelId)"
              title="Load into canvas"
              style="margin: 0;"
            >
              <i>upload</i>
            </button>
            <button
              class="circle transparent small"
              @click="deleteRecent(item.labelId)"
              title="Delete from recents"
              style="margin: 0;"
            >
              <i>delete</i>
            </button>
          </div>
        </div>
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

const STORAGE_KEY_PINNED = 'wm_vizpick_pinned';
const STORAGE_KEY_RECENTS = 'wm_vizpick_recents';
const STORAGE_KEY_LEGACY = 'wm_vizpick_history';
const MAX_RECENTS = 12;

// 20-bit label limits:
// High 10 bits: Left marker (0..999 in DICT_5X5_1000)
// Low 10 bits: Right marker (0..999 in DICT_5X5_1000)
const MAX_VALID_LABEL_ID = (999 << 10) | 999; // 1,023,975

export default {
  name: 'VizpickGenerator',
  data() {
    return {
      labelInput: '',
      currentLabelId: null,
      leftGrid: Array.from({ length: 5 }, () => Array(5).fill(true)),
      rightGrid: Array.from({ length: 5 }, () => Array(5).fill(true)),
      leftCanonical: Array.from({ length: 5 }, () => Array(5).fill(true)),
      rightCanonical: Array.from({ length: 5 }, () => Array(5).fill(true)),
      leftMatch: { markerId: 0, rotation: 0, distance: 25, isValid: false },
      rightMatch: { markerId: 0, rotation: 0, distance: 25, isValid: false },
      pinned: [],
      recents: []
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
    this.loadStorage();
    await this.clearBoth();
  },
  methods: {
    async onLabelInput() {
      const val = parseInt(this.labelInput, 10);
      if (!isNaN(val) && val >= 0 && val <= MAX_VALID_LABEL_ID) {
        this.currentLabelId = val;
        await this.renderLabel(val);
      }
    },
    async commitInput() {
      const val = parseInt(this.labelInput, 10);
      if (!isNaN(val) && val >= 0 && val <= MAX_VALID_LABEL_ID) {
        this.currentLabelId = val;
        await this.renderLabel(val);
        this.addToRecents(val);
      }
    },
    async loadLabel(id) {
      this.labelInput = id.toString();
      this.currentLabelId = id;
      await this.renderLabel(id);
      const p = this.pinned.find(item => item.labelId === id);
      if (p) {
        p.timestamp = Date.now();
        this.savePinnedToStorage();
      } else {
        const r = this.recents.find(item => item.labelId === id);
        if (r) {
          r.timestamp = Date.now();
          this.saveRecentsToStorage();
        }
      }
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
        if (this.leftMatch.distance === 0 && this.leftMatch.rotation === 0) {
          this.leftCanonical = this.leftGrid.map(row => [...row]);
        }
      } else {
        this.rightGrid[r][c] = !this.rightGrid[r][c];
        this.rightMatch = await identifyGrid(this.rightGrid, 2);
        if (this.rightMatch.distance === 0 && this.rightMatch.rotation === 0) {
          this.rightCanonical = this.rightGrid.map(row => [...row]);
        }
      }
      this.checkBothMarkers();
    },
    async clearMarker(side) {
      if (side === 'left') {
        this.leftGrid = Array.from({ length: 5 }, () => Array(5).fill(true));
        this.leftCanonical = Array.from({ length: 5 }, () => Array(5).fill(true));
        this.leftMatch = await identifyGrid(this.leftGrid, 2);
      } else {
        this.rightGrid = Array.from({ length: 5 }, () => Array(5).fill(true));
        this.rightCanonical = Array.from({ length: 5 }, () => Array(5).fill(true));
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
      this.leftGrid = Array.from({ length: 5 }, () => Array(5).fill(true));
      this.leftCanonical = Array.from({ length: 5 }, () => Array(5).fill(true));
      this.rightGrid = Array.from({ length: 5 }, () => Array(5).fill(true));
      this.rightCanonical = Array.from({ length: 5 }, () => Array(5).fill(true));
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
        this.leftCanonical = this.leftGrid.map(row => [...row]);
        this.rightCanonical = this.rightGrid.map(row => [...row]);
        this.addToRecents(newLabelId);
      } else if (!this.leftMatch.isValid || !this.rightMatch.isValid) {
        if (this.labelInput === '') {
          this.currentLabelId = null;
        }
      }
    },
    addToRecents(labelId) {
      const pinnedItem = this.pinned.find(p => p.labelId === labelId);
      if (pinnedItem) {
        pinnedItem.timestamp = Date.now();
        this.savePinnedToStorage();
        return;
      }

      const left = (labelId >>> 10) & 0x3FF;
      const right = labelId & 0x3FF;

      this.recents = this.recents.filter(item => item.labelId !== labelId);
      this.recents.unshift({ labelId, left, right, timestamp: Date.now() });
      if (this.recents.length > MAX_RECENTS) {
        this.recents.pop();
      }
      this.saveRecentsToStorage();
    },
    pinRecent(labelId) {
      const item = this.recents.find(r => r.labelId === labelId);
      if (!item) return;
      this.recents = this.recents.filter(r => r.labelId !== labelId);
      this.saveRecentsToStorage();

      this.pinned = this.pinned.filter(p => p.labelId !== labelId);
      this.pinned.unshift({
        labelId: item.labelId,
        left: item.left,
        right: item.right,
        name: '',
        timestamp: Date.now()
      });
      this.savePinnedToStorage();
    },
    unpin(labelId) {
      const item = this.pinned.find(p => p.labelId === labelId);
      if (!item) return;
      this.pinned = this.pinned.filter(p => p.labelId !== labelId);
      this.savePinnedToStorage();

      this.recents = this.recents.filter(r => r.labelId !== labelId);
      this.recents.unshift({
        labelId: item.labelId,
        left: item.left,
        right: item.right,
        timestamp: Date.now()
      });
      if (this.recents.length > MAX_RECENTS) {
        this.recents.pop();
      }
      this.saveRecentsToStorage();
    },
    deleteRecent(labelId) {
      this.recents = this.recents.filter(r => r.labelId !== labelId);
      this.saveRecentsToStorage();
    },
    deletePinned(labelId) {
      this.pinned = this.pinned.filter(p => p.labelId !== labelId);
      this.savePinnedToStorage();
    },
    clearRecents() {
      this.recents = [];
      this.saveRecentsToStorage();
    },
    loadStorage() {
      try {
        const rawPinned = localStorage.getItem(STORAGE_KEY_PINNED);
        if (rawPinned) {
          this.pinned = JSON.parse(rawPinned);
        }

        const rawRecents = localStorage.getItem(STORAGE_KEY_RECENTS);
        if (rawRecents) {
          this.recents = JSON.parse(rawRecents);
        } else {
          const rawLegacy = localStorage.getItem(STORAGE_KEY_LEGACY);
          if (rawLegacy) {
            const legacyItems = JSON.parse(rawLegacy);
            this.recents = legacyItems.map(item => ({
              labelId: item.labelId,
              left: item.left,
              right: item.right,
              timestamp: item.timestamp || Date.now()
            }));
            this.saveRecentsToStorage();
          }
        }
      } catch (e) {
        console.warn('Failed to load VizPick storage', e);
      }
    },
    savePinnedToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY_PINNED, JSON.stringify(this.pinned));
      } catch (e) {
        console.warn('Failed to save pinned labels to storage', e);
      }
    },
    saveRecentsToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY_RECENTS, JSON.stringify(this.recents));
      } catch (e) {
        console.warn('Failed to save recent labels to storage', e);
      }
    }
  }
};
</script>

<style scoped>
.thermal-tag-card {
  border-radius: 12px;
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
