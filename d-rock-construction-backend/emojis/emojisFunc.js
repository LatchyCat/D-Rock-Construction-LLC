// Emoji Categories
const emojis = {
  seasonal: {
    summer: ["☀️", "🏖️", "🍦", "🕶️", "🍉", "🏄‍♂️", "🍹", "🌊", "👙", "🌞", "🌴", "🕶", "🌺", "🍍", "🌼", "🏝️", "🚣‍♂️", "🌅", "🦩", "🍧"],
    winter: ["⛄️", "❄️", "🎿", "🧣", "🧤", "☕️", "🌨️", "🏂", "🎄", "🎅", "🧥", "🧦", "🥶", "🍵", "🧊", "🛷", "🍫", "🎁", "🔥"],
    fall: ["🍁", "🎃", "🍂", "🌰", "🎑", "🧥", "🌾", "🦃", "🍎", "🍄", "🦉", "🧣", "🌽", "🥧", "🍃"],
    spring: ["🌸", "🌼", "🌷", "🌱", "🐣", "🌦", "🐰", "🌈", "🦋", "🐞", "🌻", "🍀", "🐝"]
  },
  holiday: {
    halloween: ["👻", "🎃", "🦇", "🕷️", "🍬", "🕸️", "😈", "🌕", "🦴", "💀", "🕯️", "🧛", "👹", "👿", "🔮"],
    christmas: ["🎄", "🎅", "🎁", "❄️", "⛄️", "🔔", "🕯️", "🦌", "🤶", "🎉", "🌟", "⭐", "🕊️"],
    valentines: ["💘", "❤️", "💖", "💕", "💓", "💞", "💝", "💗", "💋", "🌹", "💌", "😍", "😘", "🥰", "😻", "💏", "👩‍❤️‍💋‍👨", "💑", "👩‍❤️‍👨", "💔"],
    easter: ["🐰", "🥚", "🌷", "🐣", "🍫", "🐇", "🐥", "🌸", "🌼", "🍬"],
    independenceDay: ["🇺🇸", "🎆", "🎇", "🗽", "🎉", "🎊", "🍔", "🌭", "🍉", "🥤"],
    thanksgiving: ["🦃", "🍁", "🥧", "🍽️", "🌽", "🍂", "🥔", "🍗"]
  },
  miscellaneous: {
    beach: ["🏖️", "🏄‍♂️", "🏝️", "🌴", "🌊", "🐚", "🌞", "🍹", "🐬", "🌅", "⛱️", "👙", "🦀", "🐠", "🍦", "🦩", "🌺", "🍍"],
    space: ["🚀", "🌌", "🛸", "🌠", "👽", "🛰️", "🌕", "🌙", "🌎", "🌟", "💫", "🪐"],
    food: ["🍔", "🍕", "🍟", "🌭", "🍗", "🥓", "🥪", "🥗", "🍣", "🍱", "🥘", "🍲", "🍜", "🍝", "🍰", "🍩", "🍪", "🍦", "🥤", "🍫"],
    animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🦉"],
    sports: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥊", "🥋", "🥅", "⛳", "🏒"],
    music: ["🎵", "🎶", "🎼", "🎤", "🎸", "🥁", "🎹", "🎺", "🎷", "🎻", "🎧", "🎚️", "🎛️", "📯", "🔔", "🎙️", "📻", "📀"],
    nature: ["🌲", "🌳", "🌴", "🌵", "🌷", "🌻", "🌸", "🍁", "🍃", "🍂", "🌺", "🌾", "🌱", "🍀", "🍄", "🌹", "🏵️"],
    technology: ["📱", "💻", "🖥️", "🖱️", "🖨️", "⌨️", "🖲️", "💾", "💿", "📷", "🎥", "📹", "📼", "📺", "🔌", "🔋", "🔦", "💡", "📡", "🎮"],
    transportation: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵", "🏍️", "🛺", "🚍", "🚃"],
    fantasy: ["🧚", "🧙", "🧛", "🧜", "🧞", "🧝", "🦸", "🦹", "🐉", "🦄", "🔮", "🧿", "📿", "💎", "🧩", "🎴", "🔱", "🦚"]
  }
};

// Function to get a random item from an array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to create a random array of emojis for a specific theme
function getRandomEmojiArray() {
  const categories = Object.keys(emojis);
  const randomCategory = getRandomItem(categories);
  const subcategories = Object.keys(emojis[randomCategory]);
  const randomSubcategory = getRandomItem(subcategories);
  return emojis[randomCategory][randomSubcategory];
}

// Function to create a cool design with emojis
function createCoolDesign() {
  let design = "";
  const emojisArray = getRandomEmojiArray(); // Get a random array of emojis

  const terminalWidth = process.stdout.columns; // Get the width of the terminal

  // Calculate the number of columns and rows based on the terminal width and the number of emojis
  const numCols = Math.ceil(Math.sqrt(emojisArray.length * (terminalWidth / 2))); // (terminalWidth / 2) approximates the aspect ratio of emojis
  const numRows = Math.ceil(emojisArray.length / numCols);

  // Choose a random pattern
  const patterns = [
    createGridPattern,
    createDiagonalPattern,
    createCircularPattern,
    createRandomPattern
  ];
  const chosenPattern = getRandomItem(patterns);

  // Apply the chosen pattern
  design = chosenPattern(emojisArray, numRows, numCols);

  // Print the design
  console.log(design);
  return emojisArray;
}

// Pattern: Grid
function createGridPattern(emojisArray, numRows, numCols) {
  let design = "";
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const index = i * numCols + j;
      if (index < emojisArray.length) {
        design += emojisArray[index] + " ";
      }
    }
    design += "\n";
  }
  return design;
}

// Pattern: Diagonal
function createDiagonalPattern(emojisArray, numRows, numCols) {
  let design = Array(numRows).fill().map(() => Array(numCols).fill(" "));
  let index = 0;
  for (let sum = 0; sum < numRows + numCols - 1; sum++) {
    for (let i = 0; i < numRows; i++) {
      let j = sum - i;
      if (j >= 0 && j < numCols && index < emojisArray.length) {
        design[i][j] = emojisArray[index++];
      }
    }
  }
  return design.map(row => row.join(" ")).join("\n");
}

// Pattern: Circular
function createCircularPattern(emojisArray, numRows, numCols) {
  let design = Array(numRows).fill().map(() => Array(numCols).fill(" "));
  let index = 0;
  let top = 0, bottom = numRows - 1, left = 0, right = numCols - 1;

  while (top <= bottom && left <= right && index < emojisArray.length) {
    for (let i = left; i <= right && index < emojisArray.length; i++)
      design[top][i] = emojisArray[index++];
    top++;

    for (let i = top; i <= bottom && index < emojisArray.length; i++)
      design[i][right] = emojisArray[index++];
    right--;

    if (top <= bottom) {
      for (let i = right; i >= left && index < emojisArray.length; i--)
        design[bottom][i] = emojisArray[index++];
      bottom--;
    }

    if (left <= right) {
      for (let i = bottom; i >= top && index < emojisArray.length; i--)
        design[i][left] = emojisArray[index++];
      left++;
    }
  }

  return design.map(row => row.join(" ")).join("\n");
}

// Pattern: Random
function createRandomPattern(emojisArray, numRows, numCols) {
  let design = Array(numRows).fill().map(() => Array(numCols).fill(" "));
  let availablePositions = [];

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      availablePositions.push([i, j]);
    }
  }

  for (let i = 0; i < emojisArray.length && availablePositions.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const [row, col] = availablePositions[randomIndex];
    design[row][col] = emojisArray[i];
    availablePositions.splice(randomIndex, 1);
  }

  return design.map(row => row.join(" ")).join("\n");
}

// Test the function
// Uncomment the line below to test the function
// createCoolDesign();

// Export the function
module.exports = createCoolDesign;
