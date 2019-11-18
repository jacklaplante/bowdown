import React from 'react'

import Title from './title'

class Controls extends React.Component {
    constructor(props) {
        super(props)
        this.state = {page: "main"}
        this.showMobileControls = this.showMobileControls.bind(this);
        this.showDesktopControls = this.showDesktopControls.bind(this);
    }

    showMobileControls() {
        this.setState({page: "mobile"})
    }

    showDesktopControls() {
        this.setState({page: "desktop"})
    }

    render() {
      if (this.state.page == "main") {
        return (
          <div className="centered">
            <Title title='controls' />
            <div className="button" onClick={this.showMobileControls}>mobile</div>
            <div className="button" onClick={this.showDesktopControls} id="mouse-and-keyboard-button">mouse + keyboard</div>
            <div className="button" onClick={this.props.mainMenu}>back</div>
          </div>
        )
      } else if (this.state.page == "mobile") {
        return (
          <div>
            <div id="controls">
              <p>Mobile controls:</p>
              <ul>
                <li>Move - Touch movement on left side of screen</li>
                <li>Move Camera - Touch movement on right side of screen</li>
                <li>Draw and Release Arrow - Target button (hold -> release)</li>
                <li>Draw and Release Grapple - Grapple button (hold -> release)</li>
                <li>Jump - Green bar on bottom-right of screen</li>
                <li>For the best experience, keep your phone in landscape mode, fullscreen (which doesn't always work on iPhone, don't blame me! blame Apple)</li>
              </ul>
            </div>
            <div className="button" onClick={this.props.mainMenu}>main menu</div>
          </div>
        )
      } else if (this.state.page == "desktop") {
        return (
          <div>
            <div id="controls">
              <p>Mouse + keyboard:</p>
              <ul>
                <li>Mouse - move camera</li>
                <li>Left click (hold -> release) - draw and release arrow</li>
                <li>Right click (hold -> release) - draw and release grapple</li>
                <li>WASD - move</li>
                <li>Space - jump</li>
                <li>Shift - sprint</li>
              </ul>
            </div>
            <div className="button" onClick={this.props.mainMenu}>main menu</div>
          </div>
        )
      }
    }
}

export default Controls