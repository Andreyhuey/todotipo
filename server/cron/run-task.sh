#!/bin/bash
# Runs a compiled API task (dist/tasks/<name>.js) and emails if it fails.
#   run-task.sh weekly-report
source "$(dirname "$0")/lib.sh"

TASK="$1"
OUT="$(mktemp)"
cd "$APP_DIR" || exit 1

if ! "$NODE" "dist/tasks/$TASK.js" >"$OUT" 2>&1; then
  notify "Scheduled task '$TASK' FAILED" "The scheduled task '$TASK' exited with an error.

$(tail -30 "$OUT")"
  rm -f "$OUT"
  exit 1
fi
rm -f "$OUT"
