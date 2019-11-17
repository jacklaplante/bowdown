var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

import title from '../images/title.svg';

var Title = function (_React$Component) {
  _inherits(Title, _React$Component);

  function Title() {
    _classCallCheck(this, Title);

    return _possibleConstructorReturn(this, (Title.__proto__ || Object.getPrototypeOf(Title)).apply(this, arguments));
  }

  _createClass(Title, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'title' },
        React.createElement(
          'svg',
          { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 653.5 117.5' },
          React.createElement(
            'title',
            null,
            'Asset 1'
          ),
          React.createElement(
            'g',
            { id: 'Layer_2', 'data-name': 'Layer 2' },
            React.createElement(
              'g',
              { id: 'Layer_2-2', 'data-name': 'Layer 2' },
              React.createElement('path', { d: 'M69.7,98.57C68,106.81,54.89,110.68,42.87,117.5H0L39.13,0H71.69C83.19,0,98,4.6,98,18.57L91.69,37.19c-3.84,9.38-2.42,14.17-11.07,23.23l-12.11,4.1c5.18,1,8.53,6.33,7,14.21Zm-25.5-8,6.31-19H36l-6.32,19Z' }),
              React.createElement('path', { d: 'M142.86,99c0,13.09-5.82,18.53-17.31,18.53h-34c-10.87,0-17.32-5.14-17.32-18.53l39.13-80.29C113.37,6.18,119.18,0,130.68,0h34C175.67,0,182,5.29,182,18.68Zm-26-8.38L156,27.06H139.4L100.27,90.59Z' }),
              React.createElement('path', { d: 'M277.68,56c-11.22,22.85-25.58,41.11-36.2,61.47H215.7c-2.15-4.11-4.55-9.11-6.7-14.11h-.38a102,102,0,0,1-6.69,14.11h-33c-10-16.91-4.31-37.8.5-60.59L193.79,0h26l-24.4,52.21c0,15.44-9.92,29.56-6.51,37.06h.51c2-4.27,11.2-12.85,13.86-19.62,1.48-3.74,5.78-8.62,5.78-12.74L233.47,0h26L235.09,52.21c0,15.44-9.91,29.7-6.5,37.21h.25c3.54-7.65,16.29-23,22.81-37.21L276.05,0h26Z' }),
              React.createElement('path', { d: 'M345.82,88.4c-8.77,12.88-24,29.1-35.26,29.1h-48L311.06,0h51.3c10.74,0,15.69,19.8,9.26,35.46Zm-24.66,2.19,23.2-63.53H322.67L298,90.59Z' }),
              React.createElement('path', { d: 'M426.67,90.59c-4.51,14.87-15.18,26.91-29,26.91H368.22c-10.86,0-17.31-5.14-17.31-18.53L390,18.68C390,6.18,395.85,0,407.35,0h34c11,0,17.31,5.29,17.31,18.68Zm-21.89,0,27.84-63.53H407l-30,63.53Z' }),
              React.createElement('path', { d: 'M614.38,117.5h-26l39.12-90.59H610.92L571.79,117.5h-26L584.89,0h50.8c11.5,0,17.81,5.29,17.81,19.27Z' }),
              React.createElement('polygon', { points: '63.38 42.06 69.7 23.09 55.14 23.09 48.82 42.06 63.38 42.06' }),
              React.createElement('path', { d: 'M555.64,56c-11.21,22.85-25.57,41.11-36.2,61.47H493.66c-2.14-4.11-4.55-9.11-6.69-14.11h-.38a102,102,0,0,1-6.7,14.11h-33c-10-16.91-4.32-37.8.49-60.59L471.76,0h26L473.38,52.21c0,15.44-9.92,29.56-6.5,37.06h.5c2-4.27,11.2-12.85,13.87-19.62C482.72,65.91,487,61,487,56.91L511.44,0h26L513.06,52.21c0,15.44-9.92,29.7-6.51,37.21h.26c3.53-7.65,16.28-23,22.8-37.21L554,0h26Z' })
            )
          )
        )
      );
    }
  }]);

  return Title;
}(React.Component);

export default Title;