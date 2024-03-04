import Die from './components/Die';
import { useState, useEffect } from 'react';
import {nanoid} from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);

  useEffect(() => {
    const valueRef = dice[0].value
    setTenzies(dice.every((die) => die.isHeld && die.value === valueRef));
  }, [dice])

  function generateNewDie(){
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice(){
    const diceArray = [];
    
    for(let i = 0; i < 10; i++){
      diceArray.push(generateNewDie());
    }

    return diceArray;
  }

  function rollDice(){
    if (!tenzies) {
      setDice((prevDice) => {
        return prevDice.map((prevDie) => {
          return prevDie.isHeld ? prevDie : generateNewDie();
        });
      });
    } else {
      setTenzies(false);
      setDice(allNewDice());
    }
  }

  function holdDice(id){
    setDice(prevDice => {
       return prevDice.map(prevDie => {
        return prevDie.id === id
          ? {...prevDie, isHeld: !prevDie.isHeld}
          : prevDie
      })
    })
  }

  const diceElements = dice.map(dieObject => (<Die
    key={dieObject.id} 
    value={dieObject.value} 
    isHeld={dieObject.isHeld}
    holdDice={()=> holdDice(dieObject.id)}/>))

  return (
    <main>
      {tenzies && <Confetti/>}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button 
      className="roll-dice" 
      onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}