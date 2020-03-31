import React, { Component } from 'react';
import { View,StyleSheet,AppRegistry,Text, Modal, TouchableOpacity} from 'react-native';
import { Routes, Color} from 'common';
import QRCode from 'react-native-qrcode-svg';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, Marker,Callout } from 'react-native-maps';
class CheckMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errorMessage: null,
      region: null
    };
  }

  _mapView = () => {
    const { data } = this.props;
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
         <MapView
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: parseFloat(data[0].latitude),
            longitude: parseFloat(data[0].longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          >
          {data.map((item, index) => (
            <Marker
              coordinate={{
                longitude: parseFloat(item.longitude),
                latitude: parseFloat(item.latitude),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              title={item.route + ', ' + item.locality + ', ' + item.country}
            />
          ))}
        </MapView>
      </View>
    );
  }
  _modal = () => {
    return (
      <View style={{
        backgroundColor: Color.secondary
      }}>
        <Modal isVisible={this.props.visible} style={{
          padding: 0,
          margin: 0,
          position: 'relative'
        }}>
          {this._mapView()}
          <View style={{
            width: 200,
            position: 'absolute',
            top: 10,
            right: 10
          }}>
            <TouchableOpacity
              onPress={() => this.props.close()} 
              style={[{
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                borderRadius: 5
              }, {
                width: '25%',
                backgroundColor: Color.danger
              }]}
              >
              <Text style={{
                color: Color.white,
                textAlign: 'center'
              }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  render() {
    const data=this.state
    return (
      <View style={styles.container}>
        {this._modal()}
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
