#!/bin/bash
# Коммит + push изменений в main
set -e

cd "$(dirname "$0")"

commit="${1:-chore: update redirect stub}"

git pull
git add -A
git commit -m "$commit" || echo "Изменений нет"
git push
