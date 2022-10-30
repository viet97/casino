import Emitter from './Emitter';

const LIST_EVENT = {
  PING_SERVER_EMITTER: 'ping_server_emitter',
  LOADING_GLOBAL_ON_OFF: 'loading_on_off',
  //orientation
  ORIENTATION_DID_CHANGE: 'orientation_did_change',
  DEVICE_ORIENTATION_DID_CHANGE: 'device_orientation_did_change',
  //network
  NETWORK_CHANGE: 'network_change',
  //appstate
  APP_STATE_CHANGE: 'app_state_change',
  APP_STATE_CHANGE_TO_FOREGROUND: 'APP_STATE_CHANGE_TO_FOREGROUND',
  CHANGE_TAB: 'CHANGE_TAB',
  //EVENT CHANGE
  CHANGE_SCREEN: 'CHANGE_SCREEN',
};

export class EmitterManager {
  static getInstance() {
    if (!this._instance) {
      this._instance = new EmitterManager();
    }
    return this._instance;
  }

  static clear() {
    if (this._instance) {
      delete this._instance;
    }
  }

  static listEvent = LIST_EVENT;

  emit(eventName, ...args) {
    if (!eventName) {
      return;
    }
    return Emitter.emit(eventName, ...args);
  }

  on(eventName, cb) {
    if (!eventName || !cb) {
      return;
    }
    Emitter.on(eventName, cb);
  }

  off(eventName, cb) {
    if (!eventName) {
      return;
    }
    Emitter.off(eventName, cb);
  }

  once(eventName, cb, ctx) {
    if (!eventName || !cb) {
      return;
    }
    Emitter.once(eventName, cb, ctx);
  }
}
