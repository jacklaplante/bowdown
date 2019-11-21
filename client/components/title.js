var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

var Title = function (_React$Component) {
  _inherits(Title, _React$Component);

  function Title() {
    _classCallCheck(this, Title);

    return _possibleConstructorReturn(this, (Title.__proto__ || Object.getPrototypeOf(Title)).apply(this, arguments));
  }

  _createClass(Title, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { id: "title" },
        React.createElement(
          "svg",
          { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 806.43 117.5" },
          React.createElement(
            "title",
            null,
            "Asset 3"
          ),
          React.createElement(
            "g",
            { id: "Layer_2", "data-name": "Layer 2" },
            React.createElement(
              "g",
              { id: "Layer_2-2", "data-name": "Layer 2" },
              React.createElement("rect", { className: "cls-1", x: "68.18", y: "47.13", width: "657.23", height: "12" }),
              React.createElement("polygon", { className: "cls-2", points: "111.56 30.36 0 30.36 32.64 51.43 144.2 51.43 111.56 30.36" }),
              React.createElement("polygon", { className: "cls-3", points: "111.56 77.45 0 77.45 32.64 56.38 144.2 56.38 111.56 77.45" }),
              React.createElement("path", { className: "cls-3", d: "M806.43,53.2l-70.2,15.34a2.91,2.91,0,0,1-2.71-.84,14.7,14.7,0,0,0-15-4,13.31,13.31,0,0,0-4.74,2.71,2.9,2.9,0,0,1-4.88-2.12V42.53a2.89,2.89,0,0,1,4.77-2.21A13.23,13.23,0,0,0,718.49,43a13.87,13.87,0,0,0,14.28-4.26,3,3,0,0,1,2.84-1Z" }),
              React.createElement("path", { className: "cls-4", d: "M282.24,89.27h.51c2-4.27,11.2-12.85,13.86-19.62,1.48-3.74,5.79-8.62,5.79-12.74L304,53.3l-15.22.05C288.26,68.34,278.92,82,282.24,89.27Z" }),
              React.createElement("polygon", { className: "cls-4", points: "437.7 27.06 416 27.06 405.93 52.97 428.26 52.9 437.7 27.06" }),
              React.createElement("polygon", { className: "cls-4", points: "414.5 90.59 428.26 52.9 405.93 52.97 391.3 90.59 414.5 90.59" }),
              React.createElement("polygon", { className: "cls-4", points: "137.53 90.59 143.84 71.62 129.28 71.62 122.96 90.59 137.53 90.59" }),
              React.createElement("path", { className: "cls-4", d: "M321.92,89.42h.25c3.46-7.48,15.71-22.36,22.34-36.25l-16.1,0C328,68.27,318.58,82.08,321.92,89.42Z" }),
              React.createElement("polygon", { className: "cls-4", points: "498.11 90.59 514.75 52.62 488.18 52.7 470.27 90.59 498.11 90.59" }),
              React.createElement("polygon", { className: "cls-4", points: "249.29 27.06 232.73 27.06 216.4 53.58 232.99 53.52 249.29 27.06" }),
              React.createElement("polygon", { className: "cls-4", points: "210.16 90.59 232.99 53.52 216.4 53.58 193.61 90.59 210.16 90.59" }),
              React.createElement("polygon", { className: "cls-4", points: "525.95 27.06 500.31 27.06 488.18 52.7 514.75 52.62 525.95 27.06" }),
              React.createElement("polygon", { className: "cls-4", points: "704.25 26.91 693.4 52.04 709.98 51.99 720.81 26.91 704.25 26.91" }),
              React.createElement("path", { className: "cls-4", d: "M599.88,89.42h.26c3.53-7.64,16.25-23,22.77-37.15l-16.52,0C606.34,67.72,596.48,81.93,599.88,89.42Z" }),
              React.createElement("path", { className: "cls-4", d: "M560.21,89.27h.5c2-4.27,11.2-12.85,13.87-19.62,1.47-3.74,5.78-8.62,5.78-12.74l1.94-4.51-15.59.05C566.61,67.8,556.81,81.81,560.21,89.27Z" }),
              React.createElement("path", { className: "cls-5", d: "M93.33,117.5H136.2c12-6.82,25.15-10.69,26.83-18.93l5.84-19.84a28.15,28.15,0,0,0-6.61-25h0l-47.75.16Zm50.52-45.88-6.32,19H123l6.32-19Z" }),
              React.createElement("path", { className: "cls-5", d: "M183.69,36.21q1.8-9,3.59-17.94C187.28,4.29,176.52,0,165,0H132.46l-18,53.91,47.75-.16a34.93,34.93,0,0,0,21.43-17.54Zm-27,5.85H142.15l6.32-19H163Z" }),
              React.createElement("path", { className: "cls-5", d: "M258,0H224c-11.5,0-17.32,6.18-17.32,18.68l-17,35,26.74-.08,16.33-26.52h16.56L233,53.52l25.39-.08,16.94-34.76C275.32,5.29,269,0,258,0Z" }),
              React.createElement("path", { className: "cls-5", d: "M210.16,90.59H193.61l22.79-37-26.74.08L167.58,99c0,13.39,6.44,18.53,17.31,18.53h34c11.5,0,17.31-5.44,17.31-18.53l22.19-45.53L233,53.52Z" }),
              React.createElement("path", { className: "cls-5", d: "M328.42,52.21,352.83,0h-26L304,53.3l24.46-.08C328.41,52.88,328.42,52.55,328.42,52.21Z" }),
              React.createElement("path", { className: "cls-5", d: "M322.17,89.42h-.25c-3.34-7.34,6.07-21.15,6.49-36.2L304,53.3l-1.55,3.61c0,4.12-4.31,9-5.79,12.74C294,76.42,284.77,85,282.75,89.27h-.51c-3.32-7.32,6-20.93,6.49-35.92l-24.51.07-1.5,3.49c-4.81,22.79-10.48,43.68-.5,60.59h33A100.88,100.88,0,0,0,302,103.39h.38c2.15,5,4.55,10,6.7,14.11h25.78c10.62-20.36,25-38.62,36.2-61.47l1.29-3-27.79.09C337.88,67.06,325.63,81.94,322.17,89.42Z" }),
              React.createElement("path", { className: "cls-5", d: "M288.75,52.21,313.16,0h-26L264.22,53.42l24.51-.07C288.74,53,288.75,52.59,288.75,52.21Z" }),
              React.createElement("path", { className: "cls-5", d: "M369.39,0,345,52.21c-.15.32-.31.64-.47,1l27.79-.09L395.42,0Z" }),
              React.createElement("path", { className: "cls-5", d: "M414.5,90.59H391.3L405.92,53,382.5,53,355.9,117.5h48c11.24,0,26.48-16.22,35.26-29.1L456.5,52.81l-28.24.09Z" }),
              React.createElement("path", { className: "cls-5", d: "M455.69,0h-51.3L382.5,53,405.92,53,416,27.06h21.7L428.26,52.9l28.24-.09L465,35.46C471.38,19.8,466.43,0,455.69,0Z" }),
              React.createElement("path", { className: "cls-5", d: "M534.67,0h-34c-11.5,0-17.31,6.18-17.31,18.68L466.76,52.77l21.42-.07,12.13-25.64H526l-11.2,25.56,22.17-.07L552,18.68C552,5.29,545.67,0,534.67,0Z" }),
              React.createElement("path", { className: "cls-5", d: "M498.11,90.59H470.27L488.18,52.7l-21.42.07L444.24,99c0,13.39,6.45,18.53,17.32,18.53H491c13.85,0,24.52-12,29-26.91l16.92-38-22.17.07Z" }),
              React.createElement("polygon", { className: "cls-5", points: "639.1 117.5 665.13 117.5 693.4 52.04 660.86 52.15 639.1 117.5" }),
              React.createElement("polygon", { className: "cls-5", points: "709.98 51.99 681.68 117.5 707.71 117.5 733.83 51.91 709.98 51.99" }),
              React.createElement("path", { className: "cls-5", d: "M746.84,19.27C746.84,5.29,740.52,0,729,0h-50.8L660.86,52.15,693.4,52l10.85-25.13h16.56L710,52l23.85-.08Z" }),
              React.createElement("path", { className: "cls-5", d: "M566.71,52.21,591.12,0h-26L542.56,52.53l24.15-.08Z" }),
              React.createElement("path", { className: "cls-5", d: "M606.39,52.21,630.8,0h-26L582.3,52.4l24.09-.08Z" }),
              React.createElement("path", { className: "cls-5", d: "M647.35,0,622.94,52.21l0,.06,27.74-.09L673.38,0Z" }),
              React.createElement("path", { className: "cls-5", d: "M600.14,89.42h-.26c-3.4-7.49,6.46-21.7,6.51-37.1l-24.09.08-1.94,4.51c0,4.12-4.31,9-5.78,12.74-2.67,6.77-11.84,15.35-13.87,19.62h-.5c-3.4-7.46,6.4-21.47,6.5-36.82l-24.15.08-1.88,4.38c-4.8,22.79-10.47,43.68-.49,60.59h33a102,102,0,0,0,6.7-14.11h.38c2.15,5,4.55,10,6.7,14.11h25.77C623.4,97.14,637.76,78.88,649,56l1.68-3.85-27.74.09C616.39,66.41,603.67,81.78,600.14,89.42Z" })
            )
          )
        ),
        React.createElement(
          "p",
          { id: "kickstarter" },
          "Help fund development of the game and get exclusive content on ",
          React.createElement(
            "a",
            { href: "https://www.kickstarter.com/projects/698520615/bowdown?ref=aozya1", target: "_blank" },
            "Kickstarter!"
          )
        )
      );
    }
  }]);

  return Title;
}(React.Component);

export default Title;