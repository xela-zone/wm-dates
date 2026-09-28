default:
    @just --list

# Compile WebAssembly core
wasm:
    nix shell nixpkgs#rustc nixpkgs#lld --command \
      rustc --target wasm32-unknown-unknown --crate-type cdylib -C opt-level=3 \
      crates/vizpick-wasm/src/lib.rs -o src/assets/vizpick.wasm

# Start Vite development server with HMR
dev:
    pnpm run dev

# Fast local build to dist/
build:
    pnpm run build

# Preview production build locally
preview:
    pnpm run preview

# Pure hermetic Nix build to ./result
nix-build:
    nix build

# Build pnpm dependencies derivation to ./result
nix-build-deps:
    nix build .#pnpm-deps
