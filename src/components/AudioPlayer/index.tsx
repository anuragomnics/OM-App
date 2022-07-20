import React, {FC, useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import TrackPlayer, {Capability, Event, Track} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import {EventRegister} from 'react-native-event-listeners';

import {c, f, l, t} from '../../styles/shared';
import Text from '../Text';
import SpinnerLoader, {AudioPlayingLoader} from '../../loaders/SpinnerLoader';
import {useAppSelector} from '../../hooks/useRedux';
import {ThemeSelector} from '../../store/Configuration';

interface AudioPlayerProps {
  poster: string;
  mediaUrl: string;
  title: string;
  duration: number;
}

const AudioPlayer: FC<AudioPlayerProps> = ({
  poster,
  mediaUrl,
  title,
  duration,
}) => {
  const accentColor = usePrimaryStyles().color;
  const appTheme = useAppSelector(ThemeSelector());

  // state
  const [trackPlayingStatus, setTrackPlayingStatus] = useState('ready');
  const [isLoading, setIsLoading] = useState(false);

  const startPlayer = async () => {
    setIsLoading(true);
    const TRACK_PLAYER_CONTROLS_OPTS = {
      stopWithApp: true,
      capabilities: [Capability.Play, Capability.Pause],
      compactCapabilities: [Capability.Play, Capability.Pause],
    };

    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions(TRACK_PLAYER_CONTROLS_OPTS);
    await TrackPlayer.reset();
    await TrackPlayer.add({
      url: mediaUrl,
      title: title,
      artwork: poster,
      duration: duration,
      artist: '',
    });

    // Start playing it
    await TrackPlayer.play();
    setIsLoading(false);
  };

  const registerPlayer = async () => {};

  useEffect(() => {
    EventRegister.addEventListener('trackPlayerEvent', data => {
      data === 'pause' && setTrackPlayingStatus('paused');
      data === 'play' && setTrackPlayingStatus('playing');
      data === 'stop' && setTrackPlayingStatus('ready');
    });
    registerPlayer();
  }, []);

  const handleAudioControls = async (control: string) => {
    if (control === 'play') {
      startPlayer();
      setTrackPlayingStatus('playing');
    }
    if (control === 'pause') {
      await TrackPlayer.pause();
      setTrackPlayingStatus('paused');
    }
  };

  return (
    <>
      <View
        style={[
          l.flexRow,
          l.alignCtr,
          // l.justifyCtr,
          l.p10,
          {
            backgroundColor: appTheme === 'light' ? '#f5f5f5' : '#212121',
            borderRadius: 15,
          },
        ]}>
        <View style={{...styles.controlWrapper, backgroundColor: accentColor}}>
          {(trackPlayingStatus === 'paused' ||
            trackPlayingStatus !== 'playing') && (
            <TouchableOpacity
              onPress={() => {
                handleAudioControls('play');
              }}>
              <Icon name={'play-arrow'} size={45} color={c.white} />
            </TouchableOpacity>
          )}

          {trackPlayingStatus === 'playing' && (
            <TouchableOpacity
              onPress={() => {
                handleAudioControls('pause');
              }}>
              <Icon name={'pause'} size={45} color={c.white} />
            </TouchableOpacity>
          )}
        </View>
        {isLoading && (
          <View>
            <Text>loading...</Text>
          </View>
        )}
        {!isLoading && (
          <>
            {trackPlayingStatus === 'playing' ? (
              <View style={[l.flexRow, l.ml20]}>
                <AudioPlayingLoader />
              </View>
            ) : (
              <Text style={[t.h4SM, f.fontWeightMedium, l.ml20]}>
                {duration}
              </Text>
            )}
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  controlWrapper: {
    borderRadius: 100,
  },
});

export default AudioPlayer;
