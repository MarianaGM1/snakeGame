const grid = document.querySelector('.grid')
const startButton = document.getElementById('start')
const restartButton = document.getElementById('restart')
const scoreDisplay = document.getElementById('score')
const prevScoreDisplay = document.getElementById('prevScore')
const overlay = document.getElementById('overlay')
const gulp = new Audio ('sounds/Gulp.mp3')
const gameOver = new Audio ('sounds/GO.mp3')
let squares = []
let currentSnake = [212,211,210]
let direction = 1
const width = 20
let appleIndex = 0
let score = 0
let intervalTime = 600
let speed = 0.85
let timerId = 0

function createGrid() {
    //create 100 of these elements with a for loop
    for (let i=0; i < width*width; i++) {
     //create element
    const square = document.createElement('div')
    //add styling to the element
    square.classList.add('square')
    //put the element into our grid
    grid.appendChild(square)
    //push it into a new squares array    
    squares.push(square)
    }
}
createGrid()

currentSnake.forEach(index => squares[index].classList.add('snake'))


function startGame() {
    clearInterval(timerId)
    currentSnake = [212,211,210]
    score = 0
    //re add new score to browser
    scoreDisplay.textContent = score
    direction = 1
    intervalTime = 600
    //readd the class of snake to our new currentSnake
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    timerId = setInterval(move, intervalTime)
}

function restartGame() {
    overlay.style.display = 'none'
    //remove the snake
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    //remove the apple
    squares[appleIndex].classList.remove('apple')
    clearInterval(timerId)
    currentSnake = [212,211,210]
    score = 0
    //re add new score to browser
    scoreDisplay.textContent = score
    direction = 1
    intervalTime = 600
    generateApple()
    //readd the class of snake to our new currentSnake
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    timerId = setInterval(move, intervalTime)
}

function move() {
    if (
        (currentSnake[0] + width >= width*width && direction === width) || //if snake has hit bottom
        (currentSnake[0] % width === width-1 && direction === 1) || //if snake has hit right wall
        (currentSnake[0] % width === 0 && direction === -1) || //if snake has hit left wall
        (currentSnake[0] - width < 0 && direction === -width) || //if snake has hit top
        squares[currentSnake[0] + direction].classList.contains('snake')
    ) {
        gameOver.play()
        prevScoreDisplay.textContent = score
        scoreDisplay.textContent = '0'
        overlay.style.display = 'block'
        return clearInterval(timerId); 
    }
    

    //remove last element from our currentSnake array
    const tail = currentSnake.pop()
    //remove styling from last element
    squares[tail].classList.remove('snake')
    //add square in direction we are heading
    currentSnake.unshift(currentSnake[0] + direction)
    //add styling so we can see it

    //deal with snake head gets apple
    if (squares[currentSnake[0]].classList.contains('apple')) {
        //remove the class of apple
        squares[currentSnake[0]].classList.remove('apple')
        //grow our snake by adding class of snake to it
        squares[tail].classList.add('snake')
        //grow our snake array
        currentSnake.push(tail)
        gulp.play()
        //generate new apple
        generateApple()
        //add one to the score
        score++
        //display our score
        scoreDisplay.textContent = score
        //speed up our snake
        clearInterval(timerId)
        intervalTime = intervalTime * speed
        timerId = setInterval(move, intervalTime)

    }
       
    squares[currentSnake[0]].classList.add('snake')
}


function generateApple() {
    do {
        appleIndex = Math.floor(Math.random() * squares.length)
    } while (squares[appleIndex].classList.contains('snake'))
    squares[appleIndex].classList.add('apple')
} 
generateApple()


function control(e) {
    if (e.keyCode === 39) {
        direction = 1
    } else if (e.keyCode === 38) {
        direction = -width
    } else if (e.keyCode === 37) {
        direction = -1
    } else if (e.keyCode === 40) {
        direction = +width
    }
}


document.addEventListener('keyup', control)
startButton.addEventListener('click', startGame)
restartButton.addEventListener('click', restartGame)
overlay.addEventListener('click', function(event) {
    if (event.target.id == 'overlay'){
        overlay.style.display = 'none'
    }
})