Гайд создания

# Установка doctave
```bash
sudo apt install cargo
cargo install --git https://github.com/Doctave/doctave --tag 0.4.1
```

# Инициализация проекта
```bash
doctave init
```

# Подготовка для деплоя github pages
```bash
touch docs/_include/.nojekyll

npm install -g gh-pages@3.0.0
```

# Деплой
```bash
doctave build --release
gh-pages -d site
```

# Настройка github
Переходим в настройки (https://github.com/second-constantine/second-constantine.github.io/settings/pages) и указываем ветку `gh-pages`

# Возможные проблемы
Если не хватает прав
```bash
sudo chmod 777 /usr/local/lib/node_modules/gh-pages/ -R
```
fatal: A branch named 'gh-pages' already exists.
```bash
sudo rm -rf /usr/local/lib/node_modules/gh-pages/.cache
```
