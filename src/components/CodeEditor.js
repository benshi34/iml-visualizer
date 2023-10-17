import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import './CodeEditorStyles.css';

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

function CodeEditor({ def, defName, selectedQuestion }) {
  const [dataFile, setDataFile] = useState(def);
  const [questions, setQuestions] = useState([]);
  const [code, setCode] = useState('');
  const [codeDropdownKey, setCodeDropdownKey] = useState(0);
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [generationResult, setGenerationResult] = useState('');
  const [currFile, setCurrFile] = useState(defName)

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleSelection = (key, value) => {
    if (selectedQuestion) {
      const questionData = questions[selectedQuestion];
      if (questionData) {
        var snippetData = questionData[0][key-1];
        if (snippetData) {
          setGenerationResult(snippetData['result_type'] + '\n' + snippetData['status'])
        }
      }
      setCode(value);
    }
  }

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

  const reset = () => {
    setDataFile(def)
    setCurrFile(defName)
  }

  const handleJSONFileUpload = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0]; // Get the first selected file
    console.log(file)
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const jsonContent = e.target.result;
        try {
          const parsedJSON = JSON.parse(jsonContent);
          // Use the parsed JSON data in your code editor
          console.log(parsedJSON)
          console.log("HERE")
          setDataFile(parsedJSON)
          setCurrFile(file.name)
          setGenerationResult('')
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
    // Get the code snippets
    const data = processJSON(dataFile)
    const questionData = data[selectedQuestion];
    if (questionData) {
      var snippetData = questionData[1];
      const codeSnippets = []
      snippetData?.forEach(function (dict) {
        if (dict.hasOwnProperty("solution_code")) {
          codeSnippets.push(dict.solution_code);
        }
      });
      setQuestions(data)
      setCodeSnippets(codeSnippets)
      // Reset the code dropdown by updating its key when the selected question changes
      setCodeDropdownKey((prevKey) => prevKey + 1);
      setCode('');
    }
  }, [selectedQuestion, dataFile]); 

  return (
    <div className='editor-container'>
      <CodeDropdown codeSnippets={codeSnippets} onSelect={handleSelection} keyProp={codeDropdownKey}/>
      <div className='editor-title'>Code Snippet</div>
        <pre>Code JSON file loaded: <b>{trim(currFile)}</b></pre>
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
          style={{ width: '100%'}}
        />
      <div className='ace-toolbar'>
        <button className='save-button'>Save</button>
        <input
          type="file"
          id="jsonFileInput"
          accept=".json"
          onChange={handleJSONFileUpload}
        />
        <button onClick={() => reset()} className='reset-button'>Reset</button>
      </div>
      <h3>Generation Results: </h3>
      <pre>{generationResult}</pre>
    </div>
  );
}

export default CodeEditor;
