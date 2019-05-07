# rise-data-image demo

## Install polymer tools

This needs to be done just once per machine.

```bash
npm install -g polymer-cli@1.8.0
```

**Note**: If EPERM errors occur then install polymer-cli using the
`--unsafe-perm` flag ( `npm install -g polymer-cli@1.8.0 --unsafe-perm` )
and/or using sudo.

## Build instructions

Create a standalone project using the contents of this directory as a base.

Then run:

```bash
npm install
polymer build
```

The 'polymer build' command needs to be run after each change to the source
code.

The output is created into the build/prod directory.

## Run instructions

### Option a) Running the ChromeOS app in a local Chrome browser, and GCS.

This option is the most convenient if one does not want to install a local
copy of the Electron Player.

To do this all the contents of build/prod may be uploaded to GCS,
with public permissions and no caching. To avoid CORS issues, the server
domain of the published file must be risevision.com.

Then create a schedule that points to the published file, for example:

  http://widgets.risevision.com/staging/pages/2018.XX.XX.XX.XX/src/rise-image.html

Note that this is an HTTP URL, as ChromeOS Player currently requires that.

Then configure the local environment as described in the
[Financial Templates First - Local Development](https://docs.google.com/document/d/1xbtDo9GnhbH0lGeQmgTdSb-U5ed0vTjufhxZBV-1C4A/edit)
document. It's not necessary to point the schedule to a local URL as it's
described there, with the above URL for the schedule is enough.

Once the application has been configured and ran, an image referenced as the
file attribute in the rise-image tag should appear after a few seconds.
Status messages related to GCS download may appear also in the meantime.

### Option b) Using another local or remote server

It's also possible to use a local server or another remote GCS server other
than Rise Vision Storage, but there is a catch.

Running the page on a domain other than risevision.com will result in
CORS-related errors, due to browser restrictions.

A way to avoid such problems is to map GCS requests to local o remote locations
using a local proxy server such as Charles - https://www.charlesproxy.com/.

Another way to avoid such problems is to install and test using a local
installation of Rise Vision Electron Player, which is described in next
section.

### Option c) Running with Electron Player

Note that the page that runs in player-electron could use GCS, or a local or
remote server.

For example, to run a web server locally, one could run the following commands:

```bash
cd build/prod
python -m SimpleHTTPServer 8999
```

Then configure the schedule pointing to the URL:
http://localhost:8999/src/rise-image-electron.html

Add a display id to that schedule, and open an Electron Player for that
display id.
