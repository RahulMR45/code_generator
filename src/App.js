import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js';

function App() {
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('Python');
    const [currentResponse, setCurrentResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/generate-code', {
                description,
                language,
            });

            setCurrentResponse({ description, language, code: response.data.code });
            setDescription('');
        } catch (error) {
            console.error("Error generating code:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentResponse) {
            hljs.highlightAll();
        }
    }, [currentResponse]);

    return (
        <div className="App">
            <h1>CodeGPT</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Task Description:
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Programming Language:
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="Python">Python</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Java">Java</option>
                        <option value="C++">C++</option>
                        <option value="C#">C#</option>
                        <option value="HTML">HTML</option>
                        <option value="Ruby">Ruby</option>
                        <option value="PHP">PHP</option>
                        <option value="Kotlin">Kotlin</option>

                        
                    </select>
                </label>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Code'}
                </button>
            </form>

            {currentResponse && (
                <div className="response-container">
                    <div className="response-block">
                        <h3>Generated Code for: {currentResponse.description}</h3>
                        <p><strong>Language:</strong> {currentResponse.language}</p>
                        <div className="code-container">
                            <pre><code className={`language-${currentResponse.language.toLowerCase()}`}>
                                {currentResponse.code}
                            </code></pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;