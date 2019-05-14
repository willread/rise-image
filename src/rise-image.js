/* eslint-disable no-console */

import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { html } from "@polymer/polymer/lib/utils/html-tag.js";
import { version } from "./rise-image-version.js";
import "@polymer/iron-image/iron-image.js";

class RiseImage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          overflow: hidden;
          position: relative;
        }
      </style>
      <iron-image id="image"></iron-image>
    `;
  }

  static get properties() {
    return {
      file: {
        type: String,
        value: ""
      },
      width: {
        type: String,
        value: null
      },
      height: {
        type: String,
        value: null
      },
      sizing: {
        type: String,
        value: "contain"
      },
      responsive: {
        type: Boolean,
        value: false
      }
    };
  }

  // Each item of observers array is a method name followed by
  // a comma-separated list of one or more dependencies.
  static get observers() {
    return [
      "_reset(file)"
    ]
  }

  static get EVENT_CONFIGURED() {
    return "configured";
  }

  static get EVENT_START() {
    return "start";
  }

  static get EVENT_IMAGE_STATUS_UPDATED() {
    return "image-status-updated";
  }

  static get EVENT_IMAGE_ERROR() {
    return "image-error";
  }

  static get EVENT_SVG_USAGE() {
    return "svg-usage";
  }

  static get LOG_TYPE_INFO() {
    return "info";
  }

  static get LOG_TYPE_WARNING() {
    return "warning";
  }

  static get LOG_TYPE_ERROR() {
    return "error";
  }

  static get STORAGE_PREFIX() {
    return "https://storage.googleapis.com/";
  }

  constructor() {
    super();

    this._watchInitiated = false;
    this._initialStart = true;
    this._invalidFileType = false;
    this._url = "";
  }

  ready() {
    super.ready();

    this._configureImageEventListeners();

    const handleStart = () => this._handleStart();

    this.addEventListener( RiseImage.EVENT_START, handleStart, {
      once: true
    });

    this._sendImageEvent( RiseImage.EVENT_CONFIGURED );
  }

  _configureImageEventListeners() {
    this.$.image.addEventListener( "error-changed", ( evt ) => {
      console.log( evt );
    });
  }

  _getComponentData() {
    return {
      name: "rise-image",
      id: this.id,
      version: version
    };
  }

  _getStorageData() {
    return {
      configuration: "storage file",
      file_form: this._getStorageFileFormat( this.file ),
      file_path: this.file,
      local_url: this._url
    }
  }

  _getStorageFileFormat( filePath ) {
    return filePath.substr( filePath.lastIndexOf( "." ) + 1 ).toLowerCase();
  }

  _reset() {
    if ( !this._initialStart ) {

      this._watchInitiated = false;
      this._url = "";

      this._log( RiseImage.LOG_TYPE_INFO, "reset", null, { storage: this._getStorageData() });
      this._start();
    }
  }

  _isValidFileType( path ) {
    const format = this._getStorageFileFormat( path ),
      valid = [ "jpg", "jpeg", "png", "bmp", "svg", "gif", "webp" ];


    for ( let i = 0, len = valid.length; i < len; i++ ) {
      if ( format.indexOf( valid[ i ]) !== -1 ) {
        return true;
      }
    }

    return false;
  }

  _getDataUrlFromSVGLocalUrl( localUrl ) {
    return new Promise(( resolve, reject ) => {
      const xhr = new XMLHttpRequest();

      xhr.overrideMimeType( "image/svg+xml" );

      xhr.onload = () => {
        if ( xhr.status !== 200 ) {
          reject( `${ xhr.status } : ${ xhr.statusText }` );
        }

        let reader = new FileReader();

        reader.onloadend = () => {
          if ( reader.error ) {
            reject( "Read failed" );
          }

          this._log( RiseImage.LOG_TYPE_INFO, RiseImage.EVENT_SVG_USAGE, { svg_details: {
            blob_size: xhr.response.size,
            data_url_length: reader.result.length
          } }, { storage: this._getStorageData() });

          resolve( reader.result );
        };

        reader.readAsDataURL( xhr.response );
      };

      xhr.onerror = event => {
        reject( `Request failed: ${ JSON.stringify( event )}` );
      };

      xhr.open( "GET", localUrl );
      xhr.responseType = "blob";
      xhr.send();
    });
  }

  _filterInvalidFileTypes() {
    if ( this.file ) {
      if ( !this._isValidFileType( this.file )) {
        const errorMessage = "Invalid file format";

        this._log( RiseImage.LOG_TYPE_ERROR, RiseImage.EVENT_IMAGE_ERROR, { errorMessage }, { storage: this._getStorageData() });
        this._sendImageEvent( RiseImage.EVENT_IMAGE_ERROR, { file: this.file, errorMessage });
        this._invalidFileType = true;
      }
    }
  }

  _renderImage( url ) {
    if ( this.responsive ) {
      this.$.image.updateStyles({ "--iron-image-width": "100%" });
    } else {
      this.$.image.width = isNaN( this.width ) ? parseInt( this.width, 10 ) : this.width;
      this.$.image.height = isNaN( this.height ) ? parseInt( this.height, 10 ) : this.height;
      this.$.image.sizing = this.sizing;
    }

    if ( this._getStorageFileFormat( this.file ) === "svg" ) {
      this._getDataUrlFromSVGLocalUrl( url )
        .then( dataUrl => {
          this.$.image.src = dataUrl;
        })
        .catch( error => {
          this._log( RiseImage.LOG_TYPE_ERROR, RiseImage.EVENT_IMAGE_ERROR, error, { storage: this._getStorageData() });
          this._sendImageEvent( RiseImage.EVENT_IMAGE_ERROR, { file: this.file, error });
        });
    } else {
      this.$.image.src = url;
    }
  }

  _clearImage() {
    this.$.image.src = "";
  }

  _start() {
    this._filterInvalidFileTypes();

    if ( !this.file || this._invalidFileType ) {
      this._clearImage();
      return;
    }

    if ( RisePlayerConfiguration.isPreview()) {
      return this._handleStartForPreview();
    }

    if ( !this._watchInitiated ) {
      RisePlayerConfiguration.LocalStorage.watchSingleFile(
        this.file, message => this._handleSingleFileUpdate( message )
      );
      this._watchInitiated = true;
    }
  }

  _handleStartForPreview() {
    // check license for preview will be implemented in some other epic later

    this._url = RiseImage.STORAGE_PREFIX + this.file;
    this._handleImageStatusUpdated( "CURRENT" );
  }

  _handleStart() {
    if ( this._initialStart ) {
      this._initialStart = false;

      if ( !RisePlayerConfiguration.isPreview()) {
        this._log( RiseImage.LOG_TYPE_INFO, RiseImage.EVENT_START, null, { storage: this._getStorageData() });
      }

      this._start();
    }
  }

  _log( type, event, details = null, additionalFields ) {
    const componentData = this._getComponentData();

    switch ( type ) {
    case RiseImage.LOG_TYPE_INFO:
      RisePlayerConfiguration.Logger.info( componentData, event, details, additionalFields );
      break;
    case RiseImage.LOG_TYPE_WARNING:
      RisePlayerConfiguration.Logger.warning( componentData, event, details, additionalFields );
      break;
    case RiseImage.LOG_TYPE_ERROR:
      RisePlayerConfiguration.Logger.error( componentData, event, details, additionalFields );
      break;
    }
  }

  _handleSingleFileError( message ) {
    const details = { file: this.file, errorMessage: message.errorMessage, errorDetail: message.errorDetail };

    this._log( RiseImage.LOG_TYPE_ERROR, RiseImage.EVENT_IMAGE_ERROR, {
      errorMessage: message.errorMessage,
      errorDetail: message.errorDetail
    }, { storage: this._getStorageData() });

    this._sendImageEvent( RiseImage.EVENT_IMAGE_ERROR, details );
  }

  _handleSingleFileUpdate( message ) {
    if ( !message.status ) {
      return;
    }

    this._url = message.fileUrl || "";

    if ( message.status === "FILE-ERROR" ) {
      this._handleSingleFileError( message );
      return;
    }

    this._handleImageStatusUpdated( message.status );
  }

  _handleImageStatusUpdated( status ) {
    this._log( RiseImage.LOG_TYPE_INFO, RiseImage.EVENT_IMAGE_STATUS_UPDATED, { status: status }, { storage: this._getStorageData() });

    if ( status === "CURRENT" ) {
      this._renderImage( this._url );
    }
  }

  _sendImageEvent( eventName, detail = {}) {
    const event = new CustomEvent( eventName, {
      bubbles: true, composed: true, detail
    });

    this.dispatchEvent( event );
  }

}

customElements.define( "rise-image", RiseImage );
