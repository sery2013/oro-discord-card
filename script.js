function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. ФОН С ГРАДИЕНТОМ
    const bgGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, 500);
    bgGrad.addColorStop(0, '#0d0e1a');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. ПОЛУПРОЗРАЧНЫЕ СИМВОЛЫ НА ФОНЕ
    ctx.save();
    ctx.fillStyle = "rgba(255, 122, 24, 0.05)";
    ctx.font = "bold 35px Fredoka";
    const pattern = ["( )", "*", "ORO", "( )", "*"];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 5; j++) {
            ctx.fillText(pattern[(i + j) % pattern.length], i * 130 - 20, j * 100 + 40);
        }
    }
    ctx.restore();

    // 3. ТОНКАЯ ВНЕШНЯЯ РАМКА КАРТОЧКИ
    ctx.strokeStyle = "rgba(255, 122, 24, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    const avX = 25, avY = 70, avS = 140, radius = 18;

    function drawFinalLayer() {
        // Название USER CARD ORO
        ctx.save();
        ctx.shadowColor = "rgba(255, 122, 24, 0.3)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "white";
        ctx.font = "bold 30px Fredoka";
        ctx.fillText("USER CARD ORO", 25, 45);
        ctx.restore();

        const username = document.getElementById("username").value || "sery2013";
        const date = document.getElementById("date").value || "2026-03-05";

        // ТОНКАЯ РАМКА Username
        ctx.strokeStyle = "rgba(255, 122, 24, 0.6)";
        ctx.lineWidth = 1;
        ctx.strokeRect(185, 65, 580, 50);
        ctx.fillStyle = "rgba(20, 21, 31, 0.6)";
        ctx.fillRect(185, 65, 580, 50);
        
        ctx.fillStyle = "white";
        ctx.font = "bold 24px Fredoka";
        ctx.fillText(username, 205, 100);

        // ТОНКАЯ РАМКА Joined Date
        ctx.strokeStyle = "rgba(255, 204, 0, 0.5)";
        ctx.strokeRect(185, 125, 580, 40);
        ctx.fillStyle = "rgba(15, 15, 20, 0.6)";
        ctx.fillRect(185, 125, 580, 40);
        
        ctx.fillStyle = "#ccc";
        ctx.font = "18px Fredoka";
        ctx.fillText("Joined: " + date, 205, 152);

        // --- РОЛИ С ГРАДИЕНТАМИ ---
        const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
        const selectedRoles = Array.from(roleCheckboxes).filter(chk => chk.checked).map(chk => chk.value);
        let xStart = 185, yStart = 180;

        selectedRoles.forEach(role => {
            let c1, c2;
            if (role === "Gold") { c1="#B8860B"; c2="#FFD700"; }
            else if (role === "Silver") { c1="#434343"; c2="#C0C0C0"; }
            else if (role === "Explorer") { c1="#008B8B"; c2="#00D4FF"; }
            else if (role.includes("Tier 1")) { c1="#CC5500"; c2="#FF7A18"; }
            else if (role.includes("Tier 2")) { c1="#b35900"; c2="#ff8c1a"; }
            else if (role.includes("Tier 3")) { c1="#996600"; c2="#ffaa00"; }
            else if (role.includes("Tier 4")) { c1="#808000"; c2="#bdb76b"; }
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
            ctx.fillText(role, xStart + 13, yStart + 21);
            xStart += bWidth + 10;
        });

        // --- ТЕКСТОВЫЙ ЛОГОТИП ORO ---
        ctx.save();
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 50px Fredoka";
        ctx.shadowColor = "#ff7a18";
        ctx.shadowBlur = 15;
        ctx.fillText("ORO", 760, 360);
        ctx.restore();

        // QR КОД
        const qr = new Image();
        qr.crossOrigin = "anonymous";
        qr.onload = function() {
            ctx.drawImage(qr, 35, 245, 120, 120);
            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.font = "10px Fredoka";
            ctx.textAlign = "center";
            ctx.fillText("Scan to visit", 95, 240);
            ctx.fillText("getoro.xyz", 95, 380);
        };
        qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://getoro.xyz";
    }

    // РИСУЕМ АВАТАР
    const avatarInput = document.getElementById("avatar");
    
    // Тонкая рамка аватара
    ctx.strokeStyle = "rgba(255, 122, 24, 0.8)";
    ctx.lineWidth = 1.5;
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
        ctx.fillStyle = "#1a1b29";
        ctx.beginPath();
        ctx.roundRect(avX + 1, avY + 1, avS - 2, avS - 2, radius - 1);
        ctx.fill();
        drawFinalLayer();
    }
}

function downloadCard() {
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "oro-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
