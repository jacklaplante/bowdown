import React from 'react'

import {connectToServer} from '../src/websocket'

const https = require('https');

class Servers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {servers: []};
    this.startOnServer = this.startOnServer.bind(this);
  }

  componentDidMount() {
    https.get('https://rvcv9mh5l1.execute-api.us-east-1.amazonaws.com/test/pets', (res) => {
      res.on('data', (d) => {
        var response = JSON.parse(d);
        if (response.Items) {
          this.setState({servers: response.Items});
        }
      });
    }).on('error', (e) => {
      console.error(e);
    });
  }

  startOnServer(event) {
    connectToServer(event.target.id)
    this.props.startGame();
  } 

  render() {

    const servers = []
    this.state.servers.forEach((server) => {
      if (server.serverId && server.serverId.S && server.activePlayers && server.activePlayers.S && server.serverIp && server.serverIp.S) {
        servers.push(
          <div className="server" key={server.serverId.S}>
            <div className="name">{server.serverId.S}</div>
            <div className="activePlayers">{server.activePlayers.S}</div>
            <div className="join" onClick={this.startOnServer} id={server.serverIp.S}>Join</div>
          </div>
        )
      } else {
        console.error("error parsing the server listing response")
      }
    })

    var serverList;
    if (servers.length > 0 ) {
      serverList = (
        <div id="server-list">
          <div id="server-list-header">
            <div>Name</div>
            <div id="player-count">Players</div>
          </div>
          {servers}
        </div>
      )
    } else {
      serverList = (
        <div>loading</div>
      )
    }

    return (
      <div className="centered">
        {serverList}
        <div className="button" onClick={this.props.mainMenu}>back</div>
      </div>
    )
  }
}

export default Servers