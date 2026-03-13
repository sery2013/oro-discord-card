// --- 1. АНИМАЦИЯ ЖИВОГО ФОНА ---
const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");
let bgParticles = [];

function initBackground() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    bgParticles = [];
    for (let i = 0; i < 60; i++) {
        bgParticles.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            speed: Math.random() * 0.7 + 0.2,
            length: Math.random() * 100 + 50,
            opacity: Math.random() * 0.3
        });
    }
}

function drawBackground() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgCtx.fillStyle = '#050508';
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    bgParticles.forEach(p => {
        p.y += p.speed;
        if (p.y > bgCanvas.height) {
            p.y = -p.length;
            p.x = Math.random() * bgCanvas.width;
        }
        let g = bgCtx.createLinearGradient(0, p.y, 0, p.y + p.length);
        g.addColorStop(0, 'transparent');
        g.addColorStop(1, `rgba(255, 122, 24, ${p.opacity})`);
        bgCtx.strokeStyle = g;
        bgCtx.lineWidth = 1;
        bgCtx.beginPath();
        bgCtx.moveTo(p.x, p.y);
        bgCtx.lineTo(p.x, p.y + p.length);
        bgCtx.stroke();
    });
    requestAnimationFrame(drawBackground);
}

window.addEventListener('resize', initBackground);
initBackground();
drawBackground();

// --- 2. ТВОЯ ЛОГИКА ГЕНЕРАЦИИ КАРТОЧКИ ---
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

    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисование частиц внутри карточки
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

    // Отрисовка текста и аватара (твоя полная логика)
    const username = document.getElementById("username").value || "sery2013";
    const date = document.getElementById("date").value || "2026-03-12";
    const bioText = document.getElementById("userBio").value || "Web3 Explorer";

    ctx.fillStyle = "white";
    ctx.font = "bold 30px Fredoka";
    ctx.fillText("USER CARD", 25, 45);

    // Аватар
    const avX = 25, avY = 70, avS = 140;
    ctx.strokeStyle = "rgba(255, 122, 24, 0.7)";
    ctx.strokeRect(avX, avY, avS, avS);
    if (avatarImg) ctx.drawImage(avatarImg, avX + 1, avY + 1, avS - 2, avS - 2);

    ctx.fillStyle = "white";
    ctx.font = "bold 24px Fredoka";
    ctx.fillText(username, 205, 100);

    // Роли
    const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
    const selectedRoles = Array.from(roleCheckboxes).filter(chk => chk.checked).map(chk => chk.value);
    let xStart = 185, yStart = 180;

    selectedRoles.forEach(role => {
        ctx.fillStyle = "#ff7a18";
        ctx.font = "bold 13px Fredoka";
        const bWidth = ctx.measureText(role).width + 26;
        ctx.beginPath();
        ctx.roundRect(xStart, yStart, bWidth, 25, 6);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText(role, xStart + 13, yStart + 17);
        xStart += bWidth + 10;
    });

    // Логотип ORO
    ctx.save();
    ctx.textAlign = "right";
    ctx.fillStyle = "#ff7a18";
    ctx.font = "bold 50px Fredoka";
    ctx.fillText("ORO", 760, 360);
    ctx.restore();
}

function downloadCard() {
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "oro-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
