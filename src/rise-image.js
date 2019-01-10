/* eslint-disable no-console */

import { PolymerElement, html } from "@polymer/polymer";
import { version } from "./rise-image-version.js";
import "./rise-data-image.js";
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
      <rise-data-image id="data" file="[[file]]"></rise-data-image>
      <iron-image id="image" sizing="[[sizing]]" position="[[position]]" placeholder="[[placeholder]]"></iron-image>
    `;
  }

  static get properties() {
    return {
      file: {
        type: String,
        value: ""
      },
      /**
       * Sizing of the image
       */
      sizing: {
        type: String,
        value: ""
      },
      /**
       * Position of the image
       */
      position: {
        type: String,
        value: ""
      },
      /**
       * Background/placeholder until the src (file) of the image has loaded.
       */
      placeholder: {
        type: String,
        value: ""
      }
    };
  }

  // Each item of observers array is a method name followed by
  // a comma-separated list of one or more dependencies.
  static get observers() {
    return [
      "_handlePlaceholder(placeholder)"
    ]
  }

  constructor() {
    super();
  }

  ready() {
    super.ready();

    this._configureDataEventListeners();
    this._configureImageEventListeners();

    this.$.data.dispatchEvent( new CustomEvent( "start" ));
  }

  _handlePlaceholder( value ) {
    console.log( "handle placeholder", value, this.$.image.preload );
    this.$.image.preload = typeof value !== "undefined" && value;
  }

  _configureDataEventListeners() {
    this.$.data.addEventListener( "configured", () =>
      this.$.data.dispatchEvent( new CustomEvent( "start" ))
    );

    this.$.data.addEventListener( "image-status-updated", event => {
      if ( event.detail.status === "CURRENT" ) {
        this.$.image.src = event.detail.url
      }
    });

    this.$.data.addEventListener( "image-error", event => {
      console.log( "error", event.detail.errorMessage );
    });

    this.$.data.addEventListener( "unlicensed", () => {
      console.log( "display is unlicensed" );
    });
  }

  _configureImageEventListeners() {
    this.$.image.addEventListener( "error-changed", () => {

    });
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
