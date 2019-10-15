import React from 'react'

import Title from './title'
import MenuButton from './menuButton'


class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {state: props.state};
  }

  render() {
    return (
      <div>
        <Title />
        <MenuButton action='loading' />
      </div>
    )
  }
}

export default Menu