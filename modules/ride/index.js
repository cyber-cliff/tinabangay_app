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
class Ride extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      newDataFlag: false,
      showDatePicker: false,
      fromDateLabel: null,
      fromDateFlag: false,
      fromDate: new Date(),
      toDateLabel: null,
      toDateFlag: false,
      toDate: new Date(),
      from: null,
      to: null,
      data: null,
      selected: null,
      errorMessage: null,
      locationFlag: 'from',
      dateFlag: null,
      code: null,
      type: null
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
      }]
    }
    this.setState({
      isLoading: true, 
      showDatePicker: false,
      showTimePicker: false
    })
    Api.request(Routes.ridesRetrieve, parameter, response => {
      this.setState({isLoading: false})
      if(response.data.length > 0){
        this.setState({data: response.data})
      }else{
        this.setState({data: null})
      }
    }, error => {
      this.setState({isLoading: false})
      console.log(error)
    });
  }

  submit = () => {
    const { user } = this.props.state;
    const {from, to, fromDate, toDate, type, code } = this.state;
    if(user == null){
      this.setState({errorMessage: 'Invalid Account.'})
      return
    }
    if(from == null || to == null){
      this.setState({errorMessage: 'Locations are required.'})
      return
    }
    if(fromDate == null || toDate == null){
      this.setState({errorMessage: 'Dates are required.'})
      return
    }
    if(type == null){
      this.setState({errorMessage: 'Type is required.'})
      return
    }
    this.setState({errorMessage: null})
    let parameter = {
      account_id: user.id,
      from: from,
      to: to,
      from_date_time: fromDate,
      to_date_time: toDate,
      payload: 'manual',
      type: type,
      code: code
    }
    this.setState({isLoading: true})
    console.log(parameter)
    Api.request(Routes.ridesCreate, parameter, response => {
      console.log(response)
      this.setState({isLoading: false})
      if(response.data > 0){
        this.setState({
          newDataFlag: false,
          fromDatePicker: false,
          fromDateLabel: null,
          fromDateFlag: false,
          fromDate: new Date(),
          toDatePicker: false,
          toDateLabel: null,
          toTimeFlag: false,
          toDate: new Date(),
          from: null,
          to: null,
          selected: null,
          errorMessage: null,
          locationFlag: 'from'
        })
        this.retrieve()
      }
    }, error => {
      console.log(error)
      this.setState({isLoading: false})
    });
    // this.setState({newPlaceFlag: false})
  }

  manageLocation = (location) => {
    const { locationFlag } = this.state;
    if(locationFlag == 'from'){
      this.setState({
        from: location ? location.route + ', ' + location.locality + ', ' + location.country : null
      })
    }else{
      this.setState({
        to: location ? location.route + ', ' + location.locality + ', ' + location.country : null
      })
    }
  }

  getTime = (date) => {
    let hours = date.getHours() % 12 || 12
    return hours + ':' + date.getMinutes() + ' ' + (date.getHours() > 12 ? 'PM' : 'AM')
  }

  getTimeTz = (date) => {
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':00'
  }

  setDate = (event, date) => {
    const { dateFlag } = this.state;
    if(dateFlag == 'from'){
      this.setState({
        showDatePicker: false,
        fromDateFlag: true,
        fromDate: this.getTimeTz(date),
        fromDateLabel: Currency.getMonth(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + this.getTime(date)
      });
    }else if(dateFlag == 'to'){
      this.setState({
        showDatePicker: false,
        toDateFlag: true,
        toDate: this.getTimeTz(date),
        toDateLabel: Currency.getMonth(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + this.getTime(date)
      });
    }
  }

  _datePicker = () => {
    const { showDatePicker } = this.state;
    return (
      <View>
        { 
          (showDatePicker && Platform.OS == 'ios') && <DateTimePicker value={new Date()}
            mode={'datetime'}
            display="default"
            date={new Date()}
            onCancel={() => this.setState({showDatePicker: false})}
            onConfirm={this.setDate} 
            onChange={this.setDate} />
        }
        { 
          (showDatePicker && Platform.OS == 'android') && <DateTimePicker value={new Date()}
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

  _newData = () => {
    const types = Helper.transportationTypes.map((item, index) => {
      return {
        label: item.title,
        value: item.value
      };
    })
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
          marginTop: 10
        }}>
          <Text>Select Type</Text>
          {
            Platform.OS == 'android' && (
              <Picker selectedValue={this.state.type}
              onValueChange={(type) => this.setState({type})}
              style={BasicStyles.pickerStyleCreate}
              >
                {
                  Helper.transportationTypes.map((item, index) => {
                    return (
                      <Picker.Item
                      key={index}
                      label={item.title} 
                      value={item.value}/>
                    );
                  })
                }
              </Picker>
            )
          }
          {
            Platform.OS == 'ios' && (
              <RNPickerSelect
                onValueChange={(type) => this.setState({type})}
                items={types}
                style={BasicStyles.pickerStyleIOSNoMargin}
                placeholder={{
                  label: 'Click to select',
                  value: null,
                  color: Color.primary
                }}
                />
            )
          }
        </View>
        <View>
          <Text style={{
            paddingTop: 10
          }}>Code(Optional)</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(code) => this.setState({code})}
            value={this.state.code}
            placeholder={'Plate Number, Flight Number, Jeepney Code ...'}
          />
        </View>
        <View style={{
          position: 'relative',
          backgroundColor: Color.white,
          zIndex: 2
        }}>
          <Text style={{
            paddingTop: 10
          }}>From</Text>
          <GooglePlacesAutoComplete 
            onFinish={(from) => this.manageLocation(from)}
            placeholder={'Start typing location'}
            onChange={() => this.setState({
              locationFlag: 'from'
            })}
          />
        </View>
        <View style={{
        }}>

          <Text style={{
            paddingTop: 10
          }}>From Date</Text>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.warning,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {this.setState({showDatePicker: true, dateFlag: 'from'})}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>{this.state.fromDateFlag == false ? 'Click to add' : this.state.fromDateLabel}</Text>
          </TouchableHighlight>
        </View>
        <View style={{
          position: 'relative',
          backgroundColor: Color.white,
          zIndex: 1,
          marginTop: 20
        }}>
          <Text style={{
            paddingTop: 10
          }}>To</Text>
          <GooglePlacesAutoComplete 
            onFinish={(to) => this.manageLocation(to)}
            placeholder={'Start typing location'}
            onChange={() => this.setState({
              locationFlag: 'to'
            })}
          />
        </View>
        <View>
        <Text style={{
            paddingTop: 10
          }}>To Date</Text>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.warning,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {this.setState({showDatePicker: true, dateFlag: 'to'})}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>{this.state.toDateFlag == false ? 'Click to add' : this.state.toDateLabel}</Text>
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
                marginTop: 20
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

  _data = () => {
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
                      {item.code ? item.code: ''} {item.type}
                    </Text>
                  </View>
                  <Text
                    style={[BasicStyles.normalText, {
                      paddingTop: 10,
                      color: Color.darkGray
                    }]}>
                    {item.from} - {item.to}
                  </Text>
                  <Text
                    style={[BasicStyles.normalText, {
                      color: Color.darkGray
                    }]}>
                    {item.from_date_human} - {item.to_date_human}
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
                          There was a death in this route.
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
                          There was a COVID Positve in this route.
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
                          There was a PUM in this route.
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
                          There was a PUI in this route.
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
                          This route is clear.
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
    const { isLoading, newDataFlag, data } = this.state;
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
            Hi {user != null ? user.username : ''}! We would like to ask your help to input your transportation history that you have been on board for the past months. Please, be honest and help us fight COVID-19. Don't worry your location is not viewable from other users.
          </Text>
        </View>

        {
          newDataFlag == false && (
            <TouchableHighlight
              style={[BasicStyles.btn, {
                backgroundColor: Color.primary,
                width: '100%',
                marginTop: 20
              }]}
              onPress={() => {
                this.setState({newDataFlag: true})
              }}
            >
              <Text style={{
                color: Color.white
              }}>Add previous rides</Text>
            </TouchableHighlight>
          )
        }
        {
          newDataFlag == true && (
            this._newData()
          )
        }
        {
          data !== null && (this._data())
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
)(Ride);
