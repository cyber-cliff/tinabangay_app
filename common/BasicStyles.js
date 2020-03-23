import Color from './Color';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
export default {
  formControl: {
    height: 50,
    borderColor: Color.gray,
    borderWidth: 1,
    width: width - 40,
    paddingLeft: 10,
    marginBottom: 20,
    borderRadius: 5
  },
  formControlModal: {
    height: 50,
    borderColor: Color.gray,
    borderWidth: 1,
    width: '90%',
    marginLeft: '5%',
    marginBottom: 20,
    borderRadius: 5,
    paddingLeft: 10
  },
  formControlCreate: {
    height: 50,
    borderColor: Color.gray,
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    borderRadius: 5,
    paddingLeft: 10
  },
  pickerStyle: {
    height: 50,
    borderBottomColor: Color.gray,
    borderBottomWidth: 1,
    width: '90%'
  },
  pickerStyleCreate: {
    height: 50,
    borderBottomColor: Color.gray,
    borderBottomWidth: 1,
    width: '100%',
    paddingLeft: 10
  },
  pickerStyleIOS: {
    inputIOS: {
      borderWidth: 1,
      borderColor: Color.gray,
      borderRadius: 5,
      color: '#000',
      paddingRight: 30,
      marginRight: 18,
      marginLeft: 10,
      height: 50,
      paddingLeft: 10
    }
  },
  pickerStyleIOSNoMargin: {
    inputIOS: {
      borderWidth: 1,
      borderColor: Color.gray,
      borderRadius: 5,
      color: '#000',
      height: 50,
      width: '100%',
      paddingLeft: 10
    }
  },
  btn: {
    height: 50,
    backgroundColor: Color.primary,
    width: width - 40,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  btnPrimary: {
    backgroundColor: Color.primary
  },
  btnSecondary: {
    backgroundColor: Color.secondary
  },
  btnWarning: {
    backgroundColor: Color.warning
  },
  textWhite: {
    color: Color.white
  },
  iconSize: 24,
  iconStyle: {
    color: Color.white,
    paddingLeft: 20,
    paddingRight: 20
  },
  titleText: {
    fontSize: 13,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 20,
    paddingRight: 20
  },
  normalText: {
    fontSize: 12,
    color: Color.gray,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 20,
    paddingRight: 20
  },
  Separator: {
    height: 0.5,
    width: width - 40,
    backgroundColor: Color.lightGray,
    marginLeft: 20
  },
  badge: {
    backgroundColor: Color.danger,
    color: Color.white,
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 10
  },
  profileImageSize: {
    height: 30,
    width: 30,
    borderRadius: 15
  },
  profileIconSize: 30
}