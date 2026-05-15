const alphabetMap = {
  A: ["right", "bottom"],
  B: ["left", "right", "bottom"],
  C: ["left", "bottom"],

  D: ["top", "right", "bottom"],
  E: ["top", "right", "bottom", "left"],
  F: ["top", "left", "bottom"],

  G: ["top", "right"],
  H: ["top", "left", "right"],
  I: ["top", "left"],

  J: ["right", "bottom", "dot"],
  K: ["left", "right", "bottom", "dot"],
  L: ["left", "bottom", "dot"],

  M: ["top", "right", "bottom", "dot"],
  N: ["top", "right", "bottom", "left", "dot"],
  O: ["top", "left", "bottom", "dot"],

  P: ["top", "right", "dot"],
  Q: ["top", "left", "right", "dot"],
  R: ["top", "left", "dot"],

  S: ["vshape"],
  T: ["gtshape"],
  U: ["ltshape"],
  V: ["caretshape"],

  W: ["vshape", "dot"],
  X: ["gtshape", "dot"],
  Y: ["ltshape", "dot"],
  Z: ["caretshape", "dot"]
};

const keyboardLayout = [
  ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"],
  ["Y", "X", "C", "V", "B", "N", "M"]
];

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

function createSymbol(letter) {
  const wrapper = document.createElement("span");
  wrapper.className = "pigpen-symbol";
  wrapper.dataset.letter = letter;

  const parts = alphabetMap[letter];

  if (!parts) {
    wrapper.textContent = letter;
    return wrapper;
  }

  parts.forEach(part => {
    if (part === "dot") {
      const dot = document.createElement("span");
      dot.className = "dot";
      wrapper.appendChild(dot);
    } else if (
      part === "vshape" ||
      part === "gtshape" ||
      part === "ltshape" ||
      part === "caretshape"
    ) {
      const shape = document.createElement("span");
      shape.className = part;
      wrapper.appendChild(shape);
    } else {
      const line = document.createElement("span");
      line.className = `line ${part}`;
      wrapper.appendChild(line);
    }
  });

  return wrapper;
}

function encryptText() {
  outputText.innerHTML = "";

  const text = normalizeText(inputText.value);

  for (const char of text) {
    if (alphabetMap[char]) {
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

      const firstLetter = normalized[0];
      button.appendChild(createSymbol(firstLetter));

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

  gain.gain.setValueAtTime(0.08, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.08);
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

  let textToCopy = "";

  if (mode === "encrypt") {
    textToCopy = normalizeText(inputText.value);
  } else {
    textToCopy = decryptLetters.join("");
  }

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
