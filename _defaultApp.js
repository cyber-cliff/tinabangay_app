import React from 'react';
import { View } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '@redux';
import AppNavigation from 'navigation';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { Helper } from 'common';
import { Tutorial } from 'components';
const AppContainer = createAppContainer(AppNavigation);

function ReduxNavigation (props) {
  return <AppContainer />
}

const mapStateToProps = state => ({ state: state })
let AppReduxNavigation = connect(mapStateToProps)(ReduxNavigation)
const store = createStore(rootReducer);

export default class App extends React.Component{
  constructor(props) {
    super(props);
  
    this.state = {
      tutorial: false
    };
  }

  componentDidMount(){
    this.checkTutorial();
  }

  checkTutorial = async () => {
    try {
      const flag = await AsyncStorage.getItem(Helper.APP_NAME + 'tutorial');
      console.log('flag', flag)
      if(flag != null) {
        this.setState({tutorial: true})
      }
    } catch(e) {
      console.log(e)
    }
  }
  
  storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(`${Helper.APP_NAME}${key}`, value)
    } catch (e) {
      console.log(e)
    }
  }

  onFinish = () => {
    this.storeData('tutorial', 'done');
    this.setState({tutorial: true})
  }

  onSkip = () => {
    console.log('onSkip')
  }

  render() {
    const { tutorial } = this.state;
    console.ignoredYellowBox = ['Warning: Each'];
    return (
      <Provider store={store}>
        <View style={{
            flex: 1,
            backgroundColor: '#ffffff'
          }}>
          {
            tutorial == true && (
              <AppReduxNavigation />
            )
          }
          {
            tutorial == false && (
              <Tutorial onFinish={() => this.onFinish()} onSkip={() => this.onSkip()}/>
            )
          }
         
        </View>
      </Provider>
    );
  }
}