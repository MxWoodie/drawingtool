import React from 'react';
import './App.css';

class Rectangle extends React.Component {
  render() {
    return (
      <div className='rectangle' style={{top: this.props.top, left: this.props.left, width: this.props.width, height: this.props.height, backgroundColor: this.props.bgcolor}}></div>
    )
  }
}

class Canvas extends React.Component {
  render() {
    return (
      <div className='canvas' style={{width: this.props.width, height: this.props.height, backgroundColor: this.props.bgcolor}}>
        {this.props.children}
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      canvasWidth: null,
      canvasHeight: null,
      canvasColor: 'transparent'
    }
  }

  handleFile(file) {
    let fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onloadend = () => {
      this.drawPicture(fileReader.result.split('\n'));
    }
  }

  drawPicture(arr) {
    const elements = [];
    for (let i = 0; i < arr.length; i++) {
      const line = arr[i].split(' ');
      switch(line[0]) {
        case 'C': 
          this.setState({canvasWidth: +line[1]});
          this.setState({canvasHeight: +line[2]});
          break;
        case 'L':
        case 'R':
          console.log(this.state.canvasWidth);
          if (+line[1] > this.state.canvasWidth || +line[2] > this.state.canvasHeight) continue;
          const width = +line[3] < this.state.canvasWidth ? line[3] - line[1] : this.state.canvasWidth - line[1];
          const height = +line[4] < this.state.canvasHeight ? line[4] - line[2] : this.state.canvasHeight - line[2];
          elements.push([+line[1], +line[2], width, height]);
          break;
        case 'B':
          let isCanvas = true;
          elements.forEach(element => {
            if ((+line[1] > element[0] && +line[1] < element[0] + element[2]) 
              && (+line[2] > element[1] && +line[2] < element[1] + element[3])) {
                element.push('orange');
                isCanvas = false;
            } 
          });
          if (isCanvas 
            && (+line[1] < this.state.canvasWidth && +line[2] < this.state.canvasHeight)) 
            this.state.canvasColor = 'orange';
          break;
        default:
          continue;
      }
    }
    console.log(elements);
    this.setState({elements: elements});
  }

  render() {
    return (
      <div>
        <input type='file' onChange={e => this.handleFile(e.target.files[0])} />
        <Canvas width={this.state.canvasWidth} height={this.state.canvasHeight} bgcolor={this.state.canvasColor}>
          {this.state.elements.map(item => (
            <Rectangle left={item[0]} top={item[1]} width={item[2]} height={item[3]} bgcolor={item[4]} key={item} />
          ))}
        </Canvas>
      </div>
    )
  }
}

export default App;
