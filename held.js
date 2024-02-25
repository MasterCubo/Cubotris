



function drawHeldBorder() {
  // draw the board outline (with double-thickness):
  push()
  // noFill()  
  // stroke('grey')
  // strokeWeight(10*cellBorderWidth)
  // rect(15, 125, 9.5*8, 9.4*8)
  fill('grey')
  noStroke()
  text("Held", 15, 115) 
  pop()
}
  
function clearHeldBoard() {
  heldBoard = []
    for (let row of Array(4).keys()) {
      heldBoard.push([])
      for (let col of Array(4).keys()){
        heldBoard[row].push(null)
    }}
}
  
function placeHeldPiece() {
      clearHeldBoard()
      let heldPiece = rotate2dListCounterClockwise(tetrisPieces[heldPieceIndex])
      if (heldPieceIndex != null){
      for (let row of Array(len(heldPiece)).keys()){
        for (let col of Array(len(heldPiece[row])).keys()){
            if (heldPiece[row][col]){
                heldBoard[row][col+1] = tetrisPieceColors[heldPieceIndex] // the +1 bumps it to the middle of the square
            }
        }
    }
  }
}
  
function drawHeldBoard() {
  for (let row of Array(4).keys()){
        for( let col of Array(4).keys()){
            if (col < 3 && heldBoard[row][col] == null && heldBoard[row][col+1] != null) {
              drawHeldCell(row, col, heldBoard[row][col+1], true)
            }
            else {
              drawHeldCell(row, col, heldBoard[row][col])
            }
        }
    }
}

function drawHeldCell(col, row, pcolor, highlight) {
  let widthHeight = getCellSize()
  let cellWidth = widthHeight[0]
  let cellHeight = widthHeight[1]
  
  let cellLeft = 15 + col * cellWidth
  let cellTop = 125 + row * cellHeight // bump it down one.
  
  
  push()
  if (highlight) {
    noFill();noStroke();//stroke('grey')
    push()
    let highlightColor = color(pcolor)
    strokeCap(SQUARE);
    highlightColor.setRed(red(highlightColor)+50)
    highlightColor.setBlue(blue(highlightColor)+50)
    highlightColor.setGreen(green(highlightColor)+50)
    stroke(highlightColor)
    strokeWeight(cellBorderWidth*130)
    line(cellLeft, cellTop+cellHeight, cellLeft+cellWidth, cellTop+cellHeight)
    pop()
  }
  else if(pcolor == null) {
    noFill();noStroke();//stroke('grey')
  }
  else{fill(pcolor);noStroke();}
  strokeWeight(cellBorderWidth)
  rect(cellLeft, cellTop, cellWidth, cellHeight)
  pop()
}
  
function drawHeld() {
  drawHeldBorder()
  if (heldPieceIndex != null) {
    placeHeldPiece()
  }
  drawHeldBoard()
}
