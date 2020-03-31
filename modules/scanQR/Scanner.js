import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, Modal, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker,StyleSheet,TouchableOpacity,Linking,AppRegistry} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner,GooglePlacesAutoComplete} from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle ,faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Button from "react-native-button";
import { Formik } from 'formik'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as yup from 'yup'
const height = Math.round(Dimensions.get('window').height);

class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  retrieveUserInfo = (username) => {
    let parameter = {
      condition: [{
        value: username,
        clause: '=',
        column: 'username'
      }]
    }
    this.setState({
      isLoading: true
    })
    Api.request(Routes.accountRetrieve, parameter, response => {
      this.setState({isLoading: false})
      const { setScannedUser } = this.props;
      if(response.data.length > 0){
        console.log(response)
        setScannedUser(response.data[0])
        this.props.close(response.data[0])
      }else{
        setScannedUser(null)
        this.props.close(null)
      }
    });
  }

  onSuccess = (e) => {
    this.retrieveUserInfo(e.data)
  }

  _modal = () => {
    const { user } = this.props.state;
    return (
      <View style={{
        backgroundColor: Color.secondary
      }}>
        <Modal isVisible={this.props.visible} style={{
          padding: 0,
          margin: 0,
          position: 'relative'
        }}>
          <QRCodeScanner
            ref={(node) => { this.scanner = node }}
            onRead={this.onSuccess.bind(this)}
            reactivateTimeout={1000}
            style={{
              height: height
            }}
          />

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
          <View style={{
            width: '100%',
            position: 'absolute',
            bottom: 50,
            left: 0
          }}>
            <Text style={{
              textAlign: 'center'
            }}>Scanning QR Code...</Text>
          </View>
        </Modal>
      </View>
    );
  }

  render() {
    return (
      <View style={Style.MainContainer}>
        {this._modal()}
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setScannedUser: (scannedUser) => dispatch(actions.setScannedUser(scannedUser))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  
)(Scanner);
