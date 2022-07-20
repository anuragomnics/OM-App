import React, {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  ScrollView,
  StatusBar,
  Share,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
import FastImage from 'react-native-fast-image';
import Button from '../../components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector} from '../../hooks/useRedux';
import {FontsSelector, SettingsSelector} from '../../store/Configuration';
import moment from 'moment';
import DeviceHelper from '../../config/DeviceHelper';
import Header from '../../components/Header';
import RNFetchBlob from 'rn-fetch-blob';
import {useColors} from '../../styles/shared/Colors';
import {PostType} from '../../types/responses/PostsListResponseType';

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

const PostDetailsStyle2: FC<Props> = ({post}) => {
  const ContainerStyles = useContainerStyles();
  const primaryColor = usePrimaryStyles().color;
  const colors = useColors();
  const settings = useAppSelector(SettingsSelector());
  const fonts = useAppSelector(FontsSelector());
  const normalFont = fonts.filter(font => {
    return font.fontWeight == '300';
  });

  const fontUrl = normalFont[0]
    ? normalFont[0].fontURL
    : fonts?.[0]?.fontURL || '';

  // const {post = {}, fromSlider, fromRelatedNews} = route.params;
  const {postDetails, isLoading} = useSinglePost(post.id);
  const {bottom, top} = useSafeAreaInsets();

  const title = post.title;
  const postBannerImage =
    post.post_type === 'image' ? post.post_media_url : post.post_thumbnail_url;

  // refs
  const scrollRef = useRef();

  const [fontScaleIndex, setFontScaleIndex] = useState<number>(2);

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

  return (
    <View style={[ContainerStyles]}>
      <Header useBack title={' '} />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{height: '100%'}}
        // @ts-ignore
        ref={scrollRef}>
        <View style={[l.p20]}>
          {/* title */}
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

          {/* categories */}
          {/* {postDetails?.categories && newsDetails?.categories.length > 0 && (
            <View style={[l.flexRow, l.alignCtr, l.wrap, l.mt5]}>
              {newsDetails?.categories.map((category, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      {backgroundColor: primaryColor},
                      l.p5,
                      l.defaultBorderRadius,
                      l.mt5,
                      index !== 0 ? l.ml5 : null,
                    ]}>
                    <Text style={[t.pSM, {color: c.white}]}>
                      {category.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          )} */}

          {/* banner image */}
          <View style={[l.mt15]}>
            <DetailsBannerImage post={post} />
          </View>

          {/* copyright text */}
          {postDetails?.post_media_copyright_text && (
            <Text style={[{color: c.black200, textAlign: 'center'}, l.mt5]}>
              {postDetails?.post_media_copyright_text}
            </Text>
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

          {/* Gallery */}
          {/* {newsDetails?.gallery && newsDetails?.gallery.length > 0 && (
            <View style={[l.mt15]}>
              <Gallery news={newsDetails} />
            </View>
          )} */}

          {/* Authors */}
          {/* {newsDetails?.authors && newsDetails?.authors.length > 0 && (
            <View style={[l.mt15]}>
              <Authors news={newsDetails} />
            </View>
          )} */}

          {/* related News */}
          {/* {newsDetails?.related_news && newsDetails?.related_news.length > 0 && (
            <View style={[l.mt15]}>
              <Text style={[t.h5, f.fontWeightMedium]}>{'Related News'}</Text>
              {newsDetails?.related_news.map((relatedNews, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[l.flexRow, l.alignCtr, l.mt15]}
                    onPress={() => {
                      onRelatedNewsPress(relatedNews);
                    }}>
                    <FastImage
                      source={{uri: relatedNews.thumbnail}}
                      style={styles.relatedNewsImage}
                    />
                    <Text style={[l.ml10, l.flex]}>{relatedNews.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )} */}
        </View>
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
    // position: 'absolute',

    height: 40,
    width: '100%',
    // opacity: 0.5,
    zIndex: 999,
  },
  relatedNewsImage: {
    height: 35,
    width: 35,
    ...l.defaultBorderRadius,
  },
});

export default PostDetailsStyle2;
