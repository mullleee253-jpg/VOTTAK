// ═══════════════════════════════════════════════════════════════
//                 ОБЛЕГЧЕННАЯ СИСТЕМА ЗАЩИТЫ САЙТА
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // Защита только от DevTools (F12)
    document.addEventListener('keydown', function(e) {
        // Блокируем только F12 и Ctrl+Shift+I
        if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73)) {
            e.preventDefault();
            showNotification('DevTools заблокированы для защиты', 'warning');
            return false;
        }
    });

    // Мягкая защита от правого клика (только на изображениях)
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            showNotification('Сохранение изображений ограничено', 'info');
            return false;
        }
    });

    // Простая защита от ботов
    let rapidActions = 0;
    let lastActionTime = 0;

    function checkBotActivity() {
        const now = Date.now();
        if (now - lastActionTime < 50) { // Очень быстрые действия
            rapidActions++;
            if (rapidActions > 10) {
                showNotification('Обнаружена подозрительная активность', 'warning');
                rapidActions = 0;
            }
        } else {
            rapidActions = 0;
        }
        lastActionTime = now;
    }

    // Мониторим только клики
    document.addEventListener('click', checkBotActivity);

    // Защита от iframe встраивания
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // Простая функция уведомлений
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'warning' ? '#ff9800' : '#2196F3'};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 99999;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Базовая защита от XSS в формах
    function sanitizeInputs() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function(e) {
                const value = e.target.value;
                if (value.includes('<script') || value.includes('javascript:')) {
                    e.target.value = value.replace(/<script.*?>.*?<\/script>/gi, '');
                    showNotification('Опасный код удален из поля', 'warning');
                }
            });
        });
    }

    // Инициализация
    document.addEventListener('DOMContentLoaded', function() {
        sanitizeInputs();
        console.log('🛡️ Базовая защита активирована');
    });

})();