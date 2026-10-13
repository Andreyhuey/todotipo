#!/bin/bash
# Nightly PostgreSQL backup: compressed dump, verified, last 14 kept.
source "$(dirname "$0")/lib.sh"

DEST="$BACKUP_DIR/db"
KEEP_DAYS=14
mkdir -p "$DEST"
chmod 700 "$BACKUP_DIR" "$DEST"

FILE="$DEST/oaken-db-$(date -u +%Y-%m-%d_%H%M).sql.gz"
ERR="$(mktemp)"

if PGPASSWORD="$(env_get DB_PASS)" pg_dump \
    -h "$(env_get DB_HOST)" -p "$(env_get DB_PORT)" -U "$(env_get DB_USER)" "$(env_get DB_NAME)" \
    --no-owner --no-privileges 2>"$ERR" | gzip -9 > "$FILE" &&
  gzip -t "$FILE" && [ "$(zcat "$FILE" | head -c 100000 | grep -c 'CREATE TABLE')" -gt 0 ]; then
  chmod 600 "$FILE"
  find "$DEST" -name 'oaken-db-*.sql.gz' -mtime +"$KEEP_DAYS" -delete
else
  rm -f "$FILE"
  notify "Database backup FAILED" "The nightly database backup could not be created.

$(tail -20 "$ERR")"
  rm -f "$ERR"
  exit 1
fi
rm -f "$ERR"
