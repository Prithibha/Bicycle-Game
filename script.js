const biCycle = document.getElementById('biCycle');
const speedBreaker = document.getElementById('speedBreaker');
const car = document.getElementById('car');
const scoreDisplay = document.getElementById('score');
let score = 0;
let biCyclePosition = 125; // Starting position of the bicycle
let gameInterval;
let gameSpeed = 5; // Speed of object movement

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && biCyclePosition > 0) {
        biCyclePosition -= 20;
    } else if (event.key === 'ArrowRight' && biCyclePosition < 250) {
        biCyclePosition += 20;
    }
    biCycle.style.left = `${biCyclePosition}px`;
});

// Variables to track touch start and end positions
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX; // Capture the start X position
});

document.addEventListener('touchmove', (event) => {
    touchEndX = event.touches[0].clientX; // Capture the moving X position
});

document.addEventListener('touchend', () => {
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > 30 && biCyclePosition < 250) {
        // Swipe right
        biCyclePosition += 20;
    } else if (swipeDistance < -30 && biCyclePosition > 0) {
        // Swipe left
        biCyclePosition -= 20;
    }
    biCycle.style.left = `${biCyclePosition}px`;
});

function startGame() {
    resetObject(speedBreaker, 'speedBreaker');
    resetObject(car, 'car');

    gameInterval = setInterval(() => {
        moveObject(speedBreaker, 'speedBreaker');
        moveObject(car, 'car');
        checkCollision();
    }, 20);
}

function moveObject(object, type) {
    let objectTop = parseInt(window.getComputedStyle(object).getPropertyValue('top'));

    if (objectTop >= 600) {
        resetObject(object, type);
    } else {
        object.style.top = `${objectTop + gameSpeed}px`;
    }
}

function resetObject(object, type) {
    let newLeftPosition;
    do {
        newLeftPosition = Math.floor(Math.random() * 270);
    } while (checkOverlap(newLeftPosition, type)); 

    object.style.top = '-50px'; 
    object.style.left = `${newLeftPosition}px`;
}

function checkCollision() {
    let biCycleRect = biCycle.getBoundingClientRect();
    let speedBreakerRect = speedBreaker.getBoundingClientRect();
    let carRect = car.getBoundingClientRect();

    if (biCycleRect.left < speedBreakerRect.right &&
        biCycleRect.right > speedBreakerRect.left &&
        biCycleRect.top < speedBreakerRect.bottom &&
        biCycleRect.bottom > speedBreakerRect.top) {
        score++;
        scoreDisplay.textContent = score;
        resetObject(speedBreaker, 'speedBreaker');
    }

    if (biCycleRect.left < carRect.right &&
        biCycleRect.right > carRect.left &&
        biCycleRect.top < carRect.bottom &&
        biCycleRect.bottom > carRect.top) {
        clearInterval(gameInterval);
        alert('Game Over! Your Score: ' + score);
        window.location.reload();
    }
}

function checkOverlap(newLeftPosition, type) {
    let carLeft = parseInt(window.getComputedStyle(car).getPropertyValue('left'));
    let speedBreakerLeft = parseInt(window.getComputedStyle(speedBreaker).getPropertyValue('left'));
    const minDistance = 80;

    if (type === 'car') {
        return Math.abs(newLeftPosition - speedBreakerLeft) < minDistance;
    } else if (type === 'speedBreaker') {
        return Math.abs(newLeftPosition - carLeft) < minDistance;
    }
    return false;
}

startGame();
