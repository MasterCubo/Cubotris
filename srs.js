
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
    iPiece = [[false, false, false, false],
              [ true,  true,  true,  true],
              [false, false, false, false],
              [false, false, false, false]]
  
    jPiece = [[ true, false, false],
              [ true, true,  true ],
              [false, false, false]]
  
    lPiece = [[ false, false,  true ],
              [  true,  true,  true ],
              [false, false, false]]
  
    oPiece = [[  true,  true ],
              [  true,  true ]]
  
    sPiece = [[ false,  true,  true ],
              [  true,  true, false ],
              [ false, false, false]]
  
    tPiece = [[ false,  true, false ],
              [  true,  true,  true ],
              [false ,false, false]]
  
    zPiece = [[  true,  true, false ],
              [ false,  true,  true ],
              [false, false, false]] 
  
    tetrisPieces = [ iPiece, jPiece, lPiece, oPiece,
                         sPiece, tPiece, zPiece ]
    tetrisPieceColors = [ '#41afe1', '#1365b3', '#f58927', '#f7cf3a', '#51b84d', '#9639a3', '#e95063', '#868686' ]
}


// each large table is a side of an srs chart
// each col is a test case, each row is a starting rotation state, and each inner pair is the displacement of the test case, [down row change, right col change]
let srsKickTable = [ 

  // clockwise spin STZOLJ
[[[0, 0], [0, -1], [-1, -1], [ 2, 0], [ 2, -1]], 
 [[0, 0], [0,  1], [ 1,  1], [-2, 0], [-2,  1]],
 [[0, 0], [0,  1], [-1,  1], [ 2, 0], [ 2,  1]],
 [[0, 0], [0, -1], [ 1, -1], [ 2, 0], [ 2, -1]]],

// counterclockwise spin STZOLJ
[[[0, 0], [0,  1], [-1,  1], [ 2, 0], [ 2,  1]],
 [[0, 0], [0,  1], [ 1,  1], [-2, 0], [-2,  1]],
 [[0, 0], [0, -1], [-1, -1], [ 2, 0], [-2, -1]],
 [[0, 0], [0, -1], [ 1, -1], [-2, 0], [-2, -1]]],

 // 180 kick table STZOLJ from Tetr.io (SRS+)
[[[0, 0], [-1,  0], [-1,  1], [-1, -1], [ 0,  1], [ 0, -1]],
 [[0, 0], [ 0,  1], [-2,  1], [-1,  1], [-2,  0], [-1,  0]],
 [[0, 0], [ 1,  0], [ 1, -1], [ 1,  1], [ 0, -1], [ 0,  1]],
 [[0, 0], [ 0, -1], [-2, -1], [-1, -1], [-2,  0], [-1,  0]]],
                    
  // I piece clockwise rotation from SRS+ (tetr.io)
[[[0, 0], [0,  1], [0, -2], [ 1, -2], [-2,  1]],
 [[0, 0], [0, -1], [0,  2], [-2, -1], [ 1,  2]],
 [[0, 0], [0,  2], [0, -1], [ 2, -1], [-1,  2]], 
 [[0, 0], [0,  1], [0, -2], [ 2,  1], [-1, -2]]],
 // I piece counterclokcwise rotation from SRS+ (tetr.io) (symmetrical to clockwise on the y axis)
[[[0, 0], [0, -1], [0,  2], [ 1,  2], [-2, -1]], // second number neg
 [[0, 0], [0, -1], [0,  2], [ 2, -1], [-1,  2]], // first num neg
 [[0, 0], [0, -2], [0,  1], [ 2,  1], [-1, -2]], // second num neg
 [[0, 0], [0,  1], [0, -2], [-2,  1], [ 1, -2]]] // first num neg

]



function wallKick(rotation) {  // the whole srs kicktable 
  if (currPiece == 0) { // if I piece
    switch(rotation) {
    case 0: // clockwise rotation
      
      switch(rotationState) { // from this state
          
        case 0:
               if (movePiece(...srsKickTable[3][0][0])) {
            return true
          }
          else if (movePiece(...srsKickTable[3][0][1])) {
            return true
          }
          else if (movePiece(...srsKickTable[3][0][2])) {
            return true
          }
          else if (movePiece(...srsKickTable[3][0][3])) {
            return true
          }
          else if (movePiece(...srsKickTable[3][0][4])) {
            return true
          }
          else {
            return false
          }
          break
          
        case 1:
               if (movePiece(...srsKickTable[3][1][0])){
            return true
          }
          else if (movePiece(...srsKickTable[3][1][1])){
            return true
          }
          else if (movePiece(...srsKickTable[3][1][2])){
            return true
          }
          else if (movePiece(...srsKickTable[3][1][3])){
            return true
          }
          else if (movePiece(...srsKickTable[3][1][4])){
            return true
          }
          else{
            return false
          }
          break
        
        case 2:
               if (movePiece(...srsKickTable[3][2][0])){
            return true
          }
          else if (movePiece(...srsKickTable[3][2][1])){
            return true
          }
          else if (movePiece(...srsKickTable[3][2][2])){
             return true
          }
          else if (movePiece(...srsKickTable[3][2][3])){
            return true
          }
          else if (movePiece(...srsKickTable[3][2][4])){
            return true
          }
          else {
            return false
          }
          break
        
        case 3:
               if (movePiece(...srsKickTable[3][3][0])){
            return true
          }
          else if (movePiece(...srsKickTable[3][3][1])){ // not working
            return true
          }
          else if (movePiece(...srsKickTable[3][3][2])){
            return true
          }
          else if (movePiece(...srsKickTable[3][3][3])){
            return true
          }
          else if (movePiece(...srsKickTable[3][3][4])){
            return true
          }
          else{
            return false
          }
          break // end case 3
      }
      break // case 0
      
      
    case 1: // counterclockwise rotation
          
    switch(rotationState) { // from this state
          
        case 0:
               if (movePiece(...srsKickTable[4][0][0])){
            return true
          }
          else if (movePiece(...srsKickTable[4][0][1])){
            return true
          }
          else if (movePiece(...srsKickTable[4][0][2])){
            return true
          }
          else if (movePiece(...srsKickTable[4][0][3])){
            return true
          }
          else if (movePiece(...srsKickTable[4][0][4])){
            return true
          }
          else {
            return false
          }
          break
          
        case 1:
               if (movePiece(...srsKickTable[4][1][0])){
            return true
          }
          else if (movePiece(...srsKickTable[4][1][1])){
            return true
          }
          else if (movePiece(...srsKickTable[4][1][2])){
            return true
          }
          else if (movePiece(...srsKickTable[4][1][3])){
            return true
          }
          else if (movePiece(...srsKickTable[4][1][4])){
            return true
          }
          else{
            return false
          }
          break
        
        case 2:
               if (movePiece(...srsKickTable[4][2][0])){
            return true
          }
          else if (movePiece(...srsKickTable[4][2][1])){
            return true
          }
          else if (movePiece(...srsKickTable[4][2][2])){
             return true
          }
          else if (movePiece(...srsKickTable[4][2][3])){
            return true
          }
          else if (movePiece(...srsKickTable[4][2][4])){
            return true
          }
          else {
            return false
          }
          break
        
        case 3:
               if (movePiece(...srsKickTable[4][3][0])){
            return true
          }
          else if (movePiece(...srsKickTable[4][3][1])){
            return true
          }
          else if (movePiece(...srsKickTable[4][3][2])){
            return true
          }
          else if (movePiece(...srsKickTable[4][3][3])){
            return true
          }
          else if (movePiece(...srsKickTable[4][3][4])){
            return true
          }
          else{
            return false
          }
          break // end case 3
      } // end switch rotation state
      break // end counterclockwise rotation
    }// end switch rotation direction  
  }
  else {
  switch(rotation) {
    case 0: // clockwise rotation
      
      switch(rotationState) { // from this state
          
        case 0:
               if (movePiece(...srsKickTable[0][0][0])) {
            return true
          }
          else if (movePiece(...srsKickTable[0][0][1])) {
            return true
          }
          else if (movePiece(...srsKickTable[0][0][2])) {
            return true
          }
          else if (movePiece(...srsKickTable[0][0][3])) {
            return true
          }
          else if (movePiece(...srsKickTable[0][0][4])) {
            return true
          }
          else {
            return false
          }
          break
          
        case 1:
               if (movePiece(...srsKickTable[0][1][0])){
            return true
          }
          else if (movePiece(...srsKickTable[0][1][1])){
            return true
          }
          else if (movePiece(...srsKickTable[0][1][2])){
            return true
          }
          else if (movePiece(...srsKickTable[0][1][3])){
            return true
          }
          else if (movePiece(...srsKickTable[0][1][4])){
            return true
          }
          else{
            return false
          }
          break
        
        case 2:
               if (movePiece(...srsKickTable[0][2][0])){
            return true
          }
          else if (movePiece(...srsKickTable[0][2][1])){
            return true
          }
          else if (movePiece(...srsKickTable[0][2][2])){
             return true
          }
          else if (movePiece(...srsKickTable[0][2][3])){
            return true
          }
          else if (movePiece(...srsKickTable[0][2][4])){
            return true
          }
          else {
            return false
          }
          break
        
        case 3:
               if (movePiece(...srsKickTable[0][3][0])){
            return true
          }
          else if (movePiece(...srsKickTable[0][3][1])){ // not working
            return true
          }
          else if (movePiece(...srsKickTable[0][3][2])){
            return true
          }
          else if (movePiece(...srsKickTable[0][3][3])){
            return true
          }
          else if (movePiece(...srsKickTable[0][3][4])){
            return true
          }
          else{
            return false
          }
          break // end case 3
      }
      break // case 0
      
      
    case 1: // counterclockwise rotation
          
    switch(rotationState) { // from this state
          
        case 0:
               if (movePiece(...srsKickTable[1][0][0])){
            return true
          }
          else if (movePiece(...srsKickTable[1][0][1])){
            return true
          }
          else if (movePiece(...srsKickTable[1][0][2])){
            return true
          }
          else if (movePiece(...srsKickTable[1][0][3])){
            return true
          }
          else if (movePiece(...srsKickTable[1][0][4])){
            return true
          }
          else {
            return false
          }
          break
          
        case 1:
               if (movePiece(...srsKickTable[1][1][0])){
            return true
          }
          else if (movePiece(...srsKickTable[1][1][1])){
            return true
          }
          else if (movePiece(...srsKickTable[1][1][2])){
            return true
          }
          else if (movePiece(...srsKickTable[1][1][3])){
            return true
          }
          else if (movePiece(...srsKickTable[1][1][4])){
            return true
          }
          else{
            return false
          }
          break
        
        case 2:
               if (movePiece(...srsKickTable[1][2][0])){
            return true
          }
          else if (movePiece(...srsKickTable[1][2][1])){
            return true
          }
          else if (movePiece(...srsKickTable[1][2][2])){
             return true
          }
          else if (movePiece(...srsKickTable[1][2][3])){
            return true
          }
          else if (movePiece(...srsKickTable[1][2][4])){
            return true
          }
          else {
            return false
          }
          break
        
        case 3:
               if (movePiece(...srsKickTable[1][3][0])){
            return true
          }
          else if (movePiece(...srsKickTable[1][3][1])){
            return true
          }
          else if (movePiece(...srsKickTable[1][3][2])){
            return true
          }
          else if (movePiece(...srsKickTable[1][3][3])){
            return true
          }
          else if (movePiece(...srsKickTable[1][3][4])){
            return true
          }
          else{
            return false
          }
          break // end case 3
      }
      break // end counterclockwise rotation
      
    case 2: // 180 rotation
          
    switch(rotationState) { // from this state
          
        case 0:
              if (movePiece(...srsKickTable[2][0][0])) {
            return true
          }
          else if(movePiece(...srsKickTable[2][0][1])) {
            return true
          }
          else if(movePiece(...srsKickTable[2][0][2])) {
            return true
          }
          else if(movePiece(...srsKickTable[2][0][3])) {
            return true
          }
          else if(movePiece(...srsKickTable[2][0][4])) {
            return true
          }
          else if(movePiece(...srsKickTable[2][0][5])) {
            return true
          }
          else {
            return false
          }
          break
          
        case 1:
               if (movePiece(...srsKickTable[2][1][0])){
            return true
          }
          else if (movePiece(...srsKickTable[2][1][1])){
            return true
          }
          else if (movePiece(...srsKickTable[2][1][2])){
            return true
          }
          else if (movePiece(...srsKickTable[2][1][3])){
            return true
          }
          else if (movePiece(...srsKickTable[2][1][4])){
            return true
          }
          else if (movePiece(...srsKickTable[2][1][5])){
            return true
          }
          else{
            return false
          }
          break
        
        case 2:
               if (movePiece(...srsKickTable[2][2][0])){
            return true
          }
          else if (movePiece(...srsKickTable[2][2][1])){
            return true
          }
          else if (movePiece(...srsKickTable[2][2][2])){
             return true
          }
          else if (movePiece(...srsKickTable[2][2][3])){
            return true
          }
          else if (movePiece(...srsKickTable[2][2][4])){
            return true
          }
          else if (movePiece(...srsKickTable[2][2][5])){
            return true
          }
          else {
            return false
          }
          break
        
        case 3:
               if (movePiece(...srsKickTable[2][3][0])){ // broke
            return true
          }
          else if (movePiece(...srsKickTable[2][3][1])){
            return true
          }
          else if (movePiece(...srsKickTable[2][3][2])){
            return true
          }
          else if (movePiece(...srsKickTable[2][3][3])){
            return true
          }
          else if (movePiece(...srsKickTable[2][3][4])){
            return true
          }
          else if (movePiece(...srsKickTable[2][3][5])){
            return true
          }
          else{
            return false
          }
          break // end case 3
      }
        
    }
  } // end STZLOJ
}

function pieceIsLegal(){
    for (let row of  Array(len(piece)).keys()){
        for (let col of Array(len(piece[0])).keys()){
            if (piece[row][col]){
                if (0 > pieceTopRow+row ||
                    pieceTopRow+row >= rows ||
                    0 > pieceLeftCol+col ||
                    pieceLeftCol+col >= cols){
                    return false // hit a wall
                }
                else if (board[pieceTopRow+row][pieceLeftCol+col] == null){
                  // theres nothing there, pass
                    }
                else{ // theres a piece there
                    return false}
            }
        }
    }
    return true
}

function rotationIsLegal(rotation){
    // for (let row of Array(len(piece)).keys()){
    //     for (let col of Array(len(piece[0])).keys()){
    //         if (piece[row][col]){
    //             if (0 > pieceTopRow+row ||
    //                 pieceTopRow+row >= rows ||
    //                 0 > pieceLeftCol+col ||
    //                 pieceLeftCol+col >= cols){
    //             // its hitting a wall, do a wall kick
    //             return wallKick(rotation)
    //         }
    //             else if (board[pieceTopRow+row][pieceLeftCol+col] == null){
    //               // pass
    //                 }
    //             else{
    //                 return wallKick(rotation)}
    //         }
    //     }
    // }
    // return true
  return wallKick(rotation)
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
    lockDelayCount = lockDelay+1 // lock piece
    let rowsDropped = 0
    while(movePiece( 1, 0)){
      rowsDropped +=1
      // all the moving is done in the while loop expression
    }
    addScore(0, rowsDropped, 0)
  
    takeStep() // this is so the next piece immediately shows up
    play(s.harddrop)
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
    
    if (rotationIsLegal(0)){
      lastMovement = 0
      rotationState = (rotationState+1)%4
      play(s.rotate)  
      return true
        }
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
    
    if (rotationIsLegal(1)){
        lastMovement = 1
        rotationState = (rotationState+3)%4  // -1 broke %, this is equivalent
        play(s.rotate)
        return true
}
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
    
    if (rotationIsLegal(2)){
        lastMovement = 2
        rotationState = (rotationState+2)%4  
        play(s.rotate)
        return true
}
    else{
        piece = oldPiece
        pieceTopRow = oldTopRow
        pieceLeftCol = oldLeftCol}
}
