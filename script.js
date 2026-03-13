// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ АНИМАЦИИ ---
let particles = [];
let animationId = null;
let qrImage = new Image();
qrImage.crossOrigin = "anonymous";
qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://getoro.xyz";

// Инициализация частиц (выполняется один раз)
function initParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * 800,
            y: Math.random() * 400,
            size: Math.random() * 1.5 + 0.3,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5
        });
    }
}

function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");

    if (particles.length === 0) initParticles();
    
    // Останавливаем предыдущий цикл, если он запущен
    if (animationId) cancelAnimationFrame(animationId);

    const avatarInput = document.getElementById("avatar");
    let avatarImg = null;

    // Логика загрузки аватара
    if (avatarInput.files && avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                avatarImg = img;
                startLoop();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        startLoop();
    }

    function startLoop() {
        function frame() {
            render(ctx, canvas, avatarImg);
            animationId = requestAnimationFrame(frame);
        }
        animationId = requestAnimationFrame(frame);
    }
}

function render(ctx, canvas, avatarImg) {
    // 1. Очистка и базовые настройки
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    // 2. ФОН (Глубокий градиент)
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Свечение сверху (оранжевое)
    const topGlow = ctx.createRadialGradient(canvas.width, 0, 0, canvas.width, 0, 500);
    topGlow.addColorStop(0, 'rgba(255, 122, 24, 0.15)');
    topGlow.addColorStop(1, 'rgba(255, 122, 24, 0)');
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Свечение снизу (синее)
    const botGlow = ctx.createRadialGradient(0, canvas.height, 0, 0, canvas.height, 500);
    botGlow.addColorStop(0, 'rgba(0, 212, 255, 0.08)');
    botGlow.addColorStop(1, 'rgba(0, 212, 255, 0)');
    ctx.fillStyle = botGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. АНИМИРОВАННЫЕ ЧАСТИЦЫ
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

    // 4. ДЕКОРАТИВНЫЙ ПАТТЕРН (Сетка и символы)
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    for (let x = 0; x < canvas.width; x += 40) {
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath(); ctx.arc(x, y, 0.6, 0, Math.PI * 2); ctx.fill();
        }
    }
    
    ctx.fillStyle = "rgba(255, 122, 24, 0.03)";
    ctx.font = "bold 35px Fredoka";
    const symbols = ["( )", "ORO", "*", "◇"];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            ctx.save();
            ctx.translate(i * 150 + 20, j * 120 + 40);
            ctx.rotate(-Math.PI / 15);
            ctx.fillText(symbols[(i + j) % symbols.length], 0, 0);
            ctx.restore();
        }
    }
    ctx.restore();

    // 5. ОСНОВНЫЕ ДАННЫЕ
    const avX = 25, avY = 70, avS = 140;

    // Аватар
    ctx.save();
    ctx.strokeStyle = "rgba(255, 122, 24, 0.6)";
    ctx.strokeRect(avX, avY, avS, avS);
    if (avatarImg) {
        ctx.drawImage(avatarImg, avX + 1, avY + 1, avS - 2, avS - 2);
    } else {
        ctx.fillStyle = "#11111d";
        ctx.fillRect(avX + 1, avY + 1, avS - 2, avS - 2);
    }
    ctx.restore();

    // Заголовок
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Fredoka";
    ctx.shadowColor = "rgba(255, 122, 24, 0.5)";
    ctx.shadowBlur = 12;
    ctx.fillText("USER CARD", 25, 45);
    ctx.restore();

    // Линия под заголовком
    ctx.save();
    const grad = ctx.createLinearGradient(275, 0, 765, 0);
    grad.addColorStop(0, "transparent"); grad.addColorStop(0.5, "rgba(255, 122, 24, 0.4)"); grad.addColorStop(1, "transparent");
    ctx.strokeStyle = grad;
    ctx.beginPath(); ctx.moveTo(275, 35); ctx.lineTo(765, 35); ctx.stroke();
    ctx.restore();

    const username = document.getElementById("username").value || "sery2013";
    const date = document.getElementById("date").value || "2026-03-12";
    const bioText = document.getElementById("userBio").value || "Web3 Explorer & Content Enthusiast";

    // Поля ввода
    ctx.strokeStyle = "rgba(255, 122, 24, 0.3)";
    ctx.strokeRect(185, 65, 580, 50);
    ctx.fillStyle = "white"; ctx.font = "bold 24px Fredoka";
    ctx.fillText(username, 205, 100);

    ctx.strokeStyle = "rgba(255, 204, 0, 0.2)";
    ctx.strokeRect(185, 125, 580, 40);
    ctx.fillStyle = "#aaa"; ctx.font = "18px Fredoka";
    ctx.fillText("Joined: " + date, 205, 152);

    // Роли
    const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
    const selectedRoles = Array.from(roleCheckboxes).filter(chk => chk.checked).map(chk => chk.value);
    let xStart = 185, yStart = 180;

    selectedRoles.forEach(role => {
        ctx.font = "bold 13px Fredoka";
        const bWidth = ctx.measureText(role).width + 26;
        if(xStart + bWidth > canvas.width - 20) { xStart = 185; yStart += 35; }
        ctx.fillStyle = "rgba(255, 122, 24, 0.15)";
        ctx.beginPath(); ctx.roundRect(xStart, yStart, bWidth, 25, 6); ctx.fill();
        ctx.fillStyle = "white"; ctx.fillText(role, xStart + 13, yStart + 17);
        xStart += bWidth + 10;
    });

    // Bio
    const bioY = yStart + 45;
    ctx.strokeStyle = "rgba(255, 122, 24, 0.3)";
    ctx.strokeRect(185, bioY, 580, 45);
    ctx.fillStyle = "#eee"; ctx.font = "italic 16px Fredoka";
    ctx.fillText(bioText, 205, bioY + 28);

    // Соцсети
    const sY = bioY + 105;
    ctx.fillStyle = "white"; ctx.font = "14px Fredoka";
    ctx.fillText("𝕏 Twitter", 185, sY);
    ctx.fillText("✈️ Telegram", 285, sY);
    ctx.fillText("👾 Discord", 395, sY);
    ctx.fillText("🌐 getoro.xyz", 505, sY);

    // Логотип ORO (Анимированная пульсация)
    ctx.save();
    ctx.textAlign = "right";
    const pulse = 10 + Math.sin(Date.now() / 500) * 8;
    ctx.shadowColor = "#ff7a18";
    ctx.shadowBlur = pulse;
    const lGrad = ctx.createLinearGradient(700, 360, 760, 360);
    lGrad.addColorStop(0, "#ffcc00"); lGrad.addColorStop(1, "#ff7a18");
    ctx.fillStyle = lGrad;
    ctx.font = "bold 50px Fredoka";
    ctx.fillText("ORO", 760, 360);
    ctx.restore();

    // QR код
    if (qrImage.complete) {
        ctx.drawImage(qrImage, 35, 245, 120, 120);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "10px Fredoka"; ctx.textAlign = "center";
        ctx.fillText("getoro.xyz", 95, 380);
    }
}

function downloadCard() {
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "oro-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
