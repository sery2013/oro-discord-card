function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. УЛУЧШЕННЫЙ ГРАДИЕНТ ФОНА (Глубокий темный с золотым отливом)
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#0a0a14'); // Темно-синий
    bgGradient.addColorStop(0.5, '#050508'); // Почти черный
    bgGradient.addColorStop(1, '#0e0b11'); // С золотистым отливом
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. ПОЛУПРОЗРАЧНЫЕ ТЕМАТИЧЕСКИЕ СИМВОЛЫ
    ctx.fillStyle = "rgba(255, 204, 0, 0.05)"; // Очень тусклый золотой
    ctx.font = "bold 40px Fredoka";
    const symbols = ["( )", "*", "ORO", "( )", "getoro.xyz"];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            ctx.fillText(symbols[(i+j)%symbols.length], i * 150 - 50, j * 120 + 50);
        }
    }

    const avX = 25, avY = 70, avS = 140, radius = 18;

    // Функция отрисовки всех элементов (ВЫЗЫВАЕТСЯ ПОСЛЕ ЗАГРУЗКИ)
    function drawAllElements() {
        // Название карточки со свечением
        ctx.save();
        ctx.shadowColor = "rgba(255, 122, 24, 0.4)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "white";
        ctx.font = "bold 30px Fredoka";
        ctx.fillText("USER CARD ORO", 25, 45);
        ctx.restore();

        const username = document.getElementById("username").value || "sery2013";
        const date = document.getElementById("date").value || "2026-03-05";

        // Username со свечением
        ctx.save();
        ctx.shadowColor = "#ff7a18";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(20, 21, 31, 0.8)";
        ctx.fillRect(185, 65, 580, 50);
        ctx.strokeStyle = "#ff7a18";
        ctx.lineWidth = 2;
        ctx.strokeRect(185, 65, 580, 50);
        ctx.restore();
        ctx.fillStyle = "white";
        ctx.font = "bold 24px Fredoka";
        ctx.fillText(username, 205, 98);

        // Дата
        ctx.fillStyle = "rgba(15, 15, 20, 0.8)";
        ctx.fillRect(185, 125, 580, 40);
        ctx.strokeStyle = "#ffcc00";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(185, 125, 580, 40);
        ctx.fillStyle = "#aaa";
        ctx.font = "18px Fredoka";
        ctx.fillText("Joined: " + date, 205, 152);

        // --- РОЛИ С РАЗНЫМИ ЦВЕТАМИ ---
        const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
        const selectedRoles = Array.from(roleCheckboxes).filter(chk => chk.checked).map(chk => chk.value);
        let xStart = 185, yStart = 185;

        selectedRoles.forEach(role => {
            let c1 = "#CC5500", c2 = "#FF7A18"; // Оранжевый (Default for Tier 1/2)
            if (role === "Explorer") { c1="#008B8B"; c2="#00D4FF"; } // Синий неоновый
            if (role === "Gold") { c1="#B8860B"; c2="#FFD700"; }
            if (role === "Silver") { c1="#434343"; c2="#C0C0C0"; }

            ctx.font = "bold 13px Fredoka";
            const bWidth = ctx.measureText(role).width + 26;
            if(xStart + bWidth > canvas.width - 20) { xStart = 185; yStart += 40; }

            const g = ctx.createLinearGradient(xStart, yStart, xStart, yStart + 30);
            g.addColorStop(0, c2); g.addColorStop(1, c1);
            ctx.fillStyle = g;
            ctx.roundRect(xStart, yStart, bWidth, 30, 6);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.fillText(role, xStart + 13, yStart + 20);
            xStart += bWidth + 10;
        });

        // 3. ПОДПИСИ К QR (рисуем после того как qr точно загрузится)
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "10px Fredoka";
        ctx.textAlign = "center";
        ctx.fillText("Scan to visit", 95, 240);
        ctx.fillText("getoro.xyz", 95, 380);
        ctx.textAlign = "start";
    }

    // --- ЦЕПОЧКА ЗАГРУЗКИ КАРТИНОК ---
    const avatarInput = document.getElementById("avatar");
    let avatarLoaded = false, logoLoaded = false, qrLoaded = false;
    
    function checkAllLoaded() {
        if (avatarLoaded && logoLoaded && qrLoaded) {
            drawAllElements();
        }
    }

    // 1. Аватар
    const avatarImg = new Image();
    if (avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarImg.src = e.target.result;
            avatarImg.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(avX + 2, avY + 2, avS - 4, avS - 4, radius - 2);
                ctx.clip();
                ctx.drawImage(avatarImg, avX, avY, avS, avS);
                ctx.restore();
                avatarLoaded = true;
                checkAllLoaded();
            };
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else { avatarLoaded = true; } // Placeholder if no file

    // Рамка аватара
    ctx.save();
    ctx.shadowColor = "#ff7a18";
    ctx.shadowBlur = 12;
    ctx.strokeStyle = "#ff7a18";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(avX, avY, avS, avS, radius);
    ctx.stroke();
    ctx.restore();

    // 2. Логотип ORO
    const logo = new Image();
    logo.crossOrigin = "anonymous";
    logo.src = "https://ltdfoto.ru/images/2026/03/12/ORO.png";
    logo.onload = () => {
        ctx.drawImage(logo, 630, 310, 130, 65);
        logoLoaded = true;
        checkAllLoaded();
    };

    // 3. QR Код
    const qr = new Image();
    qr.crossOrigin = "anonymous";
    qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://getoro.xyz";
    qr.onload = () => {
        ctx.drawImage(qr, 35, 245, 120, 120);
        qrLoaded = true;
        checkAllLoaded();
    };
}
