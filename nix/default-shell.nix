{pkgs}: let
  pythonEnv = pkgs.python312;
in
  pkgs.mkShell {
    packages = with pkgs; [
      pythonEnv
      uv

      nodejs_24
      pnpm

      postgresql
      redis

      basedpyright
      ruff
      prettierd

      dockerfmt
      typescript-language-server
      vscode-langservers-extracted
      dockerfile-language-server
      yaml-language-server

      nil
      alejandra
      statix

      stdenv.cc.cc.lib # required for pnpm
      just
    ];

    shellHook = ''
      export UV_PYTHON="${pythonEnv}/bin/python"
      export UV_PYTHON_DOWNLOADS=never
      export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib''${LD_LIBRARY_PATH:+:''$LD_LIBRARY_PATH}"

      export UV_LINK_MODE=copy
      export PYTHONUNBUFFERED=1

      if [ ! -d ".venv" ]; then
        uv venv;
      fi
      source .venv/bin/activate

      echo "Welcome to Drive"
    '';
  }
