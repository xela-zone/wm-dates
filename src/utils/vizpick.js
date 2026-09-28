import initWasm from '@/assets/vizpick.wasm?init';

let wasmExports = null;

/**
 * Loads and caches the WebAssembly core module.
 */
export async function getVizpickCore() {
  if (!wasmExports) {
    const instance = await initWasm();
    wasmExports = instance.exports;
  }
  return wasmExports;
}

/**
 * Converts a 25-bit integer pattern into a 5x5 boolean grid.
 * (true = white / bit 1, false = black / bit 0)
 * Bit 24 is (0,0), Bit 0 is (4,4).
 *
 * @param {number} pattern
 * @returns {boolean[][]}
 */
export function patternToGrid(pattern) {
  const grid = [];
  for (let r = 0; r < 5; r++) {
    const row = [];
    for (let c = 0; c < 5; c++) {
      const shift = 24 - (r * 5 + c);
      row.push(((pattern >>> shift) & 1) === 1);
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Converts a 5x5 boolean grid into a 25-bit integer pattern.
 *
 * @param {boolean[][]} grid
 * @returns {number}
 */
export function gridToPattern(grid) {
  let pattern = 0;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (grid[r][c]) {
        const shift = 24 - (r * 5 + c);
        pattern |= (1 << shift);
      }
    }
  }
  return pattern >>> 0;
}

/**
 * Returns the canonical 5x5 grid for a given ArUco marker ID (0..999).
 *
 * @param {number} markerId
 * @returns {Promise<boolean[][]>}
 */
export async function getMarkerGrid(markerId) {
  const core = await getVizpickCore();
  const pattern = core.aruco_get_marker_pattern(markerId);
  return patternToGrid(pattern);
}

/**
 * Identifies a 5x5 candidate grid against all 1000 markers across 4 rotations.
 *
 * @param {boolean[][]} grid
 * @param {number} maxCorrectionBits
 * @returns {Promise<{ markerId: number, rotation: number, distance: number, isValid: boolean }>}
 */
export async function identifyGrid(grid, maxCorrectionBits = 2) {
  const core = await getVizpickCore();
  const pattern = gridToPattern(grid);
  const res = core.aruco_identify(pattern, maxCorrectionBits);

  return {
    markerId: res & 0x3FF,
    rotation: (res >>> 10) & 0x3,
    distance: (res >>> 12) & 0x1F,
    isValid: ((res >>> 17) & 0x1) === 1
  };
}

/**
 * Returns minimum Hamming distance from a 5x5 grid to a target marker ID.
 *
 * @param {boolean[][]} grid
 * @param {number} markerId
 * @returns {Promise<{ distance: number, rotation: number }>}
 */
export async function getDistanceToId(grid, markerId) {
  const core = await getVizpickCore();
  const pattern = gridToPattern(grid);
  const res = core.aruco_distance_to_id(pattern, markerId);

  return {
    distance: res & 0x1F,
    rotation: (res >>> 5) & 0x3
  };
}

/**
 * Encodes a 20-bit Walmart VizPick Label ID into left & right markers.
 *
 * @param {number} labelId
 * @returns {Promise<{ labelId: number, leftMarkerId: number, rightMarkerId: number, leftGrid: boolean[][], rightGrid: boolean[][] }>}
 */
export async function encodeLabel(labelId) {
  const core = await getVizpickCore();
  const leftMarkerId = (labelId >>> 10) & 0x3FF;
  const rightMarkerId = labelId & 0x3FF;

  const leftPattern = core.aruco_get_marker_pattern(leftMarkerId);
  const rightPattern = core.aruco_get_marker_pattern(rightMarkerId);

  return {
    labelId,
    leftMarkerId,
    rightMarkerId,
    leftGrid: patternToGrid(leftPattern),
    rightGrid: patternToGrid(rightPattern)
  };
}

/**
 * Decodes left & right marker IDs into a 20-bit Walmart VizPick Label ID.
 *
 * @param {number} leftMarkerId
 * @param {number} rightMarkerId
 * @returns {number}
 */
export function decodeLabel(leftMarkerId, rightMarkerId) {
  return ((leftMarkerId << 10) | (rightMarkerId & 0x3FF)) >>> 0;
}
