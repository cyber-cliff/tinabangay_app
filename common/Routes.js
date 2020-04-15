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
  notificationsRetrieve: apiUrl + 'patients/retrieve_notifications',
  accountProfileCreate: apiUrl + 'account_profiles/create',
  accountProfileUpdate: apiUrl + 'account_profiles/update',
  accountInformationRetrieve: apiUrl + 'account_informations/retrieve',
  accountInformationUpdate: apiUrl + 'account_informations/update',
  visitedPlacesRetrieve: apiUrl + 'visited_places/retrieve',
  visitedPlacesCreate: apiUrl + 'visited_places/create',
  visitedPlacesUpdate: apiUrl + 'visited_places/update',
  temperaturesCreate: apiUrl + 'temperatures/create',
  temperaturesRetrieve: apiUrl + 'temperatures/retrieve',
  patientsCreate: apiUrl + 'patients/create',
  ridesRetrieve: apiUrl + 'rides/retrieve',
  ridesCreate: apiUrl + 'rides/create',
  tracingPlaces: apiUrl + 'tracing_places/places',
  transportationCreate: apiUrl + 'transportations/create',
  transportationUpdate: apiUrl + 'transportations/update',
  transportationRetrieve: apiUrl + 'transportations/retrieve',
  locationsCreate: apiUrl + 'locations/create',
  locationsRetrieve: apiUrl + 'locations/retrieve',
  locationsUpdate: apiUrl + 'locations/update'
}