import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker, Platform} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, Empty, Confirmation, GooglePlacesAutoCompleteWithMap } from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
const height = Math.round(Dimensions.get('window').height);
class Location extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      newFlag: false,
      selected: null,
      location: null,
      errorMessage: null,
      showConfirmation: false
    }
  }

  componentDidMount(){
    this.retrieve()
  }

  manageLocation = (location) => {
    this.setState({
      location: location
    })
  }

  retrieve = () => {
    const { user } = this.props.state;
    if(user === null){
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'account_id'
      }],
      sort: {
        updated_at: 'desc'
      }
    }
    this.setState({
      isLoading: true
    })
    Api.request(Routes.locationRetrieve, parameter, response => {
      const { setAllLocation } = this.props;
      this.setState({isLoading: false})
      if(response.data.length > 0){
        setAllLocation(response.data)
      }else{
        setAllLocation(null)
      }
    }, error => {
      console.log(error)
    });
  }

  updateData = () => {
    if(this.state.selected == null){
      return
    }
    const { setLocation } = this.props;
    setLocation(this.state.selected)
    this.setState({
      showConfirmation: false
    })
  }

  submit = () => {
    const { user } = this.props.state;
    const { location } = this.state;
    if(user == null){
      this.setState({errorMessage: 'Invalid Account.'})
      return
    }
    if(location == null || (location != null && location.route == null)){
      this.setState({errorMessage: 'Location is required.'})
      return
    }
    this.setState({errorMessage: null})
    let parameter = {
      account_id: user.id,
      longitude: location.longitude,
      latitude: location.latitude,
      route: location.route,
      region: location.region,
      country: location.country,
      locality: location.locality,
    }
    this.setState({isLoading: true})
    Api.request(Routes.locationCreate, parameter, response => {
      console.log(response)
      this.setState({isLoading: false})
      if(response.data > 0){
        this.setState({
          newFlag: false,
          type: null,
          model: null,
          number: null
        })
        this.retrieve()
      }
    }, error => {
      console.log(error)
    });
  }

  _new = () => {
    return (
      <View>
        {
          this.state.errorMessage != null && (
            <View>
              <Text style={{
                color: Color.danger,
                paddingTop: 10,
                paddingBottom: 10,
                textAlign: 'center'
              }}>{this.state.errorMessage}</Text>
            </View>
          )
        }

        <View style={{
          position: 'relative',
          backgroundColor: Color.white,
          zIndex: 2
        }}>
          <GooglePlacesAutoCompleteWithMap 
            onFinish={(location) => this.manageLocation(location)}
            placeholder={'Start typing location'}
            onChange={() => {}}
          />
        </View>

        <View style={{
          position: 'relative',
          zIndex: 0
        }}>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.primary,
                width: '100%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {this.submit()}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Submit</Text>
          </TouchableHighlight>
        </View>

         <View style={{
          position: 'relative',
          zIndex: 0
        }}>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.danger,
                width: '100%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {this.setState({
                newFlag: false,
                type: null,
                model: null,
                number: null
              })}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Cancel</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  _data = () => {
    const { selected } = this.state;
    const { locations, location } = this.props.state;
    return (
      <View style={{
        backgroundColor: Color.white,
        position: 'relative',
        zIndex: -1
      }}>
        <FlatList
          data={locations}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <View style={{
              borderRadius: 5,
              marginBottom: 10,
              borderColor: (location != null && item.id == location.id) ? Color.primary : Color.gray,
              borderWidth: 1,
              position: 'relative',
              zIndex: -1,
              backgroundColor: (location != null && item.id == location.id) ? Color.primary : '#fff'
            }}>
              <TouchableHighlight
                onPress={() => {this.setState({
                  showConfirmation: true,
                  selected: item
                })}}
                underlayColor={Color.gray}
                >
                <View style={Style.TextContainer}>
                  <View style={{
                    flexDirection: 'row'
                  }}>
                    {
                      (item.route != 'xx' && item.locality != 'xx') && (
                        <Text
                          style={[BasicStyles.titleText, {
                            paddingTop: 10,
                            fontWeight: 'bold',
                            color: (location != null && item.id == location.id) ? Color.white : Color.primary
                          }]}>
                          {item.route + ', ' + item.locality + ', ' + item.country}
                        </Text>
                      )
                    }
                    {
                      (item.route == 'xx' && item.locality == 'xx') && (
                        <Text
                          style={[BasicStyles.titleText, {
                            paddingTop: 10,
                            fontWeight: 'bold',
                            color: (location != null && item.id == location.id) ? Color.white : Color.primary
                          }]}>
                          Custom Location
                        </Text>
                      )
                    }
                  </View>
                  <Text
                    style={[BasicStyles.normalText, {
                      color: (location != null && item.id == location.id) ? Color.white : Color.darkGray,
                      paddingBottom: 10
                    }]}>
                    {item.longitude + '/' + item.latitude}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }

  render() {
    const { user } = this.props.state;
    const { locations } = this.props.state;
    const { isLoading, newFlag } = this.state;
    return (
      <ScrollView
        style={Style.ScrollView}
        onScroll={(event) => {
          if(event.nativeEvent.contentOffset.y <= 0) {
            if(this.state.isLoading == false){
              this.retrieve()
            }
          }
        }}
        >
        {isLoading ? <Spinner mode="overlay"/> : null }
        {
          newFlag == false && (
            <TouchableHighlight
              style={[BasicStyles.btn, {
                backgroundColor: Color.primary,
                width: '100%',
                marginTop: 20
              }]}
              onPress={() => {
                this.setState({newFlag: true})
              }}
            >
              <Text style={{
                color: Color.white
              }}>Add location</Text>
            </TouchableHighlight>
          )
        }
        {
          newFlag == true && (
            this._new()
          )
        }
        {
          locations == null && (
            <Empty />
          )
        }
        {
          locations !== null && (this._data())
        }
        {
          this.state.showConfirmation && (
            <Confirmation
              visible={this.state.showConfirmation}
              onCancel={() => {
                this.setState({
                  showConfirmation: false,
                  selectedId: null
                })
              }}
              message={'Are you sure you want to set this as active location?'}
              onContinue={() => this.updateData()}
            />
          )
        }
      </ScrollView>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setAllLocation: (locations) => dispatch(actions.setAllLocation(locations)),
    setLocation: (location) => dispatch(actions.setLocation(location))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Location);
