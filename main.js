// copied from https://academy.cs.cmu.edu/ide//28918676 and edited
// changing from python to js was actaully harder and also easier than I thought

// notable rewrites

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
let gameOver = false

 
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
let DARRate = 10 // in frames of holding
// if you want to measure in ms
// let DARRate = Math.floor(ms/16.7)
let ARRRate = 6 // in frames of holding
// tetr.io has it at 2, and it feels natural, so idk why setting this to 2 feels so bad.

let TouchUI = false

function setup(){ // called on game restart
    createCanvas(400,600)
    gameOver = false
    tetris = 0
    score = 0
    level = 1
    totalClearedLines = 0
    heldPieceIndex = null
    combo = -1
  
    leftHoldingFrames = 0
    rightHoldingFrames = 0
  
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

function rotate2dListClockwise(L) {
    let M = [];
    for (let row = 0; row < L[0].length; row++) {
        let newRow = [];
        for (let col = L.length - 1; col >= 0; col--) {
            newRow.push(L[col][row]);
        }
        M.push(newRow);
    }
    return M;
}

function rotate2dListCounterClockwise(L) {
  let M = []
  for (let row of L) {
    M.push(row.slice())}
  M = rotate2dListClockwise(M)
  M = rotate2dListClockwise(M)
  M = rotate2dListClockwise(M)
  return M
}

function rotate2dList180(L) {
  let M = []
  for (let row of L) {
    M.push(row.slice())}
  M = rotate2dListClockwise(M)
  M = rotate2dListClockwise(M)
  return M
}

function loadTetrisPieces(){
    // Seven "standard" pieces (tetrominoes)
    iPiece = [[  true,  true,  true,  true ]]
    jPiece = [[  true, false, false ],
              [  true,  true,  true ]]
    lPiece = [[ false, false,  true ],
              [  true,  true,  true ]]
    oPiece = [[  true,  true ],
              [  true,  true ]]
    sPiece = [[ false,  true,  true ],
              [  true,  true, false ]]
    tPiece = [[ false,  true, false ],
              [  true,  true,  true ]]
    zPiece = [[  true,  true, false ],
              [ false,  true,  true ]] 
    tetrisPieces = [ iPiece, jPiece, lPiece, oPiece,
                         sPiece, tPiece, zPiece ]
    tetrisPieceColors = [ '#41afe1', '#1365b3', '#f58927', '#f7cf3a', '#51b84d', '#9639a3', '#e95063' ]
}

function pieceIsLegal(){
    for (let row of  Array(len(piece)).keys()){
        for (let col of Array(len(piece[0])).keys()){
            if (piece[row][col]){
                if (0 > pieceTopRow+row || 
                    pieceTopRow+row >= rows || 
                    0 > pieceLeftCol+col || 
                    pieceLeftCol+col >= cols){
                    return false}
                else if (board[pieceTopRow+row][pieceLeftCol+col] == null){
                  // pass
                    }
                else{
                    return false}
            }
        }
    }
    return true
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
      score += 100 * level
      break
    case 2:
      score += 300 * level
      break
    case 3:
      score += 500 * level
      break
    case 4:
      tetris = 30 
      score += 800 * level
      break
  }
  if (combo > 0){
    score += 50 * combo * level
  }
}

function movePiece(drow, dcol){ // returns true if piece was moved
    pieceTopRow += drow
    pieceLeftCol += dcol
    if (pieceIsLegal()){
        return true}
    else{
        pieceTopRow -= drow
        pieceLeftCol -= dcol
        return false}
}

function hardDropPiece(){
    let rowsDropped = 0
    while(movePiece( 1, 0)){
      rowsDropped +=1
      // all the moving is done in the while loop expression
    }
    addScore(0, rowsDropped, 0)
    takeStep() // this is so the next piece immediately shows up
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
  
function rotatePieceClockwise(){
    oldPiece = piece
    oldTopRow = pieceTopRow
    oldLeftCol = pieceLeftCol
    
    centerRow = oldTopRow + Math.floor(len(oldPiece)/2)
    centerCol = oldLeftCol + Math.floor(len(oldPiece[0])/2)
    
    piece = rotate2dListClockwise(piece)
    pieceTopRow = centerRow - Math.floor(len(piece)/2)
    pieceLeftCol = centerCol - Math.floor(len(piece[0])/2)
    
    if (pieceIsLegal()){
        return true}
    else{
        piece = oldPiece
        pieceTopRow = oldTopRow
        pieceLeftCol = oldLeftCol}
}
  
function rotatePieceCounterClockwise(){
    oldPiece = piece
    oldTopRow = pieceTopRow
    oldLeftCol = pieceLeftCol
    
    centerRow = oldTopRow + Math.floor(len(oldPiece)/2)
    centerCol = oldLeftCol + Math.floor(len(oldPiece[0])/2)
    
    piece = rotate2dListCounterClockwise(piece)
    pieceTopRow = centerRow - Math.floor(len(piece)/2)
    pieceLeftCol = centerCol - Math.floor(len(piece[0])/2)
    
    if (pieceIsLegal()){
        return true}
    else{
        piece = oldPiece
        pieceTopRow = oldTopRow
        pieceLeftCol = oldLeftCol}
}

function rotatePiece180(){
    oldPiece = piece
    oldTopRow = pieceTopRow
    oldLeftCol = pieceLeftCol
    
    centerRow = oldTopRow + Math.floor(len(oldPiece)/2)
    centerCol = oldLeftCol + Math.floor(len(oldPiece[0])/2)
    
    piece = rotate2dList180(piece)
    pieceTopRow = centerRow - Math.floor(len(piece)/2)
    pieceLeftCol = centerCol - Math.floor(len(piece[0])/2)
    
    if (pieceIsLegal()){
        return true}
    else{
        piece = oldPiece
        pieceTopRow = oldTopRow
        pieceLeftCol = oldLeftCol}
}
  
function draw(){
    // push()
    // fill(0)
    // rect(-10,-10,410,410)
    // pop()
    background(color(56,60,68))
  
    doHoldingFrames()  //
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
  // frameCount is increasing at 60 frames per second
    if (frameCount%round((1/speedCurve[level-1])) == 0) {
      takeStep()
    }
  
    if (!isLooping()){
      push()
      let c = color(25)
      c.setAlpha(200)
      fill(c)
      noStroke()
      rect(0,0,400,400)
      pop()
      
      push()
      textAlign(CENTER)
      textSize(20)
      text("PAUSED", 200, 200)
      pop()
    }
}

function onStep(){
    takeStep()}

function takeStep(){
    if (! gameOver){
    if (totalClearedLines> level*10) {
      level+=1
    }
    if (!movePiece(1, 0)){
        placePieceOnBoard()
        removeFullRows()
        loadNextPiece()
        heldThisFall = false
    }
}}

function holdPiece() {
  //let currrentPieceIndex = tetrisPieces.indexOf(piece)
  if (!heldThisFall) {
    if (heldPieceIndex == null){
    heldPieceIndex = currPieceIndex}
    
    else {
      let temp = heldPieceIndex
      heldPieceIndex = currPieceIndex
      nextPieceIndex = temp
      
    }
    loadNextPiece()
    heldThisFall = true
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
    nextPieceIndex = bag[0]
    bag.splice(0, 1)
    if (len(bag) < 7){
        bag.push(nextBag[0])
        nextBag.splice(0,1)}
    if (len(nextBag) == 0){       
      nextBag = [0,1,2,3,4,5,6]
      shuffleArray(nextBag)
    }
    
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
    }
    else{
      combo = -1
    }
}
  
function drawText() {
    push()
    fill(255)
    textSize(16)
    if (gameOver) {
      fill(255,0,0)
      text('Tetris\nGame Over!\nPress r to try \nagain', 10, 30)
    }
    else{
    text('Cubotris', 10, 30)
    pop()
    }
  push()
  fill(255)
  textSize(16)
  textAlign(CENTER)
  text("Level: "+level, 200,430)
  text("Score: "+score, 200,450)
  text("Lines: "+totalClearedLines, 200,470)
  pop()
    if (tetris > 0) {
      tetris -= 1
      if (tetris%10 == 0 || (tetris+2)%10==0 || (tetris+1)%10==0){}
      else{
        push()
        textSize(40)
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

function doHoldingFrames() {
  if(keyIsDown(LEFT_ARROW)){
     leftHoldingFrames += 1
    //console.log(leftHoldingFrames)
  }
  if (keyIsDown(RIGHT_ARROW)){
      rightHoldingFrames += 1
    //console.log(rightHoldingFrames)
    }
}  
  
function doDAR() {
  if(keyIsDown(LEFT_ARROW)){
     if (leftHoldingFrames >= DARRate) {
        while(movePiece(0,-1)){}
    }
  }
  if (keyIsDown(RIGHT_ARROW)){
    if (rightHoldingFrames >= DARRate) {
       while(movePiece(0,1)){}
    }
  }
}

function doARR() {
  if(keyIsDown(LEFT_ARROW)){
    if (leftHoldingFrames % ARRRate == 0) { // every ARRRate frames
      movePiece(0,-1)
    }
  }
  if(keyIsDown(RIGHT_ARROW)){
    if (rightHoldingFrames % ARRRate == 0) {
      movePiece(0,1)
    }
  }
}
  
function keyPressed(){
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
            movePiece( 0, 1)
            break
        case 'ArrowDown':
            movePiece( 1, 0)
            addScore(1,0,0)
            break
        case 'ArrowLeft':
            movePiece( 0, -1)
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
    }
    
    } 
    if (key == 'r'){
    setup()}
}

function keyReleased() {
  switch (key){
    case 'ArrowLeft':
      leftHoldingFrames = 0
      break
    case 'ArrowRight':
      rightHoldingFrames = 0
      break
  }
}

