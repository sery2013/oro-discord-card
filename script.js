// --- 1. НОВЫЙ КОД ДЛЯ ЖИВОГО ФОНА ВСЕГО САЙТА ---
const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");
let bgDots = [];

function initBackground() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    bgDots = [];
    for (let i = 0; i < 60; i++) {
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


// --- 2. ТВОЙ ОРИГИНАЛЬНЫЙ КОД КАРТОЧКИ (БЕЗ ИЗМЕНЕНИЙ) ---
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
            renderAll(ctx, canvas, avatarImg);
            animationId = requestAnimationFrame(frame);
        }
        animationId = requestAnimationFrame(frame);
    }
}

function renderAll(ctx, canvas, avatarImg) {
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const topGrad = ctx.createRadialGradient(canvas.width, 0, 50, canvas.width, 0, 400);
    topGrad.addColorStop(0, 'rgba(255, 122, 24, 0.15)');
    topGrad.addColorStop(1, 'rgba(255, 122, 24, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bottomGrad = ctx.createRadialGradient(0, canvas.height, 50, 0, canvas.height, 500);
    bottomGrad.addColorStop(0, 'rgba(0, 212, 255, 0.1)');
    bottomGrad.addColorStop(1, 'rgba(0, 212, 255, 0)');
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        ctx.fillStyle = `rgba(255, 122, 24, ${p.opacity * 2})`;
        ctx.beginPath(); ctx.arc(p.x, p.y + p.length, 1, 0, Math.PI * 2); ctx.fill();
    });

    scanLineY += 1.2;
    if (scanLineY > 400) scanLineY = 0;
    ctx.fillStyle = "rgba(255, 122, 24, 0.04)";
    ctx.fillRect(0, scanLineY, canvas.width, 1.5);

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    for (let x = 0; x < canvas.width; x += 30) {
        for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill();
        }
    }
    ctx.restore();

    const avX = 25, avY = 70, avS = 140;
    ctx.save();
    ctx.strokeStyle = "rgba(255, 122, 24, 0.7)";
    ctx.strokeRect(avX, avY, avS, avS);
    if (avatarImg) {
        ctx.drawImage(avatarImg, avX + 1, avY + 1, avS - 2, avS - 2);
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Fredoka";
    ctx.shadowColor = "rgba(255, 122, 24, 0.6)";
    ctx.shadowBlur = 15;
    ctx.fillText("USER CARD", 25, 45);
    ctx.restore();

    const username = document.getElementById("username").value || "sery2013";
    ctx.fillStyle = "white"; ctx.font = "bold 24px Fredoka";
    ctx.fillText(username, 205, 100);

    // ЛОГО ORO
    ctx.save();
    ctx.textAlign = "right";
    const pulse = 10 + Math.sin(Date.now() / 500) * 8;
    ctx.fillStyle = "#ff7a18"; ctx.font = "bold 50px Fredoka";
    ctx.shadowColor = "#ff7a18"; ctx.shadowBlur = pulse;
    ctx.fillText("ORO", 760, 360);
    ctx.restore();
}

function downloadCard() {
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "oro-animated-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
