import './App.css';
import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor.js'
import codingQuestions from './data/Questions.js'
import sample from './data/sample.json'
import sample2 from './data/sample2.json'
import usaco_dict from './data/usaco_dict.json'

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
  const [currFile, setCurrFile] = useState('sample.json');

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

  const trim = (currFile) => {
    const length = currFile.length
    if (length < 20) {
      return currFile
    }
    else {
      return currFile.slice(0, 10) + "..." + currFile.slice(length-8, length)
    }
  }

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
          setCurrFile(file.name)
        } catch (error) {
          // Handle JSON parsing error
          console.error('Error parsing JSON:', error);
          // You can display an error message to the user if needed
        }
      };
  
      reader.readAsText(file);
    }
  }; 

  useEffect(() => {
    const questions = processJSON(sample)
    var descriptionTemp = {}
    const ids = Object.keys(usaco_dict)
    for (let i = 0; i < ids.length; i++) {
      descriptionTemp[ids[i]] = usaco_dict[ids[i]]['description']
    }
    setDescriptions(descriptionTemp)
    setQuestions(questions);
  }, []);

  return (
    <div className="App">
      <h1>IML-Visualizer</h1>
      <pre>
        Question JSON loaded: <b>{trim(currFile)}</b>
      </pre>
      <div className="input-container">
        <input
          type="file"
          id="jsonFileInput"
          accept=".json"
          onChange={handleJSONFileUpload}
      />
      </div>
      <div></div>
      <QuestionDropdown questions={questions} selectedQuestion={selectedQuestion} onQuestionSelect={handleQuestionSelect} />
      <h2>Problem Description</h2>
      <pre>{selectedQuestion ? descriptions[selectedQuestion] : 'Select a question to view description.'}</pre>
      <div className="container">
        <div className="editor-container">
          <CodeEditor def={sample} defName={'sample.json'} selectedQuestion={selectedQuestion}/>
        </div>
        <div className="editor-container">
          <CodeEditor def={sample2} defName={'sample2.json'} selectedQuestion={selectedQuestion}/>
        </div>
      </div>
    </div>
  );
}

export default App;
