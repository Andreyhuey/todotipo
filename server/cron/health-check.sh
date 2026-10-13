#!/bin/bash
# Every 5 minutes: checks the API (and its database) and emails once when it
# goes down and once when it recovers. Also keeps the app warm, so visitors
# don't hit a cold start after the host idles it.
source "$(dirname "$0")/lib.sh"

URL="https://oaken-api.andreyhuey.dev/api/health"
DOWN_FLAG="$STATE_DIR/api-down"

check() { curl -fsS -m 60 "$URL" 2>&1; }

if BODY="$(check)" && echo "$BODY" | grep -q '"status":"ok"'; then
  if [ -f "$DOWN_FLAG" ]; then
    SINCE="$(cat "$DOWN_FLAG")"
    rm -f "$DOWN_FLAG"
    notify "API recovered" "The API at $URL is healthy again (it was down since $SINCE)."
  fi
  exit 0
fi

# One retry after a pause rides out a normal restart before raising the alarm.
sleep 30
if BODY="$(check)" && echo "$BODY" | grep -q '"status":"ok"'; then
  exit 0
fi

if [ ! -f "$DOWN_FLAG" ]; then
  date -u '+%d %b %Y %H:%M UTC' > "$DOWN_FLAG"
  notify "API is DOWN" "The health check at $URL failed twice in a row.

Response:
${BODY:-(no response)}

The site may show errors until this is fixed. Server logs: ~/oaken-api/stderr.log"
fi
exit 1
