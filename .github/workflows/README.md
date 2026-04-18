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
`main`, then updates a rolling prerelease named `main-build` with the latest
installable tarball asset:

- asset: `fission-ai-openspec-main.tgz`
- release tag: `main-build`

This gives contributors a stable GitHub-hosted install target for the latest
repository build without waiting for an npm publish.
