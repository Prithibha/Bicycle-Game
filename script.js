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

function startGame() {
    // Place initial objects randomly
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

    if (objectTop >= 600) { // If object goes off the screen, reset it
        resetObject(object, type);
    } else {
        object.style.top = `${objectTop + gameSpeed}px`;
    }
}

function resetObject(object, type) {
    let newLeftPosition;
    
    // Assign different left positions for car and speedBreaker, ensuring no overlap
    do {
        newLeftPosition = Math.floor(Math.random() * 270);
    } while (checkOverlap(newLeftPosition, type));  // Check if the new position is overlapping

    object.style.top = '-50px'; // Start off screen at the top
    object.style.left = `${newLeftPosition}px`; // Set random X position
}


function checkCollision() {
    let biCycleRect = biCycle.getBoundingClientRect();
    let speedBreakerRect = speedBreaker.getBoundingClientRect();
    let carRect = car.getBoundingClientRect();

    // Check collision with leaf
    if (biCycleRect.left < speedBreakerRect.right &&
        biCycleRect.right > speedBreakerRect.left &&
        biCycleRect.top < speedBreakerRect.bottom &&
        biCycleRect.bottom > speedBreakerRect.top) {
        score++;
        scoreDisplay.textContent = score;
        resetObject(speedBreaker, 'speedBreaker');
    }

    // Check collision with bike
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
    // Get the current positions of the other object to compare
    let carLeft = parseInt(window.getComputedStyle(car).getPropertyValue('left'));
    let speedBreakerLeft = parseInt(window.getComputedStyle(speedBreaker).getPropertyValue('left'));
    
    // Define a threshold for minimum distance between the car and speed breaker
    const minDistance = 80;  // You can adjust this value for more or less separation

    if (type === 'car') {
        return Math.abs(newLeftPosition - speedBreakerLeft) < minDistance;  // Check car's distance from speed breaker
    } else if (type === 'speedBreaker') {
        return Math.abs(newLeftPosition - carLeft) < minDistance;  // Check speed breaker's distance from car
    }
    return false;  // No overlap if we can't determine the type
}

startGame();
