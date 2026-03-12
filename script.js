function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. ФОН (Радиальный градиент в стиле getoro.xyz)
    const bgGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, 500);
    bgGrad.addColorStop(0, '#11121d');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. ТОНКАЯ ВНЕШНЯЯ РАМКА КАРТОЧКИ
    ctx.strokeStyle = "rgba(255, 122, 24, 0.5)";
    ctx.lineWidth = 2; // Сделали тоньше
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    const avX = 25, avY = 70, avS = 140, radius = 18;

    function drawAllElements() {
        // Название карточки
        ctx.save();
        ctx.shadowColor = "rgba(255, 122, 24, 0.4)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "white";
        ctx.font = "bold 30px Fredoka";
        ctx.fillText("USER CARD ORO", 25, 45);
        ctx.restore();

        const username = document.getElementById("username").value || "sery2013";
        const date = document.getElementById("date").value || "2026-03-05";

        // Username
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

        // Дата
        ctx.strokeStyle = "#ffcc00";
        ctx.fillStyle = "rgba(15, 15, 20, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(185, 125, 580, 40);
        ctx.fillRect(185, 125, 580, 40);
        ctx.fillStyle = "#aaa";
        ctx.font = "18px Fredoka";
        ctx.fillText("Joined: " + date, 205, 152);

        // --- РОЛИ (Цвета под тон карточки) ---
        const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
        const selectedRoles = Array.from(roleCheckboxes).filter(chk => chk.checked).map(chk => chk.value);
        let xStart = 185, yStart = 185;

        selectedRoles.forEach(role => {
            let c1, c2;
            if (role === "Gold") { c1="#B8860B"; c2="#FFD700"; }
            else if (role === "Silver") { c1="#434343"; c2="#C0C0C0"; }
            else if (role.includes("Tier")) { c1="#CC5500"; c2="#FF7A18"; }
            else { c1="#1a1b29"; c2="#3a3b4c"; }

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

        // Логотип ORO (В нижний правый угол)
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.src = "https://ltdfoto.ru/images/2026/03/12/ORO.png";
        logo.onload = () => ctx.drawImage(logo, 630, 315, 130, 65);

        // QR Код
        const qr = new Image();
        qr.crossOrigin = "anonymous";
        qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://getoro.xyz";
        qr.onload = () => {
            ctx.drawImage(qr, 35, 245, 120, 120);
            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.font = "10px Fredoka";
            ctx.textAlign = "center";
            ctx.fillText("Scan to visit", 95, 240);
            ctx.fillText("getoro.xyz", 95, 380);
        };
    }

    // РИСУЕМ АВАТАР
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

    if (avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                ctx.save();
                ctx.beginPath();
                // Жесткая обрезка: отступаем 2px внутрь рамки
                ctx.roundRect(avX + 2, avY + 2, avS - 4, avS - 4, radius - 2);
                ctx.clip();
                ctx.drawImage(img, avX, avY, avS, avS);
                ctx.restore();
                drawAllElements();
            };
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        ctx.fillStyle = "#1a1b29";
        ctx.beginPath();
        ctx.roundRect(avX + 2, avY + 2, avS - 4, avS - 4, radius - 2);
        ctx.fill();
        drawAllElements();
    }
}
