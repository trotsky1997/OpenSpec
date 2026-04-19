# Installation

## Prerequisites

- **Node.js 20.19.0 or higher** — Check your version: `node --version`

## Package Managers

### npm

```bash
npm install -g @fission-ai/openspec@latest
```

### pnpm

```bash
pnpm add -g @fission-ai/openspec@latest
```

### yarn

```bash
yarn global add @fission-ai/openspec@latest
```

### bun

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Run OpenSpec directly without installation:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Or install to your profile:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Or add to your development environment in `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:Fission-AI/OpenSpec";
  };

  outputs = { nixpkgs, openspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ openspec.packages.x86_64-linux.default ];
    };
  };
}
```

## Verify Installation

```bash
openspec --version
```

## Install the latest `main` build from GitHub

If you need the latest packaged build from the repository before a registry
release is cut, install the rolling `main-build` release asset directly:

```bash
npm install -g \
  https://github.com/Fission-AI/OpenSpec/releases/download/main-build/fission-ai-openspec-main.tgz \
  --ignore-scripts
```

This asset is refreshed by GitHub Actions on every push to `main`.

To pin a specific build, use its matching `main-build-<short-sha>` release tag:

```bash
npm install -g \
  https://github.com/Fission-AI/OpenSpec/releases/download/main-build-<short-sha>/fission-ai-openspec-main.tgz \
  --ignore-scripts
```

## Next Steps

After installing, initialize OpenSpec in your project:

```bash
cd your-project
openspec init
```

See [Getting Started](getting-started.md) for a full walkthrough.
