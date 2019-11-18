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
    this.setState({
      readyToRock: true,
      startGame: function() {
        if (typeof document.body.requestPointerLock == "function") {
          document.body.requestPointerLock();
        }
        if (document.getElementsByTagName("audio").length > 0) {
          document.getElementsByTagName("audio")[0].pause()
        }
        game.start();
      }
    })
  }

  render() {
    if (this.state.page == "main") {
      return (
        <div className="centered">
          <Title title='bowdown' />
          <div className="button" onClick={this.listServers} id="servers">
            {this.state.readyToRock ? 'servers' : 'loading'}
          </div>
          <div className="button" onClick={this.showControls} id="controls-button">controls</div>
          <div id="menu-info">
            {(window.innerWidth < window.innerHeight) ? 'put phone in landscape mode for best experience' : ''}
          </div>
        </div>
      );
    } else if (this.state.page == "servers") {
      return (
        <Servers mainMenu={this.mainPage} startGame={this.state.startGame} />
      )
    } else if (this.state.page == "controls") {
      return (
        <Controls mainMenu={this.mainPage} />
      )
    }
  }
}

export default Menu