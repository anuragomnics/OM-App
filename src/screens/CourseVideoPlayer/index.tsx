import React, {FC, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Video from 'react-native-video';
import {RouteProp} from '@react-navigation/native';
// @ts-ignore
import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation-locker';

// custom
import Header from '../../components/Header';
import Text from '../../components/Text';
import {c, f, l, t} from '../../styles/shared';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ContainerStyles} from '../../styles/elements';

interface Props {
  mediaUrl: string;
}

const TABS = [
  {
    name: 'Description',
    id: 0,
  },
  {
    name: 'All Chapters',
    id: 1,
  },
];

const CourseVideoPlyer: FC<Props> = ({mediaUrl}) => {
  // @ts-ignore
  // const {chapter = {}, allChapters = []} = route.params;
  const primaryColor = usePrimaryStyles().color;

  // state
  const [showVideoControls, setShowVideoControls] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  // const [selectedChapter, setSelectedChapter] = useState<ChapterType>(chapter);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [isVideoSliding, setIsVideoSliding] = useState(false);
  const [sliderVideoTime, setSliderVideoTime] = useState(0);

  //refs
  const videoPlayerRef: any = useRef(null);

  useEffect(() => {
    return () => {
      Orientation.unlockAllOrientations();
      Orientation.lockToPortrait();
    };
  }, []);

  const toggleFullscreenMode = () => {
    // if (!fullscreenMode) {
    //   Orientation.lockToLandscapeLeft();
    // } else {
    //   Orientation.lockToPortrait();
    // }
    setFullscreenMode(!fullscreenMode);
  };

  return (
    <View style={[ContainerStyles, {backgroundColor: 'red'}]}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#000'} />
      <View
        style={[
          {
            backgroundColor: '#000',
            position: 'relative',
            marginTop: useSafeAreaInsets().top,
            borderWidth: 1,
          },
        ]}>
        <View
          style={[fullscreenMode ? styles.fullscreenWrapper : styles.wrapper]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setShowVideoControls(true);
            }}>
            <Video
              ref={videoPlayerRef}
              // source={require('../../assets/videos/sampleVideo2.mp4')}
              source={{
                uri: mediaUrl,
              }}
              onError={err => {
                console.log('videoErrr', err);
              }}
              style={styles.video}
              resizeMode="stretch"
              controls={false}
              paused={videoPaused}
              fullscreen={false}
              // fullscreenOrientation={'landscape'}
              onReadyForDisplay={() => {
                setIsVideoLoading(false);
              }}
              onProgress={data => {
                setCurrentVideoTime(data.currentTime);
              }}
            />
          </TouchableOpacity>

          {isVideoLoading ? (
            <View style={styles.videoLoader}>
              <ActivityIndicator size={'large'} color={c.white} />
            </View>
          ) : null}

          {/* video controls */}
          {showVideoControls && (
            <View style={styles.videoControlsMainContainer}>
              {/* outsde click component */}
              <View style={styles.videoControlsOuterContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setShowVideoControls(false);
                  }}
                  style={styles.videoControlsOuterWrapper}
                />
              </View>
              <View style={styles.videoControlsWrapper}>
                {/* row -1 */}
                <View />
                {/* row - 2 */}
                <View style={[l.flexRow, l.alignCtr, l.justifyCtr]}>
                  {/* pause and play */}
                  {videoPaused ? (
                    <TouchableOpacity
                      onPress={() => {
                        setVideoPaused(false);
                        setShowVideoControls(false);
                      }}>
                      <Icon name={'play-arrow'} size={60} color={c.white} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setVideoPaused(true);
                      }}>
                      <Icon name={'pause'} size={60} color={c.white} />
                    </TouchableOpacity>
                  )}
                </View>
                {/* row-3 */}
                <View style={[l.flexRow, l.alignCtr]}>
                  <Text style={styles.videoDuration}>
                    {`${Math.floor(
                      (!isVideoSliding ? currentVideoTime : sliderVideoTime) /
                        60,
                    )}:${Math.floor(
                      (!isVideoSliding ? currentVideoTime : sliderVideoTime) %
                        60,
                    )
                      .toString()
                      .padStart(2, '0')}`}
                  </Text>
                  {/* video slider */}
                  <Slider
                    style={styles.slider}
                    value={!isVideoSliding ? currentVideoTime : sliderVideoTime}
                    onSlideStart={() => {
                      setIsVideoSliding(true);
                    }}
                    onValueChange={(val: number) => {
                      // setSliderVideoTime(val);
                    }}
                    onSlidingComplete={(currVal: number) => {
                      setIsVideoSliding(false);
                      setCurrentVideoTime(currVal);
                      videoPlayerRef?.current?.seek(currVal);
                    }}
                    step={1}
                    maximumValue={596}
                    minimumTrackTintColor={primaryColor}
                    maximumTrackTintColor={c.grey50}
                    thumbTintColor={c.white}
                  />
                  <Text style={styles.videoDuration}>{'9:56'}</Text>
                  <TouchableOpacity
                    style={[l.ml10]}
                    onPress={toggleFullscreenMode}>
                    <Icon
                      name={fullscreenMode ? 'fullscreen-exit' : 'fullscreen'}
                      color={c.white}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* content */}
      <ScrollView
        contentContainerStyle={[l.p20]}
        bounces={false}
        showsVerticalScrollIndicator={false}></ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenWrapper: {
    height: '100%',
    width: '100%',
    // position: 'absolute',
  },
  wrapper: {
    height: 250,
  },
  video: {
    height: '100%',
    width: '100%',
  },
  videoLoader: {
    position: 'absolute',
    ...l.fullWidth,
    height: '100%',
    ...l.alignCtr,
    ...l.justifyCtr,
  },
  videoControlsMainContainer: {
    position: 'absolute',
    ...l.fullWidth,
    height: '100%',
  },
  videoControlsOuterContainer: {
    position: 'absolute',
    backgroundColor: '#000',
    ...l.fullWidth,
    height: '100%',
    opacity: 0.6,
  },
  videoControlsOuterWrapper: {
    ...l.fullWidth,
    height: '100%',
  },
  videoControlsWrapper: {
    ...l.fullWidth,
    height: '100%',
    ...l.p10,
    ...l.justifyBtw,
  },
  slider: {
    flex: 1,
    ...l.mx10,
  },
  videoDuration: {
    color: c.white,
  },
  chaptersDivider: {
    height: 1.5,
    backgroundColor: c.grey50,
    ...l.my20,
  },
});

export default CourseVideoPlyer;
