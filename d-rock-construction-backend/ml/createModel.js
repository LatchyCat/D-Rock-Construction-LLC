const tf = require('@tensorflow/tfjs');
const natural = require('natural');
const fs = require('fs').promises;
const path = require('path');

// Shuffles training data
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Advanced tokenization and stemming
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Expanded training data
const trainingData = [
  // Greetings
  { input: "Hi there!", intent: "greeting" },
  { input: "Hello, how can I help you today?", intent: "greeting" },
  { input: "Good morning! Welcome to our service.", intent: "greeting" },
  { input: "Hey, what's up?", intent: "greeting" },
  { input: "Greetings! How may I assist you?", intent: "greeting" },
  { input: "Welcome to our platform!", intent: "greeting" },
  { input: "Hi! How are you doing today?", intent: "greeting" },

  // Support
  { input: "I need help with my account", intent: "support" },
  { input: "Can you assist me with a technical issue?", intent: "support" },
  { input: "I'm having trouble logging in", intent: "support" },
  { input: "My product isn't working properly", intent: "support" },
  { input: "How do I reset my password?", intent: "support" },
  { input: "I can't access my files", intent: "support" },
  { input: "Is there a way to recover deleted data?", intent: "support" },

  // Inquiry
  { input: "What services do you offer for home renovation?", intent: "inquiry" },
  { input: "Could you tell me about your pricing plans?", intent: "inquiry" },
  { input: "I'm interested in learning more about your company", intent: "inquiry" },
  { input: "Do you have any ongoing promotions?", intent: "inquiry" },
  { input: "What's the difference between your basic and premium packages?", intent: "inquiry" },
  { input: "Are your products eco-friendly?", intent: "inquiry" },
  { input: "Can you explain your return policy?", intent: "inquiry" },

  // Farewell
  { input: "Goodbye, thank you for your help", intent: "farewell" },
  { input: "That's all I needed, have a great day!", intent: "farewell" },
  { input: "Thanks for your assistance, bye!", intent: "farewell" },
  { input: "I appreciate your help. Take care!", intent: "farewell" },
  { input: "Alright, I'm done. See you later!", intent: "farewell" },
  { input: "Thank you, goodbye!", intent: "farewell" },
  { input: "You've been very helpful. Farewell!", intent: "farewell" }
];

function preprocessData(data) {
  const uniqueIntents = [...new Set(data.map(item => item.intent))];
  const intentToIndex = Object.fromEntries(uniqueIntents.map((intent, index) => [intent, index]));

  let vocabulary = new Set();
  const processedData = data.map(item => {
    const tokens = tokenizer.tokenize(item.input.toLowerCase());
    const stemmed = tokens.map(token => stemmer.stem(token));
    stemmed.forEach(word => vocabulary.add(word));
    return {
      input: stemmed,
      intent: intentToIndex[item.intent]
    };
  });

  vocabulary = Array.from(vocabulary);
  const wordToIndex = Object.fromEntries(vocabulary.map((word, index) => [word, index + 1])); // 0 is reserved for padding

  const encodedData = processedData.map(item => ({
    input: item.input.map(word => wordToIndex[word] || 0),
    intent: item.intent
  }));

  return { encodedData, intentToIndex, wordToIndex };
}

function createModel(inputShape, numIntents) {
  const model = tf.sequential();
  model.add(tf.layers.embedding({ inputDim: inputShape[1], outputDim: 16, inputLength: inputShape[0] }));
  model.add(tf.layers.globalAveragePooling1d());
  model.add(tf.layers.dense({ units: 8, activation: 'relu', kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }) }));
  model.add(tf.layers.dropout({ rate: 0.5 }));
  model.add(tf.layers.dense({ units: numIntents, activation: 'softmax' }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy']
  });

  return model;
}

async function kFoldCrossValidation(encodedData, numIntents, vocabularySize, k = 5) {
    console.log('Starting k-fold cross-validation');
    console.log('encodedData length:', encodedData.length);
    console.log('numIntents:', numIntents);
    console.log('vocabularySize:', vocabularySize);

    if (!Array.isArray(encodedData) || encodedData.length === 0) {
      throw new Error('encodedData is not a valid array');
    }

    console.log('Shuffling data...');
    const shuffled = shuffleArray([...encodedData]);
    console.log('Shuffled data sample:', JSON.stringify(shuffled.slice(0, 2)));

    const foldSize = Math.floor(shuffled.length / k);
    console.log('Fold size:', foldSize);


  let totalAccuracy = 0;

  for (let i = 0; i < k; i++) {
    console.log(`Starting fold ${i + 1}`);

    console.log('Splitting data into validation and training sets...');
    const validationData = shuffled.slice(i * foldSize, (i + 1) * foldSize);
    const trainingData = [...shuffled.slice(0, i * foldSize), ...shuffled.slice((i + 1) * foldSize)];

    console.log('Validation data sample:', JSON.stringify(validationData.slice(0, 2)));
    console.log('Training data sample:', JSON.stringify(trainingData.slice(0, 2)));

    if (trainingData.length === 0 || validationData.length === 0) {
      throw new Error(`Fold ${i + 1}: Training or validation data is empty`);
    }

    console.log('Calculating maxLen...');
    const maxLen = Math.max(...shuffled.map(item => item.input.length));
    console.log('maxLen:', maxLen);

    for (let i = 0; i < k; i++) {
        console.log(`Starting fold ${i + 1}`);

        console.log('Splitting data into validation and training sets...');
        const validationData = shuffled.slice(i * foldSize, (i + 1) * foldSize);
        const trainingData = [...shuffled.slice(0, i * foldSize), ...shuffled.slice((i + 1) * foldSize)];

        console.log('Validation data sample:', JSON.stringify(validationData.slice(0, 2)));
        console.log('Training data sample:', JSON.stringify(trainingData.slice(0, 2)));

        if (trainingData.length === 0 || validationData.length === 0) {
            throw new Error(`Fold ${i + 1}: Training or validation data is empty`);
        }

        console.log('Preparing training tensors...');
        const xTrain = tf.tensor2d(trainingData.map(item => {
            return item.input.concat(new Array(maxLen - item.input.length).fill(0));
        }));
        const yTrain = tf.tensor1d(trainingData.map(item => item.intent));

        console.log('Preparing validation tensors...');
        const xVal = tf.tensor2d(validationData.map(item => {
            return item.input.concat(new Array(maxLen - item.input.length).fill(0));
        }));
        const yVal = tf.tensor1d(validationData.map(item => item.intent));

    console.log('xTrain shape:', xTrain.shape);
    console.log('yTrain shape:', yTrain.shape);
    console.log('xVal shape:', xVal.shape);
    console.log('yVal shape:', yVal.shape);

    console.log('Creating model...');
    const model = createModel([maxLen, vocabularySize + 1], numIntents);

    console.log('Training model...');
    await model.fit(xTrain, yTrain, {
      epochs: 50,
      validationData: [xVal, yVal],
      callbacks: tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 5 })
    });

    console.log('Evaluating model...');
    const evalResult = model.evaluate(xVal, yVal);
    totalAccuracy += evalResult[1].dataSync()[0];

    console.log(`Fold ${i + 1} Accuracy: ${evalResult[1].dataSync()[0]}`);
  }

  console.log(`Average Accuracy: ${totalAccuracy / k}`);
}

async function saveModel(model, intentToIndex, wordToIndex, saveDir) {
  await model.save(`file://${saveDir}`);

  const metadata = {
    intents: Object.keys(intentToIndex),
    vocabulary: wordToIndex
  };

  await fs.writeFile(path.join(saveDir, 'metadata.json'), JSON.stringify(metadata));
  console.log(`Model and metadata saved to ${saveDir}`);
}

(async () => {
  try {
    const { encodedData, intentToIndex, wordToIndex } = preprocessData(trainingData);

    console.log('Encoded data sample:', encodedData[0]);
    console.log('Number of samples:', encodedData.length);
    console.log('Number of intents:', Object.keys(intentToIndex).length);
    console.log('Vocabulary size:', Object.keys(wordToIndex).length);

    await kFoldCrossValidation(encodedData, Object.keys(intentToIndex).length, Object.keys(wordToIndex).length);

    // Train final model on all data
    const maxLen = Math.max(...encodedData.map(item => item.input.length));
    const xTrain = tf.tensor2d(encodedData.map(item => item.input.concat(new Array(maxLen - item.input.length).fill(0))));
    const yTrain = tf.tensor1d(encodedData.map(item => item.intent));

    const finalModel = createModel([maxLen, Object.keys(wordToIndex).length + 1], Object.keys(intentToIndex).length);
    await finalModel.fit(xTrain, yTrain, { epochs: 50, validationSplit: 0.2 });

    const saveDir = path.join(__dirname, 'saved_model');
    await fs.mkdir(saveDir, { recursive: true });
    await saveModel(finalModel, intentToIndex, wordToIndex, saveDir);
  } catch (error) {
    console.error('Error in model creation and training:', error);
    console.error('Error stack:', error.stack);
  }
})()};
