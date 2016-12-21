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
 * Polymer element for cast remote player.
 */
var Player = Polymer({
  is: 'cast-remote-player',
  properties: {
    isConnected: {type: Boolean, value: false},
    isMediaLoaded: {type: Boolean, value: false},
    currentTime: {type: Number, observer: 'onCurrentTimeChange', value: 0},
    displayedCurrentTime: {type: Number, value: 0},
    duration: {type: Number, value: 0},
    volumeLevel: {type: Number, observer: 'onVolumeLevelChange', value: 0},
    isPaused: {type: Boolean, value: false},
    isMuted: {type: Boolean, value: false},
    canPause: {type: Boolean, value: false},
    canSeek: {type: Boolean, value: false},
    statusText: {type: String, value: ''},
    timeSliderValue: {type: Number, value: 0},
    volumeSliderValue: {type: Number, value: 0},
    controller: {type: Object, value: null}
  },
  ready: function() {
    /**
     * If true, we avoid propagating volumeLevel changes to the slider's 'value'
     * property. The paper-slider element can mishandle external changes
     * to its 'value' property while the user is dragging.
     * @private {boolean}
     */
    this.ignoreExternalVolumeUpdates_ = false;

    /**
     * Whether to ignore changes to current time requested by the controller.
     * True while the user is dragging the slider.
     * @private {boolean}
     */
    this.ignoreExternalTimeUpdates_ = false;

    this.initController();
  },
  /**
   * Create RemotePlayerController for the element.
   * Wait for cast framework to be loaded.
   * @suppress {checkTypes}
   */
  initController: function() {
    if (!window.cast || !cast.framework ||
        !cast.framework.RemotePlayerController) {
      window.setTimeout(this.initController.bind(this), 500);
      return;
    }
    this.controller = new cast.framework.RemotePlayerController(this);
  },
  onPlayPause: function() { this.controller.playOrPause(); },
  onMuteUnmute: function() { this.controller.muteOrUnmute(); },
  /**
   * @param {boolean} isPaused
   * @return {string}
   */
  getPlayPauseIcon: function(isPaused) {
    return isPaused ? 'av:play-arrow' : 'av:pause';
  },
  /**
   * @param {boolean} isMuted
   * @return {string}
   */
  getMuteUnmuteIcon: function(isMuted) {
    return isMuted ? 'av:volume-off' : 'av:volume-up';
  },
  /**
   * @param {number} newVolumeLevel
   * @param {number} oldVolumeLevel
   * */
  onVolumeLevelChange: function(newVolumeLevel, oldVolumeLevel) {
    if (this.ignoreExternalVolumeUpdates_) {
      return;
    }
    this.volumeSliderValue = newVolumeLevel;
  },
  /** @param {!Event} e */
  onVolumeSliderChange: function(e) {
    this.ignoreExternalVolumeUpdates_ = false;
    this.volumeLevel = e.target.value;
    this.controller.setVolumeLevel();
  },

  /** @param {!Event} e */
  onImmediateVolumeSliderChange: function(e) {
    this.ignoreExternalVolumeUpdates_ = true;
    this.volumeLevel = e.target.immediateValue;
    this.controller.setVolumeLevel();
  },

  /**
   * @param {number} newCurrentTime
   * @param {number} oldCurrentTime
   * */
  onCurrentTimeChange: function(newCurrentTime, oldCurrentTime) {
    if (this.ignoreExternalTimeUpdates_) {
      return;
    }
    this.displayedCurrentTime = newCurrentTime;
    this.timeSliderValue = (newCurrentTime * 100) / this.duration;
  },

  /** @param {!Event} e */
  onImmediateTimeSliderChange: function(e) {
    this.ignoreExternalTimeUpdates_ = true;
    this.displayedCurrentTime = (e.target.immediateValue * this.duration) / 100;
  },

  /** @param {!Event} e */
  onTimeSliderChange: function(e) {
    this.ignoreExternalTimeUpdates_ = false;
    this.currentTime = (e.target.value * this.duration) / 100;
    this.controller.seek();
  },
  /**
   * @param {number} timeInSec Must be positive. Intervals longer than 100 hours
   *     get truncated silently.
   * @return {string}
   */
  getFormattedTime: function(timeInSec) {
    if (!this.controller) {
      return '0:00:00';
    }
    return this.controller.getFormattedTime(timeInSec);
  }
});
