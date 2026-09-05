const $ = (id) => document.getElementById(id);

const countdownScreen = $("countdownScreen");
const startScreen = $("startScreen");
const bookScreen = $("bookScreen");
const finalScreen = $("finalScreen");
const countNumber = $("countNumber");
const countSub = $("countSub");
const surpriseBtn = $("surpriseBtn");
const birthdaySong = $("birthdaySong");
const bookStage = $("bookStage");
const book = $("book");
const bookGuide = $("bookGuide");
const closeBookBtn = $("closeBookBtn");

let currentPage = 0;
let touchStartX = null;
let touchStartY = null;
let suppressNextClick = false;

function showScreen(screen){
  [countdownScreen,startScreen,bookScreen,finalScreen].forEach(s=>s.classList.remove("active"));
  screen.classList.add("active");
}

function runCountdown(){
  let n = 3;
  countNumber.textContent = n;
  countSub.textContent = "Get ready...";
  const timer = setInterval(()=>{
    n--;
    if(n > 0){
      countNumber.textContent = n;
      countSub.textContent = n === 2 ? "Just a little longer..." : "Almost there...";
    }else{
      clearInterval(timer);
      countNumber.textContent = "✦";
      countSub.textContent = "Here we go...";
      setTimeout(()=>showScreen(startScreen),700);
    }
  },1000);
}

function makeStars(){
  const layer = $("starLayer");
  for(let i=0;i<70;i++){
    const s = document.createElement("span");
    s.className="star";
    s.textContent = ["✦","✧","★","·"][Math.floor(Math.random()*4)];
    s.style.left = Math.random()*100+"%";
    s.style.top = (-5-Math.random()*35)+"%";
    s.style.animationDuration = (2.7+Math.random()*4)+"s";
    s.style.animationDelay = (Math.random()*3)+"s";
    s.style.fontSize = (8+Math.random()*12)+"px";
    layer.appendChild(s);
  }
}
function makeBalloons(){
  const layer = $("balloonLayer");
  for(let i=0;i<18;i++){
    const b=document.createElement("div");
    b.className="balloon";
    b.style.left=(Math.random()*100)+"%";
    b.style.animationDuration=(7+Math.random()*7)+"s";
    b.style.animationDelay=(-Math.random()*8)+"s";
    const hue=300+Math.random()*70;
    b.style.background=`radial-gradient(circle at 30% 25%,rgba(255,255,255,.55),transparent 13%), hsl(${hue},55%,68%)`;
    b.style.transform=`scale(${.65+Math.random()*.65})`;
    layer.appendChild(b);
  }
}

function startMusic(){
  // Browsers often block true autoplay. This call is made from the user's
  // button click, which is a user gesture and therefore usually allowed.
  birthdaySong.volume = 0.45;
  birthdaySong.play().catch(()=> {
    const hint=document.querySelector(".tap-hint");
    if(hint) hint.textContent="Tap again anywhere to start the music";
  });
}

function arriveBook(){
  setTimeout(()=>bookStage.classList.add("arrive"),250);
  setTimeout(()=> {
    book.classList.add("is-open");
    bookGuide.classList.add("show");
    bookGuide.innerHTML='<span class="hand-icon">☝</span><span>Drag / swipe from the right page to flip</span>';
    // Open first page naturally when cover turns.
  },2450);
}

function setPage(p){
  currentPage=Math.max(0,Math.min(3,p));
  if(currentPage===0){
    book.classList.add("is-open");
    document.querySelector(".page-one").classList.remove("flipped");
    document.querySelector(".page-two").classList.remove("flipped");
  }
  if(currentPage===1){
    document.querySelector(".page-one").classList.add("flipped");
  }
  if(currentPage===2){
    document.querySelector(".page-one").classList.add("flipped");
    document.querySelector(".page-two").classList.add("flipped");
  }
  if(currentPage===3){
    document.querySelector(".page-one").classList.add("flipped");
    document.querySelector(".page-two").classList.add("flipped");
    document.querySelector(".page-three").classList.add("flipped");
    bookGuide.classList.remove("show");
    setTimeout(()=>{
      closeBookBtn.classList.add("show");
    },900);
  }
  updateGuide();
}

function updateGuide(){
  if(currentPage<3){
    bookGuide.classList.add("show");
    const text=currentPage===0
      ? "Use your hand / finger on the right page to flip"
      : currentPage===1
        ? "One more page… swipe / drag to continue"
        : "Last page… then the book will close";
    bookGuide.innerHTML=`<span class="hand-icon">☝</span><span>${text}</span>`;
  }
}

function nextPage(){
  if(currentPage<3) setPage(currentPage+1);
}
function prevPage(){
  if(currentPage>0) setPage(currentPage-1);
}

// Pointer/touch swipe gestures
book.addEventListener("pointerdown",(e)=>{
  touchStartX=e.clientX;
  touchStartY=e.clientY;
  book.setPointerCapture?.(e.pointerId);
});
book.addEventListener("pointerup",(e)=>{
  if(touchStartX===null) return;
  const dx=e.clientX-touchStartX;
  const dy=e.clientY-touchStartY;
  touchStartX=null; touchStartY=null;
  if(Math.abs(dx)<40 || Math.abs(dx)<Math.abs(dy)) return;
  suppressNextClick = true;
  if(dx<0) nextPage(); else prevPage();
});

// Click zones also make it easy on desktop:
// right half => next, left half => previous
book.addEventListener("click",(e)=>{
  if(suppressNextClick){
    suppressNextClick = false;
    return;
  }
  const rect=book.getBoundingClientRect();
  const relative=(e.clientX-rect.left)/rect.width;
  if(relative>0.52) nextPage();
  else prevPage();
});

surpriseBtn.addEventListener("click",()=>{
  startMusic();
  showScreen(bookScreen);
  makeStars();
  makeBalloons();
  arriveBook();
});

closeBookBtn.addEventListener("click",()=>{
  closeBookBtn.classList.remove("show");
  bookGuide.classList.remove("show");
  book.classList.remove("is-open");
  document.querySelector(".page-one").classList.remove("flipped");
  document.querySelector(".page-two").classList.remove("flipped");
  document.querySelector(".page-three").classList.remove("flipped");
  currentPage=0;
  setTimeout(()=>{
    showScreen(finalScreen);
    createFinalSparkles();
  },1200);
});

function createFinalSparkles(){
  const layer=$("finalSparkles");
  for(let i=0;i<45;i++){
    const s=document.createElement("span");
    s.textContent=["✦","✧","·","★"][Math.floor(Math.random()*4)];
    s.style.position="absolute";
    s.style.left=Math.random()*100+"%";
    s.style.top=Math.random()*100+"%";
    s.style.opacity=.15+Math.random()*.7;
    s.style.fontSize=(7+Math.random()*15)+"px";
    s.style.animation=`floatSpark ${2+Math.random()*3}s ease-in-out ${Math.random()}s infinite alternate`;
    layer.appendChild(s);
  }
}
const style=document.createElement("style");
style.textContent="@keyframes floatSpark{to{transform:translateY(-20px) scale(1.25);opacity:.9}}";
document.head.appendChild(style);

// Start automatically
runCountdown();
