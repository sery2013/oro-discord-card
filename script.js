function generateCard(){
const canvas=document.getElementById("cardCanvas");
const ctx=canvas.getContext("2d");
ctx.clearRect(0,0,canvas.width,canvas.height);

// Фон с градиентом
const gradient=ctx.createLinearGradient(0,0,canvas.width,canvas.height);
gradient.addColorStop(0,'#0b0c14');
gradient.addColorStop(1,'#1f1f2a');
ctx.fillStyle=gradient;
ctx.fillRect(0,0,canvas.width,canvas.height);

// Название карточки
ctx.fillStyle="white";
ctx.font="bold 30px Fredoka";
ctx.fillText("USER CARD ORO",20,40);

// Username и дата
const username=document.getElementById("username").value||"Username";
const date=document.getElementById("date").value||"2026-01-01";

// Username блок
ctx.fillStyle="#1a1b29";
ctx.fillRect(180,60,580,50);
ctx.strokeStyle="#ff7a18";
ctx.lineWidth=3;
ctx.strokeRect(180,60,580,50);
ctx.fillStyle="white";
ctx.font="bold 24px Fredoka";
ctx.fillText(username,200,95);

// Дата блок
ctx.fillStyle="#1a1b29";
ctx.fillRect(180,120,580,40);
ctx.strokeStyle="#ffcc00";
ctx.lineWidth=3;
ctx.strokeRect(180,120,580,40);
ctx.fillStyle="white";
ctx.font="18px Fredoka";
ctx.fillText("Joined: "+date,200,148);

// 🔥 РОЛИ С ТЁМНЫМИ ГРАДИЕНТАМИ
const roles=document.querySelectorAll(".roles input[type='checkbox']");
const selected=Array.from(roles).filter(r=>r.checked).map(r=>r.value);

let x=180,y=180;
const h=30,gap=10;

selected.forEach(role=>{
    let c1,c2,txt;
    switch(role){
        case "Gold":c1="#B8860B";c2="#FFD700";txt="#FFF8DC";break;
        case "Silver":c1="#708090";c2="#C0C0C0";txt="#F0F8FF";break;
        case "Bronze":c1="#8B4513";c2="#CD7F32";txt="#FFE4C4";break;
        case "Iron":c1="#2F4F4F";c2="#708090";txt="#E0E0E0";break;
        case "Explorer":c1="#008B8B";c2="#00D4FF";txt="#E0FFFF";break;
        case "Content Creator Tier 1":c1="#CC5500";c2="#FF7A18";txt="#FFE5CC";break;
        case "Content Creator Tier 2":c1="#CC7722";c2="#FF9F43";txt="#FFE5CC";break;
        case "Content Creator Tier 3":c1="#CC8800";c2="#FFA500";txt="#FFF0D0";break;
        case "Content Creator Tier 4":c1="#CCAA00";c2="#FFD166";txt="#FFF5DD";break;
        default:c1="#444";c2="#666";txt="#EEE";
    }
    
    const w=ctx.measureText(role).width+20;
    if(x+w>canvas.width-20){x=180;y+=h+gap;}
    
    ctx.strokeStyle=c2;
    ctx.lineWidth=2;
    ctx.strokeRect(x,y,w,h);
    
    const g=ctx.createLinearGradient(x,y,x+w,y+h);
    g.addColorStop(0,c1);
    g.addColorStop(1,c2);
    ctx.fillStyle=g;
    ctx.fillRect(x,y,w,h);
    
    ctx.fillStyle=txt;
    ctx.font="bold 14px Fredoka";
    ctx.fillText(role,x+10,y+20);
    x+=w+10;
});

// Функция загрузки изображений
function loadImg(src,x,y,w,h,clip,cb){
    const img=new Image();
    img.crossOrigin="anonymous";
    img.src=src;
    img.onload=()=>{
        if(clip){
            ctx.save();
            ctx.beginPath();
            ctx.arc(x+w/2,y+h/2,w/2,0,Math.PI*2);
            ctx.closePath();
            ctx.clip();
        }
        ctx.drawImage(img,x,y,w,h);
        if(clip)ctx.restore();
        if(cb)cb();
    };
    img.onerror=()=>{if(cb)cb();};
}

// 🔲 КВАДРАТНАЯ РАМКА ВОКРУГ АВАТАРА
const avInput=document.getElementById("avatar");
const avX=20,avY=60,avS=140,radius=15;

if(avInput.files[0]){
    const reader=new FileReader();
    reader.onload=e=>{
        // 1️⃣ РИСУЕМ КВАДРАТНУЮ РАМКУ
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(avX,avY,avS,avS,radius);
        ctx.closePath();
        ctx.strokeStyle="#ff7a18";
        ctx.lineWidth=4;
        ctx.stroke();
        ctx.restore();
        
        // 2️⃣ ОБРЕЗАЕМ АВАТАР ПО РАМКЕ (ЧТОБЫ НЕ ВЫХОДИЛ)
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(avX+4,avY+4,avS-8,avS-8,radius-2);
        ctx.closePath();
        ctx.clip();
        loadImg(e.target.result,avX,avY,avS,avS,false,drawRest);
        ctx.restore();
    };
    reader.readAsDataURL(avInput.files[0]);
}else{
    // 1️⃣ РИСУЕМ РАМКУ
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(avX,avY,avS,avS,radius);
    ctx.closePath();
    ctx.strokeStyle="#ff7a18";
    ctx.lineWidth=4;
    ctx.stroke();
    ctx.restore();
    
    // 2️⃣ PLACEHOLDER С ОБРЕЗКОЙ
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(avX+4,avY+4,avS-8,avS-8,radius-2);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle="#1a1b29";
    ctx.fillRect(avX,avY,avS,avS);
    ctx.fillStyle="#ff7a18";
    ctx.font="bold 50px Fredoka";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText("👤",avX+avS/2,avY+avS/2);
    ctx.textAlign="start";
    ctx.textBaseline="alphabetic";
    ctx.restore();
    
    drawRest();
}

function drawRest(){
    // 🟠 ЛОГОТИП ORO СПРАВА СВЕРХУ
    loadImg("https://ltdfoto.ru/images/2026/03/12/ORO.png",650,20,120,60);
    
    // 📱 QR КОД СЛЕВА ВНИЗУ ПОД АВАТАРОМ (отступ 10px от низа)
    const qrSize=120;
    const qrY=canvas.height-10-qrSize; // 400-10-120=270
    loadImg("https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://getoro.xyz",20,qrY,qrSize,qrSize);
    
    // Подпись под QR
    ctx.fillStyle="rgba(255,255,255,0.7)";
    ctx.font="11px Fredoka";
    ctx.textAlign="center";
    ctx.fillText("Scan to visit",80,qrY-5);
    ctx.fillText("getoro.xyz",80,canvas.height-5);
    ctx.textAlign="start";
}
}

function downloadCard(){
    const c=document.getElementById("cardCanvas");
    const a=document.createElement("a");
    a.download="oro-card.png";
    a.href=c.toDataURL();
    a.click();
}
