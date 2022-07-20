import React, {FC, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
  LogBox,
  BackHandler,
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
import {RootStackParams, ScreenID} from '../../navigation/types';
import {ChapterType} from '../../types/responses/SingleCourseResponseType';

import DeviceHelper from '../../config/DeviceHelper';
import TabBar from '../../components/TabBar';
import {
  BoxShadowStyles,
  ContainerStyles,
  useContainerStyles,
} from '../../styles/elements';
import ChapterItem from '../../components/ChapterItem';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import Description from '../../screens/CourseDetails/Components/Description';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {FontsSelector, ThemeSelector} from '../../store/Configuration';
import {PostType} from '../../types/responses/PostsListResponseType';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {closeVideoPlayer, VideoPlayerContentSelector} from '../../store/News';
import {PERMISSIONS} from 'react-native-permissions';
import {useColors} from '../../styles/shared/Colors';

interface Props {}

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

const VideoPlayer: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const VideoPlayerContent = useAppSelector(VideoPlayerContentSelector());
  const appTheme = useAppSelector(ThemeSelector());
  const colors = useColors();
  const {top, bottom} = useSafeAreaInsets();
  const fonts = useAppSelector(FontsSelector());

  const primaryColor = usePrimaryStyles().color;
  const normalFont = fonts.filter(font => {
    return font.fontWeight == '300';
  });
  const fontUrl = normalFont[0]
    ? normalFont[0].fontURL
    : fonts?.[0]?.fontURL || '';

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
  const [showModal, setShowModal] = useState(false);
  const [ViewType, setViewType] = useState<'full' | 'minimized'>('full');
  const [ViewTypeTemp, setViewTypeTemp] = useState<'full' | 'minimized'>(
    'full',
  );

  // let isVideoSliding = false;

  //refs
  const videoPlayerRef: any = useRef(null);
  const backHandler = useRef(null);
  const videoDuration = useRef(0);

  let timer: NodeJS.Timeout;
  let touchY = useRef(null);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onBackPress = () => {
    if (ViewType === 'full') {
      dispatch(closeVideoPlayer());
    }
  };

  const addBackHandler = () => {
    //@ts-ignore
    backHandler.current = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onBackPress();
        return true;
      },
    );
  };

  const removeBackHandler = () => {
    // @ts-ignore
    backHandler?.current?.remove();
  };

  useEffect(() => {
    Orientation.lockToPortrait();
    addBackHandler();

    return () => {
      Orientation.lockToPortrait();
      Orientation.unlockAllOrientations();
      removeBackHandler();
    };
  }, []);

  const setTimer = (cb: Function, time: number) => {
    const timer = setTimeout(() => {
      cb();
    }, time);
  };

  const clearTimer = () => {
    timer && clearTimeout(timer);
  };

  const offset = useSharedValue(Dimensions.get('window').height);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: withTiming(offset.value, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }).valueOf(),
    };
  });

  const toggleFullscreenMode = () => {
    if (!fullscreenMode) {
      Orientation.lockToLandscapeLeft();
      offset.value = Dimensions.get('window').width;
    } else {
      Orientation.lockToPortrait();
      Orientation.unlockAllOrientations();
      offset.value = Dimensions.get('window').width;
    }
    setFullscreenMode(!fullscreenMode);
  };

  const exitVideoPlayer = () => {
    dispatch(closeVideoPlayer());
  };

  interface TestProps {
    bool: boolean;
    children: React.ReactNode;
  }

  return (
    <>
      <Animated.View
        style={[
          // conatinerStyles,
          {
            backgroundColor: appTheme === 'light' ? '#fff' : '#121212',
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: 97,
            bottom: 0,
            paddingTop: ViewType === 'full' ? top : 0,
          },
          animatedStyles,
          ViewType === 'full'
            ? fullscreenMode
              ? styles.fullScreenModal
              : styles.modal
            : {
                ...styles.minimisedModal,
                marginBottom: bottom + 50,
                ...BoxShadowStyles,
              },
        ]}>
        {/* {!fullscreenMode && (
        <Header useBack title={'hey'} onBackPress={exitVideoPlayer} />
      )} */}
        <View
          style={[
            {height: fullscreenMode ? '100%' : 250},
            ViewType === 'minimized'
              ? {...l.flexRow, ...l.justifyBtw, height: 70}
              : {},
          ]}
          // @ts-ignore
          onTouchStart={e => (touchY.current = e.nativeEvent.pageY)}
          onTouchEnd={e => {
            if (
              !fullscreenMode &&
              touchY.current &&
              // @ts-ignore
              touchY.current - e.nativeEvent.pageY < -40
            ) {
              touchY.current = null;
              offset.value = 70;
              setViewTypeTemp('minimized');
              setTimeout(() => {
                setViewType('minimized');
              }, 350);
              removeBackHandler();
            }
            if (
              ViewType === 'minimized' &&
              touchY.current &&
              // @ts-ignore
              touchY.current - e.nativeEvent.pageY > 40
            ) {
              offset.value = Dimensions.get('window').height;
              setViewTypeTemp('full');
              setViewType('full');
              addBackHandler();
            }
          }}>
          <View
            style={
              ViewType === 'minimized'
                ? styles.minimizedWrapper
                : fullscreenMode
                ? styles.fullscreenWrapper
                : styles.videoWrapper
            }>
            {isVideoLoading ? (
              <View style={styles.videoLoader}>
                <ActivityIndicator size={'large'} color={c.white} />
              </View>
            ) : null}

            {showVideoControls && !isVideoLoading && ViewType === 'full' && (
              <View
                // activeOpacity={1}
                style={[
                  fullscreenMode
                    ? styles.fullScreenVideoControlsContainer
                    : styles.videoControlsContainer,
                ]}
                // onPress={() => {
                //   if (!videoPaused) {
                //     clearTimer();
                //     // setShowVideoControls(false);
                //   }
                // }}
              >
                {/* outsde click component */}
                {/* <View style={styles.videoControlsOuterContainer}>
                <TouchableOpacity
                  onPress={() => {
                    // setShowVideoControls(false);
                  }}
                  style={styles.videoControlsOuterWrapper}
                />
              </View> */}
                <TouchableOpacity
                  style={styles.videoControlsWrapper}
                  onPress={() => {
                    // clearTimer();
                    // setTimer(() => {
                    //   setShowVideoControls(false);
                    // }, 350);
                    setShowVideoControls(false);
                  }}>
                  {/* row -1 */}
                  <View />
                  {/* row - 2 */}
                  <View style={[l.flexRow, l.alignCtr, l.justifyCtr]}>
                    {/* pause and play */}
                    {videoPaused ? (
                      <TouchableOpacity
                        onPress={() => {
                          setVideoPaused(false);
                          setTimer(() => {
                            setShowVideoControls(false);
                          }, 1500);
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
                      value={
                        // !isVideoSliding ? currentVideoTime : sliderVideoTime
                        currentVideoTime
                      }
                      onSlidingStart={() => {
                        setIsVideoSliding(true);
                      }}
                      onValueChange={(val: number) => {
                        // setSliderVideoTime(val);
                      }}
                      onSlidingComplete={(currVal: number) => {
                        // isVideoSliding = false;
                        setIsVideoSliding(false);
                        setCurrentVideoTime(currVal);
                        videoPlayerRef?.current?.seek(currVal);
                      }}
                      step={0.2}
                      maximumValue={
                        VideoPlayerContent?.post_media_duration || 18
                      }
                      minimumTrackTintColor={primaryColor}
                      maximumTrackTintColor={c.grey50}
                      thumbTintColor={c.white}
                    />
                    <Text style={styles.videoDuration}>
                      {VideoPlayerContent?.post_media_duration || '0:00'}
                    </Text>
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
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={exitVideoPlayer}>
                    <Icon name={'close'} color={c.black1000} size={25} />
                  </TouchableOpacity> */}
              </View>
            )}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShowVideoControls(true);
              }}
              style={{height: '100%'}}>
              <Video
                ref={videoPlayerRef}
                source={{
                  uri: VideoPlayerContent?.post_media_url,
                }}
                onError={err => {
                  console.log('videoErrr', err);
                }}
                style={
                  ViewType === 'minimized'
                    ? styles.minimizedVideo
                    : fullscreenMode
                    ? styles.fullscreenVideo
                    : styles.video
                }
                resizeMode="stretch"
                controls={false}
                paused={videoPaused}
                onReadyForDisplay={() => {
                  setIsVideoLoading(false);
                }}
                onProgress={data => {
                  !isVideoSliding && setCurrentVideoTime(data.currentTime);
                }}
                onVideoError={() => {
                  console.log('VideoErr');
                }}
                allowsExternalPlayback={true}
                onEnd={() => {
                  videoPlayerRef?.current?.setNativeProps({paused: true});
                  videoPlayerRef?.current?.seek(0);
                  setVideoPaused(true);
                  setShowVideoControls(true);
                  setCurrentVideoTime(0);
                }}
                onBuffer={Buffer => {
                  setIsVideoLoading(Buffer.isBuffering);
                }}
              />
            </TouchableOpacity>
          </View>

          {ViewType === 'minimized' && (
            <View
              style={[
                // l.mr20,
                l.flexRow,
                l.alignCtr,
              ]}>
              {videoPaused ? (
                <TouchableOpacity
                  onPress={() => {
                    setVideoPaused(false);
                    // setTimer(() => {
                    //   setShowVideoControls(false);
                    // }, 1000);
                  }}>
                  <Icon
                    name={'play-arrow'}
                    color={colors.black1000}
                    size={25}
                    style={[l.mr20]}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setVideoPaused(true);
                  }}>
                  <Icon
                    name={'pause'}
                    color={colors.black1000}
                    size={25}
                    style={[l.mr20]}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={exitVideoPlayer}>
                <Icon name={'close'} color={c.black1000} size={25} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {ViewType === 'full' && !fullscreenMode && (
          <View style={[l.flex]}>
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              style={{
                marginBottom: useSafeAreaInsets().bottom,
                ...l.mt15,
              }}
              contentContainerStyle={[l.px20, l.pb20]}>
              {(VideoPlayerContent?.description ||
                VideoPlayerContent?.introduction) && (
                <View>
                  <Description
                    postDetails={VideoPlayerContent}
                    fontSize={'100%'}
                    fontUrl={fontUrl}
                    scrollToTop={() => {}}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {},
  fullScreenModal: {},
  minimisedModal: {
    ...BoxShadowStyles,
    ...l.px20,
  },
  fullscreenWrapper: {
    height: '100%',
    width: '100%',
  },
  videoWrapper: {
    height: 250,
  },
  minimizedWrapper: {
    marginTop: 4,
  },
  fullscreenVideo: {
    backgroundColor: '#000',
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 98,
    // bottom: 0,
  },
  video: {
    backgroundColor: '#000',
    height: 250,
  },
  minimizedVideo: {
    height: 60,
    width: 90,
  },
  videoLoader: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    ...l.alignCtr,
    ...l.justifyCtr,
    zIndex: 999,
  },
  fullScreenVideoControlsContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  videoControlsContainer: {
    position: 'absolute',
    ...l.fullWidth,
    height: 250,
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.5)',
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

export default VideoPlayer;
