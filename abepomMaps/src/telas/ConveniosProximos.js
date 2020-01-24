import React, {Component} from 'react';
import {AppState, Text} from 'react-native';

class AppStateExample extends Component {
  state = {
    appState: AppState.currentState,
  };

  componentDidMount() {
    console.log(this._handleAppStateChange);
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    console.log(this._handleAppStateChange);

    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }
    this.setState({appState: nextAppState});
  };

  render() {
    return <Text>Current state is: {this.state.appState}</Text>;
  }
}
export default AppStateExample;
