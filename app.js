const keyboardLayout = [
  ["Q","W","E","R","T","Z","U","I","O","P","Ü"],
  ["A","S","D","F","G","H","J","K","L","Ö","Ä"],
  ["Y","X","C","V","B","N","M"]
];


const pigpenType = {

  A:"br",
  B:"blr",
  C:"bl",

  D:"tbr",
  E:"tblr",
  F:"tbl",

  G:"tr",
  H:"tlr",
  I:"tl",

  J:"br-dot",
  K:"blr-dot",
  L:"bl-dot",

  M:"tbr-dot",
  N:"tblr-dot",
  O:"tbl-dot",

  P:"tr-dot",
  Q:"tlr-dot",
  R:"tl-dot",

  S:"angle-down",
  T:"angle-right",
  U:"angle-left",
  V:"angle-up",

  W:"angle-down-dot",
  X:"angle-right-dot",
  Y:"angle-left-dot",
  Z:"angle-up-dot"
};


let mode = "encrypt";
let decryptLetters = [];


const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");

const inputTitle = document.getElementById("inputTitle");
const outputTitle = document.getElementById("outputTitle");

const symbolKeyboardSection = document.getElementById("symbolKeyboardSection");
const symbolKeyboard = document.getElementById("symbolKeyboard");

const spaceBtn = document.getElementById("spaceBtn");
const backBtn = document.getElementById("backBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");



function normalizeText(text){

  return text
    .toUpperCase()
    .replaceAll("Ä","AE")
    .replaceAll("Ö","OE")
    .replaceAll("Ü","UE")
    .replaceAll("ß","SS");
}



function createSvgLine(x1,y1,x2,y2){

  const line = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );

  line.setAttribute("x1",x1);
  line.setAttribute("y1",y1);
  line.setAttribute("x2",x2);
  line.setAttribute("y2",y2);

  line.setAttribute("stroke","#111");
  line.setAttribute("stroke-width","9");
  line.setAttribute("stroke-linecap","square");

  return line;
}



function createSvgDot(){

  const dot = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  dot.setAttribute("cx","50");
  dot.setAttribute("cy","50");

  dot.setAttribute("r","7");

  dot.setAttribute("fill","#111");

  return dot;
}



function createSymbol(letter){

  const wrapper = document.createElement("span");
  wrapper.className = "pigpen-symbol";


  const type = pigpenType[letter];


  if(!type){

    wrapper.textContent = letter;
    return wrapper;
  }


  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  svg.setAttribute("viewBox","0 0 100 100");
  svg.setAttribute("width","100");
  svg.setAttribute("height","100");


  const hasDot = type.includes("dot");

  const clean = type.replace("-dot","");


  if(clean.includes("t")){
    svg.appendChild(createSvgLine(20,20,80,20));
  }

  if(clean.includes("b")){
    svg.appendChild(createSvgLine(20,80,80,80));
  }

  if(clean.includes("l")){
    svg.appendChild(createSvgLine(20,20,20,80));
  }

  if(clean.includes("r")){
    svg.appendChild(createSvgLine(80,20,80,80));
  }


  if(clean==="angle-down"){

    svg.appendChild(
      createSvgLine(20,20,50,80)
    );

    svg.appendChild(
      createSvgLine(80,20,50,80)
    );
  }


  if(clean==="angle-up"){

    svg.appendChild(
      createSvgLine(20,80,50,20)
    );

    svg.appendChild(
      createSvgLine(80,80,50,20)
    );
  }


  if(clean==="angle-right"){

    svg.appendChild(
      createSvgLine(20,20,80,50)
    );

    svg.appendChild(
      createSvgLine(20,80,80,50)
    );
  }


  if(clean==="angle-left"){

    svg.appendChild(
      createSvgLine(80,20,20,50)
    );

    svg.appendChild(
      createSvgLine(80,80,20,50)
    );
  }


  if(hasDot){

    svg.appendChild(
      createSvgDot()
    );
  }


  wrapper.appendChild(svg);

  return wrapper;
}



function encryptText(){

  outputText.innerHTML = "";

  const text = normalizeText(
    inputText.value
  );


  for(const char of text){

    if(pigpenType[char]){

      outputText.appendChild(
        createSymbol(char)
      );
    }

    else if(char===" "){

      outputText.appendChild(
        document.createTextNode("   ")
      );
    }
  }
}



function updateOutput(){

  if(mode==="encrypt"){

    encryptText();
  }
}



function playClickSound(){

  const ctx = new (
    window.AudioContext ||
    window.webkitAudioContext
  )();


  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.frequency.value = 520;

  gain.gain.value = 0.05;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();

  osc.stop(
    ctx.currentTime + 0.05
  );
}



inputText.addEventListener(
  "input",
  updateOutput
);


updateOutput();
