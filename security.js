// ═══════════════════════════════════════════════════════════════
//                    СИСТЕМА ЗАЩИТЫ САЙТА
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // Защита от DevTools
    let devtools = {
        open: false,
        orientation: null
    };

    const threshold = 160;

    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%c🚫 ДОСТУП ЗАПРЕЩЕН!', 'color: red; font-size: 50px; font-weight: bold;');
                console.log('%c⚠️ Обнаружена попытка взлома!', 'color: orange; font-size: 20px;');
                console.log('%c🔒 Сайт защищен от несанкционированного доступа', 'color: blue; font-size: 16px;');
                
                // Блокируем страницу
                document.body.innerHTML = `
                    <div style="
                        position: fixed; 
                        top: 0; left: 0; 
                        width: 100%; height: 100%; 
                        background: #000; 
                        color: red; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-size: 24px; 
                        z-index: 99999;
                        font-family: monospace;
                    ">
                        🚫 ДОСТУП ЗАБЛОКИРОВАН<br>
                        <small style="font-size: 16px;">Обнаружена подозрительная активность</small>
                    </div>
                `;
            }
        } else {
            devtools.open = false;
        }
    }, 500);

    // Защита от копирования контента (более мягкая)
    document.addEventListener('contextmenu', function(e) {
        // Разрешаем правый клик на input полях
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true;
        }
        
        e.preventDefault();
        showSecurityAlert('Правый клик ограничен для защиты контента');
        return false;
    });

    // Блокируем только критичные горячие клавиши
    document.addEventListener('keydown', function(e) {
        // Блокируем только DevTools (F12, Ctrl+Shift+I, Ctrl+Shift+J)
        if (e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74))) {
            e.preventDefault();
            showSecurityAlert('DevTools заблокированы');
            return false;
        }
        
        // Разрешаем Ctrl+A, Ctrl+C, Ctrl+V для удобства пользователей
        // Блокируем только Ctrl+U (просмотр исходного кода)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            showSecurityAlert('Просмотр исходного кода заблокирован');
            return false;
        }
    });

    // Защита от выделения текста (только для важных элементов)
    document.addEventListener('selectstart', function(e) {
        // Разрешаем выделение в input полях и обычном тексте
        if (e.target.tagName === 'INPUT' || 
            e.target.tagName === 'TEXTAREA' || 
            e.target.closest('.allow-select')) {
            return true;
        }
        
        // Блокируем только выделение кода и важных элементов
        if (e.target.tagName === 'CODE' || 
            e.target.closest('.no-select')) {
            e.preventDefault();
            return false;
        }
    });

    // Защита от перетаскивания (только изображения)
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Анти-DDoS: Ограничение запросов
    let requestCount = 0;
    let lastRequestTime = Date.now();
    
    function checkRequestRate() {
        const now = Date.now();
        if (now - lastRequestTime < 1000) {
            requestCount++;
            if (requestCount > 10) {
                showSecurityAlert('Слишком много запросов! Подозрение на DDoS');
                // Блокируем на 30 секунд
                setTimeout(() => {
                    requestCount = 0;
                }, 30000);
                return false;
            }
        } else {
            requestCount = 1;
            lastRequestTime = now;
        }
        return true;
    }

    // Мониторинг подозрительной активности (более мягкий)
    let clickCount = 0;
    let rapidClicks = 0;
    let lastClickTime = 0;
    
    document.addEventListener('click', function() {
        const now = Date.now();
        
        // Проверяем только очень быстрые клики (возможные боты)
        if (now - lastClickTime < 100) {
            rapidClicks++;
            if (rapidClicks > 20) {
                showSecurityAlert('Обнаружены слишком быстрые клики');
                rapidClicks = 0;
            }
        } else {
            rapidClicks = 0;
        }
        
        lastClickTime = now;
        clickCount++;
        
        // Сбрасываем счетчик каждые 30 секунд
        setTimeout(() => {
            clickCount = Math.max(0, clickCount - 1);
        }, 30000);
    });

    // Убираем мониторинг скролла - он мешает нормальному использованию

    // Защита от iframe встраивания
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // Проверка на боты
    function detectBot() {
        // Проверяем User Agent
        const botPatterns = [
            /bot/i, /spider/i, /crawler/i, /scraper/i,
            /curl/i, /wget/i, /python/i, /java/i
        ];
        
        const userAgent = navigator.userAgent;
        for (let pattern of botPatterns) {
            if (pattern.test(userAgent)) {
                return true;
            }
        }
        
        // Проверяем отсутствие мыши
        let hasMouseMoved = false;
        document.addEventListener('mousemove', function() {
            hasMouseMoved = true;
        });
        
        setTimeout(() => {
            if (!hasMouseMoved) {
                showSecurityAlert('Обнаружен бот');
            }
        }, 5000);
        
        return false;
    }

    // Защита от SQL инъекций в URL
    function checkURL() {
        const url = window.location.href.toLowerCase();
        const sqlPatterns = [
            'select', 'union', 'insert', 'delete', 'update',
            'drop', 'create', 'alter', 'exec', 'script',
            '<script', 'javascript:', 'vbscript:', 'onload='
        ];
        
        for (let pattern of sqlPatterns) {
            if (url.includes(pattern)) {
                showSecurityAlert('Обнаружена попытка инъекции');
                window.location.href = '/';
                return false;
            }
        }
        return true;
    }

    // Функция показа предупреждений
    function showSecurityAlert(message) {
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff4444, #cc0000);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(255, 68, 68, 0.4);
            z-index: 99999;
            font-family: Arial, sans-serif;
            font-weight: bold;
            animation: slideIn 0.3s ease-out;
        `;
        alert.innerHTML = `🛡️ ${message}`;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }

    // Скрываем исходный код
    function obfuscateSource() {
        // Удаляем комментарии из HTML
        const comments = document.createNodeIterator(
            document.documentElement,
            NodeFilter.SHOW_COMMENT,
            null,
            false
        );
        
        let comment;
        const commentsToRemove = [];
        while (comment = comments.nextNode()) {
            commentsToRemove.push(comment);
        }
        
        commentsToRemove.forEach(comment => {
            comment.parentNode.removeChild(comment);
        });
    }

    // Защита от автоматических скриптов
    function addHoneypot() {
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.style.cssText = `
            position: absolute;
            left: -9999px;
            opacity: 0;
            pointer-events: none;
        `;
        
        honeypot.addEventListener('input', function() {
            showSecurityAlert('Обнаружен автоматический скрипт');
        });
        
        document.body.appendChild(honeypot);
    }

    // Мониторинг производительности (анти-DDoS)
    function monitorPerformance() {
        let startTime = performance.now();
        
        setInterval(() => {
            const currentTime = performance.now();
            const timeDiff = currentTime - startTime;
            
            if (timeDiff > 10000) { // Если страница тормозит
                showSecurityAlert('Обнаружена перегрузка системы');
            }
            
            startTime = currentTime;
        }, 5000);
    }

    // Защита от XSS
    function sanitizeInputs() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function(e) {
                const value = e.target.value;
                const xssPatterns = [
                    /<script/i, /javascript:/i, /vbscript:/i,
                    /onload=/i, /onerror=/i, /onclick=/i
                ];
                
                for (let pattern of xssPatterns) {
                    if (pattern.test(value)) {
                        e.target.value = '';
                        showSecurityAlert('Обнаружена XSS атака');
                        break;
                    }
                }
            });
        });
    }

    // Инициализация защиты
    function initSecurity() {
        console.log('%c🛡️ СИСТЕМА ЗАЩИТЫ АКТИВИРОВАНА', 'color: green; font-size: 16px; font-weight: bold;');
        
        checkURL();
        detectBot();
        obfuscateSource();
        addHoneypot();
        monitorPerformance();
        sanitizeInputs();
        
        // Очищаем консоль каждые 3 секунды
        setInterval(() => {
            console.clear();
            console.log('%c🛡️ Сайт защищен', 'color: green; font-size: 14px;');
        }, 3000);
    }

    // Запускаем защиту при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }

    // Защита от закрытия страницы ботами
    window.addEventListener('beforeunload', function(e) {
        if (!checkRequestRate()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

})();

// CSS для анимаций
const securityStyles = document.createElement('style');
securityStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    /* Защита от выделения (более мягкая) */
    .no-select {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
    /* Разрешаем выделение для большинства элементов */
    input, textarea, p, h1, h2, h3, h4, h5, h6, span, div, .allow-select {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
    }
`;
document.head.appendChild(securityStyles);