// Animación de texto en la dedicatoria
document.addEventListener('DOMContentLoaded', () => {
    const dedicatoriaText = document.querySelector('.dedicatoria p');
    dedicatoriaText.style.opacity = 0;
    let opacity = 0;
    const fadeInInterval = setInterval(() => {
        opacity += 0.05;
        dedicatoriaText.style.opacity = opacity;
        if (opacity >= 1) {
            clearInterval(fadeInInterval);
        }
    }, 50);
});
<button id="changeBackground" class="button">Cambiar Fondo</button>
document.getElementById('changeBackground').onclick = function () {
    document.body.style.backgroundImage = "url('assets/images/new-floral-pattern.png')";
};
function createFloatingFlower() {
    const flower = document.createElement('div');
    flower.classList.add('flower');
    flower.style.top = Math.random() * 100 + '%';
    flower.style.left = Math.random() * 100 + '%';
    flower.style.width = '50px';
    flower.style.height = '50px';
    flower.style.backgroundImage = "url('assets/images/flower1.png')";
    document.body.appendChild(flower);
}

// Crear 10 flores flotantes al cargar la página
for (let i = 0; i < 10; i++) {
    createFloatingFlower();
}
<audio id="backgroundMusic" src="assets/audio/song.mp3"></audio>
<button id="playMusic" class="button">Reproducir Música</button>
document.getElementById('playMusic').onclick = function () {
    const audio = document.getElementById('backgroundMusic');
    audio.play();
};
