function generateCard(){
const canvas=document.getElementById("cardCanvas");
const ctx=canvas.getContext("2d");
ctx.clearRect(0,0,canvas.width,canvas.height);

// Фон
const gradient=ctx.createLinearGradient(0,0,canvas.width,canvas.height);
gradient.addColorStop(0,'#0b0c14');
gradient.addColorStop(1,'#1f1f2a');
ctx.fillStyle=gradient;
ctx.fillRect(0,0,canvas.width,canvas.height);

// Название карточки сверху
ctx.fillStyle="white";
ctx.font="bold 30px Fredoka";
ctx.fillText("USER CARD ORO",20,40);

// Username и дата
const username=document.getElementById("username").value||"Username";
const date=document.getElementById("date").value||"2026-01-01";

// Username рамка
ctx.fillStyle="#1a1b29";
ctx.fillRect(180,60,580,50);
ctx.strokeStyle="#ff7a18";
ctx.lineWidth=3;
ctx.strokeRect(180,60,580,50);

ctx.fillStyle="white";
ctx.font="bold 24px Fredoka";
ctx.fillText(username,200,95);

// Дата рамка
ctx.fillStyle="#1a1b29";
ctx.fillRect(180,120,580,40);
ctx.strokeStyle="#ffcc00";
ctx.lineWidth=3;
ctx.strokeRect(180,120,580,40);

ctx.fillStyle="white";
ctx.font="18px Fredoka";
ctx.fillText("Joined: "+date,200,148);

// Роли с тёмными градиентами
const roleCheckboxes=document.querySelectorAll(".roles input[type='checkbox']");
const selectedRoles=Array.from(roleCheckboxes).filter(chk=>chk.checked).map(chk=>chk.value);

let xStart=180;
let yStart=180;
const badgeHeight=30;
const badgeGap=10;

selectedRoles.forEach(role=>{
    let color1,color2,textColor;
    switch(role){
        case "Gold":color1="#B8860B";color2="#FFD700";textColor="#FFF8DC";break;
        case "Silver":color1="#708090";color2="#C0C0C0";textColor="#F0F8FF";break;
        case "Bronze":color1="#8B4513";color2="#CD7F32";textColor="#FFE4C4";break;
        case "Iron":color1="#2F4F4F";color2="#708090";textColor="#E0E0E0";break;
        case "Explorer":color1="#008B8B";color2="#00D4FF";textColor="#E0FFFF";break;
        case "Content Creator Tier 1":color1="#CC5500";color2="#FF7A18";textColor="#FFE5CC";break;
        case "Content Creator Tier 2":color1="#CC7722";color2="#FF9F43";textColor="#FFE5CC";break;
        case "Content Creator Tier 3":color1="#CC8800";color2="#FFA500";textColor="#FFF0D0";break;
        case "Content Creator Tier 4":color1="#CCAA00";color2="#FFD166";textColor="#FFF5DD";break;
        default:color1="#444";color2="#666";textColor="#EEE";
    }
    
    const badgeWidth=ctx.measureText(role).width+20;
    if(xStart+badgeWidth>canvas.width-20){
        xStart=180;
        yStart+=badgeHeight+badgeGap;
    }
    
    ctx.strokeStyle=color2;
    ctx.lineWidth=2;
    ctx.strokeRect(xStart,yStart,badgeWidth,badgeHeight);
    
    const grad=ctx.createLinearGradient(xStart,yStart,xStart+badgeWidth,yStart+badgeHeight);
    grad.addColorStop(0,color1);
    grad.addColorStop(1,color2);
    ctx.fillStyle=grad;
    ctx.fillRect(xStart,yStart,badgeWidth,badgeHeight);
    
    ctx.fillStyle=textColor;
    ctx.font="bold 14px Fredoka";
    ctx.fillText(role,xStart+10,yStart+20);

    xStart+=badgeWidth+10;
});

// Функция для безопасного рисования изображений
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
        if(clipCircle)ctx.restore();
        if(callback)callback();
    };
    img.onerror=function(){
        console.error("Image load error:",src);
        if(callback)callback();
    };
}

// 🔲 Квадратная рамка вокруг аватара
const avatarInput=document.getElementById("avatar");
const avatarX=20;
const avatarY=60;
const avatarSize=140;
const borderRadius=15; // Закругление углов рамки

if(avatarInput.files[0]){
    const reader=new FileReader();
    reader.onload=function(e){
        // 🔥 РИСУЕМ КВАДРАТНУЮ РАМКУ с закруглением!
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(avatarX,avatarY,avatarSize,avatarSize,borderRadius);
        ctx.closePath();
        ctx.strokeStyle="#ff7a18";
        ctx.lineWidth=4;
        ctx.stroke();
        ctx.restore();
        
        // Рисуем аватар с закруглением
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(avatarX+4,avatarY+4,avatarSize-8,avatarSize-8,borderRadius-2);
        ctx.closePath();
        ctx.clip();
        drawImageSafe(e.target.result,avatarX,avatarY,avatarSize,avatarSize,false,drawLogoAndQR);
        ctx.restore();
    };
    reader.readAsDataURL(avatarInput.files[0]);
}else{
    // 🔥 РИСУЕМ КВАДРАТНУЮ РАМКУ для placeholder!
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(avatarX,avatarY,avatarSize,avatarSize,borderRadius);
    ctx.closePath();
    ctx.strokeStyle="#ff7a18";
    ctx.lineWidth=4;
    ctx.stroke();
    ctx.restore();
    
    // Placeholder аватар
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(avatarX+4,avatarY+4,avatarSize-8,avatarSize-8,borderRadius-2);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle="#1a1b29";
    ctx.fillRect(avatarX,avatarY,avatarSize,avatarSize);
    ctx.fillStyle="#ff7a18";
    ctx.font="bold 50px Fredoka";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText("👤",avatarX+avatarSize/2,avatarY+avatarSize/2);
    ctx.textAlign="start";
    ctx.textBaseline="alphabetic";
    ctx.restore();
    
    drawLogoAndQR();
}

function drawLogoAndQR(){
    // 🟠 Логотип ORO справа сверху
    drawImageSafe("https://ltdfoto.ru/images/2026/03/12/ORO.png",650,20,120,60);
    
    // 📱 QR код ВНИЗУ с отступом 10px от нижней рамки
    const qrSize=120;
    const qrY=canvas.height-10-qrSize;
    drawImageSafe("https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://getoro.xyz",650,qrY,qrSize,qrSize);
    
    // Подпись под QR
    ctx.fillStyle="rgba(255,255,255,0.7)";
    ctx.font="11px Fredoka";
    ctx.textAlign="center";
    ctx.fillText("Scan to visit",710,qrY-5);
    ctx.fillText("getoro.xyz",710,canvas.height-5);
    ctx.textAlign="start";
}
}

// Скачать карточку
function downloadCard(){
const canvas=document.getElementById("cardCanvas");
const link=document.createElement("a");
link.download="oro-card.png";
link.href=canvas.toDataURL();
link.click();
}
