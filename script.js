// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ ЭФФЕКТОВ ---
let particles = [];
let animationId = null;
let scanLineY = 0;
let isGenerating = false; 
let currentAvatarImg = null; 

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

// --- ОБНОВЛЕННАЯ ФУНКЦИЯ НАКЛОНА (ТОЛЬКО НА КАРТОЧКЕ) ---
function initTilt() {
    const canvas = document.getElementById("cardCanvas");
    if (!canvas) return;

    // Слушаем движение мыши ТОЛЬКО на канвасе
    canvas.addEventListener("mousemove", (e) => {
        if (canvas.style.display === "none") return;

        const rect = canvas.getBoundingClientRect();
        
        // Вычисляем позицию курсора относительно КАРТОЧКИ, а не окна
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Определяем центр карточки
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Вычисляем угол наклона (макс. 10 градусов)
        const rotateX = (-(y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;

        canvas.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    // Плавный сброс наклона, когда мышь уходит с поверхности карточки
    canvas.addEventListener("mouseleave", () => {
        canvas.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
}

function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const skeleton = document.getElementById("skeleton");
    
    if (canvas) canvas.style.display = "block";
    if (skeleton) skeleton.style.display = "none";

    isGenerating = true;
    canvas.classList.add("canvas-generating");
    scanLineY = 0; 

    setTimeout(() => {
        isGenerating = false;
        canvas.classList.remove("canvas-generating");
    }, 2500);

    const ctx = canvas.getContext("2d");

    if (particles.length === 0) initDigitalFlow();
    if (animationId) cancelAnimationFrame(animationId);

    const avatarInput = document.getElementById("avatar");

    if (avatarInput.files && avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                currentAvatarImg = img;
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
            renderAll(ctx, canvas, currentAvatarImg);
            animationId = requestAnimationFrame(frame);
        }
        animationId = requestAnimationFrame(frame);
    }
    
    // Инициализируем наклон один раз при генерации
    initTilt();
}

document.addEventListener("DOMContentLoaded", () => {
    const inputs = ["username", "date", "userBio"];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", () => {});
        }
    });

    document.querySelector(".roles")?.addEventListener("change", () => {});
});

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

    let staticScanY = (Date.now() * 0.05) % 400;
    ctx.fillStyle = "rgba(255, 122, 24, 0.04)";
    ctx.fillRect(0, staticScanY, canvas.width, 1.5);

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    for (let x = 0; x < canvas.width; x += 30) {
        for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill();
        }
    }
    ctx.fillStyle = "rgba(255, 122, 24, 0.04)";
    ctx.font = "bold 40px Fredoka";
    const symbols = ["( )", "ORO", "*", "◇"];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 6; j++) {
            ctx.save();
            ctx.translate(i * 120, j * 90);
            ctx.rotate(-Math.PI / 10);
            ctx.fillText(symbols[(i + j) % symbols.length], 0, 0);
            ctx.restore();
        }
    }
    ctx.restore();

    const avX = 25, avY = 70, avS = 140;
    ctx.save();
    ctx.strokeStyle = "rgba(255, 122, 24, 0.7)";
    ctx.strokeRect(avX, avY, avS, avS);
    if (avatarImg) {
        ctx.drawImage(avatarImg, avX + 1, avY + 1, avS - 2, avS - 2);
    } else {
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(avX + 1, avY + 1, avS - 2, avS - 2);
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Fredoka";
    ctx.shadowColor = "rgba(255, 122, 24, 0.6)";
    ctx.shadowBlur = 15;
    ctx.fillText("USER CARD", 25, 45);
    ctx.restore();

    ctx.save();
    const lineGrad = ctx.createLinearGradient(275, 0, 765, 0);
    lineGrad.addColorStop(0, "rgba(255, 122, 24, 0)");
    lineGrad.addColorStop(0.5, "rgba(255, 122, 24, 0.5)");
    lineGrad.addColorStop(1, "rgba(255, 122, 24, 0)");
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(275, 35); ctx.lineTo(765, 35); ctx.stroke();
    ctx.restore();

    const username = document.getElementById("username").value || "sery2013";
    const date = document.getElementById("date").value || "2026-03-12";
    const bioText = document.getElementById("userBio").value || "Web3 Explorer & Content Enthusiast";

    ctx.save();
    ctx.strokeStyle = "rgba(255, 122, 24, 0.3)";
    ctx.strokeRect(185, 65, 580, 50);
    ctx.fillStyle = "white"; ctx.font = "bold 24px Fredoka";
    ctx.fillText(username, 205, 100);

    ctx.strokeStyle = "rgba(255, 204, 0, 0.2)";
    ctx.strokeRect(185, 125, 580, 40);
    ctx.fillStyle = "#aaa"; ctx.font = "18px Fredoka";
    ctx.fillText("Joined: " + date, 205, 152);
    ctx.restore();

    ctx.save();
    const selectedRoles = Array.from(document.querySelectorAll(".roles input[type='checkbox']")).filter(chk => chk.checked).map(chk => chk.value);
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

    ctx.save();
    const bioY = yStart + 45;
    ctx.strokeStyle = "rgba(255, 122, 24, 0.3)";
    ctx.strokeRect(185, bioY, 580, 45);
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)"; 
    ctx.fillRect(185, bioY, 580, 45);
    ctx.fillStyle = "#eee"; ctx.font = "italic 16px Fredoka";
    ctx.fillText(bioText, 205, bioY + 28);
    ctx.restore();

    ctx.save();
    const sY = bioY + 105;
    ctx.font = "14px Fredoka"; ctx.fillStyle = "white";
    const drawIcon = (x, y, color, type) => {
        ctx.save(); ctx.translate(x, y - 12); ctx.fillStyle = color;
        if (type === 'tg') {
            ctx.beginPath(); ctx.moveTo(0, 7); ctx.lineTo(15, 0); ctx.lineTo(13, 15); ctx.lineTo(9, 10); ctx.lineTo(9, 14); ctx.lineTo(7, 10); ctx.fill();
        } else if (type === 'x') {
            ctx.font = "bold 15px Arial"; ctx.fillStyle = "white"; ctx.fillText("𝕏", 0, 13);
        } else if (type === 'dc') {
            ctx.beginPath(); ctx.arc(8, 7, 7, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    };
    drawIcon(185, sY, "white", 'x'); ctx.fillText("Twitter", 207, sY);
    drawIcon(285, sY, "#0088cc", 'tg'); ctx.fillText("Telegram", 307, sY);
    drawIcon(395, sY, "#5865F2", 'dc'); ctx.fillText("Discord", 417, sY);
    ctx.fillText("🌐 getoro.xyz", 505, sY);
    ctx.restore();

    ctx.save();
    ctx.textAlign = "right";
    const pulse = 10 + Math.sin(Date.now() / 500) * 8;
    const oroGrad = ctx.createLinearGradient(700, 360, 760, 360);
    oroGrad.addColorStop(0, "#ffcc00"); oroGrad.addColorStop(1, "#ff7a18");
    ctx.fillStyle = oroGrad; ctx.font = "bold 50px Fredoka";
    ctx.shadowColor = "#ff7a18"; ctx.shadowBlur = pulse;
    ctx.fillText("ORO", 760, 360);
    ctx.restore();

    const qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://getoro.xyz";
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = qrSrc;
    if (qrImg.complete) {
        ctx.drawImage(qrImg, 35, 245, 120, 120);
        ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "10px Fredoka"; ctx.textAlign = "center";
        ctx.fillText("getoro.xyz", 95, 380);
    }

    if (isGenerating) {
        scanLineY += 8;
        if (scanLineY > 400) scanLineY = 0;
        ctx.save();
        let scanGrad = ctx.createLinearGradient(0, scanLineY - 40, 0, scanLineY);
        scanGrad.addColorStop(0, "transparent");
        scanGrad.addColorStop(1, "rgba(255, 122, 24, 0.4)");
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanLineY - 40, canvas.width, 40);
        ctx.strokeStyle = "#ffcc00";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff7a18";
        ctx.beginPath(); ctx.moveTo(0, scanLineY); ctx.lineTo(canvas.width, scanLineY); ctx.stroke();
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

(function() {
    const bgCanvas = document.getElementById("bgCanvas");
    if (!bgCanvas) return;
    const bgCtx = bgCanvas.getContext("2d");
    let bgLines = [];

    function init() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        bgLines = Array.from({ length: 60 }, () => ({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            speed: Math.random() * 1 + 0.5,
            len: Math.random() * 100 + 50,
            op: Math.random() * 0.3
        }));
    }

    function animate() {
        bgCtx.fillStyle = '#050508';
        bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        bgLines.forEach(l => {
            l.y += l.speed;
            if (l.y > bgCanvas.height) { l.y = -l.len; l.x = Math.random() * bgCanvas.width; }
            let g = bgCtx.createLinearGradient(0, l.y, 0, l.y + l.len);
            g.addColorStop(0, 'transparent');
            g.addColorStop(1, `rgba(255, 122, 24, ${l.op})`);
            bgCtx.strokeStyle = g;
            bgCtx.beginPath(); bgCtx.moveTo(l.x, l.y); bgCtx.lineTo(l.x, l.y + l.len); bgCtx.stroke();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    init();
    animate();
})();
