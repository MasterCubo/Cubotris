// i originally used p5.Sound, but as of idk, March 2024, theres this wierd memory leak issue, where after playing the game for like 2 mins the sound gets hella glitchy and laggy. switching to HTML Audio elements helped, since they have built in garbage collecting.

let s = {}

let muted = false


function loadASound(name) {
  console.log(`loading ${name}`)
  s[name] = new Audio(`sound/${name}.ogg`) 
}

// function checkLoaded(){
//   for (let k in s){
//     console.log(`${k}: ${s[k].isLoaded()}`)
//   }
// }

// very hard to debug sound loading

function loadSounds() {
  
  loadASound('spin')
  loadASound('harddrop')
  loadASound('hit')
  loadASound('hold')
  loadASound('sidehit')
  loadASound('clearline') 
  loadASound('clearquad')
  for (let i = 1; i <= 16; i++) {
    loadASound('combo_'+i) // load all combo sounds
  }
  loadASound('combobreak')
  loadASound('rotate')
  loadASound('softdrop')
  loadASound('move')
  loadASound('shatter')
  loadASound('detonate1')
  loadASound('detonate2')
  loadASound('detonated')
  loadASound('menuhit1')
  loadASound('menuhover')
  loadASound('countdown3')
  loadASound('countdown2')
  loadASound('countdown1')
  loadASound('go')
  loadASound('topout')
  loadASound('warning')
  // checkLoaded()
}

function play(sound) {
  if (!muted){
  if (typeof(sound) === 'object'){
    let t = sound.cloneNode() // this allows for the same sound to be played twice at once. Comment this out and try restarting to hear the effect.
    t.volume = 0.5
    t.play()
  }
  if (typeof(sound) === 'string'){
    let t = s[sound].cloneNode()
    t.volume = 0.5
    t.play()
  }
  }
}

function succ() {
  console.log('loaded sound')
}

function err(thing) {
  console.log('oh no!')
  console.log(thing)
}
