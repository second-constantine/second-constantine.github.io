/* =====================================================================
   Авторедирект на новый домен + счётчик отсчёта.
   Работает на любой странице заглушки: адрес нового сайта задан в
   <meta http-equiv="refresh"> как фолбэк, здесь — «мягкий» вариант
   с прогресс-баром и возможностью остаться.
   ===================================================================== */
(function () {
    'use strict';

    var TARGET = 'https://itcompressor.e7.by/';
    var SECONDS = 6;

    var bar = document.getElementById('bar');
    var countdown = document.getElementById('countdown');
    var cancel = document.getElementById('cancel');

    var timer = null;
    var deadline = Date.now() + SECONDS * 1000;

    function tick() {
        var left = Math.max(0, Math.round((deadline - Date.now()) / 1000));

        if (bar) {
            var done = Math.min(1, (SECONDS - left) / SECONDS);
            bar.style.width = (done * 100).toFixed(2) + '%';
        }

        if (countdown) {
            countdown.textContent = left > 0
                ? 'Переход через ' + left + ' с'
                : 'Переходим…';
        }

        if (left <= 0) {
            window.location.replace(TARGET);
            return;
        }

        timer = window.setTimeout(tick, 250);
    }

    function stop() {
        if (timer) {
            window.clearTimeout(timer);
            timer = null;
        }
        if (bar) {
            bar.style.width = '0%';
        }
        if (countdown) {
            countdown.textContent = 'Автопереход отменён';
        }
        if (cancel) {
            cancel.hidden = true;
        }
    }

    if (cancel) {
        cancel.addEventListener('click', stop);
    }

    // Уважаем «не хочу ждать»: сразу отменяем, если пользователь
    // взаимодействовал со страницей (например, начал выделять текст).
    window.addEventListener('keydown', stop, { once: true });
    window.addEventListener('wheel', stop, { once: true, passive: true });
    window.addEventListener('touchstart', stop, { once: true, passive: true });

    tick();
})();
