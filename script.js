// --- 1. АНИМАЦИЯ ЖИВОГО ФОНА САЙТА ---
const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");
let bgDots = [];

function initBackground() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    bgDots = [];
    for (let i = 0; i < 70; i++) {
        bgDots.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            speed: Math.random() * 0.5 + 0.2,
            length: Math.random() * 100 + 50,
            opacity: Math.random() * 0.3
        });
    }
}

function drawBackground() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgCtx.fillStyle = '#050508';
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgDots.forEach(d => {
        d.y += d.speed;
        if (d.y > bgCanvas.height) {
            d.y = -d.length;
            d.x = Math.random() * bgCanvas.width;
        }
        let g = bgCtx.createLinearGradient(0, d.y, 0, d.y + d.length);
        g.addColorStop(0, 'transparent');
        g.addColorStop(1, `rgba(255, 122, 24, ${d.opacity})`);
        bgCtx.strokeStyle = g;
        bgCtx.lineWidth = 1;
        bgCtx.beginPath();
        bgCtx.moveTo(d.x, d.y);
        bgCtx.lineTo(d.x, d.y + d.length);
        bgCtx.stroke();
    });
    requestAnimationFrame(drawBackground);
}
window.addEventListener('resize', initBackground);
initBackground();
drawBackground();

// --- 2. ТВОЯ ОРИГИНАЛЬНАЯ ЛОГИКА ГЕНЕРАЦИИ КАРТОЧКИ ---
let particles = [];
let animationId = null;
let scanLineY = 0;

function initDigitalFlow() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * 800,
            y: Math.random() * 400,
            speed: Math.random() * 1.5 + 0.5,
            length: Math.random() * 80 + 30,
            opacity: Math.random() * 0.4
        });
    }
}

function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    if (particles.length === 0) initDigitalFlow();
    if (animationId) cancelAnimationFrame(animationId);

    const avatarInput = document.getElementById("avatar");
    let avatarImg = null;

    if (avatarInput.files && avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => { avatarImg = img; startLoop(); };
            img.src = e.target.result;
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        startLoop();
    }

    function startLoop() {
        function frame() {
            renderAll(ctx, canvas, avatarImg);
            animationId = requestAnimationFrame(frame);
        }
        animationId = requestAnimationFrame(frame);
    }
}

function renderAll(ctx, canvas, avatarImg) {
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Базовый фон карточки
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Твои градиенты акцентов
    const topGrad = ctx.createRadialGradient(canvas.width, 0, 50, canvas.width, 0, 400);
    topGrad.addColorStop(0, 'rgba(255, 122, 24, 0.15)');
    topGrad.addColorStop(1, 'rgba(255, 122, 24, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Внутренние частицы карточки
    particles.forEach(p => {
        p.y += p.speed;
        if (p.y > 400) p.y = -p.length;
        const g = ctx.createLinearGradient(0, p.y, 0, p.y + p.length);
        g.addColorStop(0, 'transparent');
        g.addColorStop(1, `rgba(255, 122, 24, ${p.opacity})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.length);
        ctx.stroke();
    });

    // Отрисовка декоративной сетки и символов ORO
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    for (let x = 0; x < canvas.width; x += 30) {
        for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill();
        }
    }
    ctx.restore();

    // Аватар
    const avX = 25, avY = 70, avS = 140;
    ctx.save();
    ctx.strokeStyle = "rgba(255, 122, 24, 0.7)";
    ctx.lineWidth = 2;
    ctx.strokeRect(avX, avY, avS, avS);
    if (avatarImg) {
        ctx.drawImage(avatarImg, avX + 1, avY + 1, avS - 2, avS - 2);
    } else {
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(avX + 1, avY + 1, avS - 2, avS - 2);
    }
    ctx.restore();

    // Основной текст
    const username = document.getElementById("username").value || "sery2013";
    const date = document.getElementById("date").value || "2026-03-12";
    const bioText = document.getElementById("userBio").value || "Web3 Explorer";

    ctx.fillStyle = "white";
    ctx.font = "bold 30px Fredoka";
    ctx.fillText("USER CARD", 25, 45);

    ctx.font = "bold 24px Fredoka";
    ctx.fillText(username, 205, 100);
    ctx.fillStyle = "#aaa";
    ctx.font = "18px Fredoka";
    ctx.fillText("Joined: " + date, 205, 152);

    // Роли (Tier-логика)
    const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
    const selectedRoles = Array.from(roleCheckboxes).filter(chk => chk.checked).map(chk => chk.value);
    let xStart = 185, yStart = 180;

    selectedRoles.forEach(role => {
        let c1 = "#2a2b3d", c2 = "#4a4b5d";
        if (role.includes("Tier 1")) { c1 = "#CC5500"; c2 = "#FF7A18"; }
        else if (role.includes("Tier 2")) { c1 = "#b35900"; c2 = "#ff8c1a"; }
        else if (role.includes("Gold")) { c1 = "#B8860B"; c2 = "#FFD700"; }
        
        ctx.font = "bold 13px Fredoka";
        const bWidth = ctx.measureText(role).width + 26;
        const g = ctx.createLinearGradient(xStart, yStart, xStart, yStart + 25);
        g.addColorStop(0, c2); g.addColorStop(1, c1);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.roundRect(xStart, yStart, bWidth, 25, 6); ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText(role, xStart + 13, yStart + 17);
        xStart += bWidth + 10;
        if (xStart > 700) { xStart = 185; yStart += 35; }
    });

    // Bio блок
    const bioY = yStart + 45;
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(185, bioY, 580, 45);
    ctx.fillStyle = "#eee";
    ctx.font = "italic 16px Fredoka";
    ctx.fillText(bioText, 205, bioY + 28);

    // Иконки соцсетей (Твоя функция drawIcon)
    const sY = bioY + 105;
    const drawIcon = (x, y, color, type) => {
        ctx.save(); ctx.translate(x, y - 12); ctx.fillStyle = color;
        if (type === 'tg') {
            ctx.beginPath(); ctx.moveTo(0, 7); ctx.lineTo(15, 0); ctx.lineTo(13, 15); ctx.lineTo(9, 10); ctx.lineTo(9, 14); ctx.lineTo(7, 10); ctx.fill();
        } else if (type === 'x') {
            ctx.font = "bold 15px Arial"; ctx.fillStyle = "white"; ctx.fillText("𝕏", 0, 13);
        }
        ctx.restore();
    };
    drawIcon(185, sY, "white", 'x'); ctx.fillStyle = "white"; ctx.font = "14px Fredoka"; ctx.fillText("Twitter", 207, sY);
    drawIcon(285, sY, "#0088cc", 'tg'); ctx.fillText("Telegram", 307, sY);
    ctx.fillText("🌐 getoro.xyz", 505, sY);

    // ЛОГО ORO
    ctx.save();
    ctx.textAlign = "right";
    const pulse = 10 + Math.sin(Date.now() / 500) * 8;
    ctx.fillStyle = "#ff7a18"; ctx.font = "bold 50px Fredoka";
    ctx.shadowColor = "#ff7a18"; ctx.shadowBlur = pulse;
    ctx.fillText("ORO", 760, 360);
    ctx.restore();

    // QR CODE
    const qrImg = new Image();
    qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://getoro.xyz";
    if (qrImg.complete) ctx.drawImage(qrImg, 35, 245, 120, 120);
}

function downloadCard() {
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "oro-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
