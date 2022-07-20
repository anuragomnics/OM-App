import {EventRegister} from 'react-native-event-listeners';
import TrackPlayer, {Event} from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', async () => {
    await TrackPlayer.play();
    EventRegister.emit('trackPlayerEvent', 'play');
  });
  TrackPlayer.addEventListener('remote-pause', async () => {
    await TrackPlayer.pause();
    EventRegister.emit('trackPlayerEvent', 'pause');
  });
  TrackPlayer.addEventListener('remote-stop', async () => {
    await TrackPlayer.destroy();
    EventRegister.emit('trackPlayerEvent', 'stop');
  });
};
