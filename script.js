function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Улучшенный градиент фона (Киберпанк стиль)
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 50, canvas.width/2, canvas.height/2, 500);
    gradient.addColorStop(0, '#1a1b29'); // Центр чуть светлее
    gradient.addColorStop(0.5, '#0b0c14');
    gradient.addColorStop(1, '#050508');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Название карточки с легким свечением
    ctx.shadowColor = "rgba(255, 122, 24, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Fredoka";
    ctx.fillText("USER CARD ORO", 20, 40);
    ctx.shadowBlur = 0; // Сбрасываем тень для остальных элементов

    // Данные
    const username = document.getElementById("username").value || "sery2013";
    const date = document.getElementById("date").value || "2026-02-28";

    // 3. Username с эффектом рамки
    ctx.fillStyle = "rgba(26, 27, 41, 0.8)";
    ctx.fillRect(180, 60, 580, 50);
    ctx.strokeStyle = "#ff7a18";
    ctx.lineWidth = 2;
    ctx.strokeRect(180, 60, 580, 50);
    
    ctx.fillStyle = "white";
    ctx.font = "bold 24px Fredoka";
    ctx.fillText(username, 200, 95);

    // 4. Дата
    ctx.fillStyle = "rgba(26, 27, 41, 0.8)";
    ctx.fillRect(180, 120, 580, 40);
    ctx.strokeStyle = "#ffcc00";
    ctx.strokeRect(180, 120, 580, 40);
    ctx.fillStyle = "#ccc";
    ctx.font = "18px Fredoka";
    ctx.fillText("Joined: " + date, 200, 148);

    // 5. Роли (Content Creators)
    const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
    const selectedRoles = Array.from(roleCheckboxes).filter(chk => chk.checked).map(chk => chk.value);

    let xStart = 180;
    let yStart = 180;
    const badgeHeight = 30;
    const badgeGap = 10;

    selectedRoles.forEach(role => {
        let color1, color2;
        if(role.includes("Tier 1")) { color1="#CC5500"; color2="#FF7A18"; }
        else if(role.includes("Tier 2")) { color1="#CC7722"; color2="#FF9F43"; }
        else if(role.includes("Tier 3")) { color1="#CC8800"; color2="#FFA500"; }
        else { color1="#444"; color2="#777"; }

        const badgeWidth = ctx.measureText(role).width + 30;
        if (xStart + badgeWidth > canvas.width - 20) { xStart = 180; yStart += badgeHeight + badgeGap; }

        const rGrad = ctx.createLinearGradient(xStart, yStart, xStart, yStart + badgeHeight);
        rGrad.addColorStop(0, color2);
        rGrad.addColorStop(1, color1);
        
        ctx.fillStyle = rGrad;
        ctx.roundRect(xStart, yStart, badgeWidth, badgeHeight, 5);
        ctx.fill();
        
        ctx.fillStyle = "white";
        ctx.font = "bold 13px Fredoka";
        ctx.fillText(role, xStart + 15, yStart + 20);
        xStart += badgeWidth + 10;
    });

    function drawImageSafe(src, x, y, w, h, callback) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => { ctx.drawImage(img, x, y, w, h); if(callback) callback(); };
    }

    // 6. Аватар (Исправленная обрезка)
    const avatarInput = document.getElementById("avatar");
    const avX = 20, avY = 60, avS = 140, radius = 15;

    function drawFinalPieces() {
        // Логотип ORO в правом нижнем углу (как на скрине)
        drawImageSafe("https://ltdfoto.ru/images/2026/03/12/ORO.png", 640, 310, 120, 60);

        // QR КОД (поднят)
        const qrY = 240; 
        drawImageSafe("https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://getoro.xyz", 20, qrY, 120, 120);
        
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "10px Fredoka";
        ctx.textAlign = "center";
        ctx.fillText("Scan to visit", 80, qrY - 10);
        ctx.fillText("getoro.xyz", 80, qrY + 135);
    }

    // Рамка аватара со свечением
    ctx.save();
    ctx.shadowColor = "#ff7a18";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(avX, avY, avS, avS, radius);
    ctx.strokeStyle = "#ff7a18";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    if (avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            ctx.save();
            ctx.beginPath();
            // Делаем область клипа чуть меньше рамки, чтобы края не торчали
            ctx.roundRect(avX + 3, avY + 3, avS - 6, avS - 6, radius - 2);
            ctx.clip();
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                ctx.drawImage(img, avX, avY, avS, avS);
                drawFinalPieces();
            };
            ctx.restore();
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        drawFinalPieces();
    }
}
