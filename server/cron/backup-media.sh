#!/bin/bash
# Weekly backup of uploaded media (the storage folder), last 4 weeks kept.
source "$(dirname "$0")/lib.sh"

SRC_PARENT="$HOME/storage.andreyhuey.dev"
SRC_NAME="oaken"
DEST="$BACKUP_DIR/media"
KEEP_DAYS=28
mkdir -p "$DEST"
chmod 700 "$BACKUP_DIR" "$DEST"

FILE="$DEST/oaken-media-$(date -u +%Y-%m-%d).tar.gz"
ERR="$(mktemp)"

if [ -d "$SRC_PARENT/$SRC_NAME" ] &&
  tar -czf "$FILE" -C "$SRC_PARENT" "$SRC_NAME" 2>"$ERR" &&
  gzip -t "$FILE"; then
  chmod 600 "$FILE"
  find "$DEST" -name 'oaken-media-*.tar.gz' -mtime +"$KEEP_DAYS" -delete
else
  rm -f "$FILE"
  notify "Media backup FAILED" "The weekly media backup of $SRC_PARENT/$SRC_NAME failed.

$(tail -20 "$ERR")"
  rm -f "$ERR"
  exit 1
fi
rm -f "$ERR"
