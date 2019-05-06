# Image Web Component [![CircleCI](https://circleci.com/gh/Rise-Vision/rise-image/tree/master.svg?style=svg)](https://circleci.com/gh/Rise-Vision/rise-image/tree/master)

## Introduction

`rise-image` is a Polymer 3 Web Component that retrieves image files from Rise Local Storage, and displays them.

Instructions for demo page here:
https://github.com/Rise-Vision/rise-image/blob/master/demo/README.md

## Usage

The below illustrates simple usage of the component. The file image is the default ( may be overridden by a user ), and should point to a valid file in Rise Vision GCS storage.

There is no need to configure listeners if the component runs as editable ( default operation mode ). See the demo section in this repo for a full working example of an HTML page using the component which will illustrate required imports in the `<head>` of the page.

### Example

```
  <body>
    <rise-image id="rise-image-sample"
      file="risemedialibrary-30007b45-3df0-4c7b-9f7f-7d8ce6443013/logo.png">
    </rise-image>
...

  </body>
```

### Labels

The component may define a 'label' attribute that defines the text that will appear for this instance in the template editor.

This attribute holds a literal value, for example:

```
  <rise-image id="rise-image-sample"
    label="Sample"
    file="risemedialibrary-30007b45-3df0-4c7b-9f7f-7d8ce6443013/logo.png">
  </rise-image>
```

If it's not set, the label for the component defaults to "Image", which is applied via the   [generate_blueprint.js](https://github.com/Rise-Vision/html-template-library/blob/master/generate_blueprint.js) file for a HTML Template build/deployment.

### Attributes

This component receives the following list of attributes:

- **id**: ( string / required ): Unique HTML id with format 'rise-image-<NAME_OR_NUMBER>'.
- **file** ( string / required ): Valid Rise GCS path. Example: "risemedialibrary-xxxxxx-xxxx-xxxx-xxxx-xxxxxxxx/logo.png".
- **label**: ( string ): An optional label key for the text that will appear in the template editor. See 'Labels' section above.

### Events

The component sends the following events:

- **_configured_**: The component has initialized what it requires to and is ready to handle a _start_ event.
- **_unlicensed_**: Reported if the display is not licensed to access images using Rise Local Storage. The event is also sent as a warning to BQ.
- **_image-status-updated_**: The status of an image has been updated. Templates usually can ignore this event, as the displayed image will be updated by the component. This event provides an object with the following properties:
    - status: "STALE", "CURRENT", "DELETE" and "NOEXIST" for single files.
    - file: file being watched
    - url: will only be set if status == 'CURRENT'
- **_image-error_**: Thrown if an error during the processing of the file happens. The template does not need to handle this, as the component is already logging errors to BQ when running on a display. Provides an object with the following properties: file, errorMessage and errorDetail.

The component is listening for the following events:

- **_start_**: This event will initiate accessing the image. It can be dispatched on the component when _configured_ event has been fired as that event indicates the component has initialized what it requires to and is ready to make a request to the Financial server to retrieve data.

### Errors

The component may log the following errors or warnings:

- **_unlicensed_** ( warning ): See above.
- **_image-error_** ( error ): See above.

In every case, examine event-details entry and the other event fields for more information about the problem.

## Built With
- [Polymer 3](https://www.polymer-project.org/)
- [Polymer CLI](https://github.com/Polymer/tools/tree/master/packages/cli)
- [WebComponents Polyfill](https://www.webcomponents.org/polyfills/)
- [npm](https://www.npmjs.org)

## Development

### Local Development Build
Clone this repo and change into this project directory.

Execute the following commands in Terminal:

```
npm install
npm install -g polymer-cli@1.8.0
npm run build
```

**Note**: If EPERM errors occur then install polymer-cli using the `--unsafe-perm` flag ( `npm install -g polymer-cli@1.8.0 --unsafe-perm` ) and/or using sudo.

### Testing
You can run the suite of tests either by command terminal or interactive via Chrome browser.

#### Command Terminal
Execute the following command in Terminal to run tests:

```
npm run test
```

#### Local Server
Run the following command in Terminal: `polymer serve`.

Now in your browser, navigate to:

```
http://127.0.0.1:8081/components/rise-image/test/index.html
```
You can also run a specific test page by targeting the page directly:

```
http://127.0.0.1:8081/components/rise-image/test/unit/rise-image.html
```

## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues, please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas, please post your thoughts to our [community](https://help.risevision.com/hc/en-us/community/topics), otherwise submit a pull request and we will do our best to incorporate it. Please be sure to submit test cases with your code changes where appropriate.

## Resources
If you have any questions or problems, please don't hesitate to join our lively and responsive [community](https://help.risevision.com/hc/en-us/community/topics).

If you are looking for help with Rise Vision, please see [Help Center](https://help.risevision.com/hc/en-us).

**Facilitator**

[Stuart Lees](https://github.com/stulees "Stuart Lees")
