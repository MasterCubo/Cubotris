let UIButtons = []

class UIButton { // i hate writing classes.
  
  constructor(x,y,w,h,txt, txtSize, bcolor) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.txt = txt
    this.txtSize = txtSize
    this.bcolor = bcolor
    UIButtons.push(this)
  }
  
  renderButton() {
    push()
    noStroke()
    let c = color(this.bcolor)
    c.setAlpha(150)
    fill(c)
    rect(this.x, this.y, this.w, this.h)
    pop()
    push()
    textAlign(CENTER)
    textSize(this.txtSize)
    text(this.txt, this.x+this.w/2, this.y+this.h/2+(this.txtSize/4))
    pop()
  }
  
  clickInButton(mX, mY) {
    if (mX > this.x &&
       mX < this.x+this.w &&
       mY > this.y &&
       mY < this.y+this.h) {
      return true
    }
    else {return false}
  }
  
}




const newGameButton = new UIButton(15,215,76,38,'New Game', 12, 'grey')
const touchUIButton = new UIButton(15,260,76,38,'Touch UI', 12, 'grey')

const bW = 65 // buttonWidth
const btS = 50 // button Text Size
const bG = 5 // button Gap

const hDx = 250 // everything will be placed around the hard drop button
const hDy = 465

const turnCCWButton = new UIButton(hDx-bW*2-bG*3-bW/2,hDy-bW-bG,bW,bW,'↺', btS, 'cyan')
const turn180Button = new UIButton(hDx-bW*3-bG*4,hDy,bW,bW,'⇅', btS, 'cyan')
const holdButton = new UIButton(hDx-bW*2-bG*3,hDy,bW,bW,'↹ ', btS, 'cyan')


const turnCWButton = new UIButton(hDx, hDy-bW-bG,bW,bW,'↻', btS, 'cyan')
const leftButton = new UIButton(hDx-bW-bG,hDy,bW,bW,'<', btS, 'cyan')
const rightButton = new UIButton(hDx+bW+bG,hDy,bW,bW,'>', btS, 'cyan')
const hardDropButton = new UIButton(hDx,hDy,bW,bW,'↡', btS, 'cyan')
const softDropButton = new UIButton(hDx,hDy+bW+bG,bW,bW,'v', btS, 'cyan')

function drawTouchUI() {
   // draw 7 sqaures and a new game
  UIButtons[0].renderButton()  // render the new game and Touch UI buttons
  UIButtons[1].renderButton()
  
  skip = 2
  if (TouchUI) {
    for (let button of UIButtons) {
        if (skip > 0) {skip--}
        else{
          
          button.renderButton()
        
        }
    }
  }
}

function mouseInBox(x,y) {
  // returns the index of the box that contains x,y
  // 0 is New Game
  // 1 is Touch UI
  for (let i of Array(len(UIButtons)).keys()) {
    if(UIButtons[i].clickInButton(x,y)) {return i}
  }
}
  
function mousePressed() {
  switch(mouseInBox(mouseX, mouseY)) {
    case 0:
      setup()
      break
    case 1:  
      TouchUI = !TouchUI
      break
  }
  if (TouchUI) {
  switch(mouseInBox(mouseX, mouseY)) {
    case 2: 
      rotatePieceCounterClockwise()
      break
    case 3:
      rotatePiece180()
      break
    case 4:
      holdPiece()
      break
    case 5:
      rotatePieceClockwise()
      break
    case 6:
      movePiece(0, -1)
      break
    case 7:
      movePiece(0, 1)
      break
    case 8:
      hardDropPiece()
      break
    case 9:
      movePiece(1, 0)
      addScore(1,0,0)
      break
  }}
}
