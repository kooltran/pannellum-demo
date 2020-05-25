import React, { Component } from 'react';
import { render } from 'react-dom';
import "./index.css";
import Header  from "./components/Header";
import ImageDemo from "./components/ImageDemo";

class Demo extends Component {
  

  render() {
    return (
      <div className="app">
        <Header />
        <ImageDemo />
      </div>
    );
  }

}


render(<Demo />, document.querySelector('#demo'));
