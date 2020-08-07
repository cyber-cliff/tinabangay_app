import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Picker, Platform} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, Empty, Confirmation } from 'components';
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
class Transportation extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      newFlag: false,
      type: null,
      model: null,
      number: null,
      selected: null,
      errorMessage: null,
      data: null,
      showConfirmation: false
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
        updated_at: 'desc'
      }
    }
    this.setState({
      isLoading: true
    })
    Api.request(Routes.transportationRetrieve, parameter, response => {
      this.setState({isLoading: false})
      if(response.data.length > 0){
        this.setState({data: response.data})
      }else{
        this.setState({data: null})
      }
    }, error => {
      console.log(error)
    });
  }

  updateData = () => {
    if(this.state.selected == null){
      return
    }
    let parameter = {
      id: this.state.selected.id
    }
    Api.request(Routes.transportationUpdate, parameter, response => {
      this.setState({isLoading: false})
      if(response.data > 0){
        this.setState({
          selected: null,
          showConfirmation: false
        })
        this.retrieve()
      }
    }, error => {
      this.setState({
        selected: null,
        showConfirmation: false
      })
    });
  }

  submit = () => {
    const { user } = this.props.state;
    const { type, model, number } = this.state;
    if(user == null){
      this.setState({errorMessage: 'Invalid Account.'})
      return
    }
    if(type == null || type == ''){
      this.setState({errorMessage: 'Type is required.'})
      return
    }
    if(model == null || model == ''){
      this.setState({errorMessage: 'Model is required.'})
      return
    }
    this.setState({errorMessage: null})
    let parameter = {
      account_id: user.id,
      type: type,
      model: model,
      number: number ? number : null
    }
    this.setState({isLoading: true})
    Api.request(Routes.transportationCreate, parameter, response => {
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
    const transportationTypes = Helper.transportationTypes.map((item, index) => {
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
          <Text>Select Status</Text>
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
                items={transportationTypes}
                style={BasicStyles.pickerStyleIOSNoMargin}
                placeholder={{
                  label: 'Select type',
                  value: null,
                  color: Color.primary
                }}
                />
            )
          }
        </View>
        <View>
          <Text style={{
          }}>Model</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(model) => this.setState({model})}
            value={this.state.model}
            placeholder={'Enter model'}
          />
        </View>

        <View>
          <Text style={{
          }}>Code (Optional)</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(number) => this.setState({number})}
            value={this.state.number}
            placeholder={'Enter platenumber, flight number and etc'}
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
    const { data, selected } = this.state;
    return (
      <View style={{
        backgroundColor: Color.white,
        position: 'relative',
        zIndex: -1,
        minHeight: height
      }}>
        <FlatList
          data={data}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <View style={{
              borderRadius: 5,
              marginBottom: 10,
              borderColor: index === 0 ? Color.primary : Color.gray,
              borderWidth: 1,
              position: 'relative',
              zIndex: -1,
              backgroundColor: index === 0 ? Color.primary : '#fff'
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
                    <Text
                      style={[BasicStyles.titleText, {
                        paddingTop: 10,
                        fontWeight: 'bold',
                        color: index === 0 ? Color.white : Color.primary
                      }]}>
                      {item.type.toUpperCase()}
                    </Text>
                  </View>
                  <Text
                    style={[BasicStyles.normalText, {
                      color: index === 0 ? Color.white : Color.darkGray,
                      paddingBottom: 10
                    }]}>
                    {item.model.toUpperCase() + (item.number ? ':' + item.number : '')}
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
    const { isLoading, newFlag, data } = this.state;
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
              }}>Add transportation</Text>
            </TouchableHighlight>
          )
        }
        {
          newFlag == true && (
            this._new()
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
              message={'Are you sure you want to set this as active transportation?'}
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
    setPreviousRoute: (previousRoute) => dispatch(actions.setPreviousRoute(previousRoute))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transportation);
