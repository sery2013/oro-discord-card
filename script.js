function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");

    // Очистка
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Фон
    const gradient = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    gradient.addColorStop(0,'#0b0c14');
    gradient.addColorStop(1,'#1f1f2a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Username и дата с рамками
    const username = document.getElementById("username").value;
    const date = document.getElementById("date").value;

    // Username рамка
    ctx.fillStyle = "#1a1b29";
    ctx.fillRect(330,200,700,60);
    ctx.strokeStyle = "#ff7a18";
    ctx.lineWidth = 3;
    ctx.strokeRect(330,200,700,60);

    ctx.fillStyle = "white";
    ctx.font = "42px Arial";
    ctx.fillText(username, 350, 240);

    // Дата рамка
    ctx.fillStyle = "#1a1b29";
    ctx.fillRect(330,270,700,50);
    ctx.strokeStyle = "#ffcc00";
    ctx.lineWidth = 3;
    ctx.strokeRect(330,270,700,50);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Joined: " + date, 350, 305);

    // Роли в блоках с градиентом
    const roleCheckboxes = document.querySelectorAll(".roles input[type='checkbox']");
    const selectedRoles = Array.from(roleCheckboxes).filter(chk=>chk.checked).map(chk=>chk.value);

    let yStart = 340;
    ctx.font = "28px Arial";
    selectedRoles.forEach((role,i)=>{
        const x=350;
        const w=500;
        const h=40;
        // Градиент для роли
        const grad = ctx.createLinearGradient(x,yStart,x+w,yStart+h);
        grad.addColorStop(0,"#ff7a18");
        grad.addColorStop(1,"#ffcc00");
        ctx.fillStyle=grad;
        ctx.fillRect(x,yStart,w,h);
        ctx.strokeStyle="#ffffff";
        ctx.lineWidth=2;
        ctx.strokeRect(x,yStart,w,h);

        ctx.fillStyle="black";
        ctx.fillText(role,x+10,yStart+28);

        yStart+=50; // отступ между ролями
    });

    // Функция безопасного рисования изображения
    function drawImageSafe(src, x, y, w, h, clipCircle=false, callback){
        const img=new Image();
        img.crossOrigin="anonymous";
        img.src=src;
        img.onload=function(){
            if(clipCircle){
                ctx.save();
                ctx.beginPath();
                ctx.arc(x+w/2,y+h/2,w/2,0,Math.PI*2);
                ctx.closePath();
                ctx.clip();
            }
            ctx.drawImage(img,x,y,w,h);
            if(clipCircle) ctx.restore();
            if(callback) callback();
        };
    }

    // Аватар с градиентной рамкой
    const avatarInput=document.getElementById("avatar");
    if(avatarInput.files[0]){
        const reader=new FileReader();
        reader.onload=function(e){
            drawImageSafe(e.target.result,60,190,180,180,true,function(){
                drawLogoAndQR();
            });
        }
        reader.readAsDataURL(avatarInput.files[0]);
    }else{
        drawLogoAndQR();
    }

    function drawLogoAndQR(){
        drawImageSafe("https://ltdfoto.ru/images/2026/03/12/ORO.png",820,40,220,120);
        drawImageSafe("https://ltdfoto.ru/images/2026/03/12/qr.png",880,360,160,160);
    }
}

// Скачать
function downloadCard(){
    const canvas=document.getElementById("cardCanvas");
    const link=document.createElement("a");
    link.download="oro-card.png";
    link.href=canvas.toDataURL();
    link.click();
}
