// ═══════════════════════════════════════════════════════════════
//                    НОВОГОДНИЕ ЭФФЕКТЫ
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // Получаем Новый Год в локальном часовом поясе пользователя
    function getNewYearDate() {
        const now = new Date();
        let newYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
        
        // Если уже наступил новый год, показываем следующий
        if (now >= newYear) {
            newYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
        }
        
        return newYear;
    }

    // Обновление таймера
    function updateCountdown() {
        const now = new Date();
        const newYear = getNewYearDate();
        const diff = newYear - now;

        if (diff <= 0) {
            // Новый год наступил!
            showNewYearCelebration();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        // Если осталось меньше минуты - запускаем фейерверки
        if (diff < 60000) {
            launchFirework();
        }
    }

    // Празднование Нового Года
    let celebrationShown = false;
    function showNewYearCelebration() {
        if (celebrationShown) return;
        celebrationShown = true;

        // Скрываем таймер
        const countdown = document.getElementById('countdown-container');
        if (countdown) {
            countdown.innerHTML = `
                <div class="countdown-content">
                    <h2>🎉 С НОВЫМ 2025 ГОДОМ! 🎉</h2>
                    <p style="color: gold; font-size: 1.2rem;">Желаем счастья и удачи!</p>
                </div>
            `;
        }

        // Показываем поздравление
        const message = document.createElement('div');
        message.className = 'new-year-message';
        message.innerHTML = `
            <h1>🎆 С НОВЫМ ГОДОМ! 🎆</h1>
            <p>🎄 Желаем счастья, здоровья и удачи в 2025 году! 🎄</p>
            <p style="margin-top: 20px;">🎁 Приятной игры на RomauWorld! 🎁</p>
        `;
        document.body.appendChild(message);

        // Запускаем много фейерверков
        for (let i = 0; i < 20; i++) {
            setTimeout(() => launchFirework(), i * 300);
        }

        // Убираем сообщение через 10 секунд
        setTimeout(() => {
            message.style.animation = 'celebrate 0.5s ease-out reverse';
            setTimeout(() => message.remove(), 500);
        }, 10000);
    }

    // Создание снежинок
    function createSnowflakes() {
        const container = document.getElementById('snow-container');
        if (!container) return;

        const snowflakes = ['❄', '❅', '❆', '✻', '✼', '❉', '✿'];
        
        function createSnowflake() {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.fontSize = (Math.random() * 15 + 10) + 'px';
            snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
            snowflake.style.animationDelay = Math.random() * 2 + 's';
            snowflake.style.opacity = Math.random() * 0.5 + 0.5;
            
            container.appendChild(snowflake);

            // Удаляем снежинку после анимации
            setTimeout(() => {
                snowflake.remove();
            }, 12000);
        }

        // Создаем снежинки каждые 200мс
        setInterval(createSnowflake, 200);
        
        // Создаем начальные снежинки
        for (let i = 0; i < 30; i++) {
            setTimeout(createSnowflake, i * 100);
        }
    }

    // Запуск фейерверка
    function launchFirework() {
        const container = document.getElementById('fireworks-container');
        if (!container) return;

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.6);
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4', 'gold'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Создаем частицы фейерверка
        const particleCount = 30 + Math.floor(Math.random() * 20);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 6px ${color}, 0 0 10px ${color}`;

            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 50 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            particle.style.animation = 'none';
            container.appendChild(particle);

            // Анимируем частицу
            let posX = 0;
            let posY = 0;
            let opacity = 1;
            let gravity = 0;

            function animateParticle() {
                posX += vx * 0.02;
                posY += vy * 0.02 + gravity;
                gravity += 0.5;
                opacity -= 0.02;

                particle.style.transform = `translate(${posX}px, ${posY}px)`;
                particle.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            }

            requestAnimationFrame(animateParticle);
        }

        // Воспроизводим звук (опционально)
        // playFireworkSound();
    }

    // Случайные фейерверки
    function randomFireworks() {
        // Запускаем фейерверк каждые 3-8 секунд
        const delay = 3000 + Math.random() * 5000;
        setTimeout(() => {
            launchFirework();
            randomFireworks();
        }, delay);
    }

    // Новогодние частицы (конфетти)
    function createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#ffd700', '#ff69b4', '#00bfff'];
        const container = document.getElementById('fireworks-container');
        if (!container) return;

        for (let i = 0; i < 5; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                opacity: 1;
                transform: rotate(${Math.random() * 360}deg);
                animation: confettiFall ${3 + Math.random() * 2}s linear forwards;
            `;
            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }
    }

    // CSS для конфетти
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(confettiStyle);

    // Новогодние звуки (опционально)
    function playFireworkSound() {
        // Можно добавить звук фейерверка
        // const audio = new Audio('firework.mp3');
        // audio.volume = 0.3;
        // audio.play();
    }

    // Добавляем новогодние эмодзи к элементам
    function addHolidayEmojis() {
        // Добавляем снежинки к заголовкам секций
        document.querySelectorAll('.section-title').forEach(title => {
            if (!title.textContent.includes('❄️')) {
                title.textContent = '❄️ ' + title.textContent + ' ❄️';
            }
        });
    }

    // Инициализация
    function init() {
        console.log('🎄 Новогодние эффекты активированы!');
        
        // Запускаем таймер
        updateCountdown();
        setInterval(updateCountdown, 1000);

        // Создаем снежинки
        createSnowflakes();

        // Запускаем случайные фейерверки
        randomFireworks();

        // Конфетти каждые 2 секунды
        setInterval(createConfetti, 2000);

        // Добавляем эмодзи
        setTimeout(addHolidayEmojis, 1000);

        // Фейерверк при клике (для веселья)
        document.addEventListener('click', function(e) {
            if (Math.random() > 0.7) { // 30% шанс
                const container = document.getElementById('fireworks-container');
                if (container) {
                    const x = e.clientX;
                    const y = e.clientY;
                    launchFireworkAt(x, y);
                }
            }
        });
    }

    // Фейерверк в определенной точке
    function launchFireworkAt(x, y) {
        const container = document.getElementById('fireworks-container');
        if (!container) return;

        const colors = ['#ff0000', '#00ff00', '#ffd700', '#ff69b4', '#00bfff', 'gold'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 6px ${color}`;

            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 30 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            container.appendChild(particle);

            let posX = 0;
            let posY = 0;
            let opacity = 1;

            function animate() {
                posX += vx * 0.03;
                posY += vy * 0.03;
                opacity -= 0.03;

                particle.style.transform = `translate(${posX}px, ${posY}px)`;
                particle.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            }

            requestAnimationFrame(animate);
        }
    }

    // Запуск при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();