function generateCard(){
    const canvas=document.getElementById("cardCanvas");
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Фон градиент
    const gradient=ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    gradient.addColorStop(0,'#0b0c14');
    gradient.addColorStop(1,'#1f1f2a');
    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Username и дата с рамками
    const username=document.getElementById("username").value;
    const date=document.getElementById("date").value;

    // Username рамка
    ctx.fillStyle="#1a1b29";
    ctx.fillRect(220,50,550,50);
    ctx.strokeStyle="#ff7a18";
    ctx.lineWidth=3;
    ctx.strokeRect(220,50,550,50);

    ctx.fillStyle="white";
    ctx.font="28px Fredoka";
    ctx.fillText(username,230,85);

    // Дата рамка
    ctx.fillStyle="#1a1b29";
    ctx.fillRect(220,110,550,40);
    ctx.strokeStyle="#ffcc00";
    ctx.lineWidth=3;
    ctx.strokeRect(220,110,550,40);

    ctx.fillStyle="white";
    ctx.font="20px Fredoka";
    ctx.fillText("Joined: "+date,230,137);

    // Роли в мини-бейджах
    const roleCheckboxes=document.querySelectorAll(".roles input[type='checkbox']");
    const selectedRoles=Array.from(roleCheckboxes).filter(chk=>chk.checked).map(chk=>chk.value);

    let xStart=220;
    let yStart=170;
    const badgeHeight=30;
    const badgeGap=10;

    selectedRoles.forEach(role=>{
        let color="#fff";
        switch(role){
            case "Gold": color="#FFD700"; break;
            case "Silver": color="#C0C0C0"; break;
            case "Bronze": color="#CD7F32"; break;
            case "Iron": color="#9A9A9A"; break;
            case "Explorer": color="#00D4FF"; break;
            case "Content Creator Tier 1": color="#FF7A18"; break;
            case "Content Creator Tier 2": color="#FF9F43"; break;
            case "Content Creator Tier 3": color="#FFA500"; break;
            case "Content Creator Tier 4": color="#FFD166"; break;
        }
        const badgeWidth=ctx.measureText(role).width+20;
        // Бейдж с градиентом
        const grad=ctx.createLinearGradient(xStart,yStart,xStart+badgeWidth,yStart+badgeHeight);
        grad.addColorStop(0,color);
        grad.addColorStop(1,"#ffffff");
        ctx.fillStyle=grad;
        ctx.fillRect(xStart,yStart,badgeWidth,badgeHeight);
        ctx.strokeStyle="#000";
        ctx.lineWidth=1;
        ctx.strokeRect(xStart,yStart,badgeWidth,badgeHeight);

        ctx.fillStyle="#000";
        ctx.font="18px Fredoka";
        ctx.fillText(role,xStart+10,yStart+20);

        xStart+=badgeWidth+10;
        if(xStart>700){ // перенос на следующую строку
            xStart=220;
            yStart+=badgeHeight+badgeGap;
        }
    });

    // Функция безопасного рисования изображения
    function drawImageSafe(src,x,y,w,h,clipCircle=false,callback){
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

    // Аватар слева
    const avatarInput=document.getElementById("avatar");
    if(avatarInput.files[0]){
        const reader=new FileReader();
        reader.onload=function(e){
            drawImageSafe(e.target.result,50,50,150,150,true,drawLogoAndQR);
        };
        reader.readAsDataURL(avatarInput.files[0]);
    }else{
        drawLogoAndQR();
    }

    function drawLogoAndQR(){
        drawImageSafe("https://ltdfoto.ru/images/2026/03/12/ORO.png",650,50,120,60);
        drawImageSafe("https://ltdfoto.ru/images/2026/03/12/qr.png",650,280,100,100);
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
