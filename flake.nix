{
  description = "wm-dates - Expiration & PLU Utility";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # Pure pnpm dependency derivation in the Nix store
        pnpmDeps = pkgs.fetchPnpmDeps {
          pname = "wm-dates";
          version = "0.1.0";
          src = pkgs.lib.cleanSource ./.;
          fetcherVersion = 4;
          hash = "sha256-c9LSYM4yOSA+2sfAu+KgOtJwqc72k7331kcGiluDkCA=";
        };

        # Static website derivation in the Nix store
        wm-dates = pkgs.stdenv.mkDerivation {
          pname = "wm-dates";
          version = "0.1.0";

          src = pkgs.lib.cleanSource ./.;

          nativeBuildInputs = [
            pkgs.nodejs
            pkgs.pnpmConfigHook
            pkgs.pnpm
          ];

          inherit pnpmDeps;

          buildPhase = ''
            runHook preBuild
            pnpm run build
            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r dist/* $out/
            runHook postInstall
          '';
        };
      in
      {
        packages = {
          default = wm-dates;
          inherit wm-dates;
          pnpm-deps = pnpmDeps;
        };

        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.nodejs
            pkgs.pnpm
            pkgs.just
          ];

          shellHook = ''
            echo "wm-dates development shell active."
            echo "Run 'just' to list available project commands."
          '';
        };
      }
    );
}
