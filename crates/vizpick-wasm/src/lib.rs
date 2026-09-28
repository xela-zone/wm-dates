#![no_std]

mod dict;
mod math;

/// Returns the 25-bit integer pattern for a marker ID (0..999).
#[no_mangle]
pub extern "C" fn aruco_get_marker_pattern(marker_id: u32) -> u32 {
    dict::get_pattern(marker_id)
}

/// Identifies a candidate pattern against all 1000 markers across 4 rotations.
/// Returns packed u32:
///   bits 0..9:   best marker ID (0..999)
///   bits 10..11: rotation (0=0°, 1=90° CCW, 2=180°, 3=270° CCW)
///   bits 12..16: min Hamming distance (0..25)
///   bit 17:      is_valid (1 if distance <= max_correction_bits, 0 otherwise)
#[no_mangle]
pub extern "C" fn aruco_identify(pattern: u32, max_correction_bits: u32) -> u32 {
    math::find_best_match(pattern, max_correction_bits)
}

/// Returns the minimum Hamming distance and rotation to a specific target marker ID.
/// Returns packed u32:
///   bits 0..4: min Hamming distance
///   bits 5..6: rotation (0..3)
#[no_mangle]
pub extern "C" fn aruco_distance_to_id(pattern: u32, marker_id: u32) -> u32 {
    math::distance_to_id(pattern, marker_id)
}

/// Rotates a 25-bit pattern 90 degrees counter-clockwise.
#[no_mangle]
pub extern "C" fn aruco_rotate(pattern: u32) -> u32 {
    math::rotate_ccw(pattern)
}

/// Encodes a 20-bit Walmart VizPick Label ID into left & right marker IDs.
/// Packed into u64: (left_id << 32) | right_id
#[no_mangle]
pub extern "C" fn vizpick_encode(label_id: u32) -> u64 {
    let left = label_id >> 10;
    let right = label_id & 0x3FF;
    ((left as u64) << 32) | (right as u64)
}

/// Decodes left & right marker IDs into a 20-bit Walmart VizPick Label ID.
#[no_mangle]
pub extern "C" fn vizpick_decode(left_id: u32, right_id: u32) -> u32 {
    (left_id << 10) | (right_id & 0x3FF)
}

#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}
