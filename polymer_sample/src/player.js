/**
 * Copyright (C) 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @param {string} id Element id.
 * @return {?Element} The document element with the specified id.
 */
function $(id) {
  return document.getElementById(id);
}


/**
 * Initialize cast service.
 * @param {boolean} isAvailable
 * @param {?string} reason
 */
window['__onGCastApiAvailable'] = function(isAvailable, reason) {

  if (isAvailable) {
    // Init cast
    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });
    $('remotePlayer').initController();
    $('remotePlayer').controller.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        connectHandler);
    connectHandler();
  } else {
    document.getElementById('castDiv').style.display = 'none';
    document.getElementById('castError').innerText = reason;
  }
};


/**
 * Handler for cast connect/disconnect events.
 */
function connectHandler() {
  var localPlayer = $('localPlayer');
  var remotePlayer = $('remotePlayer');
  if (remotePlayer.isConnected) {
    localPlayer.hidden = true;
    // Continue playing remotely what was playing locally.
    if (localPlayer.src) {
      // Resume local playing media on remote if remote is not playing.
      if (localPlayer.currentTime < localPlayer.duration &&
          !remotePlayer.isMediaLoaded) {
        playRemote(
            getMediaIndex(localPlayer.src), localPlayer.currentTime,
            localPlayer.paused);
        localPlayer.removeAttribute('src');
        localPlayer.load();
      }
    }
  } else {
    localPlayer.hidden = false;
    // Continue playing locally what was playing remotely.
    if (remotePlayer.savedPlayerState &&
        remotePlayer.savedPlayerState.mediaInfo) {
      var mediaId =
          getMediaIndex(remotePlayer.savedPlayerState.mediaInfo.contentId);
      if (mediaId >= 0) {
        playLocally(
            mediaId, remotePlayer.savedPlayerState.currentTime,
            remotePlayer.savedPlayerState.isPaused);
      } else {
        console.log(
            'Unknown media is playing ' +
            remotePlayer.savedPlayerState.mediaInfo.contentId);
      }
    }
  }
}


var MEDIA_SOURCE_ROOT =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';


/**
 * Available media.
 */
var MEDIA_CONTENT = [
  {
    'source': MEDIA_SOURCE_ROOT + 'BigBuckBunny.mp4',
    'title': 'Big Buck Bunny',
    'subtitle': 'By Blender Foundation',
    'thumb': MEDIA_SOURCE_ROOT + 'images/BigBuckBunny.jpg',
    'contentType': 'video/mp4'
  },
  {
    'source': MEDIA_SOURCE_ROOT + 'Sintel.mp4',
    'title': 'Sintel',
    'subtitle': 'By Blender Foundation',
    'thumb': MEDIA_SOURCE_ROOT + 'images/Sintel.jpg',
    'contentType': 'video/mp4'
  }
];


/**
 * @param {string} source Media source url which is used as contentId.
 * @return {number} The media index, or -1 if not found.
 */
function getMediaIndex(source) {
  for (var i = 0; i < MEDIA_CONTENT.length; i++) {
    if (MEDIA_CONTENT[i]['source'] == source) {
      return i;
    }
  }
  return -1;
}


/**
 * Start playing media on remote device.
 * @param {number} mediaIndex Media index.
 */
function playMedia(mediaIndex) {
  if ($('remotePlayer').isConnected) {
    playRemote(mediaIndex, 0, false);
  } else {
    playLocally(mediaIndex, 0, false);
  }
}


/**
 * Play media on remote device.
 * @param {number} mediaIndex Media index.
 * @param {number} currentTime Seek time into the media.
 * @param {boolean} isPaused Media will start paused if true;
 */
function playRemote(mediaIndex, currentTime, isPaused) {
  var session = cast.framework.CastContext.getInstance().getCurrentSession();
  if (session) {
    var content = MEDIA_CONTENT[mediaIndex];
    var mediaInfo = new chrome.cast.media.MediaInfo(
        content['source'], content['contentType']);
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.title = content['title'];
    mediaInfo.metadata.subtitle = content['subtitle'];
    mediaInfo.metadata.images = [{'url': content['thumb']}];
    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.currentTime = currentTime;
    request.autoplay = !isPaused;
    session.loadMedia(request).then(
        function() { console.log('Load succeed'); },
        function(e) { console.log('Load failed ' + e); });
  }
}


/**
 * Play media on local player.
 * @param {number} mediaIndex Media index.
 * @param {number} currentTime Seek time into the media.
 * @param {boolean} isPaused Media will start paused if true;
 */
function playLocally(mediaIndex, currentTime, isPaused) {
  var content = MEDIA_CONTENT[mediaIndex];
  var localPlayer = $('localPlayer');
  localPlayer.src = content['source'];
  localPlayer.currentTime = currentTime;
  localPlayer.load();
  if (isPaused) {
    localPlayer.pause();
  } else {
    localPlayer.play();
  }
}
