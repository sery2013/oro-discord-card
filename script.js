function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");

    // Очистка и фон
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0b0c14";
    ctx.fillRect(0, 0, 1100, 550);

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

    // Асинхронная функция для загрузки изображения
    function loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => resolve(img);
        });
    }

    async function drawImages() {
        // Логотип
        const logo = await loadImage("https://ltdfoto.ru/images/2026/03/12/ORO.png");
        ctx.drawImage(logo, 820, 40, 220, 120);

        // QR
        const qr = await loadImage("https://ltdfoto.ru/images/2026/03/12/qr.png");
        ctx.drawImage(qr, 880, 360, 160, 160);

        // Аватар (если загружен)
        const avatarInput = document.getElementById("avatar");
        if (avatarInput.files[0]) {
            const reader = new FileReader();
            reader.onload = async function (e) {
                const avatar = await loadImage(e.target.result);

                ctx.save();
                ctx.beginPath();
                ctx.arc(150, 280, 90, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatar, 60, 190, 180, 180);
                ctx.restore();
            };
            reader.readAsDataURL(avatarInput.files[0]);
        }
    }

    drawImages();
}

// Download
function downloadCard() {
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "oro-card.png";
    link.href = canvas.toDataURL();
    link.click();
}
