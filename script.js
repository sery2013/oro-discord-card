function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. ПРЕМИАЛЬНЫЙ ФОН (Радиальный градиент под Oro)
    const bgGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, 500);
    bgGrad.addColorStop(0, '#0d0e1a');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. УЛЬТРА-ПРОЗРАЧНЫЙ ПАТТЕРН (0.03)
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

    // 3. ТОНКАЯ ВНЕШНЯЯ РАМКА
    ctx.strokeStyle = "rgba(255, 122, 24, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    const avX = 25, avY = 70, avS = 140, radius = 18;

    // Вспомогательная функция, которая рисует всё ОСТАЛЬНОЕ после загрузки аватара
    function drawFinalLayer() {
        // Название карточки
        ctx.fillStyle = "white";
        ctx.font = "bold 30px Fredoka";
        ctx.fillText("USER CARD ORO", 25, 45);

        const username = document.getElementById("username").value || "sery2013";
        const date = document.getElementById("date").value || "2026-03-12";

        // ТОНКИЕ РАМКИUsername
        ctx.strokeStyle = "rgba(255, 122, 24, 0.5)";
        ctx.lineWidth = 1;
        ctx.strokeRect(185, 65, 580, 50);
        ctx.fillStyle = "rgba(20, 21, 31, 0.5)";
        ctx.fillRect(185, 65, 580, 50);
        
        ctx.fillStyle = "white";
        ctx.font = "bold 24px Fredoka";
        ctx.fillText(username, 205, 100);

        // Date
        ctx.strokeStyle = "rgba(255, 204, 0, 0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(185, 125, 580, 40);
        ctx.fillStyle = "rgba(15, 15, 20, 0.5)";
        ctx.fillRect(185, 125, 580, 40);
        
        ctx.fillStyle = "#aaa";
        ctx.font = "18px Fredoka";
        ctx.fillText("Joined: " + date, 205, 152);

        // --- РОЛИ С ГРАДИЕНТАМИ (РАЗНОЦВЕТНЫЕ) ---
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

        // --- ДОБАВЛЕННЫЙ БЛОК: BIO (В ТОНКОЙ РАМКЕ) ---
        const bioY = yStart + 45;
        ctx.strokeStyle = "rgba(255, 122, 24, 0.5)";
        ctx.lineWidth = 1;
        ctx.strokeRect(185, bioY, 580, 45); // Рамка как у логина
        ctx.fillStyle = "rgba(20, 21, 31, 0.4)";
        ctx.fillRect(185, bioY, 580, 45);
        
        ctx.fillStyle = "#eee";
        ctx.font = "italic 16px Fredoka";
        ctx.fillText("Web3 Explorer & Content Enthusiast", 205, bioY + 28);

        // --- СОЦИАЛЬНЫЕ СЕТИ ---
        const socialY = bioY + 65;
        ctx.font = "14px Fredoka";
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        
        const socials = ["𝕏 Twitter", "✈️ Telegram", "💬 Discord", "🌐 getoro.xyz"];
        let socialX = 185;
        socials.forEach(item => {
            ctx.fillText(item, socialX, socialY);
            socialX += ctx.measureText(item).width + 25;
        });

        // --- ЛОГОТИП ORO (НИЖНИЙ ПРАВЫЙ) ---
        ctx.save();
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 50px Fredoka";
        ctx.shadowColor = "#ff7a18";
        ctx.shadowBlur = 15;
        ctx.fillText("ORO", 760, 360);
        ctx.restore();

        // QR
        const qr = new Image();
        qr.crossOrigin = "anonymous";
        qr.onload = function() {
            ctx.drawImage(qr, 35, 245, 120, 120);
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.font = "10px Fredoka";
            ctx.textAlign = "center";
            ctx.fillText("getoro.xyz", 95, 380);
        };
        qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://getoro.xyz";
    }

    const avatarInput = document.getElementById("avatar");
    
    // Рамка аватара
    ctx.strokeStyle = "rgba(255, 122, 24, 0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(avX, avY, avS, avS, radius);
    ctx.stroke();

    if (avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            // ГАРАНТИЯ: Рисуем аватар, и только потом всё остальное
            img.onload = () => {
                ctx.drawImage(img, avX + 1, avY + 1, avS - 2, avS - 2); 
                drawFinalLayer();
            };
            img.onerror = drawFinalLayer; // Protection if image fails
            img.src = e.target.result;
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        // Если файла нет, сразу рисуем контент
        ctx.fillStyle = "#1a1b29";
        ctx.beginPath();
        ctx.roundRect(avX + 1, avY + 1, avS - 2, avS - 2, radius - 1);
        ctx.fill();
        drawFinalLayer();
    }
}
