function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Фон в стиле getoro.xyz (Радиальный градиент)
    const bgGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, 500);
    bgGrad.addColorStop(0, '#11121d');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Тонкая рамка всей карточки
    ctx.strokeStyle = "rgba(255, 122, 24, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    const avX = 25, avY = 70, avS = 140, radius = 18;

    // Вспомогательная функция для загрузки и отрисовки
    function drawImagesLayer(callback) {
        let loadedCount = 0;
        const totalImages = 2;
        
        const logo = new Image();
        const qr = new Image();
        logo.crossOrigin = "anonymous";
        qr.crossOrigin = "anonymous";

        const onImageLoad = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                // Рисуем логотип (справа внизу)
                ctx.drawImage(logo, 630, 310, 130, 65);
                // Рисуем QR
                ctx.drawImage(qr, 35, 245, 120, 120);
                callback();
            }
        };

        logo.onload = onImageLoad;
        qr.onload = onImageLoad;
        
        logo.src = "https://ltdfoto.ru/images/2026/03/12/ORO.png";
        qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://getoro.xyz";
    }

    function drawContent() {
        // Название
        ctx.save();
        ctx.shadowColor = "rgba(255, 122, 24, 0.5)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "white";
        ctx.font = "bold 30px Fredoka";
        ctx.fillText("USER CARD ORO", 25, 45);
        ctx.restore();

        const username = document.getElementById("username").value || "sery2013";
        const date = document.getElementById("date").value || "2026-03-05";

        // Username блок со свечением
        ctx.save();
        ctx.shadowColor = "#ff7a18";
        ctx.shadowBlur = 8;
        ctx.strokeStyle = "#ff7a18";
        ctx.lineWidth = 2;
        ctx.fillStyle = "rgba(20, 21, 31, 0.9)";
        ctx.fillRect(185, 65, 580, 50);
        ctx.strokeRect(185, 65, 580, 50);
        ctx.restore();
        
        ctx.fillStyle = "white";
        ctx.font = "bold 24px Fredoka";
        ctx.fillText(username, 205, 98);

        // Дата блок
        ctx.strokeStyle = "#ffcc00";
        ctx.fillStyle = "rgba(15, 15, 20, 0.8)";
        ctx.strokeRect(185, 125, 580, 40);
        ctx.fillRect(185, 125, 580, 40);
        ctx.fillStyle = "#aaa";
        ctx.font = "18px Fredoka";
        ctx.fillText("Joined: " + date, 205, 152);

        // --- РОЛИ С РАЗНЫМИ ЦВЕТАМИ ---
        const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
        const selectedRoles = Array.from(roleCheckboxes).filter(chk => chk.checked).map(chk => chk.value);
        let xStart = 185, yStart = 185;

        selectedRoles.forEach(role => {
            let c1, c2;
            // Логика цветов для каждой роли
            if (role === "Gold") { c1="#B8860B"; c2="#FFD700"; }
            else if (role === "Silver") { c1="#434343"; c2="#C0C0C0"; }
            else if (role === "Bronze") { c1="#8B4513"; c2="#CD7F32"; }
            else if (role === "Explorer") { c1="#008B8B"; c2="#00D4FF"; }
            else if (role.includes("Tier 1")) { c1="#CC5500"; c2="#FF7A18"; }
            else if (role.includes("Tier 2")) { c1="#CC7722"; c2="#FF9F43"; }
            else if (role.includes("Tier 3")) { c1="#9e6a00"; c2="#ffcc00"; }
            else { c1="#2a2b3d"; c2="#4a4b5d"; }

            ctx.font = "bold 13px Fredoka";
            const bWidth = ctx.measureText(role).width + 26;
            if(xStart + bWidth > canvas.width - 20) { xStart = 185; yStart += 40; }

            const g = ctx.createLinearGradient(xStart, yStart, xStart, yStart + 30);
            g.addColorStop(0, c2); g.addColorStop(1, c1);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.roundRect(xStart, yStart, bWidth, 30, 6);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.fillText(role, xStart + 13, yStart + 20);
            xStart += bWidth + 10;
        });

        // Подписи к QR (рисуем после того как drawImagesLayer закончит)
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "10px Fredoka";
        ctx.textAlign = "center";
        ctx.fillText("Scan to visit", 95, 240);
        ctx.fillText("getoro.xyz", 95, 380);
        ctx.textAlign = "start";
    }

    // РИСУЕМ АВАТАР И ЗАПУСКАЕМ ОСТАЛЬНОЕ
    const avatarInput = document.getElementById("avatar");
    
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

    const finishDrawing = () => drawImagesLayer(drawContent);

    if (avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(avX + 2, avY + 2, avS - 4, avS - 4, radius - 2);
                ctx.clip();
                ctx.drawImage(img, avX, avY, avS, avS);
                ctx.restore();
                finishDrawing();
            };
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        ctx.fillStyle = "#1a1b29";
        ctx.beginPath();
        ctx.roundRect(avX + 2, avY + 2, avS - 4, avS - 4, radius - 2);
        ctx.fill();
        finishDrawing();
    }
}
