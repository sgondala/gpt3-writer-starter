import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script'
import buildspaceLogo from '../assets/buildspace-logo.png';
import twitterLogo from '../assets/twitter.png';

import { useState } from 'react';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const onUserChangedText = (event) => {
    // console.log(event.target.value);
    setUserInput(event.target.value);
  };
  
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [questionCount, setQuestionCount] = useState(8);

  function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
  }

  const callGenerateEndpoint = async () => {
    if(userInput === "") {
      setApiOutput("I'm ready to spill the beans, but first you need to ask the question");
      return;
    }

    setIsGenerating(true);
    setQuestionCount(questionCount + 1);
    
    console.log("Calling new endpoint...")
    const response = await fetch('https://ask-paulg-production.up.railway.app/get_answer/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
      },
      body: JSON.stringify({ 'question': userInput }),
    });

    console.log("Fetched data from endpoint...")
    const data = await response.json();
    // const { output } = data;
    console.log("OpenAI replied...", data)
    let result =''
    for (var key in data) {
        // If key is 'question' then continue
        if (key === 'question') {
            continue
        }
        else if (key === 'answer') {
            result = result + 'Answer: ' + data[key] + '\n \n'
            continue
        }
        // If key is 'essay_sources'
        else if (key === 'essay_sources') {
          let sources = Array.from(new Set(data[key]))
          // Now this is an array. We want iterate on it
          // and add line by line 
          result = result + 'Sources: \n'
          for (var i = 0; i < sources.length; i++) {
            let source = sources[i];
            // let essay_url = data[key][i];
            if (!isURL(source)) {
              // convert to desired format
              source = source.replace(/_/g, " ").replace(".md", "").replace(/^\d+/g, "");
              source = "Paul Graham's essay - " + source;
            }
            result = result + i + '. ' + source + '\n'
          }
        }
        // There are no more keys, it should be an error
        else {
          result = result + 'Error: ' + data[key] + '\n'
        }
    }

    setApiOutput(result);
    setIsGenerating(false);
  }

  
  return (
    <div className="root">
      <Head>
        <title> Startup Advisor INC </title>
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-19CXX88PMC"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-19CXX88PMC');
        `}
      </Script>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1> Startup Advisor INC </h1>
          </div>
          <div className="header-subtitle">
            <h2> Hello, fellow entrepreneur! Welcome to the future of startup mentorship. Our advanced AI-powered platform summarizes information from YCombinator's Startup Library, Paul Graham essays, and other sources to provide you expert advice and timely guidance to your startup related questions.  Try us out and experience what it's like having an advisor who knows exactly what you need at every stage of building your startup. </h2> 
            <h2> Try asking questions like 'How do I get startup ideas?', 'How much ESOP pool should I allocate?', etc. </h2>

            {/* <h2> {questionCount} questions asked so far ! </h2> */}
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

      <div className="twitter-container grow">
        <a
          href="https://twitter.com/sgondala2"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={twitterLogo} alt="buildspace logo" />
            <p>sgondala2</p>
          </div>
        </a>
      </div>

      <div className="contact-container grow">
        <a
          href="https://twitter.com/sgondala2"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            {/* <Image src={twitterLogo} alt="buildspace logo" /> */}
            <p> Contact us if you want to use this technology on your data! </p>
          </div>
        </a>
      </div>

    </div>
  );
};

export default Home;
