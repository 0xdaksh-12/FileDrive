{
  description = "FileDrive Flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      devShells = {
        # Route "nix develop" to the default shell file
        default = import ./nix/default-shell.nix {inherit pkgs;};

        # Route "nix develop .#fullStack" to the fullstack shell file
        # fullStack = import ./nix/fullstack-shell.nix {inherit pkgs;};
      };
    });
}
