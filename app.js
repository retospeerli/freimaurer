const keyboardLayout = [
  ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"],
  ["Y", "X", "C", "V", "B", "N", "M"]
];

const pigpenType = {
  A: "br", B: "blr", C: "bl",
  D: "tbr", E: "tblr", F: "tbl",
  G: "tr", H: "tlr", I: "tl",

  J: "br-dot", K: "blr-dot", L: "bl-dot",
  M: "tbr-dot", N: "tblr-dot", O: "tbl-dot",
  P: "tr-dot", Q: "tlr-dot", R: "tl-dot",

  S: "angle-down",
  T: "angle-right",
  U: "angle-left",
  V: "angle-up",

  W: "angle-down-dot",
  X: "angle-right-dot",
  Y: "angle-left-dot",
  Z: "angle-up-dot"
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

function normalizeText(text) {
  return text
    .toUpperCase()
    .replaceAll("Ä", "AE")
    .replaceAll("Ö", "OE")
    .replaceAll("Ü", "UE")
    .replaceAll("ß", "SS");
}

function createSvgLine(x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("y2", y2);
  return line;
}

function createSvgDot(cx, cy) {
  const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttribute("cx", cx);
  dot.setAttribute("cy", cy);
  dot.setAttribute("r", "6");
  return dot;
}

function createSymbol(letter) {
  const wrapper = document.createElement("span");
  wrapper.className = "pigpen-symbol";

  const type = pigpenType[letter];

  if (!type) {
    wrapper.textContent = letter;
    return wrapper;
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("class", "pigpen-svg");
  svg.setAttribute("aria-label", letter);

  const cleanType = type.replace("-dot", "");
  const hasDot = type.includes("dot");

  if (cleanType.includes("t")) svg.appendChild(createSvgLine(20, 20, 80, 20));
  if (cleanType.includes("b")) svg.appendChild(createSvgLine(20, 80, 80, 80));
  if (cleanType.includes("l")) svg.appendChild(createSvgLine(20, 20, 20, 80));
  if (cleanType.includes("r")) svg.appendChild(createSvgLine(80, 20, 80, 80));

  if (cleanType === "angle-down") {
    svg.appendChild(createSvgLine(20, 20, 50, 80));
    svg.appendChild(createSvgLine(80, 20, 50, 80));
  }

  if (cleanType === "angle-up") {
    svg.appendChild(createSvgLine(20, 80, 50, 20));
    svg.appendChild(createSvgLine(80, 80, 50, 20));
  }

  if (cleanType === "angle-right") {
    svg.appendChild(createSvgLine(20, 20, 80, 50));
    svg.appendChild(createSvgLine(20, 80, 80, 50));
  }

  if (cleanType === "angle-left") {
    svg.appendChild(createSvgLine(80, 20, 20, 50));
    svg.appendChild(createSvgLine(80, 80, 20, 50));
  }

  if (hasDot) {
    svg.appendChild(createSvgDot(50, 50));
  }

  wrapper.appendChild(svg);
  return wrapper;
}

function encryptText() {
  outputText.innerHTML = "";

  const text = normalizeText(inputText.value);

  for (const char of text) {
    if (pigpenType[char]) {
      outputText.appendChild(createSymbol(char));
    } else if (char === " ") {
      outputText.appendChild(document.createTextNode("   "));
    } else if (char === "\n") {
      outputText.appendChild(document.createElement("br"));
    }
  }
}

function decryptText() {
  outputText.textContent = decryptLetters.join("");
}

function updateOutput() {
  if (mode === "encrypt") {
    encryptText();
  } else {
    decryptText();
  }
}

function setMode(newMode) {
  mode = newMode;

  encryptBtn.classList.toggle("active", mode === "encrypt");
  decryptBtn.classList.toggle("active", mode === "decrypt");

  if (mode === "encrypt") {
    inputTitle.textContent = "Klartext";
    outputTitle.textContent = "Geheimschrift";
    inputText.placeholder = "Schreibe hier deinen Klartext ...";
    inputText.disabled = false;
    symbolKeyboardSection.classList.add("hidden");
  } else {
    inputTitle.textContent = "Geheimschrift-Eingabe";
    outputTitle.textContent = "Klartext";
    inputText.value = "";
    inputText.placeholder = "Benutze unten die Freimaurer-Tastatur ...";
    inputText.disabled = true;
    symbolKeyboardSection.classList.remove("hidden");
    decryptLetters = [];
  }

  outputText.innerHTML = "";
}

function buildSymbolKeyboard() {
  symbolKeyboard.innerHTML = "";

  keyboardLayout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";

    row.forEach(letter => {
      const normalized = normalizeText(letter);
      const button = document.createElement("button");
      button.className = "key";

      button.appendChild(createSymbol(normalized[0]));

      button.addEventListener("click", () => {
        playClickSound();

        for (const char of normalized) {
          decryptLetters.push(char);
        }

        inputText.value = decryptLetters.join("");
        updateOutput();
      });

      rowDiv.appendChild(button);
    });

    symbolKeyboard.appendChild(rowDiv);
  });
}

function playClickSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 520;

  gain.gain.setValueAtTime(0.06, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.06);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.06);
}

inputText.addEventListener("input", updateOutput);

encryptBtn.addEventListener("click", () => setMode("encrypt"));
decryptBtn.addEventListener("click", () => setMode("decrypt"));

spaceBtn.addEventListener("click", () => {
  playClickSound();

  if (mode === "encrypt") {
    inputText.value += " ";
  } else {
    decryptLetters.push(" ");
    inputText.value = decryptLetters.join("");
  }

  updateOutput();
});

backBtn.addEventListener("click", () => {
  playClickSound();

  if (mode === "encrypt") {
    inputText.value = inputText.value.slice(0, -1);
  } else {
    decryptLetters.pop();
    inputText.value = decryptLetters.join("");
  }

  updateOutput();
});

clearBtn.addEventListener("click", () => {
  playClickSound();

  inputText.value = "";
  decryptLetters = [];
  outputText.innerHTML = "";
});

copyBtn.addEventListener("click", async () => {
  playClickSound();

  const textToCopy =
    mode === "encrypt"
      ? normalizeText(inputText.value)
      : decryptLetters.join("");

  try {
    await navigator.clipboard.writeText(textToCopy);
    copyBtn.textContent = "Kopiert!";
    setTimeout(() => {
      copyBtn.textContent = "Ergebnis kopieren";
    }, 1200);
  } catch {
    alert("Kopieren nicht möglich.");
  }
});

document.addEventListener("keydown", event => {
  if (mode !== "decrypt") return;

  const key = event.key.toUpperCase();

  if (/^[A-ZÄÖÜß]$/.test(key)) {
    event.preventDefault();

    const normalized = normalizeText(key);

    for (const char of normalized) {
      decryptLetters.push(char);
    }

    inputText.value = decryptLetters.join("");
    updateOutput();
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    decryptLetters.pop();
    inputText.value = decryptLetters.join("");
    updateOutput();
  }

  if (event.key === " ") {
    event.preventDefault();
    decryptLetters.push(" ");
    inputText.value = decryptLetters.join("");
    updateOutput();
  }
});

buildSymbolKeyboard();
setMode("encrypt");
