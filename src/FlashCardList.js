import React from 'react'
import Flashcard from './FlashCard';

export default function FlashCardList({ flashcards }) {
  return (
    <div className="card-grid">
      {flashcards.map((flashcard, index) => {
        return <Flashcard flashcard={flashcard} key={flashcard.id} />
      })}
    </div>
  )
}
