import React, {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  ScrollView,
  StatusBar,
  Alert,
  Image,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Share,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

// images
import BackIcon from '../../assets/images/back.png';
import BackWhiteIcon from '../../assets/images/backWhite.png';
import BottomFade from '../../assets/images/bottomFade.png';

// custom
import TabBar from '../../components/TabBar';
import Text from '../../components/Text';
import {RootStackParams, ScreenID} from '../../navigation/types';
import NavigationService from '../../services/NavigationService';
import {c, f, l, t} from '../../styles/shared';
import {BoxTopShadowStyles, useContainerStyles} from '../../styles/elements';
import DetailsBannerImage from '../../components/DetailsBannerImage';
import {useSinglePost} from './hook';
import Gallery from '../CourseDetails/Components/Gallery';
import Authors from '../CourseDetails/Components/Authors';
import Description from '../CourseDetails/Components/Description';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector} from '../../hooks/useRedux';
import {
  FontsSelector,
  SettingsSelector,
  ThemeSelector,
} from '../../store/Configuration';
import moment from 'moment';
import {useColors} from '../../styles/shared/Colors';
import AudioPlayer from '../../components/AudioPlayer';
import {PostType} from '../../types/responses/PostsListResponseType';
import {color} from 'react-native-reanimated';
import DeviceHelper from '../../config/DeviceHelper';

interface Props {
  post: PostType;
}

interface TAB {
  name: string;
  id: number;
}

const TABS = [
  {
    name: 'Details',
    id: 0,
  },
  {
    name: 'Authors',
    id: 1,
  },
  {
    name: 'Gallery',
    id: 2,
  },
];

const FontScales = [14, 16, 18, 20, 22];

const PostDetailsStyle1: FC<Props> = ({post}) => {
  const settings = useAppSelector(SettingsSelector());
  const ContainerStyles = useContainerStyles();
  const primaryColor = usePrimaryStyles().color;
  const colors = useColors();

  const appTheme = useAppSelector(ThemeSelector());
  const fonts = useAppSelector(FontsSelector());
  const normalFont = fonts.filter(font => {
    return font.fontWeight == '300';
  });

  const fontUrl = normalFont[0]
    ? normalFont[0].fontURL
    : fonts?.[0]?.fontURL || '';

  const {postDetails, isLoading} = useSinglePost(post.id);
  const {bottom, top} = useSafeAreaInsets();

  const title = post.title;
  const postBannerImage =
    post.post_type === 'image' ? post.post_media_url : post.post_thumbnail_url;

  // refs
  const scrollRef = useRef();

  // state
  const [fontScaleIndex, setFontScaleIndex] = useState<number>(2);
  const [showFadeAnimate, setShowFadeAnimate] = useState(false);

  // navigations
  const goBack = () => {
    NavigationService.goBack();
  };

  const scrollToTop = () => {
    // @ts-ignore
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const onRelatedNewsPress = (relatedNews: any) => {
    scrollToTop();
    NavigationService.pushToScreen(ScreenID.PostDetails, {
      news: relatedNews,
      fromRelatedNews: true,
    });
  };

  useEffect(() => {
    scrollToTop();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        goBack();
        return true;
      },
    );
    // cleanup handler
    return () => {
      backHandler?.remove();
    };
  }, []);

  const increaseFontScale = () => {
    if (fontScaleIndex !== FontScales.length - 1) {
      setFontScaleIndex(fontScaleIndex + 1);
    }
  };
  const decreaseFontScale = () => {
    if (fontScaleIndex !== 0) {
      setFontScaleIndex(fontScaleIndex - 1);
    }
  };
  const currFontScale = FontScales[fontScaleIndex];

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log('eeeee', e?.nativeEvent);
    if (e?.nativeEvent?.contentOffset.y <= 10) {
      setShowFadeAnimate(false);
    }
    //  else {
    //   setShowFadeAnimate(true);
    // }
  };

  const linearGradientColors =
    appTheme === 'dark'
      ? ['rgba(18, 18, 18, 0)', 'rgba(18, 18, 18, 0.7)']
      : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)'];

  return (
    <View style={[ContainerStyles]}>
      {/* <Header useBack title={' '} /> */}
      <StatusBar barStyle={'light-content'} networkActivityIndicatorVisible />
      <View
        style={[
          styles.statusBar,
          {height: top, backgroundColor: 'rgba(0,0,0,0.5)'},
        ]}
      />

      {/* banner image */}
      <View style={[{position: 'relative'}]}>
        <TouchableOpacity
          style={[
            styles.backIconContainer,
            {top: top + 10, backgroundColor: colors.white},
          ]}
          onPress={goBack}>
          <Image
            source={appTheme === 'light' ? BackIcon : BackWhiteIcon}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <DetailsBannerImage post={post} styleType={2} />
      </View>

      {showFadeAnimate && (
        <LinearGradient
          colors={linearGradientColors}
          style={{
            height: 90,
            marginTop: 280,
            width: '100%',
            position: 'absolute',
            zIndex: 999,
            transform: [{rotate: '180deg'}],
          }}></LinearGradient>
      )}

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: ContainerStyles.backgroundColor,
        }}
        // contentContainerStyle={{height: '100%'}}
        // @ts-ignore
        ref={scrollRef}
        onScrollBeginDrag={e => {
          // handleScroll(e);
          setShowFadeAnimate(true);
        }}
        onScrollEndDrag={e => {
          handleScroll(e);
        }}
        onMomentumScrollEnd={e => {
          handleScroll(e);
        }}>
        {/* copyright text */}
        {postDetails?.post_media_copyright_text && (
          <Text
            style={[{color: c.black200, textAlign: 'center'}, l.mt5, l.mx20]}>
            {postDetails?.post_media_copyright_text}
          </Text>
        )}

        <View style={[l.p20]}>
          <Text style={[t.h3, f.fontWeightMedium, {lineHeight: 28}]}>
            {title}
          </Text>

          {/* Date */}
          {settings.posts_general_settings?.posts_details_date_time_format !==
            'none' && (
            <View style={[l.flexRow, l.alignCtr, l.mt10]}>
              <Text style={[f.fontWeightMedium, l.mb5, {color: c.black150}]}>
                {postDetails?.published_at
                  ? moment(
                      postDetails?.published_at,
                      'YYYY-MM-DD HH:mm:ss',
                    ).format(
                      settings.posts_general_settings
                        ?.posts_details_date_time_format === 'date_time'
                        ? 'DD.MM.YYYY | HH:mm'
                        : 'DD.MM.YYYY',
                    )
                  : ''}
              </Text>
            </View>
          )}

          {post?.post_type === 'audio' && (
            <View style={[l.mt20]}>
              <AudioPlayer
                title={post?.title}
                poster={post?.post_thumbnail_url}
                mediaUrl={post?.post_media_url}
                duration={post?.post_media_duration || 0}
              />
            </View>
          )}

          {/* Details */}
          {(post?.description || post?.introduction) && (
            <View style={[l.mt15]}>
              <Description
                postDetails={post}
                fontSize={currFontScale}
                fontUrl={fontUrl}
                scrollToTop={scrollToTop}
              />
            </View>
          )}
        </View>
        {/* </View> */}
      </ScrollView>

      <View
        style={[
          l.flexRow,
          l.alignCtr,
          l.justifyBtw,
          l.px50,
          l.py15,
          {
            paddingBottom: bottom + 10,
          },
          BoxTopShadowStyles,
        ]}>
        <View style={[l.flexRow, l.alignCtr]}>
          <Text
            style={[t.h3, l.mr30]}
            onPress={() => {
              decreaseFontScale();
            }}>
            T-
          </Text>
          <Text
            style={[t.h3]}
            onPress={() => {
              increaseFontScale();
            }}>
            T+
          </Text>
        </View>
        <View style={[l.flexRow, l.alignCtr]}>
          <Icon
            name={'vertical-align-top'}
            size={22}
            color={colors.black400}
            style={[l.mr30]}
            onPress={scrollToTop}
          />
          {postDetails?.shareable_post && postDetails.shareable_callback_url ? (
            <Icon
              name={'ios-share'}
              size={22}
              color={colors.black400}
              onPress={() => {
                if (DeviceHelper.isIOS) {
                  Share.share({
                    message: postDetails?.shareable_description || '',
                    url: postDetails?.shareable_callback_url || '',
                  });
                } else {
                  Share.share({
                    title: postDetails?.shareable_description || '',
                    message: postDetails?.shareable_callback_url || '',
                  });
                }
              }}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    position: 'absolute',
    width: '100%',
    zIndex: 999,
  },
  relatedNewsImage: {
    height: 35,
    width: 35,
    ...l.defaultBorderRadius,
  },
  backIconContainer: {
    position: 'absolute',
    backgroundColor: 'red',
    // ...l.p10,
    left: 20,
    zIndex: 999,
    borderRadius: 20,
    height: 35,
    width: 35,
    ...l.flexRow,
    ...l.alignCtr,
    ...l.justifyCtr,
  },
  backIcon: {
    width: 18,
    height: 10,
  },
});

export default PostDetailsStyle1;
