export function recorder(afterRecord: any) {
  const microphoneButton = document.getElementsByClassName(
    'start-recording-button',
  )[0];
  const recordingControlButtonsContainer = document.getElementsByClassName(
    'recording-contorl-buttons-container',
  )[0];
  const stopRecordingButton = document.getElementsByClassName(
    'stop-recording-button',
  )[0];
  const cancelRecordingButton = document.getElementsByClassName(
    'cancel-recording-button',
  )[0];
  const elapsedTimeTag = document.getElementsByClassName('elapsed-time')[0];
  const closeBrowserNotSupportedBoxButton = document.getElementsByClassName(
    'close-browser-not-supported-box',
  )[0];
  const overlay = document.getElementsByClassName('overlay')[0];
  const audioElement = document.getElementsByClassName('audio-element')[0];
  // let audioElementSource = document
  //   .getElementsByClassName('audio-element')[0]
  //   .getElementsByTagName('source')[0];
  const textIndicatorOfAudiPlaying = document.getElementsByClassName(
    'text-indication-of-audio-playing',
  )[0];

  //Listeners

  //Listen to start recording button
  // @ts-expect-error - no types
  microphoneButton.onclick = startAudioRecording;

  //Listen to stop recording button
  // @ts-expect-error - no types

  stopRecordingButton.onclick = stopAudioRecording;

  //Listen to cancel recording button
  // @ts-expect-error - no types

  cancelRecordingButton.onclick = cancelAudioRecording;

  //Listen to when the ok button is clicked in the browser not supporting audio recording box
  // @ts-expect-error - no types

  closeBrowserNotSupportedBoxButton.onclick = hideBrowserNotSupportedOverlay;

  //Listen to when the audio being played ends
  // @ts-expect-error - no types

  audioElement.onended = hideTextIndicatorOfAudioPlaying;

  /** Displays recording control buttons */
  function handleDisplayingRecordingControlButtons() {
    //Hide the microphone button that starts audio recording
    // @ts-expect-error - no types

    microphoneButton.style.display = 'none';

    //Display the recording control buttons
    recordingControlButtonsContainer.classList.remove('hide');

    //Handle the displaying of the elapsed recording time
    handleElapsedRecordingTime();
  }

  /** Hide the displayed recording control buttons */
  function handleHidingRecordingControlButtons() {
    //Display the microphone button that starts audio recording
    // @ts-expect-error - no types

    microphoneButton.style.display = 'block';

    //Hide the recording control buttons
    recordingControlButtonsContainer.classList.add('hide');

    //stop interval that handles both time elapsed and the red dot

    clearInterval(elapsedTimeTimer);
  }

  /** Displays browser not supported info box for the user*/
  function displayBrowserNotSupportedOverlay() {
    overlay.classList.remove('hide');
  }

  /** Displays browser not supported info box for the user*/
  function hideBrowserNotSupportedOverlay() {
    overlay.classList.add('hide');
  }

  /** Creates a source element for the the audio element in the HTML document*/
  // function createSourceForAudioElement() {
  //   const sourceElement = document.createElement('source');
  //   audioElement.appendChild(sourceElement);

  //   audioElementSource = sourceElement;
  // }

  /** Display the text indicator of the audio being playing in the background */
  // function displayTextIndicatorOfAudioPlaying() {
  //   textIndicatorOfAudiPlaying.classList.remove('hide');
  // }

  /** Hide the text indicator of the audio being playing in the background */
  function hideTextIndicatorOfAudioPlaying() {
    textIndicatorOfAudiPlaying.classList.add('hide');
  }

  //Controller

  /** Stores the actual start time when an audio recording begins to take place to ensure elapsed time start time is accurate*/

  let audioRecordStartTime: any;

  /** Stores the maximum recording time in hours to stop recording once maximum recording hour has been reached */
  const maximumRecordingTimeInHours = 1;

  /** Stores the reference of the setInterval function that controls the timer in audio recording*/

  let elapsedTimeTimer: any;

  /** Starts the audio recording*/
  function startAudioRecording() {
    console.log('Recording Audio...');

    //If a previous audio recording is playing, pause it
    // @ts-expect-error - no types

    const recorderAudioIsPlaying = !audioElement.paused; // the paused property tells whether the media element is paused or not
    console.log('paused?', !recorderAudioIsPlaying);
    if (recorderAudioIsPlaying) {
      // @ts-expect-error - no types

      audioElement.pause();
      //also hide the audio playing indicator displayed on the screen
      hideTextIndicatorOfAudioPlaying();
    }

    //start recording using the audio recording API
    audioRecorder
      .start()
      .then(() => {
        //on success

        //store the recording start time to display the elapsed time according to it
        audioRecordStartTime = new Date();

        //display control buttons to offer the functionality of stop and cancel
        handleDisplayingRecordingControlButtons();
      })
      .catch((error: any) => {
        //on error
        //No Browser Support Error
        if (
          error.message.includes(
            'mediaDevices API or getUserMedia method is not supported in this browser.',
          )
        ) {
          console.log('To record audio, use browsers like Chrome and Firefox.');
          displayBrowserNotSupportedOverlay();
        }

        //Error handling structure
        switch (error.name) {
          case 'AbortError': //error from navigator.mediaDevices.getUserMedia
            console.log('An AbortError has occured.');
            break;
          case 'NotAllowedError': //error from navigator.mediaDevices.getUserMedia
            console.log(
              'A NotAllowedError has occured. User might have denied permission.',
            );
            break;
          case 'NotFoundError': //error from navigator.mediaDevices.getUserMedia
            console.log('A NotFoundError has occured.');
            break;
          case 'NotReadableError': //error from navigator.mediaDevices.getUserMedia
            console.log('A NotReadableError has occured.');
            break;
          case 'SecurityError': //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
            console.log('A SecurityError has occured.');
            break;
          case 'TypeError': //error from navigator.mediaDevices.getUserMedia
            console.log('A TypeError has occured.');
            break;
          case 'InvalidStateError': //error from the MediaRecorder.start
            console.log('An InvalidStateError has occured.');
            break;
          case 'UnknownError': //error from the MediaRecorder.start
            console.log('An UnknownError has occured.');
            break;
          default:
            console.log('An error occured with the error name ' + error.name);
        }
      });
  }

  /** Stop the currently started audio recording & sends it
   */
  function stopAudioRecording() {
    console.log('Stopping Audio Recording...');

    //stop the recording using the audio recording API
    audioRecorder
      .stop()
      .then((audioAsblob: any) => {
        //Play recorder audio
        afterRecord(audioAsblob);

        //hide recording control button & return record icon
        handleHidingRecordingControlButtons();
      })
      .catch((error: any) => {
        //Error handling structure
        switch (error.name) {
          case 'InvalidStateError': //error from the MediaRecorder.stop
            console.log('An InvalidStateError has occured.');
            break;
          default:
            console.log('An error occured with the error name ' + error.name);
        }
      });
  }

  /** Cancel the currently started audio recording */
  function cancelAudioRecording() {
    console.log('Canceling audio...');

    //cancel the recording using the audio recording API
    audioRecorder.cancel();

    //hide recording control button & return record icon
    handleHidingRecordingControlButtons();
  }

  /** Plays recorded audio using the audio element in the HTML document
   * @param {Blob} recorderAudioAsBlob - recorded audio as a Blob Object
   */
  // function playAudio(recorderAudioAsBlob) {
  //   //read content of files (Blobs) asynchronously
  //   const reader = new FileReader();

  //   //once content has been read
  //   reader.onload = (e) => {
  //     //store the base64 URL that represents the URL of the recording audio
  //     // @ts-expect-error - no types
  //     const base64URL = e.target.result;

  //     //If this is the first audio playing, create a source element
  //     //as pre populating the HTML with a source of empty src causes error
  //     if (!audioElementSource)
  //       //if its not defined create it (happens first time only)
  //       createSourceForAudioElement();

  //     //set the audio element's source using the base64 URL
  //     // @ts-expect-error - no types
  //     audioElementSource.src = base64URL;

  //     //set the type of the audio element based on the recorded audio's Blob type
  //     const BlobType = recorderAudioAsBlob.type.includes(';')
  //       ? recorderAudioAsBlob.type.substr(
  //           0,
  //           recorderAudioAsBlob.type.indexOf(';'),
  //         )
  //       : recorderAudioAsBlob.type;
  //     audioElementSource.type = BlobType;

  //     //call the load method as it is used to update the audio element after changing the source or other settings
  //     // @ts-expect-error - no types
  //     audioElement.load();

  //     //play the audio after successfully setting new src and type that corresponds to the recorded audio
  //     console.log('Playing audio...');
  //     // @ts-expect-error - no types
  //     audioElement.play();

  //     //Display text indicator of having the audio play in the background
  //     displayTextIndicatorOfAudioPlaying();
  //   };

  //   //read content and convert it to a URL (base64)
  //   reader.readAsDataURL(recorderAudioAsBlob);
  // }

  /** Computes the elapsed recording time since the moment the function is called in the format h:m:s*/
  function handleElapsedRecordingTime() {
    //display inital time when recording begins
    displayElapsedTimeDuringAudioRecording('00:00');

    //create an interval that compute & displays elapsed time, as well as, animate red dot - every second
    // @ts-expect-error - no types
    elapsedTimeTimer: NodeJS.Timeout = setInterval(() => {
      //compute the elapsed time every second
      const elapsedTime = computeElapsedTime(audioRecordStartTime); //pass the actual record start time
      //display the elapsed time
      displayElapsedTimeDuringAudioRecording(elapsedTime);
    }, 1000); //every second
  }

  /** Display elapsed time during audio recording
   * @param {String} elapsedTime - elapsed time in the format mm:ss or hh:mm:ss
   */
  function displayElapsedTimeDuringAudioRecording(elapsedTime: any) {
    //1. display the passed elapsed time as the elapsed time in the elapsedTime HTML element
    elapsedTimeTag.innerHTML = elapsedTime;

    //2. Stop the recording when the max number of hours is reached
    if (elapsedTimeReachedMaximumNumberOfHours(elapsedTime)) {
      stopAudioRecording();
    }
  }

  /**
   * @param {String} elapsedTime - elapsed time in the format mm:ss or hh:mm:ss
   * @returns {Boolean} whether the elapsed time reached the maximum number of hours or not
   */
  function elapsedTimeReachedMaximumNumberOfHours(elapsedTime: any) {
    //Split the elapsed time by the symbo :
    const elapsedTimeSplitted = elapsedTime.split(':');

    //Turn the maximum recording time in hours to a string and pad it with zero if less than 10
    const maximumRecordingTimeInHoursAsString =
      maximumRecordingTimeInHours < 10
        ? '0' + maximumRecordingTimeInHours
        : maximumRecordingTimeInHours.toString();

    //if it the elapsed time reach hours and also reach the maximum recording time in hours return true
    if (
      elapsedTimeSplitted.length === 3 &&
      elapsedTimeSplitted[0] === maximumRecordingTimeInHoursAsString
    )
      return true;
    //otherwise, return false
    else return false;
  }

  /** Computes the elapsedTime since the moment the function is called in the format mm:ss or hh:mm:ss
   * @param {String} startTime - start time to compute the elapsed time since
   * @returns {String} elapsed time in mm:ss format or hh:mm:ss format, if elapsed hours are 0.
   */
  function computeElapsedTime(startTime: any) {
    //record end time
    const endTime = new Date();

    //time difference in ms
    // @ts-expect-error - no types
    let timeDiff = endTime - startTime;

    //convert time difference from ms to seconds
    timeDiff = timeDiff / 1000;

    //extract integer seconds that dont form a minute using %
    let seconds = Math.floor(timeDiff % 60); //ignoring uncomplete seconds (floor)

    //pad seconds with a zero if neccessary
    // @ts-expect-error - no types
    seconds = seconds < 10 ? '0' + seconds : seconds;

    //convert time difference from seconds to minutes using %
    timeDiff = Math.floor(timeDiff / 60);

    //extract integer minutes that don't form an hour using %
    let minutes = timeDiff % 60; //no need to floor possible incomplete minutes, becase they've been handled as seconds
    // @ts-expect-error - no types
    minutes = minutes < 10 ? '0' + minutes : minutes;

    //convert time difference from minutes to hours
    timeDiff = Math.floor(timeDiff / 60);

    //extract integer hours that don't form a day using %
    const hours = timeDiff % 24; //no need to floor possible incomplete hours, becase they've been handled as seconds

    //convert time difference from hours to days
    timeDiff = Math.floor(timeDiff / 24);

    // the rest of timeDiff is number of days
    const days = timeDiff; //add days to hours

    let totalHours = hours + days * 24;
    // @ts-expect-error - no types

    totalHours = totalHours < 10 ? '0' + totalHours : totalHours;

    // @ts-expect-error - no types

    if (totalHours === '00') {
      return minutes + ':' + seconds;
    } else {
      return totalHours + ':' + minutes + ':' + seconds;
    }
  }

  // audio-recording.js ---------------
  //API to handle audio recording

  const audioRecorder: any = {
    /** Stores the recorded audio as Blob objects of audio data as the recording continues*/
    audioBlobs: [] /*of type Blob[]*/,
    /** Stores the reference of the MediaRecorder instance that handles the MediaStream when recording starts*/
    mediaRecorder: null /*of type MediaRecorder*/,
    /** Stores the reference to the stream currently capturing the audio*/
    streamBeingCaptured: null /*of type MediaStream*/,
    /** Start recording the audio
     * @returns {Promise} - returns a promise that resolves if audio recording successfully started
     */
    start: function () {
      //Feature Detection
      if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        //Feature is not supported in browser
        //return a custom error
        return Promise.reject(
          new Error(
            'mediaDevices API or getUserMedia method is not supported in this browser.',
          ),
        );
      } else {
        //Feature is supported in browser

        //create an audio stream
        return (
          navigator.mediaDevices
            .getUserMedia({ audio: true } /*of type MediaStreamConstraints*/)
            //returns a promise that resolves to the audio stream
            .then((stream) /*of type MediaStream*/ => {
              //save the reference of the stream to be able to stop it when necessary
              audioRecorder.streamBeingCaptured = stream;

              //create a media recorder instance by passing that stream into the MediaRecorder constructor
              audioRecorder.mediaRecorder = new MediaRecorder(
                stream,
              ); /*the MediaRecorder interface of the MediaStream Recording
                    API provides functionality to easily record media*/

              //clear previously saved audio Blobs, if any
              audioRecorder.audioBlobs = [];

              //add a dataavailable event listener in order to store the audio data Blobs when recording
              audioRecorder.mediaRecorder.addEventListener(
                'dataavailable',
                (event: any) => {
                  //store audio Blob object
                  (audioRecorder.audioBlobs as any).push(event.data);
                },
              );

              //start the recording by calling the start method on the media recorder
              audioRecorder.mediaRecorder.start();
            })
        );

        /* errors are not handled in the API because if its handled and the promise is chained, the .then after the catch will be executed*/
      }
    },
    /** Stop the started audio recording
     * @returns {Promise} - returns a promise that resolves to the audio as a blob file
     */
    stop: function () {
      //return a promise that would return the blob or URL of the recording
      return new Promise((resolve) => {
        //save audio type to pass to set the Blob type
        const mimeType = audioRecorder.mediaRecorder.mimeType;

        //listen to the stop event in order to create & return a single Blob object
        audioRecorder.mediaRecorder.addEventListener('stop', () => {
          //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
          const audioBlob = new Blob(audioRecorder.audioBlobs, {
            type: mimeType,
          });

          //resolve promise with the single audio blob representing the recorded audio
          resolve(audioBlob);
        });
        audioRecorder.cancel();
      });
    },
    /** Cancel audio recording*/
    cancel: function () {
      //stop the recording feature
      audioRecorder.mediaRecorder.stop();

      //stop all the tracks on the active stream in order to stop the stream
      audioRecorder.stopStream();

      //reset API properties for next recording
      audioRecorder.resetRecordingProperties();
    },
    /** Stop all the tracks on the active stream in order to stop the stream and remove
     * the red flashing dot showing in the tab
     */
    stopStream: function () {
      //stopping the capturing request by stopping all the tracks on the active stream
      audioRecorder.streamBeingCaptured
        .getTracks() //get all tracks from the stream
        .forEach((track: any) /*of type MediaStreamTrack*/ => track.stop()); //stop each one
    },
    /** Reset all the recording properties including the media recorder and stream being captured*/
    resetRecordingProperties: function () {
      audioRecorder.mediaRecorder = null;
      audioRecorder.streamBeingCaptured = null;

      /*No need to remove event listeners attached to mediaRecorder as
            If a DOM element which is removed is reference-free (no references pointing to it), the element itself is picked
            up by the garbage collector as well as any event handlers/listeners associated with it.
            getEventListeners(audioRecorder.mediaRecorder) will return an empty array of events.*/
    },
  };
}