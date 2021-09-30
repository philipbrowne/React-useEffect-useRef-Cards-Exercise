import React, { useState, useRef, useEffect } from 'react';
import './CardDeck.css';
import Card from '../Card/Card';
import axios from 'axios';

const CardDeck = () => {
  const [deckId, setDeckId] = useState(null);
  const [cardDeck, setCardDeck] = useState(null);
  const [cardPile, setCardPile] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const intervalId = useRef(null);
  useEffect(() => {
    async function loadDeckId() {
      try {
        let res = await axios.get(
          'http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
        );
        setDeckId(res.data.deck_id);
      } catch (e) {
        console.error(e);
      }
    }
    loadDeckId();
  }, [setDeckId]);
  useEffect(() => {
    async function loadCardDeck() {
      try {
        const res = await axios.get(
          `http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`
        );
        setCardDeck(res.data.cards);
      } catch (e) {
        console.error(e);
      }
    }
    if (deckId) {
      loadCardDeck();
    }
  }, [deckId]);
  useEffect(() => {
    if (isDrawing && !intervalId.current) {
      intervalId.current = setInterval(() => {
        if (cardDeck.length > 0) {
          setCardPile([]);
          let pileCopy;
          if (cardPile.length > 0) {
            pileCopy = [...cardPile];
          } else {
            pileCopy = [];
          }
          pileCopy.push(cardDeck[0]);
          setCardPile(pileCopy);
          const deckCopy = [...cardDeck];
          deckCopy.shift();
          setCardDeck(deckCopy);
        } else {
          alert('Error: no cards remaining!');
          return () => {
            clearInterval(intervalId.current);
            intervalId.current = null;
          };
        }
      }, 1000);
      return () => {
        clearInterval(intervalId.current);
        intervalId.current = null;
      };
    }
  }, [isDrawing, setIsDrawing, cardDeck, cardPile, deckId]);
  const toggleDraw = () => {
    setIsDrawing((isDrawing) => !isDrawing);
  };

  const getRandCoords = () => {
    const transX = Math.floor(Math.random() * 20);
    const transY = Math.floor(Math.random() * 20);
    const rotateDeg = Math.floor(Math.random() * 180);
    return { transX, transY, rotateDeg };
  };

  return (
    <div className="CardDeck">
      <div className="CardDeck-top-area">
        <h1>Lets Play Some Cards</h1>
        {cardDeck && (
          <button onClick={toggleDraw}>
            {isDrawing ? 'STOP DRAWING' : 'GIMME A CARD!'}
          </button>
        )}
      </div>
      <div className="CardDeck-card-area">
        {cardPile.map((card) => (
          <Card
            key={card.code}
            image={card.image}
            transX={getRandCoords().transX}
            transY={getRandCoords().transY}
            rotateDeg={getRandCoords().rotateDeg}
          />
        ))}
      </div>
    </div>
  );
};
export default CardDeck;
