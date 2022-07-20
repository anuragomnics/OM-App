import React, {FC, useEffect, useState} from 'react';
import {
  StatusBar,
  View,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AutoHeightWebView from 'react-native-autoheight-webview';
import TrackPlayer, {Capability, Event} from 'react-native-track-player';
// @ts-ignore
import MediaMeta from 'react-native-media-meta';

// custom
import {c, l} from '../../styles/shared';
import {PostType} from '../../types/responses/PostsListResponseType';
import Text from '../Text';
import NavigationService from '../../services/NavigationService';
import {ScreenID} from '../../navigation/types';
import WebView from 'react-native-webview';
import AudioPlayer from '../AudioPlayer';
import VideoPlayer from '../VideoPlayerModal';
import {useAppDispatch} from '../../hooks/useRedux';
import {closeVideoPlayer, openVideoPlayer} from '../../store/News';

interface Props {
  post: PostType;
  styleType?: 1 | 2;
}

const DetailsBannerImage: FC<Props> = ({post, styleType}) => {
  const dispatch = useAppDispatch();

  // state
  const [showVideoPlayerModal, setShowVideoPlayerModal] = useState(false);

  return (
    <View>
      {post?.post_type === 'image' && (
        <TouchableOpacity
          onPress={() => {
            NavigationService.pushToScreen(ScreenID.FullScreenImage, {
              imageUrl: post?.post_media_url,
            });
          }}>
          <ImageBackground
            style={[
              styles.bannerImg,
              styleType === 2
                ? {borderRadius: 0, height: 280}
                : {borderRadius: 10},
            ]}
            source={{uri: post?.post_media_url}}></ImageBackground>
        </TouchableOpacity>
      )}

      {post?.post_type === 'audio' && (
        <>
          <ImageBackground
            style={[
              styles.bannerImg,
              styleType === 2
                ? {borderRadius: 0, height: 280}
                : {borderRadius: 10},
            ]}
            source={{uri: post?.post_thumbnail_url}}></ImageBackground>
          {styleType !== 2 && (
            <View style={[l.mt20]}>
              <AudioPlayer
                title={post?.title}
                poster={post?.post_thumbnail_url}
                mediaUrl={post?.post_media_url}
                duration={post?.post_media_duration || 0}
              />
            </View>
          )}
        </>
      )}

      {/* video post */}
      {post?.post_type === 'video' && (
        <View>
          <ImageBackground
            style={[
              styles.bannerImg,
              styleType === 2
                ? {borderRadius: 0, height: 280}
                : {borderRadius: 10},
            ]}
            source={{uri: post?.post_thumbnail_url}}>
            <View
              style={[
                l.flex,
                l.flexRow,
                l.alignCtr,
                l.justifyCtr,
                // styles.iconWrapper,
              ]}>
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => {
                  // clear any existing video playing
                  dispatch(closeVideoPlayer());
                  setTimeout(() => {
                    dispatch(openVideoPlayer(post));
                  }, 0);
                }}>
                <Icon name={'play-arrow'} size={60} color={c.white} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerImg: {
    height: 200,
    ...l.fullWidth,
    overflow: 'hidden',
  },
  backContainer: {
    backgroundColor: c.white,
    height: 30,
    width: 30,
    borderRadius: 40,
    ...l.justifyCtr,
    ...l.alignCtr,
    ...l.ml20,
    ...l.mt50,
  },
  iconWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 50,
  },
});

export default DetailsBannerImage;
