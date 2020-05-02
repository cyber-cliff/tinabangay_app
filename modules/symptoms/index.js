import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker, Platform} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, Empty, ImageUpload, DateTime } from 'components';
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
class Symptoms extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      newDataFlag: false,
      date: null,
      selected: null,
      errorMessage: null,
      data: null,
      type: null,
      remarks: null
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
        date: 'desc'
      }
    }
    this.setState({
      isLoading: true, 
      showDatePicker: false
    })
    Api.request(Routes.symptomsRetrieve, parameter, response => {
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
    const { user } = this.props.state;
    const { date, type, remarks } = this.state;
    if(user == null){
      this.setState({errorMessage: 'Invalid Account.'})
      return
    }

    if(type == null || type == ''){
      this.setState({errorMessage: 'Invalid Type.'})
      return
    }


    if(date == null || date == ''){
      this.setState({errorMessage: 'Invalid Date.'})
      return
    }

    this.setState({errorMessage: null})
    let parameter = {
      account_id: user.id,
      type: this.state.type,
      remarks: this.state.remarks ? this.state.remarks : null,
      date: date
    }
    this.setState({isLoading: true})
    Api.request(Routes.symptomsCreate, parameter, response => {
      this.setState({isLoading: false})
      if(response.data > 0){
        this.setState({
          newDataFlag: false,
          showDatePicker: false,
          dateFlag: false,
          date: null,
          type: null,
          remarks: null
        })
        this.retrieve()
      }
    });
    // this.setState({newPlaceFlag: false})
  }

  _newData = () => {
    const symptomsList = Helper.symptoms.map((item, index) => {
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


        <View>
          <DateTime
            type={'date'}
            placeholder={'Select Started'}
            onFinish={(date) => {
              this.setState({
                date: date.date,
                time: date.time
              })
            }}
          />
        </View>


        <View style={{
            marginTop: 10
          }}>
            <Text>Select type of symptom</Text>
            {
              Platform.OS == 'android' && (
                <Picker selectedValue={this.state.type}
                onValueChange={(type) => this.setState({type})}
                style={BasicStyles.pickerStyleCreate}
                >
                  {
                    Helper.symptoms.map((item, index) => {
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
                  items={symptomsList}
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
          }}>Other Details (Optional)</Text>
          <TextInput
            style={ Platform.OS == 'android' ? {
              borderColor: Color.gray,
              borderWidth: 1,
              width: '100%',
              marginBottom: 20,
              textAlignVertical: 'top',
              borderRadius: 5,
              paddingLeft: 10
            } : {
              borderColor: Color.gray,
              borderWidth: 1,
              width: '100%',
              marginBottom: 20,
              textAlignVertical: 'top',
              borderRadius: 5,
              minHeight: 50,
              textAlignVertical: 'middle',
              paddingLeft: 10,
              paddingTop: 10
            }}
            onChangeText={(remarks) => this.setState({remarks})}
            value={this.state.remarks}
            placeholder={'Enter other details here...'}
            multiline = {true}
            numberOfLines = {5}
          />
        </View>

        <View style={{
          position: 'relative',
          zIndex: 0,
          marginTop: 20
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
              <View style={Style.TextContainer}>
                <Text style={{
                  color: Color.primary,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {item.date_human} : {item.type}
                </Text>
                {
                  item.remarks != null && (
                    <Text style={{
                      paddingBottom: 10,
                      paddingLeft: 10,
                      paddingRight: 10
                    }}>
                      {item.remarks}
                    </Text>
                  )
                }
              </View>
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
        {isLoading ? <Spinner mode="overlay"/> : null }
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
              }}>Report Symptoms</Text>
            </TouchableHighlight>
          )
        }
        {
          newDataFlag == true && (
            this._newData()
          )
        }
        {
          data == null && (
            <Empty />
          )
        }
        {
          data !== null && (this._data())
        }
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
)(Symptoms);
