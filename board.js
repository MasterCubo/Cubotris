
function drawBoard(){
    for (let row of Array(rows).keys()){
        for( let col of Array(cols).keys()){
            if (row < rows-1 && board[row][col] == null && board[row+1][col] != null) {
              drawCell(row, col, board[row+1][col], true)
            }
            else {
              drawCell(row, col, board[row][col])
            }
        }
    }
}
  
function drawPiece(){
    for (let row of Array(len(piece)).keys()){
        for (let col of Array(len(piece[row])).keys()){
            if (piece[row][col]){
                if (row == 0 || piece[row-1][col] == false) {
                  drawCell(pieceTopRow + row-1, pieceLeftCol + col, pieceColor, true) }
                drawCell(pieceTopRow + row, pieceLeftCol + col, pieceColor, false)}
        }
    }
}


function drawBoardBorder(){
  // draw the board outline (with double-thickness):
  push()
  noFill()
  stroke('grey')
  strokeWeight(10*cellBorderWidth)
  rect(boardLeft, boardTop, boardWidth, boardHeight)
  pop()
}
  
function drawCell(row, col, pcolor, highlight){
  let leftTop = getCellLeftTop(row, col) 
  let cellLeft = leftTop[0]
  let cellTop = leftTop[1]
  
  let widthHeight = getCellSize()
  let cellWidth = widthHeight[0]
  let cellHeight = widthHeight[1]
  
  
  push()
  if (highlight) {
    noFill();stroke('grey')
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
    noFill();stroke('grey')
  }
  else{fill(pcolor);noStroke();}
  strokeWeight(cellBorderWidth)
  rect(cellLeft, cellTop, cellWidth, cellHeight)
  pop()
}
  
