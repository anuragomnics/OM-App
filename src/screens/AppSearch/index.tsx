import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// custom
import Text from '../../components/Text';
import {ContainerStyles} from '../../styles/elements';
import Header from '../../components/Header';
import {RouteProp} from '@react-navigation/core';
import {RootStackParams, ScreenID} from '../../navigation/types';
import Input from '../../components/FormControls/Input';

import {c, f, l, t} from '../../styles/shared';
import {
  useAppDispatch,
  useAppSelector,
  useThunkCallbackAction,
} from '../../hooks/useRedux';
import {
  fetchAllPosts,
  AllPostsListSelector,
  fetchAllPostsPrefix,
  PostsListSelector,
} from '../../store/News';
import FetchCoursesLoader from '../../loaders/FetchCoursesLoader';
import {getParsedTextFromHTML} from '../../utils/HTMLParser';
import {NewsType} from '../../types/responses/NewsResponsetype';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import NavigationService from '../../services/NavigationService';
import FastImage from 'react-native-fast-image';
import {PostType} from '../../types/responses/PostsListResponseType';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.AppSearch>;
}

const AppSearch: FC<Props> = ({route}) => {
  // @ts-ignore
  const {appSearchText = ''} = route.params;
  const dispatch = useAppDispatch();
  const allPostsList = useAppSelector(AllPostsListSelector());
  const primaryColor = usePrimaryStyles().color;
  // @ts-ignore
  let newsArr = allPostsList;

  //   state
  const [searchText, setSearchText] = useState(appSearchText);
  const [APICompleted, setAPICompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayType, setDisplayType] = useState('grid');

  useEffect(() => {
    setSearchText(appSearchText);
    setIsLoading(true);
    fetchNewsAPI(appSearchText);
  }, []);

  useThunkCallbackAction(
    fetchAllPostsPrefix,
    () => {
      setAPICompleted(true);
      setIsLoading(false);
    },
    () => {
      setAPICompleted(true);
      setIsLoading(false);
    },
  );

  // get NewsList API
  const fetchNewsAPI = (text: string = '') => {
    const params: any = {
      pagination: 0,
      fields: 'authors,categories,focus_point,top_news,slug',
      top_news: -1,
    };
    if (text) {
      params['keyword'] = text;
    }
    params['limit'] = 1000;
    dispatch(fetchAllPosts(params));
  };

  const onSearchPress = () => {
    setIsLoading(true);
    fetchNewsAPI(searchText);
  };

  const goToPostDetails = (post: PostType) => {
    NavigationService.pushToScreen(ScreenID.PostDetails, {
      post,
    });
  };

  return (
    <View style={[ContainerStyles]}>
      <Header useBack title={'Suchergebnisse'} />
      <ScrollView contentContainerStyle={[l.p20]}>
        <Input
          type={'search'}
          onClearSearch={() => {
            setSearchText('');
          }}
          widgetStyles={{
            container: {...l.flex, marginBottom: 0},
            wrapper: {backgroundColor: c.white},
          }}
          placeholder={'Suchbegriff eingeben'}
          leftIcon={{iconName: 'search'}}
          onChangeText={text => {
            setSearchText(text);
          }}
          value={searchText}
          returnKeyType={'search'}
          onSubmitEditing={onSearchPress}
        />

        <View style={[l.mt20]}>
          {/* News data */}
          {isLoading && (
            <FetchCoursesLoader numberOfItems={4} type={displayType} />
          )}
          {!isLoading && (
            <>
              <View
                style={
                  displayType === 'list'
                    ? {}
                    : [l.flexRow, l.justifyBtw, l.wrap]
                }>
                {(!newsArr || newsArr.length === 0) && APICompleted && (
                  <Text>{'Keine Einträge gefunden'}</Text>
                )}
                {newsArr &&
                  newsArr.map((news, i) => {
                    // const root = parse(news.description);
                    // const parsedDescription =
                    //   root.querySelector('p')?.textContent || '';
                    const description = getParsedTextFromHTML(
                      news.introduction,
                    );
                    // const authors = news?.authors.map(a => a.name).join(', ');

                    return (
                      <TouchableOpacity
                        key={i}
                        style={[
                          // BoxShadowStyles,
                          displayType == 'list'
                            ? [
                                styles.courseListContainer,
                                i !== newsArr.length - 1 ? l.mb15 : {},
                              ]
                            : styles.courseGridContainer,
                        ]}
                        onPress={() => {
                          goToPostDetails(news);
                        }}>
                        {/* banner image */}
                        <FastImage
                          source={{
                            uri:
                              news.post_type === 'image'
                                ? news.post_media_url
                                : news.post_thumbnail_url,
                          }}
                          style={[
                            displayType == 'list'
                              ? styles.courseListImg
                              : styles.courseGridImg,
                          ]}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                        <View
                          style={
                            displayType == 'list'
                              ? styles.courseWrapper
                              : styles.courseGridWrapper
                          }>
                          <View>
                            {/* title */}
                            <Text
                              style={[t.h5, f.fontWeightMedium]}
                              numberOfLines={1}>
                              {news.title}
                            </Text>

                            {/* description */}
                            <Text style={styles.description} numberOfLines={2}>
                              {description ? description : ''}
                            </Text>

                            {/* Authors */}
                            {/* {authors ? (
                              <View style={[l.flexRow, l.mt10, l.alignCtr]}>
                                <Icon
                                  name={'people'}
                                  color={primaryColor}
                                  size={16}
                                />
                                <Text
                                  style={[
                                    l.ml5,
                                    t.pSM,
                                    l.flex,
                                    l.wrap,
                                    {color: c.black200},
                                  ]}
                                  numberOfLines={1}>
                                  {authors}
                                </Text>
                              </View>
                            ) : null} */}
                          </View>

                          {/* topnews flag */}
                          {news.top_post && (
                            <Text
                              style={[
                                displayType === 'list'
                                  ? styles.topNews
                                  : styles.topNewsGrid,
                                {backgroundColor: primaryColor},
                              ]}>
                              {'Top post'}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  courseListContainer: {
    ...l.flexRow,
    backgroundColor: c.white,
    ...l.p15,
    ...l.defaultBorderRadius,
  },
  courseGridContainer: {
    width: '48%',
    ...l.mb15,
    backgroundColor: c.white,
    ...l.defaultBorderRadius,
    // overflow: 'hidden',
  },
  courseListImg: {
    width: 70,
    height: 70,
    borderWidth: 0.5,
    borderColor: '#ccc',
    ...l.defaultBorderRadius,
  },
  courseGridImg: {
    width: '100%',
    height: 120,
  },
  courseWrapper: {
    ...l.ml10,
    flex: 1,
    justifyContent: 'space-between',
  },
  courseGridWrapper: {
    ...l.p10,
    flex: 1,
    justifyContent: 'space-between',
  },
  dot: {
    ...l.mx5,
  },
  topNews: {
    padding: 2,
    ...t.pXS,
    color: '#fff',
    ...f.fontWeightMedium,
    ...l.mt10,
    alignSelf: 'flex-start',
    borderRadius: 2,
    overflow: 'hidden',
  },
  topNewsGrid: {
    padding: 2,
    ...t.pXS,
    color: '#fff',
    ...f.fontWeightMedium,
    ...l.mt10,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'absolute',
    top: -20,
    left: 10,
  },
  description: {
    color: c.black200,
    lineHeight: 18,
    ...l.mt5,
  },
});

export default AppSearch;
