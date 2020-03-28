import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker, Platform} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, ImageUpload, GooglePlacesAutoComplete } from 'components';
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
class Place extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      newPlaceFlag: false,
      showDatePicker: false,
      dateLabel: null,
      dateFlag: false,
      date: new Date(),
      data: null,
      time: null,
      selected: null,
      errorMessage: null,
      location: null
    }
  }

  componentDidMount(){
    this.retrieve()
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
        route: 'asc'
      }
    }
    this.setState({
      isLoading: true, 
      showDatePicker: false
    })
    Api.request(Routes.visitedPlacesRetrieve, parameter, response => {
      console.log(response.data)
      this.setState({isLoading: false})
      if(response.data.length > 0){
        this.setState({data: response.data})
      }else{
        this.setState({data: null})
      }
    });
  }

  manageLocation = (location) => {
    this.setState({
      location: location
    })
  }

  submit = () => {
    const { user } = this.props.state;
    const { date, time, location } = this.state;
    if(user == null){
      this.setState({errorMessage: 'Invalid Account.'})
      return
    }
    if(location == null || (location != null && location.route == null)){
      this.setState({errorMessage: 'Location is required.'})
      return
    }
    if(date == null){
      this.setState({errorMessage: 'Date is required.'})
      return
    }
    if(time == null){
      this.setState({errorMessage: 'Time is required.'})
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
      date: date,
      time: time
    }
    this.setState({isLoading: true})
    Api.request(Routes.visitedPlacesCreate, parameter, response => {
      this.setState({isLoading: false})
      if(response.data > 0){
        this.setState({
          newPlaceFlag: false,
          showDatePicker: false,
          dateFlag: false,
          date: new Date(),
          dateLabel: null
        })
        this.retrieve()
      }
    });
    // this.setState({newPlaceFlag: false})
  }

  setDate = (event, date) => {
    this.setState({
      showDatePicker: false,
      dateFlag: true,
      date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      time: date.getHours() + ':' + date.getMinutes(),
      dateLabel: Currency.getMonth(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear()
    });
    console.log(this.state.date + '/' + this.state.time);
  }

  _datePicker = () => {
    const { showDatePicker, date } = this.state;
    return (
      <View>
        { (showDatePicker && Platform.OS == 'ios') && <DateTimePicker value={new Date()}
            mode={'datetime'}
            display="default"
            date={new Date()}
            onCancel={() => this.setState({showDatePicker: false})}
            onConfirm={this.setDate} 
            onChange={this.setDate} />
        }
        { (showDatePicker && Platform.OS == 'android') && <DateTimePicker value={new Date()}
            mode={'datetime'}
            display="default"
            date={new Date()}
            onCancel={() => this.setState({showDatePicker: false})}
            onConfirm={this.setDate} 
            onChange={this.setDate} />
        }
      </View>
    );
  }

  _newPlace = () => {
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
          marginTop: 20
        }}>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.warning,
                width: '100%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {this.setState({showDatePicker: true})}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>{this.state.dateFlag == false ? 'Click to add date' : this.state.dateLabel + ' ' + this.state.time}</Text>
          </TouchableHighlight>
        </View>
        <View style={{
          position: 'relative',
          backgroundColor: Color.white,
          zIndex: 2
        }}>
          <GooglePlacesAutoComplete 
            onFinish={(location) => this.manageLocation(location)}
            placeholder={'Start typing location'}
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
      </View>
    );
  }

  _places = () => {
    const { data, selected } = this.state;
    return (
      <View style={{
        backgroundColor: Color.white,
        position: 'relative',
        zIndex: -1
      }}>
        <FlatList
          data={data}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <View style={{
              borderRadius: 5,
              marginBottom: 10,
              borderColor: Color.gray,
              borderWidth: 1,
              position: 'relative',
              zIndex: -1
            }}>
              <TouchableHighlight
                onPress={() => {console.log('hello list')}}
                underlayColor={Color.gray}
                >
                <View style={Style.TextContainer}>
                  <View style={{
                    flexDirection: 'row'
                  }}>
                    <Text
                      style={[BasicStyles.titleText, {
                        paddingTop: 10,
                        fontWeight: 'bold',
                        color: Color.primary
                      }]}>
                      {item.date_human + ':' + item.time + ' - ' + item.route}
                    </Text>
                  </View>
                  <Text
                    style={[BasicStyles.normalText, {
                      color: Color.darkGray
                    }]}>
                    {item.locality + ',' + item.country}
                  </Text>
                  {
                    item.status == 'death' && (
                      <View style={{
                        backgroundColor: 'black',
                        borderRadius: 2,
                        marginRight: 20,
                        marginLeft: 20,
                        marginBottom: 10,
                        marginTop: 10
                      }}>
                        <Text style={{
                          color: Color.white,
                          paddingTop: 2,
                          paddingBottom: 2,
                          paddingLeft: 10,
                          paddingRight: 10
                        }}>
                          There was death in this area.
                        </Text>
                      </View>
                    )
                  }

                  {
                    item.status == 'positive' && (
                      <View style={{
                        backgroundColor: Color.danger,
                        borderRadius: 2,
                        marginRight: 20,
                        marginLeft: 20,
                        marginBottom: 10,
                        marginTop: 10
                      }}>
                        <Text style={{
                          color: Color.white,
                          paddingTop: 2,
                          paddingBottom: 2,
                          paddingLeft: 10,
                          paddingRight: 10
                        }}>
                          There was a COVID Positve in this area.
                        </Text>
                      </View>
                    )
                  }
                  {
                    item.status == 'pum' && (
                      <View style={{
                        backgroundColor: Color.warning,
                        borderRadius: 2,
                        marginRight: 20,
                        marginLeft: 20,
                        marginBottom: 10,
                        marginTop: 10
                      }}>
                        <Text style={{
                          color: Color.white,
                          paddingTop: 2,
                          paddingBottom: 2,
                          paddingLeft: 10,
                          paddingRight: 10
                        }}>
                          There was a PUM in this area.
                        </Text>
                      </View>
                    )
                  }

                  {
                    item.status == 'pui' && (
                      <View style={{
                        backgroundColor: Color.primary,
                        borderRadius: 2,
                        marginRight: 20,
                        marginLeft: 20,
                        marginBottom: 10,
                        marginTop: 10
                      }}>
                        <Text style={{
                          color: Color.white,
                          paddingTop: 2,
                          paddingBottom: 2,
                          paddingLeft: 10,
                          paddingRight: 10
                        }}>
                          There was a PUI in this area.
                        </Text>
                      </View>
                    )
                  }
                  {
                    item.status == 'negative' && (
                      <View style={{
                        backgroundColor: 'green',
                        borderRadius: 2,
                        marginRight: 20,
                        marginLeft: 20,
                        marginBottom: 10,
                        marginTop: 10
                      }}>
                        <Text style={{
                          color: Color.white,
                          paddingTop: 2,
                          paddingBottom: 2,
                          paddingLeft: 10,
                          paddingRight: 10
                        }}>
                          This area is clear.
                        </Text>
                      </View>
                    )
                  }

                  
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
    const { isLoading, newPlaceFlag, data } = this.state;
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
        <View style={{
          borderRadius: 5,
          backgroundColor: Color.danger,
          paddingTop: 10,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10
        }}>
          <Text style={{
            color: Color.white
          }}>
            Hi {user != null ? user.username : ''}! We would like to ask your help to input places you have been visited for the past months. Please, be honest and help us fight COVID-19. Don't worry your location is not viewable from other users.
          </Text>
        </View>

        {
          newPlaceFlag == false && (
            <TouchableHighlight
              style={[BasicStyles.btn, {
                backgroundColor: Color.primary,
                width: '100%',
                marginTop: 20
              }]}
              onPress={() => {
                this.setState({newPlaceFlag: true})
              }}
            >
              <Text style={{
                color: Color.white
              }}>Add visited places</Text>
            </TouchableHighlight>
          )
        }
        {
          newPlaceFlag == true && (
            this._newPlace()
          )
        }
        {
          data !== null && (this._places())
        }
        {isLoading ? <Spinner mode="overlay"/> : null }
        {this._datePicker()}
      </ScrollView>
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
)(Place);
