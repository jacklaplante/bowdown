var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import ReactDOM from 'react-dom';

import Menu from './menu';
import '../src/main.css';

// import('../audio/Menu_Theme.mp3').then(function(song) {
//     song = new Audio(song.default);
//     song.addEventListener("load", function() {
//         song.play();
//     }, true);
//     song.autoplay=true
//     song.loop=true
//     document.body.appendChild(song)
//     song.load()
// })

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'root', className: 'loading' },
        React.createElement('link', { href: 'https://fonts.googleapis.com/css?family=Rubik+Mono+One&display=swap', rel: 'stylesheet' }),
        React.createElement(
          'div',
          { id: 'menu-button' },
          React.createElement(
            'svg',
            { version: '1.1', id: 'Capa_1', xmlns: 'http://www.w3.org/2000/svg', x: '0px', y: '0px', viewBox: '0 0 92.833 92.833', style: { enableBackground: 'new 0 0 92.833 92.833', style: "fill:#010002" } },
            React.createElement(
              'g',
              null,
              React.createElement('path', { d: 'M89.834,1.75H3c-1.654,0-3,1.346-3,3v13.334c0,1.654,1.346,3,3,3h86.833c1.653,0,3-1.346,3-3V4.75 C92.834,3.096,91.488,1.75,89.834,1.75z' }),
              React.createElement('path', { d: 'M89.834,36.75H3c-1.654,0-3,1.346-3,3v13.334c0,1.654,1.346,3,3,3h86.833c1.653,0,3-1.346,3-3V39.75 C92.834,38.096,91.488,36.75,89.834,36.75z' }),
              React.createElement('path', { d: 'M89.834,71.75H3c-1.654,0-3,1.346-3,3v13.334c0,1.654,1.346,3,3,3h86.833c1.653,0,3-1.346,3-3V74.75 C92.834,73.095,91.488,71.75,89.834,71.75z' })
            )
          )
        ),
        React.createElement(
          'div',
          { id: 'fullscreen' },
          React.createElement(
            'svg',
            { version: '1.1', id: 'Capa_1', xmlns: 'http://www.w3.org/2000/svg', x: '0px', y: '0px', viewBox: '0 0 298.667 298.667', style: { enableBackground: 'new 0 0 298.667 298.667', fill: '#ffdba5' } },
            React.createElement(
              'g',
              null,
              React.createElement('polygon', { points: '42.667,192 0,192 0,298.667 106.667,298.667 106.667,256 42.667,256' }),
              React.createElement('polygon', { points: '0,106.667 42.667,106.667 42.667,42.667 106.667,42.667 106.667,0 0,0' }),
              React.createElement('polygon', { points: '192,0 192,42.667 256,42.667 256,106.667 298.667,106.667 298.667,0' }),
              React.createElement('polygon', { points: '256,256 192,256 192,298.667 298.667,298.667 298.667,192 256,192' })
            )
          )
        ),
        React.createElement(Menu, null),
        React.createElement(
          'div',
          { id: 'crosshair' },
          React.createElement(
            'svg',
            { version: '1.1', id: 'Capa_1', x: '0px', y: '0px', viewBox: '0 0 404.456 404.456', style: { enableBackground: 'new 0 0 404.456 404.456', fill: 'aliceblue' } },
            React.createElement(
              'g',
              null,
              React.createElement('circle', { cx: '202.224', cy: '202.228', r: '26.686' }),
              React.createElement('path', { d: 'M83.807,49.322L50.87,4.891c-9.519-9.527-30.71-3.78-40.236,5.747S-4.64,41.347,4.887,50.874 l44.431,32.937c9.519,9.519,24.963,9.527,34.49,0C93.334,74.284,93.326,58.84,83.807,49.322z' }),
              React.createElement('path', { d: 'M393.823,10.638c-9.527-9.527-30.71-15.274-40.236-5.747l-32.937,44.431 c-9.527,9.527-9.527,24.963,0,34.49c9.527,9.527,24.963,9.519,34.49,0l44.431-32.937 C409.096,41.347,403.349,20.164,393.823,10.638z' }),
              React.createElement('path', { d: 'M355.139,320.645c-9.527-9.527-24.963-9.527-34.49,0c-9.527,9.527-9.527,24.963,0,34.49 l32.937,44.431c9.527,9.519,30.71,3.78,40.236-5.747s15.274-30.71,5.747-40.236L355.139,320.645z' }),
              React.createElement('path', { d: 'M49.318,320.645L4.887,353.582c-9.527,9.527-3.78,30.71,5.747,40.236s30.71,15.274,40.236,5.747 l32.937-44.431c9.527-9.519,9.527-24.963,0-34.49C74.28,311.127,58.844,311.127,49.318,320.645z' })
            )
          )
        ),
        React.createElement(
          'div',
          { id: 'shoot-button' },
          React.createElement(
            'svg',
            { version: '1.1', id: 'Capa_1', xmlns: 'http://www.w3.org/2000/svg', x: '0px', y: '0px', viewBox: '0 0 438.533 438.533', style: { enableBackground: 'new 0 0 438.533 438.533', fill: '#010002' } },
            React.createElement(
              'g',
              null,
              React.createElement(
                'g',
                null,
                React.createElement('path', { d: 'M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0 c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267 c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407 s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062 C438.533,179.485,428.732,142.795,409.133,109.203z M353.742,297.208c-13.894,23.791-32.736,42.633-56.527,56.534 c-23.791,13.894-49.771,20.834-77.945,20.834c-28.167,0-54.149-6.94-77.943-20.834c-23.791-13.901-42.633-32.743-56.527-56.534 c-13.897-23.791-20.843-49.772-20.843-77.941c0-28.171,6.949-54.152,20.843-77.943c13.891-23.791,32.738-42.637,56.527-56.53 c23.791-13.895,49.772-20.84,77.943-20.84c28.173,0,54.154,6.945,77.945,20.84c23.791,13.894,42.634,32.739,56.527,56.53 c13.895,23.791,20.838,49.772,20.838,77.943C374.58,247.436,367.637,273.417,353.742,297.208z' }),
                React.createElement('path', { d: 'M219.27,146.178c-20.177,0-37.401,7.139-51.678,21.411c-14.272,14.277-21.411,31.501-21.411,51.678 c0,20.175,7.135,37.402,21.411,51.673c14.277,14.277,31.504,21.416,51.678,21.416c20.179,0,37.406-7.139,51.676-21.416 c14.274-14.271,21.413-31.498,21.413-51.673c0-20.177-7.139-37.401-21.413-51.678C256.676,153.316,239.449,146.178,219.27,146.178 z' })
              )
            )
          )
        ),
        React.createElement(
          'div',
          { id: 'rope-button' },
          React.createElement(
            'svg',
            { viewBox: '-106 0 512 512', xmlns: 'http://www.w3.org/2000/svg' },
            React.createElement('path', { style: { fill: "fill:#010002" }, x: '0px', y: '0px', d: 'm285 391c-20.03125 0-38.867188-7.800781-53.03125-21.96875-11.28125-11.277344-18.507812-25.523438-20.992188-40.972656 16.949219-6.457032 29.023438-22.871094 29.023438-42.058594 0-11.515625-4.355469-22.03125-11.496094-30 7.144532-7.96875 11.496094-18.484375 11.496094-30 0-16.863281-9.328125-31.582031-23.09375-39.285156l12.632812-37.898438c24.320313-72.960937-29.953124-148.816406-106.539062-148.816406-76.59375 0-130.855469 75.863281-106.539062 148.816406l11.808593 35.421875c-16.550781 6.65625-28.269531 22.859375-28.269531 41.761719 0 11.515625 4.355469 22.03125 11.496094 30-7.140625 7.96875-11.496094 18.484375-11.496094 30 0 13.09375 5.621094 24.890625 14.578125 33.121094-9.324219 25.550781-14.578125 51.21875-14.578125 71.878906 0 66.71875 53.832031 121 120 121 36.488281 0 71.488281-17.644531 94.328125-46.808594 21.804687 10.347656 45.820313 15.808594 70.671875 15.808594h15v-90zm-138.722656 14.414062c-5.203125 9.410157-15.246094 15.585938-26.277344 15.585938-16.542969 0-30-13.457031-30-30 0-15.910156 6.644531-38.742188 17.234375-60h13.445313c2.394531 26.738281 11.171874 52.136719 25.597656 74.414062zm-101.277344-104.414062c-8.269531 0-15-6.730469-15-15s6.730469-15 15-15h150c8.269531 0 15 6.730469 15 15s-6.730469 15-15 15zm-15-75c0-8.269531 6.730469-15 15-15h150c8.269531 0 15 6.730469 15 15s-6.730469 15-15 15h-150c-8.269531 0-15-6.730469-15-15zm71.839844-105.660156c-4.820313-14.441406 5.90625-29.339844 21.160156-29.339844 15.214844 0 25.992188 14.867188 21.160156 29.359375l-20.214844 60.640625h-1.914062zm21.160156-90.339844c56.140625 0 95.894531 55.875 78.078125 109.328125l-13.890625 41.671875h-31.617188l17.050782-51.15625c11.316406-33.941406-14.011719-68.84375-49.621094-68.84375-35.632812 0-60.929688 34.9375-49.621094 68.824219l17.035156 51.175781h-31.601562l-13.890625-41.671875c-17.828125-53.484375 21.964844-109.328125 78.078125-109.328125zm-3 452c-49.625 0-90-40.820312-90-91 0-16.644531 4.496094-38.640625 12.230469-60.292969.917969.054688 1.839843.09375 2.769531.09375h29.277344c-7.949219 18.914063-14.277344 41.042969-14.277344 60.199219 0 33.085938 26.914062 60 60 60 17.851562 0 34.417969-8.074219 45.605469-21.113281.894531.9375 1.800781 1.867187 2.71875 2.785156 6.253906 6.253906 12.929687 11.933594 19.949219 17.035156-17.1875 20.195313-42.261719 32.292969-68.273438 32.292969zm150-31.816406c-30.386719-3.339844-58.53125-16.796875-80.460938-38.722656-21.925781-21.929688-35.371093-50.074219-38.710937-80.460938h30.234375c3.179688 22.355469 13.441406 42.996094 29.691406 59.246094 16.253906 16.25 36.890625 26.519531 59.25 29.699218zm0 0' })
          )
        ),
        React.createElement('div', { id: 'jump-button' }),
        React.createElement(
          'div',
          { id: 'chat' },
          React.createElement(
            'svg',
            { viewBox: '-21 -47 682.66669 682', xmlns: 'http://www.w3.org/2000/svg' },
            React.createElement('path', { d: 'm552.011719-1.332031h-464.023438c-48.515625 0-87.988281 39.464843-87.988281 87.988281v283.972656c0 48.414063 39.300781 87.816406 87.675781 87.988282v128.863281l185.191407-128.863281h279.144531c48.515625 0 87.988281-39.472657 87.988281-87.988282v-283.972656c0-48.523438-39.472656-87.988281-87.988281-87.988281zm50.488281 371.960937c0 27.835938-22.648438 50.488282-50.488281 50.488282h-290.910157l-135.925781 94.585937v-94.585937h-37.1875c-27.839843 0-50.488281-22.652344-50.488281-50.488282v-283.972656c0-27.84375 22.648438-50.488281 50.488281-50.488281h464.023438c27.839843 0 50.488281 22.644531 50.488281 50.488281zm0 0' }),
            React.createElement('path', { d: 'm171.292969 131.171875h297.414062v37.5h-297.414062zm0 0' }),
            React.createElement('path', { d: 'm171.292969 211.171875h297.414062v37.5h-297.414062zm0 0' }),
            React.createElement('path', { d: 'm171.292969 291.171875h297.414062v37.5h-297.414062zm0 0' })
          ),
          React.createElement('input', { id: 'chat-text-box', type: 'text' })
        ),
        React.createElement('div', { id: 'fps' }),
        React.createElement(
          'div',
          { id: 'game-info' },
          React.createElement('div', { id: 'kill-count' }),
          React.createElement('div', { id: 'bow-king' })
        )
      );
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));

// full screen button
var fullScreenButton = document.getElementById("fullscreen");
if (document.body.requestFullscreen || document.body.mozRequestFullScreen || document.body.webkitRequestFullscreen || document.body.msRequestFullscreen) {
  fullScreenButton.setAttribute("style", "display: block");
  fullScreenButton.onclick = function () {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    } else if (document.body.mozRequestFullScreen) {
      /* Firefox */
      document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      document.body.webkitRequestFullscreen();
    } else if (document.body.msRequestFullscreen) {
      /* IE/Edge */
      document.body.msRequestFullscreen();
    }
    if (screen.orientation.type && !screen.orientation.type.includes("landscape")) {
      screen.orientation.lock("landscape").catch(function (error) {
        console.log("device orientation cannot be locked to landscape");
      });;
    }
  };
}