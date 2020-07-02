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
    
  }

  redirect = (route) => {
    this.props.navigation.navigate(route)
  }

  submitEmployeeCheckin=()=>{
    this.props.setDeclaration({format:`employee_checkin`,id:null})
    this.onSubmit()
  }

  submitEmployeeCheckout=()=>{
    this.props.setDeclaration({format:`employee_checkout`,id:null})
    this.onSubmit()
  }

  submitCustomerDeclaration=()=>{
    this.props.setDeclaration({format:`customer`,id:null})
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
  
  createLocationSubmit=()=>
  {
    const {user, scannedLocation}=this.props.state;
    
    if(user==null)
    {
      this.setState({errorMessage: 'Invalid Account.'})
      return
    }

    let parameter = {
      account_id: user.id,
      longitude: scannedLocation.longitude,
      latitude: scannedLocation.latitude,
      route: scannedLocation.route,
      region: scannedLocation.region,
      country: scannedLocation.country,
      locality: scannedLocation.locality,
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
     marginTop:5,
     paddingTop:10,
     alignItems:'center',
     justifyContent:'center',
     borderRadius: 5,
     borderWidth:2,
     marginRight:15,
     marginLeft:15,
     
    }]}>
    <Text>Code: {scannedLocation.code?scannedLocation.code:"N/A"}{"\n"}{"\n"}</Text>
    <Text>Route: {scannedLocation.route?scannedLocation.route:"N/A"}{"\n"}{"\n"}</Text>
    <Text>Region: {scannedLocation.region?scannedLocation.region:"N/A"}{"\n"}{"\n"}</Text>
    <Text>Locality: {scannedLocation.locality?scannedLocation.locality:"N/A"}{"\n"}{"\n"}</Text>
    <Text>Country: {scannedLocation.country?scannedLocation.country:"N/A"}{"\n"}{"\n"}</Text>
    <Text>Latitude: {scannedLocation.latitude?scannedLocation.latitude:"N/A"}{"\n"}{"\n"}</Text>
    <Text>Longitude: {scannedLocation.longitude?scannedLocation.longitude:"N/A"}{"\n"}{"\n"}</Text>
    </View>
    )
  }

  onContinue=()=>
  {
    this.createLocationSubmit();
  }

  _options=()=>{

    return(
    <View
    style={[{
      paddingLeft:15,
      paddingRight:15,
    }]}>
    <View
    style={[{
      paddingBottom:8,
      paddingTop:20,
      
    }]}>
    <Button
    onPress={()=>this.setState({showConfirmation:true})} 
    title="Add to Visited Places"
    color="#005b96"
    style={[{
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      width:'50%',
      
    }]}
    >
    </Button>
    </View>
    
    <View style={[{
      paddingBottom:8
    }]}>
    <Button
     onPress={()=>this.submitCustomerDeclaration()} 
    title="Health Declaration for Customer"
    color="#005b96"
    style={[{
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      width:'50%'
    }]}
    >
    </Button>
    </View>
    <View style={[{
      paddingBottom:8
    }]}>
    <Button
    onPress={()=>this.submitEmployeeCheckin()} 
    title="Health Declaration for Employee Check-in"
    color="#005b96"
    style={[{
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      width:'50%'
    }]}
    >
    </Button>
    </View>
    <View style={[{
      paddingBottom:8
    }]}>
    <Button
    onPress={()=>this.submitEmployeeCheckout()} 
    title="Health Declaration for Employee Check-out"
    color="#005b96"
    style={[{
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      width:'50%'
    }]}
    >
    </Button>
    </View>

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