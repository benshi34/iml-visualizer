import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import './CodeEditorStyles.css';
import codingQuestions from '../data/Questions.js'

function CodeDropdown({ onSelect, codeSnippets, keyProp}) {
    return (
      <select key={keyProp} onChange={(e) => onSelect(e.target.selectedIndex, e.target.value)}>
        <option value="">Select a Sample</option>
        {codeSnippets?.map((snippet, index) => (
          <option key={index} value={[snippet, index]}>
            {'Generated Solution '+String(index+1)}
          </option>
        ))}
      </select>
    );
}

function CodeEditor({ questions, selectedQuestion }) {
  const [code, setCode] = useState('');
  const [codeDropdownKey, setCodeDropdownKey] = useState(0);
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [generationResult, setGenerationResult] = useState('');

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleSelection = (key, value) => {
    const questionData = questions[selectedQuestion];
    if (questionData) {
      var snippetData = questionData[0][key-1];
      setGenerationResult(snippetData['result_type'] + '\n' + snippetData['status'])
    }
    setCode(value);
  }

  useEffect(() => {
    // Get the code snippets
    const questionData = questions[selectedQuestion];
    if (questionData) {
      var snippetData = questionData[1];
    }
    const codeSnippets = []
    snippetData?.forEach(function (dict) {
      if (dict.hasOwnProperty("solution_code")) {
        codeSnippets.push(dict.solution_code);
      }
    });
    setCodeSnippets(codeSnippets)

    // Reset the code dropdown by updating its key when the selected question changes
    setCodeDropdownKey((prevKey) => prevKey + 1);
    setCode('');
  }, [selectedQuestion]); 

  return (
    <div className='editor-container'>
      <CodeDropdown codeSnippets={codeSnippets} onSelect={handleSelection} keyProp={codeDropdownKey}/>
      <div className='editor-title'>Code Snippet</div>
        <AceEditor
          mode="python"
          theme="github"
          name="code-editor"
          onChange={handleCodeChange}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={code}
          setOptions={{
            useWorker: false,
          }}
        />
      <div className='ace-toolbar'>
        <button className='save-button'>Save</button>
        <button onClick={() => handleCodeChange('')} className='reset-button'>Reset</button>
      </div>
      <h3>Generation Results: </h3>
      <pre>{generationResult}</pre>
    </div>
  );
}

export default CodeEditor;
