const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const vidaFill = document.getElementById("vidaFill");
const scoreDisplay = document.getElementById("score");

let ataques = [];
let vida = 100;
let score = 0;
let gameRunning = false;
let spawnRate = 1200;
let speedBoost = 0;

// Ícones de ataques
const icons = ["💀","🐍","📩","🐱‍💻","🦠","🕳️","⚠️","🔓"];

// Personagem mascote hacker
const player = {
  x: canvas.width/2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  color: "#00ff55",
  emoji: "😎💻",
  speed: 6
};

class Ataque {
  constructor(){
    this.size = 35;
    this.x = Math.random()*(canvas.width-this.size);
    this.y = -40;
    this.vel = 2 + Math.random()*2 + speedBoost;
    this.icon = icons[Math.floor(Math.random()*icons.length)];
  }
  draw(){
    ctx.font=`${this.size}px Courier New`;
    ctx.fillText(this.icon, this.x, this.y);
  }
  update(){ this.y += this.vel; }
}

function startGame(){
  ataques = [];
  vida = 100;
  score = 0;
  speedBoost = 0;
  overlay.style.display = "none";
  gameRunning = true;
  loop();
  spawnAttacks();
}

function spawnAttacks(){
  if(!gameRunning) return;
  ataques.push(new Ataque());
  setTimeout(spawnAttacks, spawnRate);
}

function drawPlayer(){
  ctx.font=`${player.height}px Arial`;
  ctx.fillText(player.emoji, player.x, player.y + player.height);
}

function handlePlayerMovement(){
  document.addEventListener("keydown",(e)=>{
    if(!gameRunning) return;
    if(e.key==="ArrowLeft") player.x -= player.speed;
    if(e.key==="ArrowRight") player.x += player.speed;
    if(player.x<0) player.x=0;
    if(player.x>canvas.width-player.width) player.x=canvas.width-player.width;
  });

  canvas.addEventListener("touchmove",(e)=>{
    if(!gameRunning) return;
    let touch = e.touches[0];
    let rect = canvas.getBoundingClientRect();
    player.x = touch.clientX - rect.left - player.width/2;
    if(player.x<0) player.x=0;
    if(player.x>canvas.width-player.width) player.x=canvas.width-player.width;
  });
}

function loop(){
  if(!gameRunning) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawPlayer();

  ataques.forEach((atk,i)=>{
    atk.update();
    atk.draw();

    // colisão com player
    if(atk.x < player.x + player.width &&
       atk.x + atk.size > player.x &&
       atk.y < player.y + player.height &&
       atk.y + atk.size > player.y){
         ataques.splice(i,1);
         score++;
         scoreDisplay.textContent = score;
    }

    // se passar da tela
    if(atk.y > canvas.height){
      ataques.splice(i,1);
      vida -= 10;
      vidaFill.style.width = vida+"%";
      if(vida<=0) gameOver();
    }
  });

  speedBoost += 0.002;
  requestAnimationFrame(loop);
}

function gameOver(){
  gameRunning=false;
  overlay.innerHTML=`
    <div style="text-align:center;">
      <h2 style="color:#00ff55;">SERVIDOR INVADIDO ❌</h2>
      <p>Pontuação final: <strong>${score}</strong></p>
      <button id="startBtn" class="btn">Reiniciar</button>
    </div>
  `;
  overlay.style.display="flex";
  document.getElementById("startBtn").onclick=startGame;
}

handlePlayerMovement();
startBtn.addEventListener("click",startGame);
