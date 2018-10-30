# CastVideos-chrome-samples

These Google Cast demo apps show how to cast videos from a Chrome browser using
Cast Chrome Sender SDK. They serve to demonstrate writing an HTML/Javascript
Cast sender app with various technologies including [Angular](https://angularjs.org/)
and [Polymer](https://www.polymer-project.org/1.0/).

**These are sender apps to be used as the starting point for your Chrome sender app**

* [Events Sample](/events_sample)
* [Angular Sample](/angular_sample)
* [Polymer Sample](/polymer_sample)

Here is the list of reference apps:

* [Chrome Sender: CastVideos-chrome](https://github.com/googlecast/CastVideos-chrome)
* [Android Sender: CastVideos-android](https://github.com/googlecast/CastVideos-android)
* [iOS Sender: CastVideos-ios](https://github.com/googlecast/CastVideos-ios)
* [CAF Receiver: BasicReceiverCAF](https://github.com/googlecast/BasicReceiverCAF)

## Setup Instructions

### Pre-requisites
 1. Get a Chromecast device
 2. Install appropriate Chrome browser

See the developer guide and release notes at https://developers.google.com/cast/ for more details.

### Steps:

 1. Put all files on your own server
 2. Use the default media receiver app: no change or change YOUR_APP_ID to your own in *_sample/player.js

#### Events/Angular Sample
 3. Open a browser and point to your page at http://[YOUR_SERVER_LOCATION]/*_sample/

#### Polymer sample
 3. Install [Bower](https://bower.io/)
 4. Install [Polymer CLI](https://www.polymer-project.org/1.0/start/)
 5. In the sample root directory, run `bower install`
 6. In the sample root directory, run `polymer build`, then `polymer serve build/unbundled`
 7. Open a browser and point to your page at http://[YOUR_SERVER_LOCATION]/polymer_sample/

## References
* Developer Guides: https://developers.google.com/cast/
* Cast APIs: http://developers.google.com/cast/docs/reference/chrome
* Design Checklist: http://developers.google.com/cast/docs/design_checklist

## How to report bugs
* For Cast SDK issues: https://devsite.googleplex.com/cast/docs/support
* For sample apps issues, please open a bug here on GitHub

## How to make contributions?
Please read and follow the steps in the CONTRIBUTING.md

## License
See LICENSE.md

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/) and the [Google Cast SDK Additional Developer Terms of Service](https://developers.google.com/cast/docs/terms/).

## Google+
Google Cast Developers Community on Google+ [http://goo.gl/TPLDxj](http://goo.gl/TPLDxj)
