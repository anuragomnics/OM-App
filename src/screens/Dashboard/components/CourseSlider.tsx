import React, {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  AppState,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageEditor from '@react-native-community/image-editor';
import to from 'await-to-js';

// custom
import {c, f, l, t} from '../../../styles/shared';
import {
  CourseSlider as CourseSlidertype,
  PostsCarouselSectionType,
} from '../../../types/responses/SettingResponseType';
import Text from '../../../components/Text';
import {Course as CourseType} from '../../../types/responses/SettingResponseType';
import {getParsedTextFromHTML} from '../../../utils/HTMLParser';
import NavigationService from '../../../services/NavigationService';
import {ScreenID} from '../../../navigation/types';
import WebView from 'react-native-webview';
import {useNavigation} from '@react-navigation/core';
import {PostType} from '../../../types/responses/PostsListResponseType';
import {
  useAppDispatch,
  useAppSelector,
  useThunkCallbackAction,
} from '../../../hooks/useRedux';
import {
  fetchPosts,
  fetchPostsPrefix,
  PostsListSelector,
} from '../../../store/News';
import FetchCoursesLoader from '../../../loaders/FetchCoursesLoader';
import {useColors} from '../../../styles/shared/Colors';
import moment from 'moment';
import {SettingsSelector} from '../../../store/Configuration';
import Icon from 'react-native-vector-icons/MaterialIcons';

const deviceWidth = Dimensions.get('window').width;

const courseItemMargin = 20;

interface Props extends PostsCarouselSectionType {
  content: PostsCarouselSectionType;
  index: number;
  ViewType?: string;
}

const CourseSlider: FC<Props> = ({
  content,
  title,
  type,
  offset,
  option_for_featured,
  total_items,
  sorting,
  maximum_items_per_carousel,
  rule_type,
  groups,
  groups_condition,
  categories,
  categories_condition,
  tags,
  tags_condition,
  index,
}) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const colors = useColors();
  const postsList = useAppSelector(PostsListSelector());
  const settings = useAppSelector(SettingsSelector());

  // ref
  const WebviewRef = useRef(null);

  // state
  const [imageUrls, setImageUrls] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // get Postslist API
  const fetchPostsAPI = () => {
    const params: any = {
      offset,
      option_for_featured,
      total_items,
      sorting,
      rule_type,
      groups_condition,
      categories_condition,
      tags_condition,
      id: index,
      type,
    };

    if (groups) params.groups = groups;
    if (categories) params.categories = categories;
    if (tags) params.tags = tags;

    dispatch(fetchPosts(params));
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPostsAPI();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // @ts-ignore
        WebviewRef.current?.reload?.();
      }
    });
    return () => {
      // @ts-ignore
      subscription?.remove();
    };
  }, []);

  useThunkCallbackAction(
    fetchPostsPrefix,
    () => {
      setIsLoading(false);
    },
    () => {
      setIsLoading(false);
    },
  );

  const renderImage = (imageUrl: string, backgroundPosition: string = '') => {
    return `<!DOCTYPE html>
      <html>
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
      body { 
        pointer-events:none;overflow:hidden;
        background-image: url('${imageUrl}');
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
        ${backgroundPosition}
      }
      </style>
      </head>
      <body>
      </body>
      </html>`;
  };

  const maximumItemsPerCarousel = parseInt(maximum_items_per_carousel || '1');

  const DATA: any = [];
  const endSlideWidth = maximumItemsPerCarousel === 1 ? 120 : 20;
  const courseItemWidth =
    deviceWidth / maximumItemsPerCarousel -
    maximumItemsPerCarousel * courseItemMargin -
    endSlideWidth / maximumItemsPerCarousel;
  const isSingleItem = DATA.length === 1;
  const postsArr = postsList[index];

  const onPress = (post: PostType) => {
    NavigationService.pushToScreen(ScreenID.PostDetails, {
      post,
    });
  };

  return (
    <View style={[l.mb20]}>
      <Text style={[t.h4, f.fontWeightMedium]}>{title}</Text>
      <ScrollView
        style={[l.mt10]}
        contentContainerStyle={[
          l.flexRow,
          isSingleItem ? {...l.fullWidth} : {},
          // l.fullWidth,
        ]}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}>
        {isLoading && (
          <FetchCoursesLoader
            numberOfItems={4}
            type={'carousel'}
            maximumCarouselItems={maximumItemsPerCarousel}
          />
        )}

        {!postsArr || postsArr.length === 0 ? (
          <Text>{'Keine Einträge gefunden'}</Text>
        ) : null}

        {postsArr &&
          postsArr.map((post, index) => {
            const description = getParsedTextFromHTML(post.introduction);
            // @ts-ignore
            const {css_bg_position} = post?.image_focus_point || {};
            const thumbnail =
              post.post_type === 'image'
                ? post.post_media_url
                : post.post_thumbnail_url;

            return (
              <TouchableOpacity
                key={index}
                style={{
                  marginRight: isSingleItem
                    ? 0
                    : index !== DATA.length - 1
                    ? courseItemMargin
                    : 0,
                  width: isSingleItem ? '100%' : courseItemWidth,
                }}
                onPress={() => {
                  onPress(post);
                }}>
                <View
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}>
                  {/* <WebView
                    ref={WebviewRef}
                    style={{
                      width: '100%',
                      maxHeight: isSingleItem
                        ? 130
                        : maximumItemsPerCarousel === 1
                        ? 130
                        : 100,
                      height: isSingleItem
                        ? 130
                        : maximumItemsPerCarousel === 1
                        ? 130
                        : 100,
                    }}
                    javaScriptEnabled={true}
                    scrollEnabled={false}
                    androidLayerType={'hardware'}
                    androidHardwareAccelerationDisabled
                    source={{
                      html: renderImage(thumbnail, css_bg_position),
                    }}></WebView> */}
                  <FastImage
                    source={{uri: thumbnail}}
                    style={{
                      width: '100%',
                      height: isSingleItem
                        ? 140
                        : maximumItemsPerCarousel === 1
                        ? 140
                        : 100,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>

                <View style={[l.mt5]}>
                  <Text
                    numberOfLines={maximumItemsPerCarousel === 1 ? 2 : 2}
                    style={[t.p, f.fontWeightMedium, {lineHeight: 20}]}>
                    {post.title}
                  </Text>
                  {settings.posts_general_settings
                    ?.posts_details_date_time_format === 'none' ? (
                    <Text
                      style={{
                        color: c.black150,
                        ...f.fontWeightMedium,
                        ...t.pSM,
                      }}>
                      {'mehr erfahren'}
                    </Text>
                  ) : null}
                </View>

                {settings.posts_general_settings
                  ?.posts_details_date_time_format !== 'none' &&
                  post?.published_at && (
                    <View style={[l.flexRow, l.alignCtr]}>
                      {/* <Icon name={'event'} size={16} color={colors.black150} /> */}

                      <Text
                        style={[
                          t.pSM,
                          f.fontWeightMedium,
                          l.mb5,
                          {color: c.black150},
                          l.mt5,
                        ]}>
                        {post?.published_at
                          ? moment(
                              post?.published_at,
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
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default CourseSlider;
