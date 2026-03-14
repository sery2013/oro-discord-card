// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ ЭФФЕКТОВ ---
let particles = [];
let animationId = null;
let scanLineY = 0;
let isGenerating = false; 
let currentAvatarImg = null; 

let reflectionPos = -500; 
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function playSound(id, stop = false) {
    const s = document.getElementById(id);
    if (!s) return;
    if (stop) {
        s.pause();
        s.currentTime = 0;
    } else {
        s.play().catch(() => {});
    }
}

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

function initTilt() {
    const canvas = document.getElementById("cardCanvas");
    if (!canvas) return;

    canvas.addEventListener("mousemove", (e) => {
        if (canvas.style.display === "none") return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (-(y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        canvas.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    canvas.addEventListener("mouseleave", () => {
        canvas.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
}

function generateCard() {
    playSound("soundClick");
    playSound("soundScan"); 

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
        playSound("soundScan", true);
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
    
    initTilt();
}

document.addEventListener("DOMContentLoaded", () => {
    if(typeof flatpickr !== 'undefined') {
        flatpickr("#date", {
            dateFormat: "m/d/Y",
            altInput: true,
            altFormat: "F j, Y",
            theme: "dark"
        });
    }
});

function renderAll(ctx, canvas, avatarImg) {
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let glitchX = 0;
    let glitchY = 0;
    if (isGenerating && Math.random() > 0.8) {
        glitchX = Math.random() * 4 - 2;
        glitchY = Math.random() * 2 - 1;
    }

    ctx.save();
    ctx.translate(glitchX, glitchY);

    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const topGrad = ctx.createRadialGradient(canvas.width, 0, 50, canvas.width, 0, 400);
    topGrad.addColorStop(0, 'rgba(255, 122, 24, 0.15)');
    topGrad.addColorStop(1, 'rgba(255, 122, 24, 0)');
    ctx.fillStyle = topGrad;
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
    });

    // Декоративная сетка
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
    ctx.strokeRect(avX, avY, avS, avS);
    if (avatarImg) {
        ctx.drawImage(avatarImg, avX + 1, avY + 1, avS - 2, avS - 2);
    } else {
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(avX + 1, avY + 1, avS - 2, avS - 2);
    }
    ctx.restore();

    // Тексты
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Fredoka";
    ctx.fillText("USER CARD", 25, 45);

    const username = document.getElementById("username").value || "sery2013";
    const date = document.getElementById("date").value || "03/12/2026";
    const bioText = document.getElementById("userBio").value || "Web3 Explorer";

    ctx.font = "bold 24px Fredoka";
    ctx.fillText(username, 205, 100);
    ctx.font = "18px Fredoka"; ctx.fillStyle = "#aaa";
    ctx.fillText("Joined: " + date, 205, 152);

    // Роли
    const selectedRoles = Array.from(document.querySelectorAll(".roles input[type='checkbox']")).filter(chk => chk.checked).map(chk => chk.value);
    let xStart = 185, yStart = 180;
    selectedRoles.forEach(role => {
        ctx.font = "bold 13px Fredoka";
        const bWidth = ctx.measureText(role).width + 26;
        ctx.fillStyle = "#ff7a18";
        ctx.beginPath(); ctx.roundRect(xStart, yStart, bWidth, 25, 6); ctx.fill();
        ctx.fillStyle = "white"; ctx.fillText(role, xStart + 13, yStart + 17);
        xStart += bWidth + 10;
    });

    // БИО
    ctx.fillStyle = "#eee"; ctx.font = "italic 16px Fredoka";
    ctx.fillText(bioText, 205, yStart + 73);

    // Логотип ORO
    ctx.textAlign = "right";
    ctx.fillStyle = "#ff7a18"; ctx.font = "bold 50px Fredoka";
    ctx.fillText("ORO", 760, 360);

    // Блик
    reflectionPos += 4; 
    if (reflectionPos > canvas.width + 500) reflectionPos = -500;
    const reflectGrad = ctx.createLinearGradient(reflectionPos, 0, reflectionPos + 300, 400);
    reflectGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    reflectGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.1)"); 
    reflectGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = reflectGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();

    if (isGenerating) {
        scanLineY += 8;
        if (scanLineY > 400) scanLineY = 0;
        ctx.strokeStyle = "#ffcc00";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, scanLineY); ctx.lineTo(canvas.width, scanLineY); ctx.stroke();
    }
}

function downloadCard() {
    playSound("soundClick");
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "oro-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// --- ФОНОВАЯ АНИМАЦИЯ САЙТА (ПОЛНАЯ ЛОГИКА) ---
(function() {
    const bgCanvas = document.getElementById("bgCanvas");
    if (!bgCanvas) return;
    const bgCtx = bgCanvas.getContext("2d");
    let bgLines = [];

    function init() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        bgLines = Array.from({ length: 80 }, () => ({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            speed: Math.random() * 1 + 0.5,
            len: Math.random() * 100 + 50,
            op: Math.random() * 0.3
        }));
    }

    function animate() {
        // Очищаем прозрачно для видимости CSS градиента
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        
        bgLines.forEach(l => {
            let dx = mouseX - l.x;
            let dy = mouseY - l.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            let currentSpeed = l.speed;
            
            if (dist < 250) {
                currentSpeed += (1 - dist/250) * 6;
            }

            l.y += currentSpeed;
            if (l.y > bgCanvas.height) { 
                l.y = -l.len; 
                l.x = Math.random() * bgCanvas.width; 
            }
            
            // Белые линии бликов
            let g = bgCtx.createLinearGradient(0, l.y, 0, l.y + l.len);
            g.addColorStop(0, 'transparent');
            g.addColorStop(1, `rgba(255, 255, 255, ${l.op + 0.1})`);
            bgCtx.strokeStyle = g;
            bgCtx.lineWidth = 1.2;
            bgCtx.beginPath(); 
            bgCtx.moveTo(l.x, l.y); 
            bgCtx.lineTo(l.x, l.y + l.len); 
            bgCtx.stroke();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    init();
    animate();
})();
