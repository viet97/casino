import * as React from 'react';
import BaseComponent from '../BaseComponent';

export default class BaseElement extends BaseComponent {
  constructor(props) {
    super(props);
    this.displayName = 'BaseElement';
  }

  renderContent() {
    return null;
  }

  render() {
    if (this.renderContent) {
      return this.renderContent();
    }
    return null;
  }
}
