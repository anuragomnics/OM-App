import React, {FC, useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// custom
import FastImage from 'react-native-fast-image';
import {c, f, l, t} from '../../../styles/shared';
import Text from '../../../components/Text';
import {usePrimaryStyles} from '../../../hooks/useThemeStyles';
import {
  CourseListSettings,
  CourseSlider,
  StaticSlider,
} from '../../../types/responses/SettingResponseType';
import Input from '../../../components/FormControls/Input';
import {
  useAppDispatch,
  useAppSelector,
  useThunkCallbackAction,
} from '../../../hooks/useRedux';
import {
  CourseListSelector,
  fetchCourses,
  FetchCoursesPrefix,
  courseList,
} from '../../../store/Course';
import {StatusSelector} from '../../../store/Status';
import FetchCoursesLoader from '../../../loaders/FetchCoursesLoader';
import Button from '../../../components/Button';
import NavigationService from '../../../services/NavigationService';
import {ScreenID} from '../../../navigation/types';
import {CourseType} from '../../../types/responses/CourseResponseType';
import DropDown from '../../../components/DropDown';
import {RequestParams} from '../../../types/request';
import {BoxShadowStyles} from '../../../styles/elements';

interface Props extends CourseListSettings {
  content: CourseListSettings | StaticSlider | CourseSlider;
  index: number;
  ViewType?: string;
  initialSearchText?: string;
}

const findCourse = (coursesList: Array<courseList>, index: number) => {
  const myCouseList = coursesList.filter(courseList => {
    if (courseList.id === index) {
      return courseList;
    }
  });
  return myCouseList?.[0];
};

const CourseList: FC<Props> = ({
  type,
  title,
  filter_category,
  top,
  display_search_and_filter,
  display_the_search_bar,
  pagination,
  display_price,
  display_number_of_chapter,
  display_duration,
  index,
  list_background_color_code,
  content,
  ViewType,
  // initialSearchText = '',
}) => {
  const dispatch = useAppDispatch();
  const primaryColor = usePrimaryStyles().color;
  const coursesList = useAppSelector(CourseListSelector());
  const showAllCourses = Boolean(ViewType === 'AllCourses');

  // refs
  const firstRender = useRef(true);

  // state
  const [displayType, setDisplayType] = useState('list');
  const [isPaginated, setIsPaginated] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currSearchKeyword, setCurrSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<{name: string; value: number}>();

  // get courses API
  const fetchCoursesAPI = () => {
    const params: RequestParams = {
      top: selectedItem ? selectedItem.value : top,
      category: filter_category,
      display_duration: display_duration ? 1 : 0,
      display_price: display_price ? 1 : 0,
      display_number_of_chapter: display_number_of_chapter ? 1 : 0,
      id: index,
    };
    if (searchText) {
      params['keyword'] = searchText;
    }
    dispatch(fetchCourses(params));
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCoursesAPI();
  }, [selectedItem?.value, currSearchKeyword]);

  // set current Search text
  const onSearchPress = () => {
    setCurrSearchKeyword(searchText);
  };

  useThunkCallbackAction(
    FetchCoursesPrefix,
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

  const myCouseList = coursesList[index];
  const total = myCouseList?.total;
  const defaultPagination = 4;
  let courses = myCouseList?.data;
  // if pagination is enabled slice the data with default pagination count
  if (total > defaultPagination && !showAllCourses) {
    courses = courses.slice(0, defaultPagination);
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
  const goToCouseDetails = (course: CourseType) => {
    NavigationService.pushToScreen(ScreenID.CouseDetails, {course});
  };
  const goToAllCourses = () => {
    NavigationService.pushToScreen(ScreenID.AllCourses, {
      content,
      searchText,
    });
  };

  const dropdownItems = [
    {name: 'No-Featured', value: 0},
    {name: 'Featured', value: 1},
    {name: 'Show All', value: -1},
  ];
  const dropdownItemsTopIndex = dropdownItems.findIndex(v => v.value === top);

  return (
    <View style={[l.mb30]}>
      {/* Header title and display actions */}
      <View style={[l.flexRow, l.alignCtr, l.mb10, {zIndex: 9}]}>
        {!showAllCourses && (
          <Text style={[t.h3, f.fontWeightMedium, l.flex]}>{title}</Text>
        )}
        {showAllCourses && display_search_and_filter && (
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
            placeholder={'search course'}
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

      {/* courses data */}
      {isLoading && (
        <FetchCoursesLoader numberOfItems={showAllCourses ? 4 : 2} />
      )}
      {!isLoading && (
        <>
          <View
            style={
              displayType === 'list' ? {} : [l.flexRow, l.justifyBtw, l.wrap]
            }>
            {(!courses || courses.length === 0) && (
              <Text>{'No Matches Found'}</Text>
            )}
            {courses &&
              courses.map((course, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      displayType == 'list'
                        ? [
                            styles.courseListContainer,
                            i !== courses.length - 1 ? l.mb15 : {},
                          ]
                        : styles.courseGridContainer,
                      list_background_color_code
                        ? {backgroundColor: list_background_color_code}
                        : {},
                    ]}
                    onPress={() => {
                      goToCouseDetails(course);
                    }}>
                    <FastImage
                      source={{
                        uri: course.thumbnail,
                      }}
                      style={
                        displayType == 'list'
                          ? styles.courseListImg
                          : styles.courseGridImg
                      }
                    />
                    <View
                      style={
                        displayType == 'list'
                          ? styles.courseWrapper
                          : styles.courseGridWrapper
                      }>
                      <View>
                        <Text
                          style={[t.h5, f.fontWeightMedium]}
                          numberOfLines={1}>
                          {course.title}
                        </Text>
                        <Text style={styles.description} numberOfLines={2}>
                          {course.description ? course.description : ''}
                        </Text>
                        {/* ) : null} */}

                        {/* duration and chapters */}
                        <View
                          style={
                            displayType === 'list'
                              ? [l.flexRow, l.alignCtr, l.mt10]
                              : [l.mt10]
                          }>
                          {course.duration ? (
                            <View style={[l.flexRow, l.alignCtr]}>
                              <Icon
                                name={'schedule'}
                                color={primaryColor}
                                size={16}
                              />
                              <Text style={[l.ml5, t.pSM, {color: c.black200}]}>
                                {course.duration}
                              </Text>
                              <View style={styles.dot} />
                            </View>
                          ) : null}
                          {course.chapters ? (
                            <View
                              style={[
                                l.flexRow,
                                l.alignCtr,
                                displayType !== 'list' ? {...l.mt5} : {},
                              ]}>
                              <Icon
                                name={'headset'}
                                color={primaryColor}
                                size={16}
                              />
                              <Text
                                style={[
                                  l.ml5,
                                  t.pSM,
                                  {color: c.black200},
                                ]}>{`${course.chapters} Chapters`}</Text>
                            </View>
                          ) : null}
                        </View>
                      </View>

                      {/* price */}
                      <View style={[l.flexRow, l.alignCtr, l.mt10]}>
                        {course.price && (
                          <Text
                            style={[
                              t.h5,
                              f.fontWeightBold,
                              {color: primaryColor},
                              l.flex,
                            ]}>
                            {course.price}
                          </Text>
                        )}
                        {course.top_course && displayType === 'list' && (
                          <Text
                            style={[
                              styles.featured,
                              {backgroundColor: primaryColor},
                            ]}>
                            {'Featured'}
                          </Text>
                        )}
                      </View>
                    </View>
                    {course.top_course && displayType !== 'list' && (
                      <Text
                        style={[
                          styles.featuredGrid,
                          {backgroundColor: primaryColor},
                        ]}>
                        {'Featured'}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
          {isPaginated && (
            <View style={[l.mt15, l.flexRow, l.justifyCtr, l.alignCtr]}>
              <Text>{`Showing ${defaultPagination} of ${total}`}</Text>
              <View style={[l.ml10]}>
                <Button
                  theme={'simplePrimary'}
                  title={'View All'}
                  onPress={goToAllCourses}
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
  featured: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    ...t.pXS,
    color: '#fff',
    ...f.fontWeightMedium,
    ...l.mt5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  featuredGrid: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    ...t.pXS,
    color: '#fff',
    ...f.fontWeightMedium,
    ...l.mt5,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'absolute',
    top: 103,
    left: 10,
  },
  description: {
    color: c.black200,
    ...t.lh18,
    ...l.mt5,
  },
});

export default CourseList;
