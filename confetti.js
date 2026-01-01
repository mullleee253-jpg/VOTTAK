// ═══════════════════════════════════════════════════════════════
//                    КОНФЕТТИ ЭФФЕКТ
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';

    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let confettiPieces = [];
    let animationFrame;

    // Настройка canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Класс конфетти
    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 8 + 5;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.color = this.randomColor();
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
            this.opacity = 1;
        }

        randomColor() {
            const colors = [
                '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
                '#ff00ff', '#00ffff', '#ffa500', '#ff69b4',
                '#ffd700', '#4CAF50', '#2196F3', '#9C27B0'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            // Гравитация
            this.speedY += 0.05;

            // Затухание
            if (this.y > canvas.height - 100) {
                this.opacity -= 0.01;
            }

            // Удаляем если вышло за границы
            if (this.y > canvas.height + 10 || this.opacity <= 0) {
                return false;
            }
            return true;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            
            // Рисуем прямоугольник (конфетти)
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
            
            ctx.restore();
        }
    }

    // Создание конфетти
    function createConfetti(count = 5) {
        for (let i = 0; i < count; i++) {
            confettiPieces.push(new Confetti());
        }
    }

    // Анимация
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Обновляем и рисуем конфетти
        confettiPieces = confettiPieces.filter(confetti => {
            const alive = confetti.update();
            if (alive) {
                confetti.draw();
            }
            return alive;
        });

        // Создаем новое конфетти
        if (Math.random() < 0.3) {
            createConfetti(2);
        }

        animationFrame = requestAnimationFrame(animate);
    }

    // Взрыв конфетти
    function confettiBurst(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            const confetti = new Confetti();
            confetti.x = x;
            confetti.y = y;
            
            // Радиальное распределение
            const angle = (Math.PI * 2 * i) / count;
            const velocity = Math.random() * 8 + 4;
            confetti.speedX = Math.cos(angle) * velocity;
            confetti.speedY = Math.sin(angle) * velocity - 5;
            
            confettiPieces.push(confetti);
        }
    }

    // Конфетти при клике
    canvas.addEventListener('click', function(e) {
        confettiBurst(e.clientX, e.clientY, 30);
    });

    // Начальный взрыв конфетти
    function initialBurst() {
        // Несколько взрывов в разных местах
        const positions = [
            { x: canvas.width * 0.2, y: canvas.height * 0.3 },
            { x: canvas.width * 0.5, y: canvas.height * 0.2 },
            { x: canvas.width * 0.8, y: canvas.height * 0.3 }
        ];

        positions.forEach((pos, index) => {
            setTimeout(() => {
                confettiBurst(pos.x, pos.y, 40);
            }, index * 200);
        });
    }

    // Запуск
    function init() {
        console.log('🎉 Конфетти активировано!');
        
        // Начальный взрыв через секунду после загрузки
        setTimeout(initialBurst, 1000);
        
        // Создаем начальное конфетти
        createConfetti(20);
        
        // Запускаем анимацию
        animate();

        // Периодические взрывы
        setInterval(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.3;
            confettiBurst(x, y, 20);
        }, 5000);
    }

    // Запуск при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Остановка при уходе со страницы
    window.addEventListener('beforeunload', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    });

})();