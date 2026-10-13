#!/bin/bash
# Shared helpers for the Oaken cron jobs. Sourced by the other scripts.
set -o pipefail

APP_DIR="$HOME/oaken-api"
BACKUP_DIR="$HOME/backups/oaken"
NODE="$HOME/nodevenv/oaken-api/22/bin/node"
STATE_DIR="$HOME/.oaken-cron"
mkdir -p "$STATE_DIR"

# Read one value from the app's .env without exporting secrets to the environment.
env_get() {
  grep -m1 "^$1=" "$APP_DIR/.env" | cut -d= -f2- | tr -d '\r'
}

ALERT_EMAIL="$(env_get ALERT_EMAIL)"
SITE_NAME="$(env_get SITE_NAME | sed 's/\.$//')"
SITE_NAME="${SITE_NAME:-Oaken}"

# notify "<subject>" "<body>" — emails the alert address (silently skips if unset).
notify() {
  [ -z "$ALERT_EMAIL" ] && return 0
  # Cron runs without a locale; without explicit UTF-8, s-nail refuses to send
  # any message containing non-ASCII characters.
  printf '%s\n\n-- %s cron on %s, %s\n' "$2" "$SITE_NAME" "$(hostname)" "$(date -u '+%d %b %Y %H:%M UTC')" |
    LC_ALL=C.UTF-8 mail -S ttycharset=utf-8 -S sendcharsets=utf-8 -s "[$SITE_NAME] $1" "$ALERT_EMAIL"
}
