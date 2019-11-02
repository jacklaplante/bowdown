import _regeneratorRuntime from 'babel-runtime/regenerator';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

import Title from './title';
import Controls from './controls';
import Servers from './servers';

var Menu = function (_React$Component) {
  _inherits(Menu, _React$Component);

  function Menu(props) {
    _classCallCheck(this, Menu);

    var _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, props));

    _this.state = {
      page: "main",
      readyToRock: false
    };
    _this.showControls = _this.showControls.bind(_this);
    _this.listServers = _this.listServers.bind(_this);
    _this.mainPage = _this.mainPage.bind(_this);
    return _this;
  }

  _createClass(Menu, [{
    key: 'mainPage',
    value: function mainPage() {
      this.setState({ page: "main" });
    }
  }, {
    key: 'showControls',
    value: function showControls() {
      this.setState({ page: "controls" });
    }
  }, {
    key: 'listServers',
    value: function listServers() {
      this.setState({ page: "servers" });
    }
  }, {
    key: 'componentDidMount',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var game, startButton;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return import( /* webpackChunkName: "game" */'../src/game');

              case 2:
                game = _context.sent;

                document.body.classList.remove("loading");
                document.body.classList.add("ready");
                startButton = document.querySelector("#play.button");

                this.setState({
                  readyToRock: true,
                  startGame: function startGame() {
                    if (typeof document.body.requestPointerLock == "function") {
                      document.body.requestPointerLock();
                    }
                    document.getElementsByTagName("audio")[0].pause();
                    game.start();
                  }
                });

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentDidMount() {
        return _ref.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: 'render',
    value: function render() {
      if (this.state.page == "main") {
        return React.createElement(
          'div',
          { className: 'centered' },
          React.createElement(Title, { title: 'bowdown' }),
          React.createElement(
            'div',
            { className: 'button', onClick: this.state.startGame, id: 'play' },
            this.state.readyToRock ? 'start' : 'loading'
          ),
          React.createElement(
            'div',
            { className: 'button', onClick: this.listServers },
            'servers'
          ),
          React.createElement(
            'div',
            { className: 'button', onClick: this.showControls },
            'controls'
          )
        );
      } else if (this.state.page == "servers") {
        return React.createElement(Servers, { mainMenu: this.mainPage });
      } else if (this.state.page == "controls") {
        return React.createElement(Controls, { mainMenu: this.mainPage });
      }
    }
  }]);

  return Menu;
}(React.Component);

export default Menu;