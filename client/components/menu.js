var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

import Title from './title';

var Menu = function (_React$Component) {
  _inherits(Menu, _React$Component);

  function Menu(props) {
    _classCallCheck(this, Menu);

    var _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, props));

    _this.state = { page: "main" };
    _this.showControls = _this.showControls.bind(_this);
    _this.showMobileControls = _this.showMobileControls.bind(_this);
    _this.showDesktopControls = _this.showDesktopControls.bind(_this);
    return _this;
  }

  _createClass(Menu, [{
    key: 'showControls',
    value: function showControls() {
      this.setState({ page: "controls" });
    }
  }, {
    key: 'showMobileControls',
    value: function showMobileControls() {
      this.setState({ page: "mobile-controls" });
    }
  }, {
    key: 'showDesktopControls',
    value: function showDesktopControls() {
      this.setState({ page: "desktop-controls" });
    }
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
            { className: 'button', id: 'play' },
            'loading'
          ),
          React.createElement(
            'div',
            { className: 'button', onClick: this.showControls },
            'controls'
          )
        );
      } else if (this.state.page == "controls") {
        return React.createElement(
          'div',
          { className: 'centered' },
          React.createElement(Title, { title: 'controls' }),
          React.createElement(
            'div',
            { className: 'button', onClick: this.showMobileControls },
            'mobile'
          ),
          React.createElement(
            'div',
            { className: 'button', onClick: this.showDesktopControls },
            'mouse + keyboard'
          )
        );
      } else if (this.state.page == "mobile-controls") {
        return React.createElement(
          'div',
          { id: 'controls' },
          React.createElement(
            'p',
            null,
            'Mobile controls:'
          ),
          React.createElement(
            'ul',
            null,
            React.createElement(
              'li',
              null,
              'Move - Touch movement on left side of screen'
            ),
            React.createElement(
              'li',
              null,
              'Move Camera - Touch movement on right side of screen'
            ),
            React.createElement(
              'li',
              null,
              'Draw and Release Arrow - Target button (hold -> release)'
            ),
            React.createElement(
              'li',
              null,
              'Draw and Release Grapple - Grapple button (hold -> release)'
            ),
            React.createElement(
              'li',
              null,
              'Jump - Green bar on bottom-right of screen'
            ),
            React.createElement(
              'li',
              null,
              'For the best experience, keep your phone in landscape mode, fullscreen (which doesn\'t work on iPhone, don\'t blame me! blame Apple)'
            )
          ),
          React.createElement(
            'p',
            null,
            'refresh this page to play :P'
          )
        );
      } else if (this.state.page == "desktop-controls") {
        return React.createElement(
          'div',
          { id: 'controls' },
          React.createElement(
            'p',
            null,
            'Mouse + keyboard:'
          ),
          React.createElement(
            'ul',
            null,
            React.createElement(
              'li',
              null,
              'Mouse - move camera'
            ),
            React.createElement(
              'li',
              null,
              'Left click (hold -> release) - draw and release arrow'
            ),
            React.createElement(
              'li',
              null,
              'Right click (hold -> release) - draw and release grapple'
            ),
            React.createElement(
              'li',
              null,
              'WASD - move'
            ),
            React.createElement(
              'li',
              null,
              'Space - jump'
            ),
            React.createElement(
              'li',
              null,
              'Shift - sprint'
            )
          ),
          React.createElement(
            'p',
            null,
            'refresh this page to play :P'
          )
        );
      }
    }
  }]);

  return Menu;
}(React.Component);

export default Menu;