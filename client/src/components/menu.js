import React from 'react'

import Title from './title'
import Controls from './controls'
import Servers from './servers'

class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: "main",
      readyToRock: false
    };
    this.showControls = this.showControls.bind(this);
    this.listServers = this.listServers.bind(this);
    this.mainPage = this.mainPage.bind(this);
  }

  mainPage() {
    this.setState({page: "main"})
  }

  showControls() {
    this.setState({page: "controls"})
  }

  listServers() {
    this.setState({page: "servers"})
  }

  async componentDidMount() {
    const game = await import(/* webpackChunkName: "game" */ '../src/game')
    document.body.classList.remove("loading")
    document.body.classList.add("ready")
    var startButton = document.querySelector("#play.button")
    this.setState({
      readyToRock: true,
      startGame: function() {
        if (typeof document.body.requestPointerLock == "function") {
          document.body.requestPointerLock();
        }
        document.getElementsByTagName("audio")[0].pause()
        game.start();
      }
    })
  }

  render() {
    if (this.state.page == "main") {
      return (
        <div className="centered">
          <Title title='bowdown' />
          <div className="button" onClick={this.state.startGame} id="play">
            {this.state.readyToRock ? 'start' : 'loading'}
          </div>
          <div className="button" onClick={this.listServers}>servers</div>
          <div className="button" onClick={this.showControls}>controls</div>
        </div>
      );
    } else if (this.state.page == "servers") {
      return (
        <Servers mainMenu={this.mainPage} />
      )
    } else if (this.state.page == "controls") {
      return (
        <Controls mainMenu={this.mainPage} />
      )
    }
  }
}

export default Menu