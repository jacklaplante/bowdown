import React from 'react'

import Title from './title'
import Controls from './controls'
import ChallengeFriends from './challengeFriends'

class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: "main",
      readyToRock: false
    };
    this.showControls = this.showControls.bind(this);
    this.challengeFriends = this.challengeFriends.bind(this);
    this.mainPage = this.mainPage.bind(this);
  }

  mainPage() {
    this.setState({page: "main"})
  }

  showControls() {
    this.setState({page: "controls"})
  }

  challengeFriends() {
    this.setState({page: "challengeFriends"})
    scene.loadMap("./garden.glb", "down");
  }
  

  async componentDidMount() {
    const game = await import(/* webpackChunkName: "game" */ '../src/game')
    game.start();
    let root = document.getElementById("root")
    root.classList.remove("loading")
    root.classList.add("ready")
    this.setState({
      readyToRock: true,
      startGame: function() {
        if (typeof document.body.requestPointerLock == "function") {
          document.body.requestPointerLock();
        }
        if (document.getElementsByTagName("audio").length > 0) {
          document.getElementsByTagName("audio")[0].pause()
        }
      }
    })
  }

  render() {
    if (this.state.page == "main") {
      return (
        <div id="menu" className="centered">
          <Title title='bowdown' />
          <div className="button" onClick={this.showControls} id="controls-button">controls</div>
          <div id="menu-info">
            {(window.innerWidth < window.innerHeight) ? 'put phone in landscape mode for best experience' : ''}
          </div>
          <div className="footer">
            <p>A game by Snubber - <a href="https://twitter.com/bowdownIO" target="_blank">twitter</a></p>
            <p>Feedback? Send to bowdown.feedback@gmail.com</p>
          </div>
        </div>
      );
    } else if (this.state.page == "challengeFriends") {
      return (
        <ChallengeFriends mainMenu={this.mainPage} startGame={this.state.startGame} />
      )
    } else if (this.state.page == "controls") {
      return (
        <Controls mainMenu={this.mainPage} />
      )
    }
  }
}

export default Menu