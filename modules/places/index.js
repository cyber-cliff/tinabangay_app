import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, ImageUpload } from 'components';
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
class Places extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      newPlaceFlag: false,
      showDatePicker: false,
      dateLabel: null,
      dateFlag: false,
      date: new Date(),
      showTimePicker: false,
      timeLabel: null,
      timeFlag: false,
      time: new Date(),
      data: null,
      selected: null,
      errorMessage: null
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
      showDatePicker: false,
      showTimePicker: false
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

  submit = () => {
    const { user, location } = this.props.state;
    const { date, time } = this.state;
    if(user == null){
      this.setState({errorMessage: 'Invalid Account.'})
      return
    }
    if(location == null || (location != null && location.route)){
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
      date: date,
      time: time
    }
    Api.request(Routes.visitedPlacesCreate, parameter, response => {
      this.setState({isLoading: false})
      if(response.data > 0){
        this.setState({
          newPlaceFlag: false,
          timeFlag: false,
          showTimePicker: false,
          time: new Date(),
          timeLabel: null,
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

  goToLocation = () => {
    const { setPreviousRoute } = this.props;
    setPreviousRoute('drawerStack')
    this.setState({showTimePicker: false, showDatePicker: false})
    this.props.navigation.navigate('locationStack')
  }

  setDate = (event, date) => {
    this.setState({
      showDatePicker: false,
      dateFlag: true,
      date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      dateLabel: Currency.getMonth(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear()
    });
    console.log('date', this.state.date);
  }

  _datePicker = () => {
    const { showDatePicker, date } = this.state;
    return (
      <View>
        { showDatePicker && <DateTimePicker value={new Date()}
            mode={'date'}
            display="default"
            date={new Date()}
            onCancel={() => this.setState({showDatePicker: false})}
            onConfirm={this.setDate} 
            onChange={this.setDate} />
        }
      </View>
    );
  }

  setTime = (event, date) => {
    console.log(date)
    this.setState({
      showTimePicker: false,
      timeFlag: true,
      time: date.getHours() + ':' + date.getMinutes,
      timeLabel: date.getHours() + ':' + date.getMinutes
    });
    console.log('date', this.state.time);
  }

  _timePicker = () => {
    const { showTimePicker, time } = this.state;
    return (
      <View>
        { showTimePicker && <DateTimePicker value={new Date()}
            mode={'time'}
            display="default"
            onCancel={() => this.setState({showTimePicker: false})}
            onConfirm={this.setTime} 
            onChange={this.setTime} />
        }
      </View>
    );
  }

  _newPlace = () => {
    return (
      <View>
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
              }}>{this.state.dateFlag == false ? 'Click to add date' : this.state.dateLabel}</Text>
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.warning,
                width: '100%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {this.setState({showTimePicker: true})}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>{this.state.timeFlag == false ? 'Click to add time' : this.state.timeLabel}</Text>
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.warning,
                width: '100%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {this.goToLocation()}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Add Location</Text>
          </TouchableHighlight>
        </View>

        <View>
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
      <View>
        <FlatList
          data={data}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <View style={{
              borderRadius: 10,
              marginBottom: 10,
              backgroundColor: Color.warning
            }}>
              <TouchableHighlight
                onPress={() => {console.log('hello list')}}
                underlayColor={Color.gray}
                >
                <View style={Style.TextContainer}>
                  <View style={{
                    flexDirection: 'row'
                  }}>
                    <FontAwesomeIcon 
                      icon={faMapMarker}
                      size={BasicStyles.iconSize}
                    />
                    <Text
                      style={[BasicStyles.titleText, {
                        paddingTop: 10,
                        color: Color.white,
                        fontSize: 20
                      }]}>
                      {item.route}
                    </Text>
                  </View>
                  <Text
                    style={[BasicStyles.normalText, {
                      color: Color.white
                    }]}>
                    {item.locality}
                  </Text>

                  <Text
                    style={[BasicStyles.normalText, {
                      paddingBottom: 10,
                      color: Color.white
                    }]}>
                    {item.country}
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
            Hi {user.username}! We would like to ask your help to input places you have been visited for the past months. Please, be honest and help us fight COVID-19. Don't worry your location is not viewable from other users.
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
        {this._timePicker()}
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
)(Places);
