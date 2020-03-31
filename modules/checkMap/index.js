import React, { Component } from 'react';
import { View,StyleSheet,AppRegistry,Text} from 'react-native';
import { Routes} from 'common';
import QRCode from 'react-native-qrcode-svg';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, Marker,Callout } from 'react-native-maps';
class CheckMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      isLoading: false,
      scannedId:null,  
      errorMessage: null,
      id:'',
      latitude:''

    };
  }

  componentDidMount(){
    this.retrieve()
  }


  retrieve = () => {
    let parameter = {
      status: 'positive'
    }
    console.log('hi')
    this.setState({
      isLoading: true
    })
    Api.request(Routes.tracingPlaces, parameter, response => {
      this.setState({
        isLoading: false
      })
      
      if(response.data.length > 0){
        
        this.setState({
          data: response.data
        })
      }else{
        this.setState({
          data: []
        })
      }
    });
    
  }

  render() {
    
   const data=this.state
   
   

    return (
      <View style={styles.container}>
   <MapView
   style={styles.map}
   provider={PROVIDER_GOOGLE}
    initialRegion={{
      latitude: 10.3167,
      longitude: 123.8878,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  >
    {this.state.data.map((item,index) => 
    
    <Marker
   
      coordinate={{
        latitude:parseFloat(item.latitude),
        longitude:parseFloat(item.longitude)
      }}
      description={"hello"}
    
    >
      <Callout>
        <Text>DEATH: {item.death_size}</Text>
        <Text>POSITIVE: {item.positive_size}</Text>
        <Text>PUI: {item.pui_size}</Text>
        <Text>PUM: {item.pum_size}</Text>
        <Text>NEGATIVE: {item.negative_size}</Text>
        <Text>ROUTE: {item.route}</Text>
      </Callout>
    </Marker>
    )}



  </MapView>
         
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setPreviousRoute: (previousRoute) => dispatch(actions.setPreviousRoute(previousRoute))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  
)(CheckMap);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    paddingTop: 40,
  },
  TextInputStyle: {
    width: '100%',
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingTop: 8,
    marginTop: 10,
    paddingBottom: 8,
    backgroundColor: '#F44336',
    marginBottom: 20,
  },
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  destinationInput: {
    borderWidth: 0.5,
    borderColor: "grey",
    height: 40,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    padding: 5,
    backgroundColor: "white"
  },
  button: {
    width: 300,
    backgroundColor: '#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
},
container: {

  flex: 1,
  // justifyContent: 'center',
  // alignItems: 'center',
},
 map: {
  //     width: screen.width,
  // height: Dimensions.get('window').height,
  ...StyleSheet.absoluteFillObject,

},
});

AppRegistry.registerComponent('default', () => GenerateQR);
