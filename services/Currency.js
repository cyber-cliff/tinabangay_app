require('intl');
require('intl/locale-data/jsonp/en.js');
export default {
  display(amount, currency){
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })
    return formatter.format(amount)
  },
  getMonth(index){
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[index];
  }
}