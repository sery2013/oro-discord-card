function generateCard(){
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 🔥 Фон под стиль getoro.xyz
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a0a0f');
    gradient.addColorStop(0.5, '#1a1a2e');
    gradient.addColorStop(1, '#0f0f1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Декоративная сетка
    ctx.strokeStyle = 'rgba(255, 122, 24, 0.08)';
    ctx.lineWidth = 1;
    for(let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for(let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
    
    // 📝 Заголовок карточки (на прежнем месте)
    ctx.fillStyle = "white";
    ctx.font = "bold 28px Fredoka";
    ctx.fillText("USER CARD ORO", 20, 35);
    
    // 👤 Username и 📅 дата
    const username = document.getElementById("username").value || "Username";
    const date = document.getElementById("date").value || "2026-01-01";
    
    // Username блок
    ctx.fillStyle = "#1a1b29";
    ctx.fillRect(180, 55, 420, 45);
    ctx.strokeStyle = "#ff7a18";
    ctx.lineWidth = 2;
    ctx.strokeRect(180, 55, 420, 45);
    ctx.fillStyle = "white";
    ctx.font = "bold 22px Fredoka";
    ctx.fillText(username, 195, 85);
    
    // Дата блок
    ctx.fillStyle = "#1a1b29";
    ctx.fillRect(180, 110, 420, 35);
    ctx.strokeStyle = "#ffcc00";
    ctx.lineWidth = 2;
    ctx.strokeRect(180, 110, 420, 35);
    ctx.fillStyle = "white";
    ctx.font = "16px Fredoka";
    ctx.fillText("Joined: " + date, 195, 135);
    
    // 🎖️ Роли
    const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
    const selectedRoles = Array.from(roleCheckboxes).filter(chk => chk.checked).map(chk => chk.value);
    
    let xStart = 180, yStart = 165, badgeHeight = 28, badgeGap = 8;
    
    selectedRoles.forEach(role => {
        let color = "#fff";
        switch(role){
            case "Gold": color = "#FFD700"; break;
            case "Silver": color = "#C0C0C0"; break;
            case "Bronze": color = "#CD7F32"; break;
            case "Iron": color = "#9A9A9A"; break;
            case "Explorer": color = "#00D4FF"; break;
            case "Content Creator Tier 1": color = "#FF7A18"; break;
            case "Content Creator Tier 2": color = "#FF9F43"; break;
            case "Content Creator Tier 3": color = "#FFA500"; break;
            case "Content Creator Tier 4": color = "#FFD166"; break;
        }
        const badgeWidth = ctx.measureText(role).width + 24;
        if(xStart + badgeWidth > canvas.width - 160){ xStart = 180; yStart += badgeHeight + badgeGap; }
        
        const grad = ctx.createLinearGradient(xStart, yStart, xStart + badgeWidth, yStart + badgeHeight);
        grad.addColorStop(0, color); grad.addColorStop(1, "#ffffff");
        ctx.fillStyle = grad;
        ctx.fillRect(xStart, yStart, badgeWidth, badgeHeight);
        ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.strokeRect(xStart, yStart, badgeWidth, badgeHeight);
        ctx.fillStyle = "#000"; ctx.font = "bold 14px Fredoka";
        ctx.fillText(role, xStart + 12, yStart + 19);
        xStart += badgeWidth + 8;
    });
    
    // 🖼️ Функция загрузки изображений
    function drawImageSafe(src, x, y, w, h, clipCircle = false, callback){
        const img = new Image(); img.crossOrigin = "anonymous"; img.src = src;
        img.onload = function(){
            if(clipCircle){ ctx.save(); ctx.beginPath(); ctx.arc(x+w/2, y+h/2, w/2, 0, Math.PI*2); ctx.clip(); }
            ctx.drawImage(img, x, y, w, h);
            if(clipCircle) ctx.restore();
            if(callback) callback();
        };
        img.onerror = () => { if(callback) callback(); };
    }
    
    // 👤 Аватар
    const avatarInput = document.getElementById("avatar");
    if(avatarInput.files && avatarInput.files[0]){
        const reader = new FileReader();
        reader.onload = e => drawImageSafe(e.target.result, 20, 55, 130, 130, true, drawLogoAndQR);
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        // Placeholder
        ctx.save(); ctx.beginPath(); ctx.arc(85, 120, 65, 0, Math.PI*2); ctx.clip();
        ctx.fillStyle = "#1a1b29"; ctx.fillRect(20, 55, 130, 130);
        ctx.fillStyle = "#ff7a18"; ctx.font = "bold 40px Fredoka"; ctx.textAlign = "center";
        ctx.fillText("👤", 85, 135); ctx.textAlign = "start"; ctx.restore();
        drawLogoAndQR();
    }
    
    function drawLogoAndQR(){
        // 🟠 Логотип ORO (справа сверху, на прежнем месте)
        drawImageSafe("https://ltdfoto.ru/images/2026/03/12/ORO.png", 660, 15, 120, 50);
        
        // 📱 QR код → getoro.xyz (справа снизу)
        const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://getoro.xyz";
        drawImageSafe(qrUrl, 670, 285, 100, 100);
        
        // Подпись под QR
        ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.font = "11px Fredoka"; ctx.textAlign = "center";
        ctx.fillText("Scan to visit", 720, 280);
        ctx.fillText("getoro.xyz", 720, 400);
        ctx.textAlign = "start";
    }
}

// 💾 Скачать карточку
function downloadCard(){
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "oro-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
