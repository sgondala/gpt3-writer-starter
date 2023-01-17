import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

import { useState } from 'react';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const onUserChangedText = (event) => {
    // console.log(event.target.value);
    setUserInput(event.target.value);
  };
  
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // const callGenerateEndpoint = async () => {
  //   setIsGenerating(true);
    
  //   console.log("Calling OpenAI...")
  //   const response = await fetch('/api/generate', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ userInput }),
  //   });

  //   const data = await response.json();
  //   const { output } = data;
  //   console.log("OpenAI replied...", output.text)

  //   setApiOutput(`${output.text}`);
  //   setIsGenerating(false);
  // }

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    
    console.log("Calling new endpoint...")
    const response = await fetch('https://ask-paulg-production.up.railway.app/get_answer/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'question': userInput }),
    });

    console.log("Fetched data from endpoint...")
    const data = await response.json();
    // const { output } = data;
    console.log("OpenAI replied...", data)
    let result =''
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            result = result + key + ': ' + data[key] + '\n'
        }
    }

    setApiOutput(result);
    setIsGenerating(false);
  }

  
  return (
    <div className="root">
      <Head>
        <title> Ask Paul Graham </title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1> Ask Paul Graham </h1>
          </div>
          <div className="header-subtitle">
            <h2> Ever wondered how it is like to have Paul Graham answer your questions about startups? Well! We've read through all of PG's content, used advanced AI magic, and tell you what he might say! </h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea 
            placeholder="" 
            className="prompt-box" 
            value={userInput}
            onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
            <a 
              className={isGenerating ? 'generate-button loading' : 'generate-button'}
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
