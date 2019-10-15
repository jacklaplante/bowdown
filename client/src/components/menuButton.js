import React from 'react'

class MenuButton extends React.Component {
  render() {
    return (
      <div className="button" id="play">{this.props.action}</div>
    );
  }
}

export default MenuButton