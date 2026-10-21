#!/bin/bash
# Локальный просмотр заглушки: http://localhost:8000
set -e

cd "$(dirname "$0")/site"

PORT="${1:-8000}"
echo "Заглушка: http://localhost:${PORT}/  (Ctrl+C — остановить)"
exec python3 -m http.server "$PORT"
