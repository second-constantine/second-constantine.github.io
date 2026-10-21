#!/bin/bash
# Публикация статичной заглушки в ветку gh-pages (GitHub Pages).
# Раньше здесь собирался doctave-сайт; теперь site/ — готовые статические файлы.
#
# Работает через git worktree, чтобы не трогать рабочий каталог main-ветки.
set -e

cd "$(dirname "$0")"

if [ ! -d site ]; then
    echo "Нет каталога site/ — нечего публиковать" >&2
    exit 1
fi

WORKTREE="$(mktemp -d)/gh-pages"
mkdir -p "$(dirname "$WORKTREE")"

cleanup() {
    git worktree remove --force "$WORKTREE" 2>/dev/null || true
    rm -rf "$(dirname "$WORKTREE")" 2>/dev/null || true
}
trap cleanup EXIT

# Ветка gh-pages: берём/создаём её и полностью перезаписываем содержимым site/
if git show-ref --verify --quiet refs/heads/gh-pages; then
    BASE=gh-pages
elif git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    BASE=origin/gh-pages
else
    BASE=main
fi

git worktree add -B gh-pages "$WORKTREE" "$BASE"

# Чистим worktree (всё, кроме служебного .git)
find "$WORKTREE" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

cp -R site/. "$WORKTREE/"

cd "$WORKTREE"
git add -A
git commit -m "chore: publish redirect stub to gh-pages" || echo "Изменений нет"
git push --force origin gh-pages

echo "Готово: https://itcompressor.github.io/"
