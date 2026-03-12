function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. ФОН И СЕТКА
    const bgGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, 500);
    bgGrad.addColorStop(0, '#0d0e1a');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.fillStyle = "rgba(255, 122, 24, 0.03)";
    ctx.font = "bold 35px Fredoka";
    const pattern = ["( )", "*", "ORO", "( )", "*"];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 5; j++) {
            ctx.fillText(pattern[(i + j) % pattern.length], i * 130 - 20, j * 100 + 40);
        }
    }
    ctx.restore();

    // 2. ЗАГОЛОВОК И ЛИНИЯ ЦВЕТА РАМОК
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Fredoka";
    ctx.shadowColor = "#ff7a18";
    ctx.shadowBlur = 15;
    ctx.fillText("USER CARD", 25, 45);
    ctx.restore();

    // Линия в цвет рамок (оранжевая полупрозрачная)
    ctx.strokeStyle = "rgba(255, 122, 24, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(215, 35); 
    ctx.lineTo(765, 35);
    ctx.stroke();

    // 3. ПОЛЯ (Username, Date, Bio)
    const username = document.getElementById("username").value || "sery2013";
    const date = document.getElementById("date").value || "2026-03-12";

    ctx.strokeStyle = "rgba(255, 122, 24, 0.5)";
    ctx.strokeRect(185, 65, 580, 50);
    ctx.fillStyle = "white";
    ctx.font = "bold 24px Fredoka";
    ctx.fillText(username, 205, 100);

    ctx.strokeStyle = "rgba(255, 204, 0, 0.4)";
    ctx.strokeRect(185, 125, 580, 40);
    ctx.fillStyle = "#aaa";
    ctx.font = "18px Fredoka";
    ctx.fillText("Joined: " + date, 205, 152);

    let xStart = 185, yStart = 180;
    const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
    const selectedRoles = Array.from(roleCheckboxes).filter(chk => chk.checked).map(chk => chk.value);

    selectedRoles.forEach(role => {
        ctx.font = "bold 13px Fredoka";
        const bWidth = ctx.measureText(role).width + 26;
        if(xStart + bWidth > canvas.width - 20) { xStart = 185; yStart += 35; }
        ctx.fillStyle = "rgba(255, 122, 24, 0.2)";
        ctx.beginPath(); ctx.roundRect(xStart, yStart, bWidth, 25, 6); ctx.fill();
        ctx.fillStyle = "white"; ctx.fillText(role, xStart + 13, yStart + 17);
        xStart += bWidth + 10;
    });

    const bioY = yStart + 45;
    ctx.strokeStyle = "rgba(255, 122, 24, 0.5)";
    ctx.strokeRect(185, bioY, 580, 45);
    ctx.fillStyle = "#eee";
    ctx.font = "italic 16px Fredoka";
    ctx.fillText("Web3 Explorer & Content Enthusiast", 205, bioY + 28);

    // 4. СОЦИАЛЬНЫЕ СЕТИ (ИКОНКИ + ТЕКСТ) ОПУЩЕНЫ НА 40px
    const sY = bioY + 105; 
    ctx.font = "14px Fredoka";
    ctx.fillStyle = "white";

    // Функция отрисовки Telegram (Залитый)
    function drawTG(x, y) {
        ctx.save();
        ctx.translate(x, y-12);
        ctx.fillStyle = "#0088cc";
        ctx.beginPath();
        ctx.moveTo(0, 7); ctx.lineTo(15, 0); ctx.lineTo(13, 15); ctx.lineTo(9, 10); ctx.lineTo(9, 14); ctx.lineTo(7, 10); ctx.lineTo(0, 7);
        ctx.fill();
        ctx.restore();
        ctx.fillText("Telegram", x + 22, y);
    }

    // Функция отрисовки X (Залитый)
    function drawX(x, y) {
        ctx.save();
        ctx.translate(x, y-12);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 15px Arial";
        ctx.fillText("𝕏", 0, 13);
        ctx.restore();
        ctx.fillText("Twitter", x + 22, y);
    }

    // Функция отрисовки Discord (Залитый силуэт)
    function drawDC(x, y) {
        ctx.save();
        ctx.translate(x, y-12);
        ctx.fillStyle = "#5865F2";
        ctx.beginPath();
        ctx.arc(8, 7, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.fillText("Discord", x + 22, y);
    }

    drawX(185, sY);
    drawTG(285, sY);
    drawDC(395, sY);
    ctx.fillText("🌐 getoro.xyz", 505, sY);

    // 5. ЛОГОТИП И QR
    ctx.save();
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 50px Fredoka";
    ctx.shadowColor = "#ff7a18";
    ctx.shadowBlur = 15;
    ctx.fillText("ORO", 760, 360);
    ctx.restore();

    const qr = new Image();
    qr.crossOrigin = "anonymous";
    qr.onload = () => {
        ctx.drawImage(qr, 35, 245, 120, 120);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.textAlign = "center";
        ctx.font = "10px Fredoka";
        ctx.fillText("getoro.xyz", 95, 380);
    };
    qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://getoro.xyz";

    // 6. АВАТАР (Тонкая рамка)
    const avatarInput = document.getElementById("avatar");
    ctx.strokeStyle = "rgba(255, 122, 24, 0.7)";
    ctx.lineWidth = 1;
    ctx.strokeRect(avX, avY, avS, avS);
    if (avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, avX+1, avY+1, avS-2, avS-2);
            img.src = e.target.result;
        };
        reader.readAsDataURL(avatarInput.files[0]);
    }
}
