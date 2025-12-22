#!/usr/bin/env bash
set -euo pipefail

# Guard to ensure mirrored schemas stay byte-identical to their canonical source.
# If a mirror drifts, update from the metarepo instead of patching here.

mirrors=(
  "json/os.context.state.schema.json:https://raw.githubusercontent.com/heimgewebe/metarepo/main/contracts/os.context.state.schema.json"
)

failures=0

for entry in "${mirrors[@]}"; do
  local_path="${entry%%:*}"
  remote_url="${entry#*:}"

  if [[ ! -f "${local_path}" ]]; then
    echo "::error file=${local_path}::Mirror missing locally."
    failures=1
    continue
  fi

  tmp="$(mktemp)"
  if ! curl -fsSL "${remote_url}" -o "${tmp}"; then
    echo "::error file=${local_path}::Failed to fetch canonical schema from ${remote_url}"
    rm -f "${tmp}"
    failures=1
    continue
  fi

  if ! diff -u "${tmp}" "${local_path}" >/dev/null; then
    echo "::error file=${local_path}::Mirror drift detected. Update from canonical source: ${remote_url}"
    echo "::group::Diff (${local_path} vs canonical)"
    diff -u "${tmp}" "${local_path}" || true
    echo "::endgroup::"
    failures=1
  else
    echo "::notice file=${local_path}::Mirror matches canonical source."
  fi

  rm -f "${tmp}"
done

exit "${failures}"
