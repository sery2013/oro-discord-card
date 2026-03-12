function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");

    // Очистка
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Фон
    ctx.fillStyle = "#0b0c14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Username и дата
    const username = document.getElementById("username").value;
    const date = document.getElementById("date").value;

    ctx.fillStyle = "white";
    ctx.font = "42px Arial";
    ctx.fillText(username, 350, 230);

    ctx.font = "24px Arial";
    ctx.fillText("Joined: " + date, 350, 340);

    // Роли (множественный выбор)
    const roleSelect = document.getElementById("role");
    const selectedRoles = Array.from(roleSelect.selectedOptions).map(opt => opt.value);

    ctx.font = "28px Arial";
    let yStart = 290;
    selectedRoles.forEach(role => {
        let roleColor = "white";
        if (role.includes("Content Creator")) roleColor = "#ff7a18";
        if (role === "Explorer") roleColor = "#00d4ff";
        if (role === "Iron") roleColor = "#9a9a9a";
        if (role === "Bronze") roleColor = "#cd7f32";
        if (role === "Silver") roleColor = "#c0c0c0";
        if (role === "Gold") roleColor = "#ffd700";

        ctx.fillStyle = roleColor;
        ctx.fillText(role, 350, yStart);
        yStart += 40;
    });

    ctx.fillStyle = "white";

    // Рисуем аватар (если выбран)
    const avatarInput = document.getElementById("avatar");
    if (avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const avatar = new Image();
            avatar.onload = function () {
                ctx.save();
                ctx.beginPath();
                ctx.arc(150, 280, 90, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatar, 60, 190, 180, 180);
                ctx.restore();

                // После аватара рисуем логотип и QR
                drawLogoAndQR(ctx);
            };
            avatar.src = e.target.result;
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        // Если аватар не выбран, сразу рисуем логотип и QR
        drawLogoAndQR(ctx);
    }
}

// Функция для логотипа и QR
function drawLogoAndQR(ctx) {
    const logo = new Image();
    logo.crossOrigin = "anonymous";
    logo.src = "https://ltdfoto.ru/images/2026/03/12/ORO.png";
    logo.onload = function () {
        ctx.drawImage(logo, 820, 40, 220, 120);

        const qr = new Image();
        qr.crossOrigin = "anonymous";
        qr.src = "https://ltdfoto.ru/images/2026/03/12/qr.png";
        qr.onload = function () {
            ctx.drawImage(qr, 880, 360, 160, 160);
        };
    };
}

// Download
function downloadCard() {
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "oro-card.png";
    link.href = canvas.toDataURL();
    link.click();
}
