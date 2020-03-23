import Pusher from 'pusher-js/react-native';
import Config from 'src/config.js';
import { Helper } from 'common';
export default {
  pusher: null,
  channel: null,
  listen (callback) {
    this.pusher = new Pusher(Config.PUSHER.key, Config.PUSHER);
    this.channel = this.pusher.subscribe(Helper.pusher.channel);
    this.channel.bind(Helper.pusher.notifications, response => {
      callback({type: Helper.pusher.notifications, data: response.data})
      // add notification here
    })
    this.channel.bind(Helper.pusher.messages, response => {
      callback({type: Helper.pusher.messages, data: response.data})
      // add messages here
    })
    this.channel.bind(Helper.pusher.messageGroup, response => {
      callback({type: Helper.pusher.messageGroup, data: response.data})
      // add validation here
    })
    this.channel.bind(Helper.pusher.systemNotification, response => {
      console.log('hello')
      callback({type: Helper.pusher.systemNotification, data: response.data})
    })
  }
}