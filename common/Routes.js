import config from 'src/config';
const url = config.IS_DEV;
let apiUrl = url + '/';
export default {
  auth: apiUrl + 'authenticate',
  authUser: apiUrl + 'authenticate/user',
  authRefresh: apiUrl + 'authenticate/refresh',
  authInvalidate: apiUrl + 'authenticate/invalidate',
  accountRetrieve: apiUrl + 'accounts/retrieve',
  accountUpdate: apiUrl + 'accounts/update',
  accountCreate: apiUrl + 'accounts/create',
  notificationsRetrieve: apiUrl + 'notifications/retrieve',
  notificationUpdate: apiUrl + 'notifications/update',
  accountProfileCreate: apiUrl + 'account_profiles/create',
  accountProfileUpdate: apiUrl + 'account_profiles/update',
  accountInformationRetrieve: apiUrl + 'account_informations/retrieve',
}