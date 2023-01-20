import React from 'react'
import { useState } from 'react';
import { CopyBlock, dracula } from "react-code-blocks"

const CodeArea = () => {

    const [language, changeLanguage] = useState("jsx");
    // const [languageDemo, changeDemo] = useState("");
    const languageDemo = `class HelloMessage extends React.Component {
        handlePress = () => {
          alert('Hello')
        }
        render() {
          return (
            <div>
              <p>Hello {this.props.name}</p>
              <button onClick={this.handlePress}>Say Hello</button>
            </div>
          );
        }
      }
      
      ReactDOM.render(
        <HelloMessage name="Taylor" />, 
        mountNode 
      );`;
    const [lineNumbers, toggleLineNumbers] = useState(true);
    return (
        <div className="container m-4 p-4">
            {/* <TopBar
                language={{
                    value: language,
                    onChange: e => {
                        changeDemo(sample[e.target.value]);
                        return changeLanguage(e.target.value);
                    },
                    options: Object.keys(sample).map(lang => (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    ))
                }}
                toggle={{
                    checked: lineNumbers,
                    onChange: e => toggleLineNumbers(!lineNumbers)
                }}
            /> */}
            <div className="demo">
                <CopyBlock
                    language={language}
                    text={languageDemo}
                    showLineNumbers={lineNumbers}
                    theme={dracula}
                    wrapLines={true}
                    codeBlock
                />
                <br />
                <CopyBlock
                    language="go"
                    text={`v := Vertex{X: 1, Y: 2}`}
                    codeBlock
                    theme={dracula}
                    showLineNumbers={false}
                />
            </div>
        </div>
    );
}

export default CodeArea