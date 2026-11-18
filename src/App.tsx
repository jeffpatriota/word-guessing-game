import style from './app.module.css';
import { useEffect, useRef, useState } from 'react';

import { WORDS, type Challenge } from './utils/words';

import { Tip } from './components/Tip';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { Header } from './components/Header';
import { Letter } from './components/Letter';
import { LettersUsed, type LettersUsedProps } from './components/LettersUsed';




export default function App() {
  const [score, setScore] = useState(0);
  const [letter, setLetter] = useState("");
  const [lettersUsed, setLettersUsed] = useState<LettersUsedProps[]>([]);
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const attemptLimit = 5;
  const maxAttempts = challenge
    ? challenge.word.length + attemptLimit
    : 0;

  const attempts = lettersUsed.length;


  function handleRestart() {
    const isConfirmed = window.confirm('Deseja reiniciar o jogo?');

    if (isConfirmed) {
      startGame();
    }
  }

  function startGame() {
    const index = Math.floor(Math.random() * WORDS.length);
    const randomWord = WORDS[index];

    setChallenge(randomWord);

    setScore(0);
    setLetter("");
    setLettersUsed([]);
  }

  function handleConfirm() {
    if (!challenge) {
      return;
    }

    if (attempts >= maxAttempts) {
      return alert('Você atingiu o limite de tentativas!');
    }

    if (!letter.trim()) {
      return alert('Digite uma letra para continuar');
    }

    const value = letter.toUpperCase();

    const exists = lettersUsed.find(
      (used) => used.value.toUpperCase() === value
    );

    if (exists) {
      setLetter('');
      return alert('Essa letra já foi utilizada');
    }

    const hits = challenge.word
      .toUpperCase()
      .split('')
      .filter((char) => char === value).length;

    const correct = hits > 0;
    const currentScore = score + hits;

    setLettersUsed((prevState) => [...prevState, { value, correct }]);
    setScore(currentScore);
    setLetter('');

    inputRef.current?.focus();
  }

  useEffect(() => {
    startGame();
  }, [])


  function endGame(message: string) {
    alert(message);
    startGame();
  }

  useEffect(() => {
    if (!challenge) {
      return
    }

    setTimeout(() => {
      if (score === challenge.word.length) {
        return endGame('Parabéns! Você acertou a palavra!');
      }

      if (lettersUsed.length >= maxAttempts) {
        return endGame('Que pena, você atingiu o limite de tentativas!');
      }
    }, 200)
  }, [score, lettersUsed.length]);

  if (!challenge) {
    return
  }

  return (
    <div className={style.container}>
      <main>
        <Header current={attempts}
          max={maxAttempts}
          onRestart={handleRestart} />

        <Tip tip={challenge?.tip || ""} />

        <div className={style.word}>
          {
            challenge?.word.split("").map((letter, index) => {
              const letterUsed = lettersUsed.find((used) =>
                used.value.toUpperCase() === letter.toUpperCase());

              return <Letter key={index}
                value={letterUsed?.value}
                color={letterUsed?.correct ? "correct" : "default"} />
            })}
        </div>

        <h4>Palpite</h4>

        <div className={style.guess}>
          <Input
            ref={inputRef}
            autoFocus
            maxLength={1}
            placeholder="?"
            value={letter}
            onChange={(e) => setLetter(e.target.value)} />
          <Button title="Confirmar" onClick={handleConfirm} />
        </div>
        <LettersUsed data={lettersUsed} />

      </main>
    </div>
  );
}