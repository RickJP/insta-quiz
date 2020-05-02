import React, {Component, Fragment} from 'react';
import {Helmet, HelmetProvider} from 'react-helmet-async';
import {StarHalf, WbIncandescent, AvTimer} from '@material-ui/icons';

import questions from '../../data/questions.json';
import {isEmpty} from '../../utils/is-empty';

import M from 'materialize-css';

import correctAnswerSound from '../../assets/audio/correctAnswer.wav';
import wrongAnswerSound from '../../assets/audio/wrongAnswer.wav';
import buttonClickSound from '../../assets/audio/buttonClick.wav';

const helmetContext = {};

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions,
      currentQuestion: {},
      nextQuestion: {},
      prevQuestion: {},
      answer: '',
      numOfQuestions: 0,
      numberOfAnsweredQuestions: 0,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      hints: 5,
      fiftyFifty: 2,
      usedFiftyFifty: false,
      time: {},
      prevRandomNo: []
    };
  }

  componentDidMount() {
    const {questions, currentQuestion, prevQuestion, nextQuestion} = this.state;
    this.displayQuestions(
      questions,
      currentQuestion,
      prevQuestion,
      nextQuestion
    );
  }

  displayQuestions = (
    questions = this.state.questions,
    currentQuestion,
    nextQuestion,
    prevQuestion
  ) => {
    let {currentQuestionIndex} = this.state;

    if (!isEmpty(questions)) {
      currentQuestion = questions[currentQuestionIndex];
      prevQuestion = questions[currentQuestionIndex - 1];
      nextQuestion = questions[currentQuestionIndex + 1];
      const answer = currentQuestion.answer;

      this.setState({
        currentQuestion,
        prevQuestion,
        nextQuestion,
        answer,
        numOfQuestions: questions.length,
        prevRandomNo: []
      }, () => {
        this.showOptions();
        
      });
    }
  };

  handleOptionClick = (e) => {
    if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
      document.getElementById('correctAnswerSound').play();
      this.correctAnswer();
    } else {
      document.getElementById('wrongAnswerSound').play();
      this.wrongAnswer();
    }
  };

  handlePrevButton = () => {
    if (this.state.prevQuestion !== undefined) {
      this.setState(
        (prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex - 1,
        }),
        () => {
          this.displayQuestions(
            this.state.questions,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.prevQuestion
          );
        }
      );
    }
  };

  handleNextButton = () => {
    if (this.state.nextQuestion !== undefined) {
      this.setState(
        (prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
        }),
        () => {
          this.displayQuestions(
            this.state.questions,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.prevQuestion
          );
        }
      );
    }
  };

  handleQuitButton = () => {
    if (window.confirm(`Do you really want to quit`)) {
      this.props.history.push('/');
    }
  };

  showOptions = () => {
    const options = Array.from(document.querySelectorAll('.option'));

    options.forEach((option) => {
      option.style.visibility = 'visible';
    });
  }

  handleHints = () => {
    if (this.state.hints > 0) {
      const options = Array.from(document.querySelectorAll('.option'));
    let indexOfAnswer;

    options.forEach((option, index) => {
      if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
        indexOfAnswer = index;
      }
    });

    while (true) {
      const randNum = Math.round(Math.random() * 3);
      if (randNum !== indexOfAnswer && !this.state.prevRandomNo.includes(randNum)) {
        options.forEach((option, index) => {
          if (index === randNum) {
            option.style.visibility = 'hidden';
            this.setState((prevState) => ({
              hints: prevState.hints - 1,
              prevRandomNo: prevState.prevRandomNo.concat(randNum)
            }));
          }
        });
        break;
      }
      if (this.state.prevRandomNo.length >= 3) break;
    }
    }
    
  };

  handleButtonClick = (e) => {
    console.log(e.target.id);
    switch (e.target.id) {
      case 'next-button':
        this.handleNextButton();
        break;
      case 'previous-button':
        this.handlePrevButton();
        break;
      case 'quit-button':
        this.handleQuitButton();
        break;
      default:
        break;
    }
    this.playButtonSound();
  };

  playButtonSound = () => {
    document.getElementById('buttonClickSound').play();
  };

  correctAnswer = () => {
    M.toast({
      html: 'Correct Answer!',
      classes: 'toast-valid',
      displayLength: 1500,
    });
    this.setState(
      (prevState) => ({
        score: prevState.score + 1,
        correctAnswers: prevState.correctAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
      }),
      () => {
        this.displayQuestions(
          this.state.questions,
          this.state.currentQuestion,
          this.state.prevQuestion,
          this.state.nextQuestion
        );
      }
    );
  };

  wrongAnswer = () => {
    navigator.vibrate(800);
    M.toast({
      html: 'Wrong Answer!',
      classes: 'toast-invalid',
      displayLength: 1500,
    });
    this.setState(
      (prevState) => ({
        wrongAnswers: prevState.wrongAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
      }),
      () => {
        this.displayQuestions(
          this.state.questions,
          this.state.currentQuestion,
          this.state.prevQuestion,
          this.state.nextQuestion
        );
      }
    );
  };

  render() {
    const {currentQuestion, numOfQuestions, currentQuestionIndex} = this.state;

    return (
      <HelmetProvider context={helmetContext}>
        <Fragment>
          <Helmet>
            {' '}
            <title>Quiz Page</title>
          </Helmet>
          <Fragment>
            <audio id="correctAnswerSound" src={correctAnswerSound}></audio>
            <audio id="wrongAnswerSound" src={wrongAnswerSound}></audio>
            <audio id="buttonClickSound" src={buttonClickSound}></audio>
          </Fragment>
          <div className="questions noselect">
            <h2>Quiz Mode</h2>
            <div className="lifeline-container">
              <p>
                {' '}
                <StarHalf
                  onClick={this.handleFiftyFify}
                  className="lifeline-icon"
                  style={{fontSize: 24, color: 'red'}}
                />
                <span className="lifeline-no">{this.state.fiftyFifty}</span>
              </p>
              <p>
                <WbIncandescent
                  onClick={this.handleHints}
                  className="lifeline-icon"
                  style={{fontSize: 24, color: 'orange'}}
                />

    <span className="lifeline-no">{this.state.hints}</span>
              </p>
            </div>{' '}
            {/* lifeline-container */}
            <div className="info-container">
              <p>
                <span>
                  {' '}
                  <span className="question-counter">
                    {currentQuestionIndex + 1} / {numOfQuestions}
                  </span>
                </span>
              </p>
              <p>
                <span>
                  {' '}
                  <span>2:15</span>
                </span>
                <AvTimer
                  onClick={this.handleHints}
                  className="lifeline-icon"
                  style={{fontSize: 24, color: 'blue'}}
                />
              </p>
            </div>{' '}
            {/* lifeline-container */}
            <h4 className="question">{currentQuestion.question}</h4>
            <div className="options-container">
              <p onClick={this.handleOptionClick} className="option">
                {currentQuestion.optionA}
              </p>
              <p onClick={this.handleOptionClick} className="option">
                {currentQuestion.optionB}
              </p>
            </div>
            <div className="options-container">
              <p onClick={this.handleOptionClick} className="option">
                {currentQuestion.optionC}
              </p>
              <p onClick={this.handleOptionClick} className="option">
                {currentQuestion.optionD}
              </p>
            </div>
            <div className="btn-container">
              <button id="previous-button" onClick={this.handleButtonClick}>
                Previous
              </button>
              <button id="next-button" onClick={this.handleButtonClick}>
                Next
              </button>
              <button id="quit-button" onClick={this.handleButtonClick}>
                Quit
              </button>
            </div>
          </div>{' '}
          {/* Questions */}
        </Fragment>
      </HelmetProvider>
    );
  }
}

export default Play;
