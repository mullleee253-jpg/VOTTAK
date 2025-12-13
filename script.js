// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимация при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за карточками
document.querySelectorAll('.feature-card, .donate-card, .contact-link').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Функция покупки доната
function buyDonate(packageName, price) {
    const message = `Привет! Хочу купить привилегию ${packageName} за ${price}₽`;
    const telegramUrl = `https://t.me/romayoutuber2023?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
}

// Эффект параллакса для hero секции
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Изменение навбара при скролле
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }
});

// Копирование IP при клике
document.querySelector('.ip-box')?.addEventListener('click', function() {
    // Когда будет IP, раскомментируй это:
    // const ip = 'your-server-ip.com';
    // navigator.clipboard.writeText(ip);
    // alert('IP скопирован в буфер обмена!');
    
    alert('IP сервера скоро будет объявлен!');
});
// Анимация счетчиков статистики
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Запускаем анимацию когда элемент появляется на экране
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counter.classList.add('animate');
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Эффект печатающегося текста для заголовка
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Добавляем частицы в фон
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesCount = 50;
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(76, 175, 80, 0.5);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
}

// CSS для частиц
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
    
    .particle {
        pointer-events: none;
        z-index: 1;
    }
`;
document.head.appendChild(particleStyle);

// Функция для обновления статистики (можно подключить к API)
function updateServerStats() {
    // Здесь можно добавить запрос к API сервера
    // Пока что показываем статичные данные
    const stats = {
        online: 0, // Когда сервер запустится, здесь будет реальное количество
        registered: 0,
        days: 0,
        uptime: 24
    };
    
    document.querySelector('[data-target="0"]').setAttribute('data-target', stats.online);
}

// Добавляем эффект глитча для заголовка
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    .glitch {
        position: relative;
        animation: glitch 2s infinite;
    }
    
    .glitch::before,
    .glitch::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    
    .glitch::before {
        animation: glitch-1 0.5s infinite;
        color: #ff0000;
        z-index: -1;
    }
    
    .glitch::after {
        animation: glitch-2 0.5s infinite;
        color: #00ff00;
        z-index: -2;
    }
    
    @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
    }
    
    @keyframes glitch-1 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(2px, -2px); }
        40% { transform: translate(-2px, 2px); }
        60% { transform: translate(-2px, -2px); }
        80% { transform: translate(2px, 2px); }
    }
    
    @keyframes glitch-2 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(-2px, -2px); }
    }
`;
document.head.appendChild(glitchStyle);

// Инициализация всех эффектов
document.addEventListener('DOMContentLoaded', function() {
    animateCounters();
    createParticles();
    updateServerStats();
    
    // Добавляем случайные эффекты при скролле
    let ticking = false;
    
    function updateOnScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Параллакс для hero секции
        const hero = document.querySelector('.hero-bg');
        if (hero) {
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
});

// Добавляем звуковые эффекты при наведении (опционально)
function addSoundEffects() {
    const buttons = document.querySelectorAll('.btn, .donate-card, .feature-card');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Здесь можно добавить звук при наведении
            // const audio = new Audio('hover-sound.mp3');
            // audio.volume = 0.1;
            // audio.play();
        });
    });
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// CSS для уведомлений
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyle);
// Функция для FAQ
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Закрываем все открытые FAQ
    document.querySelectorAll('.faq-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    // Открываем текущий, если он не был активен
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Добавляем эффект печатания для статистики
function typeNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Добавляем эффект появления элементов при скролле
function addScrollAnimations() {
    const elements = document.querySelectorAll('.feature-card, .donate-card, .rule-card, .news-card, .faq-item, .stat-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Добавляем курсор-следящий эффект
function addCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(76, 175, 80, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Увеличиваем курсор при наведении на интерактивные элементы
    const interactiveElements = document.querySelectorAll('a, button, .faq-question');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
        });
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// Добавляем эффект снега (опционально, для зимней темы)
function addSnowEffect() {
    const snowContainer = document.createElement('div');
    snowContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    document.body.appendChild(snowContainer);
    
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.innerHTML = '❄';
        snowflake.style.cssText = `
            position: absolute;
            color: rgba(255, 255, 255, 0.8);
            font-size: ${Math.random() * 10 + 10}px;
            left: ${Math.random() * 100}%;
            animation: fall ${Math.random() * 3 + 2}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        snowContainer.appendChild(snowflake);
        
        setTimeout(() => {
            snowflake.remove();
        }, 5000);
    }
    
    // Создаем снежинки каждые 300мс
    setInterval(createSnowflake, 300);
}

// CSS для эффекта снега
const snowStyle = document.createElement('style');
snowStyle.textContent = `
    @keyframes fall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(snowStyle);

// Обновляем инициализацию
document.addEventListener('DOMContentLoaded', function() {
    animateCounters();
    createParticles();
    updateServerStats();
    addScrollAnimations();
    addCustomCursor();
    
    // Добавляем снежинки
    addSnowEffect();
    
    // Добавляем плавное появление страницы
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Добавляем функцию для копирования IP
function copyIP() {
    // Когда будет реальный IP, замени на него
    const ip = 'your-server-ip.com';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(ip).then(() => {
            showNotification('IP адрес скопирован!', 'success');
        });
    } else {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = ip;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('IP адрес скопирован!', 'success');
    }
}

// Обновляем функцию покупки доната с уведомлением
const originalBuyDonate = buyDonate;
buyDonate = function(packageName, price) {
    showNotification(`Переходим к оплате ${packageName}...`, 'info');
    setTimeout(() => {
        originalBuyDonate(packageName, price);
    }, 500);
};
