function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. ФОН
    const bgGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, 500);
    bgGrad.addColorStop(0, '#0d0e1a');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. ПРОЗРАЧНЫЙ ПАТТЕРН (ORO / * / ())
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

    // 3. ВНЕШНЯЯ РАМКА
    ctx.strokeStyle = "rgba(255, 122, 24, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    const avX = 25, avY = 70, avS = 140, radius = 18;

    function drawFinalLayer() {
        // --- ЗАГОЛОВОК СО СВЕЧЕНИЕМ ---
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "bold 30px Fredoka";
        ctx.shadowColor = "#ff7a18";
        ctx.shadowBlur = 15;
        ctx.fillText("USER CARD", 25, 45);
        ctx.restore();

        // --- БЕЛАЯ ЛИНИЯ СПРАВА ---
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(215, 35); 
        ctx.lineTo(765, 35);
        ctx.stroke();

        const username = document.getElementById("username").value || "sery2013";
        const date = document.getElementById("date").value || "2026-03-12";

        // Поля Username/Date
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

        // Роли
        const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
        const selectedRoles = Array.from(roleCheckboxes).filter(chk => chk.checked).map(chk => chk.value);
        let xStart = 185, yStart = 180;

        selectedRoles.forEach(role => {
            let c1 = "#2a2b3d", c2 = "#4a4b5d";
            if (role === "Gold") { c1="#B8860B"; c2="#FFD700"; }
            else if (role === "Explorer") { c1="#008B8B"; c2="#00D4FF"; }
            else if (role.includes("Tier 1")) { c1="#CC5500"; c2="#FF7A18"; }

            ctx.font = "bold 13px Fredoka";
            const bWidth = ctx.measureText(role).width + 26;
            if(xStart + bWidth > canvas.width - 20) { xStart = 185; yStart += 35; }

            const g = ctx.createLinearGradient(xStart, yStart, xStart, yStart + 25);
            g.addColorStop(0, c2); g.addColorStop(1, c1);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.roundRect(xStart, yStart, bWidth, 25, 6);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.fillText(role, xStart + 13, yStart + 17);
            xStart += bWidth + 10;
        });

        // --- BIO ---
        const bioY = yStart + 45;
        ctx.strokeStyle = "rgba(255, 122, 24, 0.5)";
        ctx.strokeRect(185, bioY, 580, 45);
        ctx.fillStyle = "#eee";
        ctx.font = "italic 16px Fredoka";
        ctx.fillText("Web3 Explorer & Content Enthusiast", 205, bioY + 28);

        // --- СОЦИАЛЬНЫЕ СЕТИ (Опущены на 40px) ---
        const socialY = bioY + 105; // Было +65, стало +105
        ctx.font = "14px Fredoka";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";

        // Отрисовка X (Twitter)
        ctx.fillText("X", 185, socialY);
        
        // Отрисовка Telegram (иконка самолета)
        ctx.beginPath();
        ctx.moveTo(225, socialY - 10);
        ctx.lineTo(240, socialY - 5);
        ctx.lineTo(235, socialY);
        ctx.lineTo(225, socialY - 10);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.stroke();
        ctx.fillText("Telegram", 245, socialY);

        // Отрисовка Discord
        ctx.fillText("Discord", 345, socialY);
        
        // Сайт
        ctx.fillText("getoro.xyz", 445, socialY);

        // --- НИЖНИЙ ЛОГОТИП ORO ---
        ctx.save();
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 50px Fredoka";
        ctx.shadowColor = "#ff7a18";
        ctx.shadowBlur = 15;
        ctx.fillText("ORO", 760, 360);
        ctx.restore();

        // QR Код
        const qr = new Image();
        qr.crossOrigin = "anonymous";
        qr.onload = function() {
            ctx.drawImage(qr, 35, 245, 120, 120);
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.font = "10px Fredoka";
            ctx.textAlign = "center";
            ctx.fillText("Scan to visit", 95, 240);
            ctx.fillText("getoro.xyz", 95, 380);
        };
        qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://getoro.xyz";
    }

    // Аватар
    const avatarInput = document.getElementById("avatar");
    ctx.strokeStyle = "rgba(255, 122, 24, 0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(avX, avY, avS, avS, radius);
    ctx.stroke();

    if (avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(avX + 1, avY + 1, avS - 2, avS - 2, radius - 1);
                ctx.clip();
                ctx.drawImage(img, avX, avY, avS, avS);
                ctx.restore();
                drawFinalLayer();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        drawFinalLayer();
    }
}
