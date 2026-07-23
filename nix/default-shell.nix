{pkgs}: let
  pythonEnv = pkgs.python312;
in
  pkgs.mkShell {
    packages = with pkgs; [
      pythonEnv
      uv

      nodejs_24
      pnpm

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
      export UV_LINK_MODE=copy
      export PYTHONUNBUFFERED=1

      export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib''${LD_LIBRARY_PATH:+:''$LD_LIBRARY_PATH}"
      if [ -d "server" ]; then
        cd server

        # Recreate virtual environment
        rm -rf .venv
        uv venv
        source .venv/bin/activate
        uv sync

        cd ..
      elif [ -d "../server" ] || [ -f "manage.py" ]; then
        # We are already inside the server directory

        # Recreate virtual environment
        rm -rf .venv
        uv venv
        source .venv/bin/activate
      fi

      if [ -d "client" ]; then
        (
          cd client

          # Reinstall dependencies
          rm -rf node_modules
          pnpm install
        )
      fi

      echo "Welcome to Drive"
    '';
  }
