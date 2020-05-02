import React, {useState, useEffect, useRef} from 'react';
import FlashCardList from './FlashCardList';

import axios from 'axios';
import './app.css';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);

  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios.get(`https://opentdb.com/api_category.php`)
      .then((res) => {
        setCategories(res.data.trivia_categories);
      });
  }, []);

  function decodeString(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  }

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .get(`https://opentdb.com/api.php`, {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    }).then((res) => {
      setFlashcards(res.data.results.map((questionEl, index) => {
          const answer = decodeString(questionEl.correct_answer);
          const options = [
            ...questionEl.incorrect_answers.map((a) => decodeString(a)),
            answer,
          ];

          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionEl.question),
            answer,
            options: options.sort(() => Math.random() - 0.5),
          };
        })
      );
      console.log(res.data);
    });
  }

  return (
    <>
      <form className='header' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          <select id='category' ref={categoryEl}>
            {categories.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='amount'>No. of Questions</label>
          <input
            type='number'
            id='amount'
            min='1'
            step='1'
            defaultValue={10}
            ref={amountEl}
          />
        </div>
        <div className='form-group'>
          <button className='btn'>Generate</button>
        </div>
      </form>
      <div className='container'>
        <FlashCardList flashcards={flashcards} />
      </div>
    </>
  );
}


export default App;
