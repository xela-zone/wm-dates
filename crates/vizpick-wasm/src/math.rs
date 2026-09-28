use crate::dict::DICT_5X5_1000;

pub fn rotate_ccw(val: u32) -> u32 {
    let mut out = 0u32;
    for r in 0..5 {
        for c in 0..5 {
            let orig_r = c;
            let orig_c = 4 - r;
            let orig_shift = 24 - (orig_r * 5 + orig_c);
            let bit = (val >> orig_shift) & 1;
            let dst_shift = 24 - (r * 5 + c);
            out |= bit << dst_shift;
        }
    }
    out
}

pub fn find_best_match(pattern: u32, max_correction_bits: u32) -> u32 {
    let r0 = pattern;
    let r1 = rotate_ccw(r0);
    let r2 = rotate_ccw(r1);
    let r3 = rotate_ccw(r2);

    let mut best_id: u32 = 0;
    let mut best_rot: u32 = 0;
    let mut min_dist: u32 = 25;

    for (i, &marker) in DICT_5X5_1000.iter().enumerate() {
        let d0 = (r0 ^ marker).count_ones();
        if d0 == 0 {
            return (i as u32) | (0 << 10) | (0 << 12) | (1 << 17);
        }
        if d0 < min_dist {
            min_dist = d0;
            best_id = i as u32;
            best_rot = 0;
        }

        let d1 = (r1 ^ marker).count_ones();
        if d1 == 0 {
            return (i as u32) | (1 << 10) | (0 << 12) | (1 << 17);
        }
        if d1 < min_dist {
            min_dist = d1;
            best_id = i as u32;
            best_rot = 1;
        }

        let d2 = (r2 ^ marker).count_ones();
        if d2 == 0 {
            return (i as u32) | (2 << 10) | (0 << 12) | (1 << 17);
        }
        if d2 < min_dist {
            min_dist = d2;
            best_id = i as u32;
            best_rot = 2;
        }

        let d3 = (r3 ^ marker).count_ones();
        if d3 == 0 {
            return (i as u32) | (3 << 10) | (0 << 12) | (1 << 17);
        }
        if d3 < min_dist {
            min_dist = d3;
            best_id = i as u32;
            best_rot = 3;
        }
    }

    let is_valid = if min_dist <= max_correction_bits { 1 } else { 0 };
    best_id | (best_rot << 10) | (min_dist << 12) | (is_valid << 17)
}

pub fn distance_to_id(pattern: u32, marker_id: u32) -> u32 {
    if (marker_id as usize) >= DICT_5X5_1000.len() {
        return 25;
    }
    let target = DICT_5X5_1000[marker_id as usize];
    let r0 = pattern;
    let r1 = rotate_ccw(r0);
    let r2 = rotate_ccw(r1);
    let r3 = rotate_ccw(r2);

    let d0 = (r0 ^ target).count_ones();
    let d1 = (r1 ^ target).count_ones();
    let d2 = (r2 ^ target).count_ones();
    let d3 = (r3 ^ target).count_ones();

    let mut min_d = d0;
    let mut rot = 0;
    if d1 < min_d { min_d = d1; rot = 1; }
    if d2 < min_d { min_d = d2; rot = 2; }
    if d3 < min_d { min_d = d3; rot = 3; }

    (min_d & 0x1F) | (rot << 5)
}
