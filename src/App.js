import './App.css';
import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor.js'
import codingQuestions from './data/Questions.js'
import sample from './data/sample.json'

function QuestionDropdown({ questions, selectedQuestion, onQuestionSelect }) {
  const problem_ids = Object.keys(questions)
  return (
    <select value={selectedQuestion} onChange={(e) => onQuestionSelect(e.target.value)}>
      <option value="">Select a Question</option>
      {problem_ids.map((question, index) => (
        <option key={index} value={question}>
          {question}
        </option>
      ))}
    </select>
  );
}

function App() {
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [descriptions, setDescriptions] = useState({});

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
  };

  const processJSON = (sample) => {
    var questions = {}
    for (let i = 0; i < sample[0].length; i++) {
      var id = sample[0][i][0]["problem_id"]
      questions[id] = [sample[0][i], sample[1][i]]
    }
    return questions
  }

  useEffect(() => {
    const questions = processJSON(sample)
    setDescriptions(sample[2][0])
    setQuestions(questions);
  }, []);

  const handleJSONFileUpload = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0]; // Get the first selected file
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const jsonContent = e.target.result;
        try {
          const parsedJSON = JSON.parse(jsonContent);
          // Use the parsed JSON data in your code editor
          const newQuestions = processJSON(parsedJSON)
          setQuestions(newQuestions)
          setDescriptions(parsedJSON[2][0])
        } catch (error) {
          // Handle JSON parsing error
          console.error('Error parsing JSON:', error);
          // You can display an error message to the user if needed
        }
      };
  
      reader.readAsText(file);
    }
  }; 

  return (
    <div className="App">
      <h1>IML-Visualizer</h1>
      <QuestionDropdown questions={questions} selectedQuestion={selectedQuestion} onQuestionSelect={handleQuestionSelect} />
      <h2>Problem Description</h2>
      <pre>{selectedQuestion ? descriptions[selectedQuestion] : 'Select a question to view description.'}</pre>
      <div className="container">
        <div className="editor-container">
          <CodeEditor questions={questions} selectedQuestion={selectedQuestion}/>
        </div>
        <div className="editor-container">
          <CodeEditor questions={questions} selectedQuestion={selectedQuestion}/>
        </div>
      </div>
      <button onClick={() => document.getElementById('jsonFileInput').click()}>Upload JSON File</button>
      <input
        type="file"
        id="jsonFileInput"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleJSONFileUpload}
      />
    </div>
  );
}

export default App;
