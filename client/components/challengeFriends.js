var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

import { connectToServer } from '../src/websocket';

var ChallengeFriends = function (_React$Component) {
  _inherits(ChallengeFriends, _React$Component);

  function ChallengeFriends(props) {
    _classCallCheck(this, ChallengeFriends);

    var _this = _possibleConstructorReturn(this, (ChallengeFriends.__proto__ || Object.getPrototypeOf(ChallengeFriends)).call(this, props));

    _this.state = { gameName: '' };
    _this.startOnServer = _this.startOnServer.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(ChallengeFriends, [{
    key: 'handleChange',
    value: function handleChange(event) {
      var name = event.target.value.replace(/[^a-z]/gi, '').toLowerCase();
      this.setState({ gameName: name });
    }
  }, {
    key: 'startOnServer',
    value: function startOnServer(event) {
      if (this.state.gameName) {
        // MAKE SURE THE URL ENDS WITH A / 
        connectToServer("wss://virginia.bowdown.io:18181/" + this.state.gameName);
        document.getElementById("challenge-friends-form").remove();
        this.props.startGame();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'centered' },
        React.createElement(
          'div',
          { id: 'challenge-friends-form' },
          React.createElement(
            'p',
            null,
            'Type the name of the lobby that you want to create or join'
          ),
          React.createElement('input', { type: 'text', value: this.state.gameName, onChange: this.handleChange }),
          React.createElement(
            'p',
            { className: 'join', onClick: this.startOnServer },
            'Join!'
          ),
          React.createElement(
            'p',
            { className: 'share-url' },
            this.state.gameName ? "Tell your friends to join: " + this.state.gameName : ''
          )
        )
      );
    }
  }]);

  return ChallengeFriends;
}(React.Component);

export default ChallengeFriends;