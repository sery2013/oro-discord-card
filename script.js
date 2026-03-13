// Переменные для анимации вне основной функции
let particles = [];
let animationId = null;
let lastTime = 0;

// Инициализация частиц для фона
function initParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * 800,
            y: Math.random() * 400,
            size: Math.random() * 1.5 + 0.3,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.4
        });
    }
}

function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");

    // Инициализируем частицы, если они еще не созданы
    if (particles.length === 0) initParticles();
    
    // Сбрасываем старую анимацию перед запуском новой
    if (animationId) cancelAnimationFrame(animationId);

    // Подготовка аватара
    const avatarInput = document.getElementById("avatar");
    let avatarImg = null;

    if (avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                avatarImg = img;
                startMainLoop();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        startMainLoop();
    }

    function startMainLoop() {
        function animate(currentTime) {
            render(ctx, canvas, avatarImg);
            animationId = requestAnimationFrame(animate);
        }
        animationId = requestAnimationFrame(animate);
    }
}

function render(ctx, canvas, avatarImg) {
    // 1. ПОЛНЫЙ СБРОС И ОЧИСТКА
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Настройки по умолчанию
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    // --- 2. ФОН (Анимированный градиент и слои) ---
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Мягкое свечение сверху справа
    const topGrad = ctx.createRadialGradient(canvas.width, 0, 50, canvas.width, 0, 450);
    topGrad.addColorStop(0, 'rgba(255, 122, 24, 0.18)');
    topGrad.addColorStop(1, 'rgba(255, 122, 24, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Синий акцент снизу слева
    const bottomGrad = ctx.createRadialGradient(0, canvas.height, 50, 0, canvas.height, 550);
    bottomGrad.addColorStop(0, 'rgba(0, 212, 255, 0.12)');
    bottomGrad.addColorStop(1, 'rgba(0, 212, 255, 0)');
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- 3. ОТРИСОВКА ЧАСТИЦ (Анимация) ---
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        ctx.fillStyle = `rgba(255, 122, 24, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // --- 4. ДЕКОРАТИВНЫЙ ПАТТЕРН (Сетка) ---
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    for (let x = 0; x < canvas.width; x += 30) {
        for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath();
            ctx.arc(x, y, 0.7, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Полупрозрачные ORO на фоне
    ctx.fillStyle = "rgba(255, 122, 24, 0.04)";
    ctx.font = "bold 40px Fredoka";
    const symbols = ["( )", "ORO", "*", "◇"];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 5; j++) {
            ctx.save();
            ctx.translate(i * 130, j * 100);
            ctx.rotate(-Math.PI / 12);
            ctx.fillText(symbols[(i + j) % symbols.length], 0, 0);
            ctx.restore();
        }
    }
    ctx.restore();

    // --- 5. ОСНОВНЫЕ ЭЛЕМЕНТЫ КАРТЫ ---
    const avX = 25, avY = 70, avS = 140;

    // Рамка аватара
    ctx.save();
    ctx.strokeStyle = "rgba(255, 122, 24, 0.7)";
    ctx.lineWidth = 1;
    ctx.strokeRect(avX, avY, avS, avS);
    if (avatarImg) {
        ctx.drawImage(avatarImg, avX + 1, avY + 1, avS - 2, avS - 2);
    } else {
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(avX + 1, avY + 1, avS - 2, avS - 2);
    }
    ctx.restore();

    // Заголовок "USER CARD"
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Fredoka";
    ctx.shadowColor = "rgba(255, 122, 24, 0.6)";
    ctx.shadowBlur = 15;
    ctx.fillText("USER CARD", 25, 45);
    ctx.restore();

    // Декоративная линия
    ctx.save();
    const lineGrad = ctx.createLinearGradient(275, 0, 765, 0);
    lineGrad.addColorStop(0, "transparent");
    lineGrad.addColorStop(0.5, "rgba(255, 122, 24, 0.5)");
    lineGrad.addColorStop(1, "transparent");
    ctx.strokeStyle = lineGrad;
    ctx.beginPath(); ctx.moveTo(275, 35); ctx.lineTo(765, 35); ctx.stroke();
    ctx.restore();

    // Сбор данных из формы
    const username = document.getElementById("username").value || "sery2013";
    const date = document.getElementById("date").value || "2026-03-12";
    const bioText = document.getElementById("userBio").value || "Web3 Explorer & Content Enthusiast";

    // Имя пользователя (рамка + текст)
    ctx.save();
    ctx.strokeStyle = "rgba(255, 122, 24, 0.4)";
    ctx.strokeRect(185, 65, 580, 50);
    ctx.fillStyle = "white";
    ctx.font = "bold 24px Fredoka";
    ctx.fillText(username, 205, 100);
    ctx.restore();

    // Дата (рамка + текст)
    ctx.save();
    ctx.strokeStyle = "rgba(255, 204, 0, 0.3)";
    ctx.strokeRect(185, 125, 580, 40);
    ctx.fillStyle = "#aaa";
    ctx.font = "18px Fredoka";
    ctx.fillText("Joined: " + date, 205, 152);
    ctx.restore();

    // --- РОЛИ (Бейджи) ---
    ctx.save();
    const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
    const selectedRoles = Array.from(roleCheckboxes).filter(chk => chk.checked).map(chk => chk.value);
    let xStart = 185, yStart = 180;

    selectedRoles.forEach(role => {
        let c1, c2;
        if (role === "Gold") { c1="#B8860B"; c2="#FFD700"; }
        else if (role === "Explorer") { c1="#008B8B"; c2="#00D4FF"; }
        else if (role.includes("Tier 1")) { c1="#CC5500"; c2="#FF7A18"; }
        else if (role.includes("Tier 2")) { c1="#b35900"; c2="#ff8c1a"; }
        else if (role.includes("Tier 3")) { c1="#996600"; c2="#ffaa00"; }
        else if (role.includes("Tier 4")) { c1="#808000"; c2="#bdb76b"; }
        else { c1="#2a2b3d"; c2="#4a4b5d"; }

        ctx.font = "bold 13px Fredoka";
        const bWidth = ctx.measureText(role).width + 26;
        if(xStart + bWidth > canvas.width - 20) { xStart = 185; yStart += 35; }
        
        const g = ctx.createLinearGradient(xStart, yStart, xStart, yStart + 25);
        g.addColorStop(0, c2); g.addColorStop(1, c1);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.roundRect(xStart, yStart, bWidth, 25, 6); ctx.fill();
        ctx.fillStyle = "white"; ctx.fillText(role, xStart + 13, yStart + 17);
        xStart += bWidth + 10;
    });
    ctx.restore();

    // --- BIO ПАНЕЛЬ ---
    ctx.save();
    const bioY = yStart + 45;
    ctx.strokeStyle = "rgba(255, 122, 24, 0.4)";
    ctx.strokeRect(185, bioY, 580, 45);
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    ctx.fillRect(185, bioY, 580, 45);
    ctx.fillStyle = "#eee";
    ctx.font = "italic 16px Fredoka";
    ctx.fillText(bioText, 205, bioY + 28);
    ctx.restore();

    // --- СОЦИАЛЬНЫЕ СЕТИ ---
    ctx.save();
    const sY = bioY + 105;
    const drawIcon = (x, y, color, type) => {
        ctx.save();
        ctx.translate(x, y - 12);
        ctx.fillStyle = color;
        if (type === 'tg') {
            ctx.beginPath(); ctx.moveTo(0, 7); ctx.lineTo(15, 0); ctx.lineTo(13, 15); ctx.lineTo(9, 10); ctx.lineTo(9, 14); ctx.lineTo(7, 10); ctx.fill();
        } else if (type === 'x') {
            ctx.font = "bold 15px Arial"; ctx.fillStyle = "white"; ctx.fillText("𝕏", 0, 13);
        } else if (type === 'dc') {
            ctx.beginPath(); ctx.arc(8, 7, 7, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    };

    drawIcon(185, sY, "white", 'x'); ctx.fillStyle = "white"; ctx.font = "14px Fredoka"; ctx.fillText("Twitter", 207, sY);
    drawIcon(285, sY, "#0088cc", 'tg'); ctx.fillText("Telegram", 307, sY);
    drawIcon(395, sY, "#5865F2", 'dc'); ctx.fillText("Discord", 417, sY);
    ctx.fillText("🌐 getoro.xyz", 505, sY);
    ctx.restore();

    // --- ЛОГОТИП ORO (С пульсацией) ---
    ctx.save();
    ctx.textAlign = "right";
    const pulse = 12 + Math.sin(Date.now() / 600) * 6; // Эффект дыхания
    const oroGrad = ctx.createLinearGradient(700, 360, 760, 360);
    oroGrad.addColorStop(0, "#ffcc00");
    oroGrad.addColorStop(1, "#ff7a18");
    ctx.fillStyle = oroGrad;
    ctx.font = "bold 50px Fredoka";
    ctx.shadowColor = "#ff7a18";
    ctx.shadowBlur = pulse;
    ctx.fillText("ORO", 760, 360);
    ctx.restore();

    // --- QR CODE (Статичный) ---
    // Чтобы QR не мерцал при каждой отрисовке, можно использовать кэширование, 
    // но для простоты оставим прямую отрисовку
    const qr = new Image();
    qr.crossOrigin = "anonymous";
    qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://getoro.xyz";
    if (qr.complete) {
        ctx.save();
        ctx.drawImage(qr, 35, 245, 120, 120);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "10px Fredoka"; ctx.textAlign = "center";
        ctx.fillText("getoro.xyz", 95, 380);
        ctx.restore();
    }
}

function downloadCard() {
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "oro-animated-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
