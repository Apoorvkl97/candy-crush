import { useEffect, useState } from 'react';
import blue from './images/blue-candy.png';
import green from './images/green-candy.png';
import orange from './images/orange-candy.png';
import purple from './images/purple-candy.png';
import red from './images/red-candy.png';
import yellow from './images/yellow-candy.png';
import blank from './images/blank.png';
import ScoreBoard from './components/ScoreBoard.js'

function App() {
const [coloursArranged, setColoursArranged] = useState([]);
const [beingDragged, setBeingDragged] = useState(null);
const [beingReplaced, setBeingReplaced] = useState(null);
const [score, setScore] = useState(0);

const width = 8;
const colours = [
  red,
  blue,
  green,
  yellow,
  orange,
  purple
];

const coloursForBoxes = () => {
  const coloursArray = [];
  for(let i = 0; i<width*width; i++) {
    const randomNumber = Math.floor(Math.random()*colours.length);
    const randomColour = colours[randomNumber];
    coloursArray.push(randomColour);
  }
  setColoursArranged(coloursArray);
  console.log(coloursArranged);
};

const isInvalid = () => {
  if(beingDragged) {
    const beingDraggedId = parseInt(beingDragged.getAttribute("data-id"));
    const beingReplacedId = parseInt(beingReplaced.getAttribute("data-id"));
    const validMoves = [
      beingDraggedId - 1,
      beingDraggedId - width,
      beingDraggedId + 1,
      beingDraggedId + width
    ];
    const validMove = validMoves.includes(beingReplacedId);
    if(!validMove){
      return true
    }
  }
}

const checkRowFor4 = () => {
  for(let i = 0; i<64; i++) {
    const coloursChosen = [i, i+1, i+2, i+3];
    const decidedColour = coloursArranged[i];
    const isBlank = decidedColour === blank;
    if(i%width>4) continue;
    if(isInvalid()) continue;
    if(coloursChosen.every(square => coloursArranged[square]===decidedColour && !isBlank)){
      setScore((score) => score+4)
      coloursChosen.forEach(square => coloursArranged[square] = blank)
      return true
    };
  }
}

const checkColumnFor4 = () => {
  for(let i = 0; i<40; i++) {
    const coloursChosen = [i, i+width, i+(width*2), i+(width*3)];
    const decidedColour = coloursArranged[i];
    const isBlank = decidedColour === blank;
    if(isInvalid()) continue;
    if(coloursChosen.every(square => coloursArranged[square]===decidedColour && !isBlank)){
      setScore((score) => score+4)
      coloursChosen.forEach(square => coloursArranged[square] = blank)
      return true
    };
  }
}

const checkColumnFor3 = () => {
  for(let i = 0; i<48; i++) {
    const coloursChosen = [i, i+width, i+(width*2)];
    const decidedColour = coloursArranged[i];
    const isBlank = decidedColour === blank;
    if(isInvalid()) continue;
    if(coloursChosen.every(square => coloursArranged[square]===decidedColour && !isBlank)){
      setScore((score) => score+3)
      coloursChosen.forEach(square => coloursArranged[square] = blank)
      return true
    };
  }
}

const checkRowFor3 = () => {
  for(let i = 0; i<64; i++) {
    const coloursChosen = [i, i+1, i+2];
    const decidedColour = coloursArranged[i];
    const isBlank = decidedColour === blank;
    if(i%width>5) continue;
    if(isInvalid()) continue;
    if(coloursChosen.every(square => coloursArranged[square]===decidedColour) && !isBlank){
      setScore((score) => score+3)
      coloursChosen.forEach(square => coloursArranged[square] = blank)
      return true
    };
  }
}

const fillBelow = () => {
  for(let i=0; i<56; i++) {
    if(i<width && coloursArranged[i] === blank){
      coloursArranged[i] = colours[Math.floor(Math.random()*6)];
    };

    if(coloursArranged[i+width] === blank) {
      coloursArranged[i+width] = coloursArranged[i];
      coloursArranged[i] = blank
    }
  }
};

const dragStart = (e) => {
  setBeingDragged(e.target)
};

const dragDrop = (e) => {
  setBeingReplaced(e.target)
};

const dragEnd = () => {
  const beingDraggedId = parseInt(beingDragged.getAttribute("data-id"));
  const beingReplacedId = parseInt(beingReplaced.getAttribute("data-id"));

  const validMoves = [
    beingDraggedId - 1,
    beingDraggedId - width,
    beingDraggedId + 1,
    beingDraggedId + width
  ];
  const validMove = validMoves.includes(beingReplacedId);

  coloursArranged[beingDraggedId] = beingReplaced.getAttribute('src')
  coloursArranged[beingReplacedId] = beingDragged.getAttribute('src')

  const isColumn4 = checkColumnFor4()
  const isColumn3 = checkColumnFor3()
  const isRow4 = checkRowFor4()
  const isRow3 = checkRowFor3()

  if(beingDraggedId &&
  validMove &&
(isColumn3 || isColumn4 || isRow3 || isRow4)){
  setBeingDragged(null);
  setBeingReplaced(null);
} else {
  coloursArranged[beingDraggedId] = beingDragged.getAttribute('src')
  coloursArranged[beingReplacedId] = beingReplaced.getAttribute('src')
  setColoursArranged([...coloursArranged])
}
}

useEffect(() => {
coloursForBoxes();
}, []);

useEffect(() => {
  const timer = setInterval(() => {
    checkColumnFor4();
    checkRowFor4();
  checkColumnFor3();
  checkRowFor3();
  fillBelow();
  setColoursArranged([...coloursArranged])
},100)
return () => clearInterval(timer);

} , [checkColumnFor4, checkRowFor4, checkColumnFor3, checkRowFor3, fillBelow, coloursArranged]);

  return (
    <div className="App">
      <div className = "game">
        {coloursArranged.map((candyColour,index) => (
          <img
            key = {index}
            alt = {candyColour}
            src = {candyColour}
            data-id = {index}
            draggable = {true}
            onDragStart = {dragStart}
            onDragOver = {(e) => e.preventDefault()}
            onDragEnter = {(e) => e.preventDefault()}
            onDragLeave = {(e) => e.preventDefault()}
            onDrop = {dragDrop}
            onDragEnd = {dragEnd}
            />
        ))}
      </div>
      <ScoreBoard score={score}/>
    </div>
  );
}

export default App;
