default:
    @just --list

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
