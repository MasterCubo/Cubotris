function drawPreviewBorder() {
  // draw the board outline (with double-thickness):
  push()
  noFill()  
  stroke('grey')
  strokeWeight(2*cellBorderWidth) 
  // rect(315, 125, 9.5*8, 9.5*8*3)
  
  strokeWeight(4*cellBorderWidth)
  // rect(315, 125, 9.5*8, 9.5*8)
  // rect(315, 125+(9.5*8), 9.5*8, 9.5*8)
  // rect(315, 125+(9.5*8)*2, 9.5*8, 9.5*8)
  fill('grey')
  noStroke()
  text("Next", 315, 115)
  pop()
}
  
function clearPreviewBoard() {
  previewBoard = []
    for (let row of Array(4).keys()) {
      previewBoard.push([])
      for (let col of Array(12).keys()){
        previewBoard[row].push(null)
    }}
}
  
function placePreviewPieces() {
      clearPreviewBoard()
      for (let i = 0; i < 5; i++){
      let previewPiece = rotate2dListClockwise(tetrisPieces[bag[i]])
      for (let row of Array(len(previewPiece)).keys()){
        for (let col of Array(len(previewPiece[row])).keys()){
            if (previewPiece[row][col]){
                previewBoard[row][col+(i*3)+1] = tetrisPieceColors[bag[i]]
            }
        }
      }
        
    }
}
  
function drawPreviewBoard() {  // kinda looks better without a grid, see jstris 
  for (let row of Array(4).keys()){
        for( let col of Array(3*5).keys()){ // 5 preview peices, 2 cols each.
            if (col < 3*5 && previewBoard[row][col] == null && previewBoard[row][col+1] != null) {
              drawPreviewCell(row, col, previewBoard[row][col+1], true)
            }
            else {
              drawPreviewCell(row, col, previewBoard[row][col])
            }
        }
    }
}

function drawPreviewCell(col, row, pcolor, highlight) {
  let widthHeight = getCellSize()
  let cellWidth = widthHeight[0]
  let cellHeight = widthHeight[1]
  
  let cellLeft = 315 + col * cellWidth
  let cellTop = 125 + row * cellHeight - cellHeight
  
  
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
  
function drawPreview() {
  drawPreviewBorder()
  drawPreviewBoard()
}
