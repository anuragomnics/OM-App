import React, {FC, useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// custom
import FastImage from 'react-native-fast-image';
import {c, f, l, t} from '../../../styles/shared';
import Text from '../../../components/Text';
import {usePrimaryStyles} from '../../../hooks/useThemeStyles';
import {NewsListSettings} from '../../../types/responses/SettingResponseType';
import Input from '../../../components/FormControls/Input';
import {
  useAppDispatch,
  useAppSelector,
  useThunkCallbackAction,
} from '../../../hooks/useRedux';
import FetchCoursesLoader from '../../../loaders/FetchCoursesLoader';
import Button from '../../../components/Button';
import NavigationService from '../../../services/NavigationService';
import {ScreenID} from '../../../navigation/types';
import {
  fetchNews,
  fetchNewsPrefix,
  NewsListSelector,
} from '../../../store/News';
import DropDown from '../../../components/DropDown';
import {NewsType} from '../../../types/responses/NewsResponsetype';
import {getParsedTextFromHTML} from '../../../utils/HTMLParser';

interface Props extends NewsListSettings {
  content: NewsListSettings;
  index: number;
  ViewType?: string;
}

const NewsList: FC<Props> = ({
  type,
  title,
  filter_category,
  filter_tags,
  top,
  display_search_and_filter,
  display_the_search_bar,
  pagination,
  limit,
  list_background_color_code,
  content,
  ViewType,
  index,
  offset,
  item_number_per_page,
  default_view,
}) => {
  const dispatch = useAppDispatch();
  const primaryColor = usePrimaryStyles().color;
  const newsList = useAppSelector(NewsListSelector());
  const showAllNews = Boolean(ViewType === 'AllNews');

  // refs
  const firstRender = useRef(true);

  // state
  const [displayType, setDisplayType] = useState(
    default_view ? default_view : 'list',
  );
  const [isPaginated, setIsPaginated] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currSearchKeyword, setCurrSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<{name: string; value: number}>();
  const [APICompleted, setAPICompleted] = useState(false);

  // get NewsList API
  const fetchNewsAPI = () => {
    const params: any = {
      pagination: pagination ? 1 : 0,
      fields: 'authors,categories,focus_point,top_news,slug',
      top_news: selectedItem ? selectedItem.value : top,
      id: index,
      tags: filter_tags,
      categories: filter_category,
      offset,
    };
    if (searchText) {
      params['keyword'] = searchText;
    }
    if (limit) {
      params['limit'] = limit;
    } else {
      params['limit'] = 1000;
    }
    dispatch(fetchNews(params));
  };

  useEffect(() => {
    setIsLoading(true);
    fetchNewsAPI();
  }, [selectedItem?.value, currSearchKeyword]);

  useThunkCallbackAction(
    fetchNewsPrefix,
    () => {
      setAPICompleted(true);
    },
    () => {
      setAPICompleted(true);
    },
  );

  // set current Search text
  const onSearchPress = () => {
    setCurrSearchKeyword(searchText);
  };

  useThunkCallbackAction(
    fetchNewsPrefix,
    () => {
      if (isLoading) {
        setIsLoading(false);
      }
    },
    () => {
      if (isLoading) {
        setIsLoading(false);
      }
    },
  );

  const myNewsList = newsList[index];
  const total = myNewsList?.total;
  const defaultPagination = item_number_per_page
    ? item_number_per_page
    : 100000;
  let newsArr = myNewsList?.data;
  // if pagination is enabled slice the data with default pagination count
  if (total > defaultPagination && !showAllNews) {
    newsArr = newsArr.slice(0, defaultPagination);
    if (!isPaginated && pagination) {
      setIsPaginated(true);
    }
  } else if (isPaginated) {
    setIsPaginated(false);
  }

  const onSelectItemPress = (item: {name: string; value: number}) => {
    setSelectedItem(item);
  };

  // navigations
  const goToAllNews = () => {
    NavigationService.pushToScreen(ScreenID.AllNews, {
      content,
    });
  };
  const goToNewsDetails = (news: NewsType) => {
    NavigationService.pushToScreen(ScreenID.NewsDetails, {
      news,
    });
  };

  const dropdownItems = [
    {name: 'No-Featured', value: 0},
    {name: 'Featured', value: 1},
    {name: 'Show All', value: -1},
  ];

  const dropdownItemsTopIndex = dropdownItems.findIndex(v => v.value === top);

  // temporary fix for offset for NLT
  newsArr && newsArr.splice(0, 5);

  return (
    <View style={[l.mb30]}>
      <View style={[l.flexRow, l.alignCtr, l.justifyBtw, l.mb10]}>
        {/* title */}
        {!showAllNews && (
          <Text style={[t.h3, f.fontWeightMedium, l.flex]}>{title}</Text>
        )}

        {/* filter */}
        {showAllNews && display_search_and_filter && (
          <DropDown
            items={dropdownItems}
            onSelectItem={onSelectItemPress}
            defaultIndex={
              firstRender.current
                ? dropdownItemsTopIndex !== -1
                  ? dropdownItemsTopIndex
                  : 2
                : 2
            }
          />
        )}

        {/* layout actions */}
        {display_search_and_filter && (
          <View style={[l.flexRow, l.alignCtr, l.ml10]}>
            <TouchableOpacity
              onPress={() => {
                setDisplayType('list');
              }}>
              <Icon
                name={'format-list-bulleted'}
                color={displayType === 'list' ? primaryColor : c.black400}
                size={28}
              />
            </TouchableOpacity>
            <View style={[l.ml10]} />
            <TouchableOpacity
              onPress={() => {
                setDisplayType('grid');
              }}>
              <Icon
                name={'grid-view'}
                color={displayType === 'grid' ? primaryColor : c.black400}
                size={25}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* search */}
      {display_the_search_bar && (
        <View style={[l.flexRow, l.alignCtr, l.mb15]}>
          <Input
            type={'search'}
            onClearSearch={() => {
              setCurrSearchKeyword('');
            }}
            widgetStyles={{
              container: {...l.flex, marginBottom: 0},
              wrapper: {backgroundColor: c.white},
            }}
            placeholder={'search news'}
            leftIcon={{iconName: 'search'}}
            onChangeText={text => {
              setSearchText(text);
            }}
            value={searchText}
            returnKeyType={'search'}
            onSubmitEditing={onSearchPress}
          />
        </View>
      )}

      {/* News data */}
      {isLoading && (
        <FetchCoursesLoader
          numberOfItems={showAllNews ? 4 : 2}
          type={displayType}
        />
      )}
      {!isLoading && (
        <>
          <View
            style={
              displayType === 'list' ? {} : [l.flexRow, l.justifyBtw, l.wrap]
            }>
            {(!newsArr || newsArr.length === 0) && APICompleted && (
              <Text>{'No Matches Found'}</Text>
            )}
            {newsArr &&
              newsArr.map((news, i) => {
                // const root = parse(news.description);
                // const parsedDescription =
                //   root.querySelector('p')?.textContent || '';
                const description = getParsedTextFromHTML(news.introduction);
                const authors = news?.authors.map(a => a.name).join(', ');

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
                      list_background_color_code
                        ? {backgroundColor: list_background_color_code}
                        : {},
                    ]}
                    onPress={() => {
                      goToNewsDetails(news);
                    }}>
                    {/* banner image */}
                    <FastImage
                      source={{
                        uri: news.primary_image,
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
                        {authors ? (
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
                        ) : null}
                      </View>

                      {/* topnews flag */}
                      {news.top_news && (
                        <Text
                          style={[
                            displayType === 'list'
                              ? styles.topNews
                              : styles.topNewsGrid,
                            {backgroundColor: primaryColor},
                          ]}>
                          {'Top news'}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>

          {/* view All */}
          {isPaginated && (
            <View style={[l.mt15, l.flexRow, l.justifyCtr, l.alignCtr]}>
              <Text>{`Showing ${defaultPagination} of ${total}`}</Text>
              <View style={[l.ml10]}>
                <Button
                  theme={'simplePrimary'}
                  title={'View All'}
                  onPress={goToAllNews}
                />
              </View>
            </View>
          )}
        </>
      )}
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
    overflow: 'hidden',
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

export default NewsList;
