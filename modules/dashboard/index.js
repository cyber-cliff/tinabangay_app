import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner, Empty, SystemNotification } from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import {NavigationActions} from 'react-navigation';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Dashboard extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      selected: null
    }
  }

  componentDidMount(){
    const { user } = this.props.state;
    if(user != null){
      this.retrieveSummaryLedger();
    }
  }

  redirect = (route) => {
    this.props.navigation.navigate(route)
  }

  redirectDrawer = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'Requests'
    });
    this.props.navigation.dispatch(navigateAction);
  }


  retrieveSummaryLedger = () => {
    const { user } = this.props.state;
    const { setLedger, setUserLedger } = this.props;
    if(user == null){
      return
    }
    let parameter = {
      account_id: user.id,
      offset: 0,
      limit: 5,
      sort: {
        column: 'created_at',
        value: 'desc'
      },
      value: '%',
      column: 'created_at'
    }
    this.setState({isLoading: true});
    Api.request(Routes.ledgerSummaryRetrieve, parameter, response => {
      this.setState({isLoading: false});
      if(response != null){
        setLedger(response)
        setUserLedger(response.ledger.ledger)
      }else{
        setLedger(null)
        setUserLedger(null)
      }
    });
  }

  withdrawal = () => {
    this.props.navigation.navigate('withdrawalStack')
  }


  deposit = () => {
    this.props.navigation.navigate('depositStack')
  }

  viewRequest = () => {
    console.log('viewRequest')
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  }
  
  viewLedger = (item) => {
    console.log('notification selected', item)
  }
  
  FlatListItemSeparator = () => {
    return (
      <View style={BasicStyles.Separator}/>
    );
  };

  test = () => {
    //
  }


  _accountBalance = () => {
    const { userLedger } = this.props.state;
    return (
      <View style={[Style.Card, {
        backgroundColor: Color.primary,
        width: '100%'
      }]}>
        <Text style={[Style.titleText, {
          paddingTop: 10
        }]}>Account Balance</Text>
        <Text style={[Style.numberText, {
          paddingTop: 20,
          paddingBottom: 20
        }]}>{Currency.display(userLedger.amount, userLedger.currency)}</Text>
        <View style={{
          flexDirection: 'row',
          marginBottom: 10}}>
          <View style={{
            width: '50%',
          }}>
              <TouchableHighlight
                onPress={() => {this.withdrawal()}}
                style={[Style.btn, {backgroundColor: Color.secondary}]}
                underlayColor={Color.gray}
                >
                  <Text style={{
                    color: Color.white
                  }}>Withdrawal</Text>
              </TouchableHighlight>
          </View>

          <View style={{
            width: '50%'
          }}>
              <TouchableHighlight
                onPress={() => {this.deposit()}}
                underlayColor={Color.gray}
                style={[Style.btn, {backgroundColor: Color.warning}]}
              >
                <Text style={{
                  color: Color.white
                }}>Deposit</Text>
              </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }

  _requests = () => {
    const { ledger } = this.props.state;
    return (
      <View style={[Style.Card, {
        backgroundColor: Color.secondary,
        marginTop: 10,
        width: '100%'
      }]}>
        <Text style={[Style.titleText, {
          paddingTop: 10
        }]}>Requested Amount</Text>
        <Text style={[Style.numberText, {
          paddingTop: 20,
          paddingBottom: 20
        }]}>{Currency.display(ledger.ledger.total_requests, 'PHP')}</Text>
        <View style={{
          flexDirection: 'row',
          marginBottom: 10}}>
          <View style={{
            width: '100%',
          }}>
              <TouchableHighlight
                onPress={() => {this.redirectDrawer('Requests')}}
                style={[Style.btn, {
                  backgroundColor: Color.primary,
                  width: '40%',
                  marginLeft: '30%'
                }]}
                underlayColor={Color.gray}
                >
                  <Text style={{
                    color: Color.white
                  }}>View Requests</Text>
              </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }

  _myTotalRequest = () => {
    const { ledger } = this.props.state;
    return (
      <View style={[Style.Card, {
        backgroundColor: Color.warning,
        marginTop: 10,
        width: '100%'
      }]}>
        <Text style={[Style.titleText, {
          paddingTop: 10
        }]}>My Pending Requests</Text>
        <Text style={[Style.numberText, {
          paddingTop: 20,
          paddingBottom: 20
        }]}>{Currency.display(ledger.ledger.personal_total_requests, ledger.ledger.currency)}</Text>
        <View style={{
          flexDirection: 'row',
          marginBottom: 10}}>
          <View style={{
            width: '100%',
          }}>
              <TouchableHighlight
                onPress={() => {this.redirectDrawer('Requests')}}
                style={[Style.btn, {
                  backgroundColor: Color.primary,
                  width: '40%',
                  marginLeft: '30%'
                }]}
                underlayColor={Color.gray}
                >
                  <Text style={{
                    color: Color.white
                  }}>View Requests</Text>
              </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }

  _availableFunds = () => {
    const { ledger } = this.props.state;
    return (
      <View style={[Style.Card, {
        backgroundColor: Color.warning,
        marginTop: 10
      }]}>
        <Text style={[Style.titleText, {
          paddingTop: 10
        }]}>Available Funds</Text>
        <Text style={[Style.numberText, {
          paddingTop: 20,
          paddingBottom: 20
        }]}>{Currency.display(ledger.ledger.available, ledger.ledger.currency)}</Text>
        <View style={{
          flexDirection: 'row',
          marginBottom: 10}}>
          <View style={{
            width: '100%',
          }}>
          </View>
        </View>
      </View>
    );
  }

    _approvedRequest = () => {
    const { ledger } = this.props.state;
    return (
      <View style={[Style.Card, {
        backgroundColor: Color.gray,
        marginTop: 10
      }]}>
        <Text style={[Style.titleText, {
          paddingTop: 10
        }]}>Approved Requests</Text>
        <Text style={[Style.numberText, {
          paddingTop: 20,
          paddingBottom: 20
        }]}>{Currency.display(ledger.ledger.approved, ledger.ledger.currency)}</Text>
        <View style={{
          flexDirection: 'row',
          marginBottom: 10}}>
          <View style={{
            width: '100%',
          }}>
          </View>
        </View>
      </View>
    );
  }

  _pendingWithdrawal = () => {
    const { ledger } = this.props.state;
    return (
      <ScrollView horizontal={true} style={Style.ScrollView}>
        <View style={{
          flexDirection: 'row'
        }}>
        {
          ledger.ledger.withdrawal.map((item, index) => {
            return (
              <TouchableHighlight style={{
                width: width * .75,
                borderRadius: 5,
                borderColor: Color.primary,
                borderWidth: 1,
                marginRight: 10,
                padding: 5,
                backgroundColor: Color.white,
                paddingBottom: 20,
                paddingTop: 20
              }}
              onPress={() => {console.log('hi')}}
              underlayColor={Color.gray}
                >
                <View>
                  <Text style={[Style.normalText, {
                    textAlign: 'center'
                  }]}>{item.created_at_human}</Text>
                  <Text style={[Style.normalText, {
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: Color.danger,
                  }]}>{Currency.display((parseFloat(item.amount) + parseFloat(item.charge)) * -1, item.currency)}</Text>
                  <Text style={[Style.normalText, {
                    textAlign: 'center'
                  }]}>Withdrawal via {item.bank}/{item.account_number}/{item.account_name}</Text>
                   <Text style={[Style.normalText, {
                    textAlign: 'center',
                    color: Color.danger
                  }]}>Processing of the withdrawal will take up to 7 working days!</Text>
                  <Text style={[Style.normalText, {
                    textAlign: 'center'
                  }]}>Transaction ID: {item.code}</Text>
                </View>
              </TouchableHighlight>
            );
          })
        }
        </View>
      </ScrollView>
    );
  }

  _summary = () => {
    const { ledger } = this.props.state;
    const { selected } = this.state;
    return (
      <View style={{
        width: '100%'
      }}>
        <View style={{
          alignItems: 'center',
          borderBottomColor: Color.gray,
          borderBottomWidth: 0.5,
          marginTop: 10
        }}>
          <Text style={{
            fontWeight: 'bold',
            paddingTop: 5,
            color: Color.primary,
            paddingBottom: 20
          }}>Ledger Summary</Text>
        </View>
        {
          ledger.data == null && (<Empty />)
        }
        <FlatList
          data={ledger.data}
          extraData={selected}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item, index }) => (
            <View>
              <TouchableHighlight
                onPress={() => {this.viewLedger(item)}}
                underlayColor={Color.gray}
                >
                <View style={[Style.TextContainer, {
                  backgroundColor: Color.white
                }]}>
                  <View style={{
                    flexDirection: 'row'
                  }}>
                    <Text
                      style={[Style.titleTextSummary, {
                        paddingTop: 10,
                        width: '60%'
                      }]}>
                      {item.created_at_human}
                    </Text>
                    <Text
                      style={[Style.titleTextSummary, {
                        paddingTop: 10,
                        width: '40%',
                        fontWeight: 'bold',
                        color: item.amount > 0 ? Color.primary : Color.danger,
                        textAlign: 'right'
                      }]}>
                      {Currency.display(item.amount, item.currency)}
                    </Text>
                  </View>
                  <Text
                    style={Style.normalText}>
                    {item.description}
                  </Text>

                  <Text
                    style={[Style.normalText, {
                      paddingBottom: 10
                    }]}>
                    Transaction ID: {item.payload_value}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={{
          flexDirection: 'row',
          width: '100%',
          marginBottom: 100
        }}>
          <TouchableHighlight
            style={{
              height: 50,
              backgroundColor: Color.primary,
              width: '60%',
              marginBottom: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '20%'
            }}
            onPress={() => this.redirect('ledgerStack')}
            underlayColor={Color.gray}
            >
            <Text style={{
              color: Color.white
            }}>View more</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  render() {
    const { isLoading } = this.state;
    const { userLedger, ledger } = this.props.state;
    return (
      <ScrollView 
        style={Style.ScrollView}
        onScroll={(event) => {
          if(event.nativeEvent.contentOffset.y <= 0) {
            if(this.state.isLoading == false){
              this.retrieveSummaryLedger()
            }
          }
        }}
        >
        {isLoading ? <Spinner mode="overlay"/> : null }
        <SystemNotification></SystemNotification>
        <View style={[Style.MainContainer, {
          minHeight: height
        }]}>
          <View style={Style.MainContainer}>
            {userLedger != null && (this._accountBalance())}
            {ledger != null && (this._myTotalRequest()) }
            {ledger != null && (this._requests())}
            {/*ledger != null && (this._approvedRequest()) */}
            {/*ledger != null && (this._availableFunds()) */}
            {ledger != null && ledger.ledger.withdrawal != null && (
              <View style={{
                width: '100%'
              }}>
                <Text style={{
                  fontWeight: 'bold',
                  paddingTop: 20,
                  paddingBottom: 10,
                  textAlign: 'center',
                  color: Color.primary
                }}>Pending transactions</Text>
                {this._pendingWithdrawal()}
              </View>
            )}
            {ledger != null && (this._summary())}
          </View>
        </View>
      </ScrollView>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
    setUserLedger: (userLedger) => dispatch(actions.setUserLedger(userLedger))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
