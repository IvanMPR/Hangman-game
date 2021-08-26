//Page elements
const input = document.getElementById('inp');
const prevGuesses = document.getElementById('disp-prev');
const startButton = document.getElementById('start');
const button = document.getElementById('btn');
const goal = document.getElementById('goal');
const holder = document.querySelector('.main-rect');
const image = document.getElementById('image');
//Tones
const startTone = document.getElementById('start-tone');
const missTone = document.getElementById('miss-tone');
const hitTone = document.getElementById('hit-tone');
const winTone = document.getElementById('win-tone');
const lostTone = document.getElementById('lost-tone');
//Modal
const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal-title');
const modalButtonExit = document.querySelector('.cancel');
const modalButtonAgain = document.querySelector('.again');
const modalSpan = document.querySelector('.modal-note-goal');
//States Array
const states = [
  'albania',
  'andorra',
  'armenia',
  'austria',
  'azerbaijan',
  'belarus',
  'belgium',
  'bulgaria',
  'croatia',
  'cyprus',
  'denmark',
  'estonia',
  'finland',
  'france',
  'georgia',
  'germany',
  'greece',
  'hungary',
  'iceland',
  'ireland',
  'italy',
  'latvia',
  'liechtenstein',
  'lithuania',
  'luxembourg',
  'malta',
  'moldova',
  'monaco',
  'montenegro',
  'netherlands',
  'norway',
  'poland',
  'portugal',
  'romania',
  'serbia',
  'slovakia',
  'slovenia',
  'spain',
  'sweden',
  'switzerland',
  'ukraine',
  'vatican',
  'afghanistan',
  'bahrain',
  'bangladesh',
  'bhutan',
  'brunei',
  'cambodia',
  'china',
  'india',
  'indonesia',
  'iran',
  'iraq',
  'israel',
  'japan',
  'jordan',
  'kazakhstan',
  'kuwait',
  'kyrgyzstan',
  'laos',
  'lebanon',
  'malaysia',
  'maldives',
  'mongolia',
  'myanmar',
  'nepal',
  'oman',
  'pakistan',
  'philippines',
  'qatar',
  'russia',
  'singapore',
  'south_korea',
  'syria',
  'tajikistan',
  'thailand',
  'turkey',
  'turkmenistan',
  'uzbekistan',
  'vietnam',
  'yemen',
  'algeria',
  'angola',
  'benin',
  'botswana',
  'burundi',
  'cameroon',
  'chad',
  'comoros',
  'djibouti',
  'egypt',
  'eritrea',
  'ethiopia',
  'gabon',
  'gambia',
  'ghana',
  'guinea',
  'kenya',
  'lesotho',
  'liberia',
  'libya',
  'madagascar',
  'malawi',
  'mali',
  'mauritania',
  'mauritius',
  'morocco',
  'mozambique',
  'namibia',
  'niger',
  'nigeria',
  'rwanda',
  'senegal',
  'seychelles',
  'somalia',
  'sudan',
  'swaziland',
  'tanzania',
  'togo',
  'tunisia',
  'uganda',
  'zambia',
  'zimbabwe',
  'argentina',
  'bahamas',
  'barbados',
  'belize',
  'bolivia',
  'brazil',
  'canada',
  'chile',
  'colombia',
  'cuba',
  'dominica',
  'ecuador',
  'grenada',
  'guatemala',
  'guyana',
  'haiti',
  'honduras',
  'jamaica',
  'mexico',
  'nicaragua',
  'panama',
  'paraguay',
  'peru',
  'suriname',
  'uruguay',
  'venezuela',
  'australia',
  'fiji',
  'kiribati',
  'micronesia',
  'nauru',
  'palau',
  'samoa',
  'tonga',
  'tuvalu',
  'vanuatu',
];
//Object containing arrays to compare in the game
const mainObj = {};
//Container for previous guesses
let inputsContainer = [];
//Container for already used states
const statesUsed = [];
//Shuffling the states, picking the last one, and embedding it to mainObject
const pickState = function () {
  shuffle(states);

  let lastOnTheList = states.pop();
  statesUsed.push(lastOnTheList);

  goal.textContent = lastOnTheList.replace(/[a-z]/g, '*');

  mainObj.goal = lastOnTheList.split('');
  mainObj.goalLength = lastOnTheList.split('').length;
  mainObj.hiddenArr = new Array(mainObj.goalLength).fill('*');

  mainObj.counter = 0;
  console.log(mainObj);
  console.log(statesUsed);
};
//This is Knuth (Fisher - Yates) shuffle alghorithm
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  //While there remain elements to shuffle...
  while (0 !== currentIndex) {
    //Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    //And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
//init is used to clean and prepare every item for start. It is called at the very end of the code
const init = function () {
  mainObj.counter = 0;
  startButton.style.display = 'block';
  prevGuessContainer = [];
  image.src = `img/Hang${mainObj.counter}.png`;
  disableInputs();
};
//Prevent unwanted inputs by disabling them
const disableInputs = function () {
  button.disabled = true;
  input.disabled = true;
};
//Enabling inputs
const enableInputs = function () {
  button.disabled = false;
  input.disabled = false;
};
//Counter function is used to assign appropriate number to image.src
const countUp = function () {
  mainObj.counter++;
  return mainObj.counter;
};
//Function for displaying the goal text
const displayLetters = function (arr) {
  goal.textContent = arr.join('');
};
//Functions for displaying/hiding modal on rounds end
const showModal = function () {
  modalSpan.textContent = `${mainObj.goal.join('')}`;
  modal.classList.remove('hide');
  modal.classList.add('show');
};

const hideModal = function () {
  modal.classList.remove('show');
  modal.classList.add('hide');
};
//Checking for valid input. If input is valid, it is used as argument for main 'compareInput' f
const isInpValid = function (inp) {
  inp = input.value;
  let regTest = /[0-9,./;']/;
  if (inp.length > 1) {
    alert('Enter only one character');
    input.value = '';
  } else if (regTest.test(inp)) {
    alert('Enter letter only');
    input.value = '';
  } else if (inp === '') {
    alert('You must enter something');
  } else {
    inputsContainer.push(inp);
    prevGuesses.textContent = inputsContainer.join(' ');
    input.value = '';
    compareInput(inp);
  }
};
//Main function - inputs comparing with hidden goal
const compareInput = function (input) {
  const temporary = mainObj.hiddenArr;
  const splitted = mainObj.goal;

  let compare = splitted.map((letter, i) => {
    if (input === letter) {
      playOnHit();
      return (temporary[i] = letter);
    } else if (input !== letter && letter !== '*') {
      return temporary[i];
    } else {
      return (temporary[i] = '*');
    }
  });
  //If letter doesn't exist in hidden word
  if (!compare.includes(input)) {
    playOnMiss();
    image.src = `img/Hang${countUp()}.png`;
  }
  //If there was 10 wrong guesses and word is still not complete  Lost round
  if (mainObj.counter === 10 && compare.includes('*')) {
    image.src = `img/Hang${mainObj.counter}.png`;
    disableInputs();
    playOnLose();
    setTimeout(() => {
      modalTitle.textContent = `Unfortunately, you lost this round :(`;
      showModal();
    }, 500);
  }
  //If hidden word is guessed correctly  Round won
  if (!compare.includes('*')) {
    playOnWin();
    disableInputs();
    setTimeout(() => {
      modalTitle.textContent = `Congratulations, you won this round!`;
      showModal();
    }, 500);
  }
  //Updating hidden array
  mainObj.hiddenArr = compare;
  //Updating UI
  displayLetters(temporary);
};
//Starting the game on 'Start' button press. Ev.Lis is below
const startGame = function () {
  startButton.style.display = 'none';
  enableInputs();
  input.focus();
  playOnStart();
  pickState();
};
//Functions for playing audio
const playOnStart = function () {
  startTone.play();
};

const playOnMiss = function () {
  missTone.play();
};

const playOnHit = function () {
  hitTone.play();
};

const playOnWin = function () {
  winTone.play();
};

const playOnLose = function () {
  lostTone.play();
};
//Event listeners

//Returning the focus to input field for better UX

button.addEventListener('click', function () {
  setTimeout(() => {
    button.blur();
    input.focus();
  }, 400);
});
//Adding 'Enter' key as trigger
input.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    isInpValid();
  }
});
//Modal buttons listeners
modalButtonExit.addEventListener('click', function () {
  hideModal();
  location.reload();
});

modalButtonAgain.addEventListener('click', function () {
  hideModal();
  init();
  startGame();
  inputsContainer = [];
  prevGuesses.textContent = '';
});
//Starting the game
startButton.addEventListener('click', startGame);
//Calling the main sequence for comparing inputs with hidden word
button.addEventListener('click', isInpValid);
//Init function, called on every page reload or inside other listeners
init();
