import React, {useState, useEffect, useRef} from 'react';
import FlashCardList from './FlashCardList';

import axios from './axios';

import './app.css';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    setIsLoading(true);
    axios.get(`/categories`).then((res) => {
      res.data.map((data) => {
        // setCategories((categories) => [...categories, data.category])
        setCategories((categories) => categories.concat(data.category));
        setIsLoading(false);
      });
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
      .get(`/questions`, {
        params: {
          amount: amountEl.current.value,
          category:  categories[categoryEl.current.value]
        },
      })
      .then((res) => {
        setFlashcards(
          res.data.map((questionEl, index) => {
            console.log(questionEl);
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

  const DisplayCategories = () => (
    <select id='category' ref={categoryEl}>
      {categories.map((category, index) => {
        return (
          <option value={index} key={index}>
            {category}
          </option>
        );
      })}
    </select>
  );

  return (
    <>
      <form className='header' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          {!isLoading ? <DisplayCategories /> : <div>Loading...</div>}
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
