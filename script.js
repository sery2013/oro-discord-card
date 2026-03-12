function generateCard(){

const canvas=document.getElementById("cardCanvas")
const ctx=canvas.getContext("2d")

ctx.fillStyle="#0b0c14"
ctx.fillRect(0,0,1100,550)

const username=document.getElementById("username").value
const role=document.getElementById("role").value
const date=document.getElementById("date").value

// avatar

const avatarInput=document.getElementById("avatar")

const reader=new FileReader()

reader.onload=function(){

const avatar=new Image()

avatar.src=reader.result

avatar.onload=function(){

ctx.save()

ctx.beginPath()
ctx.arc(150,280,90,0,Math.PI*2)
ctx.closePath()
ctx.clip()

ctx.drawImage(avatar,60,190,180,180)

ctx.restore()

}

}

if(avatarInput.files[0]){

reader.readAsDataURL(avatarInput.files[0])

}

// username

ctx.fillStyle="white"
ctx.font="42px Arial"

ctx.fillText(username,350,230)

// role color

let roleColor="white"

if(role.includes("Content Creator")) roleColor="#ff7a18"
if(role==="Explorer") roleColor="#00d4ff"
if(role==="Iron") roleColor="#9a9a9a"
if(role==="Bronze") roleColor="#cd7f32"
if(role==="Silver") roleColor="#c0c0c0"
if(role==="Gold") roleColor="#ffd700"

ctx.fillStyle=roleColor
ctx.font="28px Arial"

ctx.fillText(role,350,290)

ctx.fillStyle="white"

ctx.font="24px Arial"

ctx.fillText("Joined: "+date,350,340)

// logo

const logo=new Image()

logo.crossOrigin="anonymous"

logo.src="https://ltdfoto.ru/images/2026/03/12/ORO.png"

logo.onload=function(){

ctx.drawImage(logo,820,40,220,120)

}

// QR

const qr=new Image()

qr.crossOrigin="anonymous"

qr.src="https://ltdfoto.ru/images/2026/03/12/qr.png"

qr.onload=function(){

ctx.drawImage(qr,880,360,160,160)

}

}

// download

function downloadCard(){

const canvas=document.getElementById("cardCanvas")

const link=document.createElement("a")

link.download="oro-card.png"

link.href=canvas.toDataURL()

link.click()

}
