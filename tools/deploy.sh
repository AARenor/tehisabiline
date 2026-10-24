#!/usr/bin/env bash
# Deploy the public static site to Cloudflare Pages.
# Publishes only site files: repo docs, tooling, agent notes and Git metadata stay private.
# Requires CLOUDFLARE_API_TOKEN (and CLOUDFLARE_ACCOUNT_ID) in the environment.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

git ls-files -z \
    | grep -zvE '^(docs|tools|output|\.github|\.impeccable)/' \
    | grep -zvE '^(AGENTS|PRODUCT|DESIGN|README)\.md$|^(package(-lock)?\.json|vercel\.json|\.vercelignore|\.gitignore)$' \
    | rsync -a --from0 --files-from=- . "$tmp/"

count=$(find "$tmp" -type f | wc -l)
test "$count" -gt 0 || { echo "deploy: empty publish set" >&2; exit 1; }
if find "$tmp" -type f -name '*.md' | grep -q .; then
    echo "deploy: refusing to publish Markdown docs" >&2
    exit 1
fi

npx --yes wrangler@4.151.0 pages deploy "$tmp" \
    --project-name=tehisabiline \
    --branch=main \
    --commit-hash="$(git rev-parse HEAD)" \
    --commit-message="$(git log -1 --format=%s)"
