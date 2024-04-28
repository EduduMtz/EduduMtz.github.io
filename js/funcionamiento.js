//****** GAME LOOP ********//

var time = new Date();
var deltaTime = 0;

var juegoIniciado = false;

/* ESPERA AL INICIAR */
function IniciarPartida() {
    var mensaje = document.querySelector(".mensaje");
    var gif = document.querySelector(".Naruto-gif");
    var naruto = document.querySelector(".Naruto");

    mensaje.style.display = "none";
    gif.style.display = "none";
    naruto.style.display = "block";

    parado = false;
    saltando = false;

    juegoIniciado = true;

    Init();
}

document.addEventListener("keydown", function(event) {
    if (event.key === "s" || event.key === "S") {
        
        document.querySelector('.Naruto').classList.add("Naruto-corriendo");

        if(document.readyState === "complete" || document.readyState === "interactive"){
            setTimeout(IniciarPartida, 1);
        }else{
            document.addEventListener("DOMContentLoaded", IniciarPartida);
        }
        
    }
});

function Init() { //****** Inicializa el juego ******//
    time = new Date();
    Start();
    Loop();
}

//****** Es el bucle principal del juego que se ejecuta continuamente ******//
function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var NarutoPosX = 42;
var NarutoPosY = sueloY; 

var sueloX = 0;
var velEscenario = 1280/3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;

var contenedor;
var Naruto;
var textoScore;
var suelo;
var gameOver;


/***** actualiza el estado del juego en cada fotograma, moviendo elementos y verificando colisiones. *****/
/*Naruto = document.querySelector(".Naruto");*/
function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    Naruto = document.querySelector(".Naruto");
    document.addEventListener("keydown", HandleKeyDown);

    gameOver.querySelector("img").addEventListener("click", function(){
        location.reload()
    });
}

function Update() {
    if(parado) return;
    
    MoverNaruto();
    MoverSuelo();
    DecidirCrearObstaculos();
    DecidirCrearNubes();
    MoverObstaculos();
    MoverNubes();
    DetectarColision();

    velY -= gravedad * deltaTime;
}

function HandleKeyDown(ev){
    if(ev.keyCode == 32){
        Saltar();
    }
}

function Saltar(){
    if(NarutoPosY === sueloY){
        saltando = true;
        velY = impulso;
        Naruto.classList.remove("Naruto-corriendo");
    }
}

function MoverNaruto() {
    NarutoPosY += velY * deltaTime;
    if(NarutoPosY < sueloY){
        
        TocarSuelo();
    }
    Naruto.style.bottom = NarutoPosY+"px";
}

function TocarSuelo() {
    NarutoPosY = sueloY;
    velY = 0;
    if(saltando){
        Naruto.classList.add("Naruto-corriendo");
    }
    saltando = false;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
    Naruto.classList.remove("Naruto-corriendo");
    Naruto.classList.add("Naruto-estrellado");
    parado = true;
}

function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if(tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if(tiempoHastaNube <= 0) {
        CrearNube();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("roca");
    if(Math.random() > 0.5) obstaculo.classList.add("roca2");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth+"px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel;
}

function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth+"px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px";
    
    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel;
}

function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        }else{
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";
        }
    }
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if(nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        }else{
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX+"px";
        }
    }
}

/*function CambiarImagenNubes() {
    // Cambiar imagen de las nubes
    var nubes = document.querySelectorAll(".nube");
    nubes.forEach(nube => {
        nube.style.backgroundImage = "url(../img/nube_2.png)";
    });
}*/

function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if(score == 5){
        gameVel = 1.15;
        contenedor.classList.add("normal");
    } else if(score == 10) {
        gameVel = 1.30;
        contenedor.classList.add("mediodia");
    } else if(score == 20) {
        gameVel = 1.5;
        contenedor.classList.add("tarde");
    } else if(score == 35) {
        gameVel = 2;
        contenedor.classList.add("noche");
        /*CambiarImagenNubes();*/
    } else if(score == 50) {
        gameVel = 2.30;
        contenedor.classList.add("medianoche");
    } else if(score == 100) {
        gameVel = 2.70;
        contenedor.classList.add("nightmare");
    }
    suelo.style.animationDuration = (3/gameVel)+"s";
}

function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";
    ReiniciarJuego();
}

function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if(obstaculos[i].posX > NarutoPosX + Naruto.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        }else{
            if(IsCollision(Naruto, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}