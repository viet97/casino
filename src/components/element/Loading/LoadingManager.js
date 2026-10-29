import { EmitterManager } from '../../../modules/EmitterManager';

export default class LoadingManager {
  static getInstance() {
    if (!this._instance) {
      this._instance = new LoadingManager();
    }
    return this._instance;
  }

  static clear() {
    if (this._instance) {
      this._instance.destroy();
      delete this._instance;
    }
  }

  constructor() {
    this.displayName = 'LoadingManager';
    this._isVisible = false;
  }

  set isVisible(isVisible) {
    this._isVisible = isVisible;
  }

  get isVisible() {
    return this._isVisible;
  }

  visibleLoading(isVisible = true) {
    requestAnimationFrame(() =>
      EmitterManager.getInstance().emit(
        EmitterManager.listEvent.LOADING_GLOBAL_ON_OFF,
        isVisible,
      ),
    );
  }

  destroy() {
    this._isVisible = false;
  }
}
