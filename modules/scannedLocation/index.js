import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker, Platform, Button} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Confirmation, Spinner, Empty, ImageUpload, GooglePlacesAutoComplete, DateTime } from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import {NavigationActions} from 'react-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { Dimensions } from 'react-native';

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);
class ScannedLocation extends Component{
  constructor(props){
    super(props);
    this.state = {
      errorMessage:null,
      showConfirmation:false,
      flag:null,
    }
  }

  componentDidMount(){
    const { scannedLocation } = this.props.state;
    console.log('scannedLocation', scannedLocation)
  }

  redirect = (route) => {
    this.props.navigation.navigate(route)
  }

  submitEmployeeCheckin=()=>{
    this.props.setDeclaration({format:`employee_checkin`, id:null})
    this.onSubmit()
  }

  submitEmployeeCheckout=()=>{
    this.props.setDeclaration({format:`employee_checkout`, id:null})
    this.onSubmit()
  }

  submitCustomerDeclaration=()=>{
    this.props.setDeclaration({format:`customer`, id:null})
    this.onSubmit()
  }

  onSubmit=()=>
  {
   
   this.redirect('declarationStack')
  }

  onCancel = () => {
    this.setState({
      showConfirmation: false,
      errorMessage: null
    })
  }
  
  createLocationSubmit = () => {
    const {user, scannedLocation } = this.props.state;
    
    if(user==null){
      this.setState({errorMessage: 'Invalid Account.'})
      return
    }
    var moment = require('moment');
    let parameter = {
      account_id: user.id,
      longitude: scannedLocation.longitude,
      latitude: scannedLocation.latitude,
      route: scannedLocation.route,
      region: scannedLocation.region,
      country: scannedLocation.country,
      locality: scannedLocation.locality,
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HH:mm')
    }
    this.setState({isLoading: true})
    Api.request(Routes.visitedPlacesCreate, parameter, response => {
      console.log(response)
      this.setState({isLoading: false})
      if(response.data > 0){
        console.log("added loc")
        alert("Successfully added Location to your Visited Places!")
        this.setState({showConfirmation:false});
      }
    }, error => {
      console.log(error)
    });
  }

  _locationInfo=()=>{
    const {scannedLocation}=this.props.state
    return(
    <View
    style={[{
      paddingTop: 50,
      paddingBottom: 50,
      alignItems:'center',
      justifyContent:'center'
    }]}>
      <Text style={{
        fontWeight: 'bold'
      }}>
        {
          scannedLocation.route + ', ' + scannedLocation.locality + ', ' + scannedLocation.country
        }
      </Text>
      <Text style={{
        color: Color.gray
      }}>
        {
          scannedLocation.longitude + '/' + scannedLocation.latitude
        }
      </Text>
      <Text>({scannedLocation.code ? scannedLocation.code : "N/A"})</Text>
    </View>
    )
  }

  onContinue = () => {
    this.createLocationSubmit();
  }

  _options = () => {
    const { user } = this.props.state;
    return(
      <View
      style={[{
        paddingLeft:15,
        paddingRight:15,
      }]}>

        <Text style={{
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 10,
          paddingRight: 10,
          textAlign: 'center'
        }}>
          {
            'Hi ' + user.username + '! Please choose the options below:'
          }
        </Text>

        <TouchableHighlight style={{
          height: 50,
          backgroundColor: Color.primary,
          width: '100%',
          marginBottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
          marginLeft: '1%'
        }}
        onPress={() => {this.setState({showConfirmation:true})}}
        underlayColor={Color.gray}
          >
          <Text style={{
            color: Color.white,
            textAlign: 'center',
          }}>Add to visited places</Text>
        </TouchableHighlight>

        <TouchableHighlight style={{
          height: 50,
          backgroundColor: Color.primary,
          width: '100%',
          marginBottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
          marginLeft: '1%'
        }}
        onPress={() => {this.submitCustomerDeclaration()}}
        underlayColor={Color.gray}
          >
          <Text style={{
            color: Color.white,
            textAlign: 'center',
          }}>Health Declaration For Customer</Text>
        </TouchableHighlight>

        <TouchableHighlight style={{
          height: 50,
          backgroundColor: Color.primary,
          width: '100%',
          marginBottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
          marginLeft: '1%'
        }}
        onPress={() => {this.submitEmployeeCheckin()}}
        underlayColor={Color.gray}
          >
          <Text style={{
            color: Color.white,
            textAlign: 'center',
          }}>Health Declaration For Employee Check-in</Text>
        </TouchableHighlight>

        <TouchableHighlight style={{
          height: 50,
          backgroundColor: Color.primary,
          width: '100%',
          marginBottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
          marginLeft: '1%'
        }}
        onPress={() => {this.submitEmployeeCheckout()}}
        underlayColor={Color.gray}
          >
          <Text style={{
            color: Color.white,
            textAlign: 'center',
          }}>Health Declaration For Employee Check-out</Text>
        </TouchableHighlight>
      </View>
    )}
  
  render() {
  const {scannedLocation}=this.props.state
    return (
      <View>
     {(this.props.state.scannedLocation)&&(this._locationInfo())}
     {this._options()}
     {
          this.state.showConfirmation && (
            <Confirmation
              visible={this.state.showConfirmation}
              onCancel={() => this.onCancel()}
              onContinue={() =>this.onContinue()}
              message={null}
            />
          )
        }
     </View>
    )
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setDeclaration: (declaration) => dispatch(actions.setDeclaration(declaration)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScannedLocation);