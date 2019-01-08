/* eslint-disable no-console */

import { PolymerElement, html } from "@polymer/polymer";
import { version } from "./rise-image-version.js";
import "@polymer/iron-image/iron-image.js";

class RiseDataImage extends PolymerElement {
  static get template() {
    return html`
      <style>
        #image {
          height: var(--rise-image-height);
          width: var(--rise-image-width);
          background-color: var(--rise-image-background-color);
        }
      </style>
      <iron-image id="image" sizing="[[sizing]]" position="[[position]]" src="http://lorempixel.com/600/400"></iron-image>
    `;
  }

  static get properties() {
    return {
      /**
       * Sizing of the image
       */
      sizing: {
        type: String,
        value: "contain"
      },

      /**
       * Position of the image
       */
      position: {
        type: String,
        value: "center center"
      },
    };
  }

  constructor() {
    super();
  }

  ready() {
    super.ready();

    console.log( "rise-image ready()" );
  }

  _getComponentData() {
    return {
      name: "rise-image",
      id: this.id,
      version: version
    };
  }

}

customElements.define( "rise-image", RiseDataImage );
