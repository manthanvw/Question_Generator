import React, { useState } from 'react';
import './App.css';

function App() {
  const [paragraph, setParagraph] = useState('');
  const [num, setNum] = useState(5);
  const [generatedText, setGeneratedText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState(1);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/generate_questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paragraph, difficulty }), // Parse 'num' to an integer
      });
      if (response.status === 200) {
        const result = await response.json();
        const newQuestions = result.questions;

        // Combine newly generated questions with existing questions
        const allQuestions = [...questions, ...newQuestions];

        // Update the state with all questions
        setQuestions(allQuestions);

        // Update the generated text with all questions
        const generatedText = allQuestions
          .map((question, index) => `Question ${index + 1}: ${question.text}`)
          .join('\n');
        setGeneratedText(generatedText);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQuestions = () => {
    if (generatedText.length === 0) {
      console.error('No questions to download.');
      return;
    }

    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-questions.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Generate Questions</h1>
      {/* <div>
        <label htmlFor="numberSelect" className="form-label">
          Enter number of questions to be generated:
        </label>
        <input
          id="num"
          type="number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
        />
      </div> */}
      <div className="mb-3">
        <textarea
          id="paragraph"
          className="form-control"
          rows="5"
          placeholder="Enter your paragraph here"
          value={paragraph}
          onChange={(e) => setParagraph(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="difficultySelect" className="form-label">
          Select Difficulty Level:
        </label>
        <select
          id="difficultySelect"
          className="form-select"
          value={difficulty}
          onChange={(e) => {
            setDifficulty(Number(e.target.value));
          }}
        >
          <option value={1}>1 (Lowest)</option>
          <option value={2}>2 (Medium)</option>
          <option value={3}>3 (Highest)</option>
        </select>
      </div>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={generateQuestions}>
          Generate Questions
        </button>
      </div>
      <div id="questions">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : questions.length === 0 ? (
          <p>No questions generated.</p>
        ) : (
          <ul className="list-group">
            {questions.map((question, index) => (
              <li key={index} className="list-group-item">
                <strong>Question {index + 1}:</strong> {question.text}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="btn btn-success" onClick={downloadQuestions}>
        Download Questions
      </button>
    </div>
  );
}

export default App;