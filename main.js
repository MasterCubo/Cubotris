// copied from https://academy.cs.cmu.edu/ide//28918676 and edited
// changing from python to js was actaully harder and also easier than I thought

// notable pypthon - javascript conversions

// list.remove(item)
// list.splice(list.indexOf(item), 1)

// list.pop(index)
// list.splice(index, 1)

// list.insert(0, item)
// list.unshift(item)

// for i in range(num)
// for (let i of Array(num).keys())

function randrange(maxn){
  return Math.floor(Math.random() * (maxn));
}
function len(item){
  return item.length
}
// TO IMPLEMENT:
// the updated version of this list is in index.html
// i like this to show where i've come.


// * 7-bag piece system || DONE
// * gameover || done
// * score || done
// * * PC detection
// * * TSpin Detection
// * * B2B detection
// * * Combo Detection  || DONE BUT SHOW IT IN UI
// * srs kick table
// * ghost pieces || done
// * held piece || done
// * DAS
// * next piece/preview || done

// * leveling / speed curve || I think it works

// * Tetris/line-clear animation?? || kinda
// * four.lol skin || kinda

let rows = 20
let cols = 10
let boardLeft = 110
let boardTop = 10
let boardWidth = 190
let boardHeight = 380
let cellBorderWidth = 0.05
let board=[]
let tetrisPieces;
let tetrisPieceColors;
let piece = null
let pieceTopRow = 0
let pieceLeftCol = 0
let pieceColor = null
let stepsPerSecond = 1
let bag 
let nextPieceIndex
let gameOver = true

 
let score = 0
let tetris = 0


let level = 1
let totalClearedLines = 0
let speedCurve = [0.01667, 0.021017, 0.026977, 0.035256, 0.04693, 0.06361, 0.0879, 0.1236, 0.1775, 0.2598, 0.388, 0.59, 0.92, 1.46, 2.36]


let ghostTopRow = 0
let ghostLeftCol = 0

let heldBoard = []
let heldPieceIndex = null
let heldThisFall = false
let currPieceIndex
let nextBag

let previewBoard = []

let combo = -1

let leftHoldingFrames
let rightHoldingFrames
let downHoldingFrames
let DARRate = 10 // in frames of holding
// if you want to measure in ms
// let DARRate = Math.floor(ms/16.7)
let ARRLimit = 6
let ARRRate = 2 // in frames of holding
// tetr.io has it at 2, and it feels natural, so idk why setting this to 2 feels so bad.

let TouchUI = false

let rotationState = 0

let lockDelayCount = 0
let lockDelay = 30 // 30 frames

let scoreDrawDecay = [0,0] // (what kind of score, the delay)
let comboDrawDecay = 0 // since combo is a global variable we dont need the tuple
let drawDecayRate = 50


let highScore = 100719 // i will never use this

let lastMovement = -1 // store the last thing I've done for tspins
// 0 = cw spin
// 1 = ccw spin
// 2 = 180 spin
// 3 = right move
// 4 = left move
// 5 = soft drop
let currPiece = -1

let restartCountdown = 0
let firstLoad = true
let countdownHappening = true

function preload() {
  hundin = loadFont('/fonts/hun2.ttf')
  config = loadFont('/fonts/cr.ttf')
  profontwindows = loadFont('/fonts/pfw.ttf')
  
  loadSounds()
  console.log('done loading')
}


function setup(){ // called on game restart
    createCanvas(400,600)
    frameRate(60)
    if (firstLoad) {gameOver= true}
    else {gameOver = false}
    tetris = 0
    score = 0
    level = 1
    totalClearedLines = 0
    heldPieceIndex = null
    combo = -1

    leftHoldingFrames = 0
    rightHoldingFrames = 0
    downHoldingFrames = 0
  
    rotationState = 0
  
    lockDelayCount = 0
  
    scoreDrawDecay = [0,0]
    comboDrawDecay = 0
  
    lastMovement = -1
    currPiece = -1
  
    board = []
    for (let row of Array(rows).keys()) {
      board.push([])
      for (let col of Array(cols).keys()){
        board[row].push(null)
    }}
  
    heldBoard = []
    for (let row of Array(4).keys()) {
      heldBoard.push([])
      for (let col of Array(4).keys()){
        heldBoard[row].push(null)
    }}
     heldIndex = null
     heldThisFall = false
  
    loadTetrisPieces()
    bag = [0,1,2,3,4,5,6]
    nextBag = [0,1,2,3,4,5,6]
    shuffleArray(bag)
    shuffleArray(nextBag)
    nextPieceIndex = bag[0]
    bag.splice(0,1) // remove the first element of the array.
    loadNextPiece()
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function addScore(softRows, hardRows, clearedRows){
  // NEEDS TO CALCULATE MORE:
    // Mini T-Spin no line(s)	              100 × level
    // T-Spin no line(s)	                  400 × level
    // Mini T-Spin Single	                  200 × level; difficult
    // T-Spin Single	                      800 × level; difficult
    // Mini T-Spin Double (if present)	      400 × level; difficult
    // T-Spin Double	                      1200 × level; difficult
    // T-Spin Triple	                      1600 × level; difficult
    // Back-to-Back difficult line clears	  Action score × 1.5 (excluding soft drop and hard drop)
    // Single-line perfect clear	          800 × level
    // Double-line perfect clear	          1200 × level
    // Triple-line perfect clear	          1800 × level
    // Tetris perfect clear	                  2000 × level
    // Back-to-back Tetris perfect clear	  3200 × level
  // idk how to detect these things.
  score += softRows
  score += hardRows*2
  switch (clearedRows) {
    case 1:
      play(s.clearline)
      score += 100 * level
      scoreDrawDecay = [1, drawDecayRate]
      break
    case 2:
      play(s.clearline)
      scoreDrawDecay = [2, drawDecayRate]
      score += 300 * level
      break
    case 3:
      play(s.clearline)
      scoreDrawDecay = [3, drawDecayRate]
      score += 500 * level
      break
    case 4:
      play(s.clearquad)
      scoreDrawDecay = [4, drawDecayRate]
      tetris = 30 
      score += 800 * level
      break
  }
  if (combo > 0){
    score += 50 * combo * level
  }
  
}

function drawScore() {
  let t = ''
  switch(scoreDrawDecay[0]){
    case 1:
      t = 'SINGLE'
      break
    case 2:
      t = 'DOUBLE'
      break
    case 3:
      t = 'TRIPLE'
      break
    case 4:
      t = 'TETRIS'
      break
  }
  push()
  let c = color(255)
  c.setAlpha(scoreDrawDecay[1]*8.5)
  fill(c)
  textSize(16)
  textFont(hundin)
  textStyle(BOLD)
  text(t, 15, 115)
  pop()
  scoreDrawDecay[1] -= 1
}
  
function drawCombo() {
  if (combo >= 2){
    push()
    let c = color(255)
    c.setAlpha(comboDrawDecay*8.5)
    fill(c)
    textSize(16)
    textFont(hundin)
    textStyle(BOLD)
    text('x'+combo, 15, 135)
    pop()
    comboDrawDecay -= 1
  }
}
  
function placePieceOnBoard(){
    for (let row of Array(len(piece)).keys()){
        for (let col of Array(len(piece[row])).keys()){
            if (piece[row][col]){
                board[pieceTopRow+row][pieceLeftCol+col] = pieceColor
            }
        }
    }    
}
  
  
function draw(){
    textFont(hundin) // i want everything to be hundin
    // push()
    // fill(0)
    // rect(-10,-10,410,410)
    // pop()
    background(color(56,60,68))
  
    doHoldingFrames()  // includes r to restart, and arrow keys
    doDAR()            // Things tied to the Framerate
    doARR()            //
  
    drawBoard()
    drawPiece()
    drawGhostPiece()
    drawHeld()
    drawPreview()
    drawBoardBorder()
    drawText()
    drawTouchUI()
    drawScore()
    drawCombo()
    if (firstLoad) {
      doCountdown()
    }
    else if (frameCount<240) {
      push()
      textAlign(CENTER)
      textSize(100)
      fill('gold')
      drawGlowText('GO!', color('gold'), boardLeft+boardWidth/2, boardTop+boardHeight/2)
      pop()
    }
  
  // frameCount is increasing at 60 frames per second
    if (frameCount%round((1/speedCurve[level-1])) == 0) {
      takeStep()
    }
  
    drawPaused()
    drawAndDoRestart()
  
    lockDelayCount += 1 // every frame increase lockDelayCount
    if (gameOver) {
      s.warning.loop = false
    }
}

function drawPaused() {
  if (!isLooping()){ // this DOES MESS WITH FRAMECOUNT BASED EVENTS
      push()
      let c = color(25)
      c.setAlpha(200)
      fill(c)
      noStroke()
      rect(0,0,width,height)
      pop()
      
      push()
      textAlign(CENTER)
      textSize(20)
      textFont(hundin)
      text("PAUSED", width/2, height/2)
      pop()
    }
}
  
//function mousePressed() {console.log(mouseX,mouseY)}

function doCountdown() {
  if (frameCount > 180) {
    gameOver=false
    firstLoad=false
    play(s.go)
  }
    
  else{
  let countdownLength = 180
  
  // do sound
  switch (frameCount) {
    case 1:
      play(s.countdown3)
      break
    case floor(countdownLength*(1/3)):
      play(s.countdown2)
      break
    case floor(countdownLength*(2/3)):
      play(s.countdown1)
      break
  }
    let countdown = ''
         if (frameCount <= 0) {countdown = ''}
    else if (frameCount < floor(countdownLength*(1/3))) {countdown = '3'}
    else if (frameCount < floor(countdownLength*(2/3))){countdown = '2'}
    else if (frameCount < countdownLength){countdown = '1'}
  push()
  textAlign(CENTER)
  textSize(100)
  fill('gold')
  drawGlowText(countdown, color('gold'), boardLeft+boardWidth/2, boardTop+boardHeight/2)
  pop()
    }
}
  
function drawAndDoRestart() {
  let countdownLength = 21
  
  // do sound
  switch (restartCountdown) {
    case 1:
      play(s.detonate1)
      play(s.detonate2)
      break
    case floor(countdownLength*(1/3)):
      play(s.detonate1)
      break
    case floor(countdownLength*(2/3)):
      play(s.detonate1)
      break
  }
    let countdown = ''
         if (restartCountdown <= 0) {countdown = ''}
    else if (restartCountdown < floor(countdownLength*(1/3))) {countdown = '3'}
    else if (restartCountdown < floor(countdownLength*(2/3))){countdown = '2'}
    else if (restartCountdown < countdownLength){countdown = '1'}
  push()
  textAlign(CENTER)
  textSize(100)
  fill('gold')
  drawGlowText(countdown, color('gold'), boardLeft+boardWidth/2, boardTop+boardHeight/2)
  pop()
    if (restartCountdown >= countdownLength) {
      play(s.shatter)
      play(s.detonated)
      restartCountdown = -1
      setup()
    }
  }

function drawGlowText(txt, glowColor, x, y) {
  glow(glowColor, 80)
  text(txt, x, y)
  text(txt, x, y)
  glow(glowColor, 12)
  text(txt, x, y)
  text(txt, x, y)
  glow(glowColor, 2)
  text(txt, x, y)
  text(txt, x, y)
}
function glow(glowColor, blurriness) { // helper function
  drawingContext.shadowColor = glowColor;
  drawingContext.shadowBlur = blurriness;
}
  
function onStep(){
    takeStep()}

function takeStep(){
    if (! gameOver){
    if (totalClearedLines> level*10) {
      level+=1
      
    }
    if (!movePiece(1, 0)){ // if the block cannot move down, it ahs 30 frames to lock
        if (lockDelayCount > lockDelay){
          lockDelayCount = 0
          placePieceOnBoard()
          removeFullRows()
          loadNextPiece()
          heldThisFall = false
    }}
    else { // if the piece isnt touching the bottom, start the count over
      lockDelayCount = 0
    }
}}

function holdPiece() {
  //let currrentPieceIndex = tetrisPieces.indexOf(piece)
  if (!heldThisFall) {
    if (heldPieceIndex == null){
    heldPieceIndex = currPieceIndex}
    
    else {
      bag.unshift(nextPieceIndex) // loadNextPiece will kill the next thing in the bag. this will restore it.  
      let temp = heldPieceIndex
      heldPieceIndex = currPieceIndex
      nextPieceIndex = temp
      
    }
    
    loadNextPiece()
    heldThisFall = true
    play(s.hold)
  }
}
  
function loadPiece(pieceIndex){
    currPieceIndex = pieceIndex
    piece = tetrisPieces[pieceIndex] // really testing my ability to type peice correctly
    pieceColor = tetrisPieceColors[pieceIndex]
    pieceTopRow = 0
    pieceCols = len(piece[0])
    pieceLeftCol = Math.floor((cols/2) - ceil(pieceCols/2))
    if (!pieceIsLegal()) { 
      gameOver = true
      pieceColor = tetrisPieceColors[7]
      play(s.topout)
    }
  let any = false
  for (let i of Array(cols).keys()) {
    if (board[3][i] != null) { // if pieces in the top 4 rows 
      any = true
      if (!s.warning.loop && !gameOver){
      s.warning.loop = true
      s.warning.play()}
    }
    if (!any) {
      s.warning.loop = false
      s.warning.pause()
    }
  }
}

function printBag() {
  let out = ''
    for (let i of bag){
      switch (i){
        case 0:
          out += 'I '
         break
        case 1:
          out += 'J '
          break
        case 2: 
          out += 'L '
          break
        case 3: 
          out += 'O '
          break
        case 4:
          out += 'S '
          break
        case 5: 
          out += 'T '
          break
        case 6:
          out += 'Z '
          break
          
      }
    }
    console.log(out)
}
  
function printNextBag() {
  let out = ''
    for (let i of nextBag){
      switch (i){
        case 0:
          out += 'I '
         break
        case 1:
          out += 'J '
          break
        case 2: 
          out += 'L '
          break
        case 3: 
          out += 'O '
          break
        case 4:
          out += 'S '
          break
        case 5: 
          out += 'T '
          break
        case 6:
          out += 'Z '
          break
          
      }
    }
    console.log(out)
}
  
function loadNextPiece(){
    placePreviewPieces()
    loadPiece(nextPieceIndex)
    currPiece = nextPieceIndex
    nextPieceIndex = bag[0]
    bag.splice(0, 1)
    if (len(bag) < 7){
        bag.push(nextBag[0])
        nextBag.splice(0,1)}
    if (len(nextBag) == 0){       
      nextBag = [0,1,2,3,4,5,6]
      shuffleArray(nextBag)
    }
    rotationState = 0
    lastMovement = -1
}

function removeFullRows(){
    let numCleared = 0
    let found
    for (let row of Array(rows).keys()){
        found = true
        for (let col of Array(cols).keys()){
            if (board[row][col] == null) {
                found = false
            }
        }
        if (found){
            numCleared += 1
            board.splice(row,1)
            board.unshift([null, null, null, null, null, null, null, null, null, null]) // idk how else to do it
        }
    } 
    
    addScore(0,0, numCleared)
  
    totalClearedLines += numCleared
  
    if (numCleared > 0){
      combo += 1
      if (combo >= 2 && combo < 17) { 
        //s.combo_1.rate(1*(2 ** ((combo-2)/12)))
        //play(s.combo_1)
      play('combo_'+(combo-1))
      }
      if (combo >= 17) {
         play(s.combo_16)
       }
      comboDrawDecay = drawDecayRate
    }
    else{
      if (combo >= 2) {
        play('combobreak')
      }
      combo = -1
    }
}
  
function drawText() {
    push()
    textFont(hundin)
    fill(255)
    textSize(16)
    if (gameOver && !firstLoad) {
      push()
      fill(255,0,0)
      text('Tetris\nGame Over!\nPress r to \ntry again', 10, 30)
      pop()
    }
    else{
    text('Cubotris', 10, 30)
    pop()
    }
  push()
    textFont(hundin)

  fill(255)
  textSize(16)
  textAlign(CENTER)
  text("Level: "+level, 200,430)
  text("Score: "+score, 200,450)
  text("Lines: "+totalClearedLines, 200,470)
  textFont('Arial')
  textSize(30)
  if (muted) {
    text("🔇", 340,470)
  }
  else {
    text("🔊", 340,470)
  }
  pop()
    if (tetris > 0) {
      tetris -= 1
      if (tetris%10 == 0 || (tetris+2)%10==0 || (tetris+1)%10==0){}
      else{
        push()
        textSize(40)
        textFont('Arial')
        fill(255,255,255,200)
        text('👏👏👏', 125, 300)
        pop()
      }
    }
 
}  


function ghostPieceIsLegal() { // copied pieceIsLegal, could probably make more efficient
    for (let row of Array(len(piece)).keys()){
        for (let col of Array(len(piece[0])).keys()){
            if (piece[row][col]){
                if (0 > ghostTopRow+row || 
                    ghostTopRow+row >= rows || 
                    0 > ghostLeftCol+col || 
                    ghostLeftCol+col >= cols){
                    return false}
                else if (board[ghostTopRow+row][ghostLeftCol+col] == null){
                  // pass
                    }
                else{
                    return false}
            }
        }
    }
    return true
}
  
function moveGhostPieceDown() {
    ghostTopRow += 1
    if (ghostPieceIsLegal()){
        return true}
    else{
        ghostTopRow -= 1
        return false}
}
function drawGhostPiece(){
  ghostTopRow = pieceTopRow
  ghostLeftCol = pieceLeftCol
  while(moveGhostPieceDown()){
    // hard drops the ghost piece
  }
  
  for (let row of Array(len(piece)).keys()){
        for (let col of Array(len(piece[row])).keys()){
            if (piece[row][col]){
                drawGhostCell(ghostTopRow + row, ghostLeftCol + col, pieceColor)}
        }
    }
}
  
  
  
function drawGhostCell(row, col, pcolor){
  let leftTop = getCellLeftTop(row, col) 
  let cellLeft = leftTop[0]
  let cellTop = leftTop[1]
  
  let widthHeight = getCellSize()
  let cellWidth = widthHeight[0]
  let cellHeight = widthHeight[1]
  
  
  push()
  // noFill();
  // stroke(color(pcolor))
  // strokeWeight(cellBorderWidth*40)
  noStroke();
  let ghostColor = color(pcolor)
  ghostColor.setAlpha(100)
  fill(ghostColor)
  rect(cellLeft, cellTop, cellWidth, cellHeight)
  pop()
}
  
function getCellLeftTop( row, col){
    let widthHeight = getCellSize()
    let cellWidth = widthHeight[0]
    let cellHeight = widthHeight[1]
    
    let cellLeft = boardLeft + col * cellWidth
    let cellTop = boardTop + row * cellHeight
    return [cellLeft, cellTop]
}
  
function getCellSize(){
    let cellWidth = boardWidth / cols
    let cellHeight = boardHeight / rows
    return [cellWidth, cellHeight]
}

  
function loadTetris() {
  for (let i = len(board)-1; i>len(board)-1-4; i--){
    for (let j = 0; j < len(board[0])-1;j++) {
      board[i][j] = tetrisPieceColors[7]
    }
  }
  // set piece to I
  loadPiece(0)
  
}
  
function doHoldingFrames() {
  if(keyIsDown(LEFT_ARROW)){
     leftHoldingFrames += 1
    //console.log(leftHoldingFrames)
  }
  if (keyIsDown(RIGHT_ARROW)){
      rightHoldingFrames += 1
    //console.log(rightHoldingFrames)
    }
  if (keyIsDown(DOWN_ARROW)){
      downHoldingFrames += 1
    //console.log(downHoldingFrames)
    }
  if (keyIsDown(82)) { // r
    if (restartCountdown != -1){ // after one restart, must release to start another
        restartCountdown += 1
    }
  }
}  
  
  
  
function doDAR() {
  if(keyIsDown(LEFT_ARROW)){
     if (leftHoldingFrames >= DARRate) {
        while(movePiece(0,-1)){play('move')} 
    }
  }
  if (keyIsDown(RIGHT_ARROW)){
    if (rightHoldingFrames >= DARRate) {
       while(movePiece(0,1)){play('move')}
    }
  }
  if (keyIsDown(DOWN_ARROW)){
    if (downHoldingFrames >= DARRate) {
       while(movePiece(1,0)){addScore(1,0,0);play('softdrop')}
      downHoldingFrames = 0
    }
  }
}

function doARR() {
  if(keyIsDown(LEFT_ARROW)){
    if (leftHoldingFrames > ARRLimit && leftHoldingFrames % ARRRate == 0) { // every ARRRate frames
      if(movePiece(0,-1)){play('move')}
    }
  }
  if(keyIsDown(RIGHT_ARROW)){
    if (rightHoldingFrames > ARRLimit && rightHoldingFrames % ARRRate == 0) {
      if(movePiece(0,1)){play('move')}
    }
  }
//   if(keyIsDown(DOWN_ARROW)){
//     if (downHoldingFrames > ARRLimit && downHoldingFrames % ARRRate == 0) {
//       if(movePiece(1,0)){addScore(1,0,0);play('softdrop')}
      
//     }
  // }
}
  
function keyPressed(){ // this does this 
  if (! gameOver){
    switch (key){
        // case '0':
        //     loadPiece( 0)
        //     break;
        // case '1':
        //     loadPiece( 1)
        //     break;
        // case '2':
        //     loadPiece( 2)
        //     break
        // case '3':
        //     loadPiece( 3)
        //     break
        // case '4':
        //     loadPiece( 4)
        //     break
        // case '5':
        //     loadPiece( 5)
        //     break
        // case '6':
        //     loadPiece( 6)
        //     break
            
        case 'ArrowUp':
            rotatePieceClockwise()
            break
        case 'ArrowRight':
            if(movePiece( 0, 1)){
              play('move')
              lastMovement = 3
            }
            break
        case 'ArrowDown':
            if(movePiece( 1, 0)){
              play('softdrop')
              lastMovement = 5
            }
            addScore(1,0,0)
            break
        case 'ArrowLeft':
            if(movePiece(0, -1)){
              play('move')
              lastMovement = 4
            }
            break
        case ' ':
          hardDropPiece()
          break
        case 'c':
          holdPiece()
          break
        case 'z':
          rotatePieceCounterClockwise()
          break
        case 'a':
          rotatePiece180()
          break
          
        case 'p':
          if (isLooping()) {
            noLoop()
            takeStep()
          }
          else{
            loop()
          }
          break
        case 't': // toggle touchUI
          TouchUI = !TouchUI
          break
        case 'k':
          loadTetris() // for fun/ debugging
          break
        case 'm':
          muted = !muted    
          break
        // case 's':
        //     takeStep()
        //     break
        // case 't':
        //   tetris = 30
        //   break
        //   case "=":
        //    level+=1
        //     break
        // case '-':
        //     level-=1
        //     break
          case '=':
            combo+=1
            break
          case '-':
            combo-=1
            break
    }
    
    } 
    // if (key == 'r'){
    // setup()}
  return false // prevent space scrolling and other default actions 
}

function keyReleased() {
  switch (key){
    case 'ArrowLeft':
      leftHoldingFrames = 0
      break
    case 'ArrowRight':
      rightHoldingFrames = 0
      break
    case 'ArrowDown':
      downHoldingFrames = 0
      break
    case 'r':
      restartCountdown = 0
  }
}

