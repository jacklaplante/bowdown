var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

import { connectToServer } from '../src/websocket';

var https = require('https');

var Servers = function (_React$Component) {
  _inherits(Servers, _React$Component);

  function Servers(props) {
    _classCallCheck(this, Servers);

    var _this = _possibleConstructorReturn(this, (Servers.__proto__ || Object.getPrototypeOf(Servers)).call(this, props));

    _this.state = { servers: [] };
    _this.startOnServer = _this.startOnServer.bind(_this);
    return _this;
  }

  _createClass(Servers, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      https.get('https://rvcv9mh5l1.execute-api.us-east-1.amazonaws.com/test/pets', function (res) {
        res.on('data', function (d) {
          var response = JSON.parse(d);
          if (process.env.NODE_ENV == 'development') {
            response.Items.push({
              activePlayers: { S: "0" },
              serverId: { S: "local" },
              serverIp: { S: "ws://localhost:18181" }
            });
          }
          if (response.Items) {
            _this2.setState({ servers: response.Items });
          }
        });
      }).on('error', function (e) {
        console.error(e);
      });
    }
  }, {
    key: 'startOnServer',
    value: function startOnServer(event) {
      connectToServer(event.target.id);
      this.props.startGame();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var servers = [];
      this.state.servers.forEach(function (server) {
        if (server.serverId && server.serverId.S && server.activePlayers && server.activePlayers.S && server.serverIp && server.serverIp.S) {
          servers.push(React.createElement(
            'div',
            { className: 'server', key: server.serverId.S },
            React.createElement(
              'div',
              { className: 'name' },
              server.serverId.S
            ),
            React.createElement(
              'div',
              { className: 'activePlayers' },
              server.activePlayers.S
            ),
            React.createElement(
              'div',
              { className: 'join', onClick: _this3.startOnServer, id: server.serverIp.S },
              'Join'
            )
          ));
        } else {
          console.error("error parsing the server listing response");
        }
      });

      var serverList;
      if (servers.length > 0) {
        serverList = React.createElement(
          'div',
          { id: 'server-list' },
          React.createElement(
            'div',
            { id: 'server-list-header' },
            React.createElement(
              'div',
              null,
              'Name'
            ),
            React.createElement(
              'div',
              { id: 'player-count' },
              'Players'
            )
          ),
          servers
        );
      } else {
        serverList = React.createElement(
          'div',
          null,
          'loading'
        );
      }

      return React.createElement(
        'div',
        { className: 'centered' },
        serverList,
        React.createElement(
          'div',
          { className: 'button', onClick: this.props.mainMenu },
          'back'
        )
      );
    }
  }]);

  return Servers;
}(React.Component);

export default Servers;