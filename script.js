const GAME_TIME = 30;
const SPAWN_INTERVAL = 800;
const STAR_TYPES = ['gold','pink','blue','bomb','special'];

let score = 0;
let timeLeft = GAME_TIME;
let spawnTimer = null;
let countdownTimer = null;
let running = false;

const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('start');
const restartBtn = document.getElementById('restart');
const playArea = document.getElementById('playArea');

function rnd(min, max){ return Math.floor(Math.random()*(max-min+1))+min }

function spawnStar(){
  const star = document.createElement('div');
  const type = STAR_TYPES[rnd(0,STAR_TYPES.length-1)];
  star.className = `star ${type}`;
  const padding = 60;
  const x = rnd(padding, playArea.clientWidth - padding);
  star.style.left = x + 'px';

  const size = rnd(36,64);
  star.style.width = star.style.height = size + 'px';

  // Adjusted duration for special star
  const duration = type === 'special' ? rnd(2000,2500) : rnd(2500,5000);
  star.style.animation = `fall ${duration}ms linear forwards`;

  star.addEventListener('click', ()=>{ if(!running) return; collectStar(star, type); });
  star.addEventListener('animationend', ()=>{ if(playArea.contains(star)) playArea.removeChild(star); });

  playArea.appendChild(star);
}

function collectStar(star, type){
  let points = 0;
  if(type === 'bomb'){
    score = 0;
    showPop(star, '💣 Boom! Score Reset');
  } else if(type === 'special'){
    points = 10;
    score += points;
    showPop(star, '+10 🌟');
  } else {
    points = type === 'gold' ? 5 : type === 'pink' ? 3 : 2;
    score += points;
    showPop(star, `+${points}`);
  }

  scoreEl.textContent = score;
  star.remove();
}

function showPop(star, text){
  const rect = star.getBoundingClientRect();
  const pop = document.createElement('div');
  pop.className = 'pop';
  pop.textContent = text;
  const parentRect = playArea.getBoundingClientRect();
  pop.style.left = (rect.left - parentRect.left + rect.width/2 - 40) + 'px';
  pop.style.top = (rect.top - parentRect.top - 20) + 'px';
  playArea.appendChild(pop);
  pop.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-30px)',opacity:0}],{duration:700}).onfinish = ()=> pop.remove();
}

function startGame(){
  if(running) return;
  running = true;
  score = 0; scoreEl.textContent = score;
  timeLeft = GAME_TIME; timeEl.textContent = timeLeft;
  startBtn.style.display = 'none'; restartBtn.style.display = 'none';

  spawnTimer = setInterval(spawnStar, SPAWN_INTERVAL);
  spawnStar();

  countdownTimer = setInterval(()=>{
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if(timeLeft <= 0) endGame();
  }, 1000);
}

function endGame(){
  running = false;
  clearInterval(spawnTimer);
  clearInterval(countdownTimer);
  document.querySelectorAll('.star').forEach(s=>s.remove());

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `<div style="font-size:28px;font-weight:800">Oras ay tapos! ⏰</div>
                       <div style="font-size:20px">Score mo: <strong>${score}</strong></div>`;
  playArea.appendChild(overlay);
  restartBtn.style.display = 'inline-block';
}

function restartGame(){
  document.querySelectorAll('.overlay').forEach(o=>o.remove());
  restartBtn.style.display = 'none';
  startGame();
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
