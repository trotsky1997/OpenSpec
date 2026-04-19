# Github Workflows

## Testing CI Locally

Test GitHub Actions workflows locally using [act](https://nektosact.com/):

```bash
# Test all PR checks
act pull_request

# Test specific job
act pull_request -j nix-flake-validate

# Dry run to see what would execute
act pull_request --dryrun
```

The `.actrc` file configures act to use the appropriate Docker image.

## Packaging workflow

The `package-main-build.yml` workflow builds and packs OpenSpec on every push to
`main`, then publishes two prerelease flavors:

- a per-commit prerelease tagged `main-build-<short-sha>`
- a rolling prerelease tagged `main-build`

Both carry the same installable tarball asset:

- asset: `fission-ai-openspec-main.tgz`

This gives contributors both an immutable per-commit build in the Releases page
and a stable GitHub-hosted install target for the latest repository build
without waiting for an npm publish.

Install examples:

```bash
npm install -g \
  https://github.com/Fission-AI/OpenSpec/releases/download/main-build/fission-ai-openspec-main.tgz \
  --ignore-scripts
npm install -g \
  https://github.com/Fission-AI/OpenSpec/releases/download/main-build-<short-sha>/fission-ai-openspec-main.tgz \
  --ignore-scripts
```
