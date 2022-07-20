import React, {FC, useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// custom
import FastImage from 'react-native-fast-image';
import {c, f, l, t} from '../../../styles/shared';
import Text from '../../../components/Text';
import {usePrimaryStyles} from '../../../hooks/useThemeStyles';
import {EventsListSectionType} from '../../../types/responses/SettingResponseType';
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
import DropDown from '../../../components/DropDown';
import {getParsedTextFromHTML} from '../../../utils/HTMLParser';
import {useColors} from '../../../styles/shared/Colors';
import {
  EventsListSelector,
  EventsPaginationDetailsSelector,
  fetchEvents,
  fetchEventsPrefix,
} from '../../../store/Events';
import {EventType} from '../../../types/responses/EventsListResponseType';
import {SettingsSelector} from '../../../store/Configuration';
import moment from 'moment';

interface Props extends EventsListSectionType {
  content: EventsListSectionType;
  index: number;
  ViewType?: string;
}

const EventsList: FC<Props> = ({
  content,
  index,
  id,
  type,
  title,
  default_view,
  switch_between_views,
  pagination,
  items_per_page,
  search_bar,
  offset,
  option_for_featured,
  rule_type,
  groups,
  groups_condition,
  categories,
  categories_condition,
  tags,
  tags_condition,
  ViewType,
  sorting,
}) => {
  const dispatch = useAppDispatch();
  const primaryColor = usePrimaryStyles().color;
  const eventsList = useAppSelector(EventsListSelector());
  const eventsListPaginationDetails = useAppSelector(
    EventsPaginationDetailsSelector(),
  );
  const settings = useAppSelector(SettingsSelector());

  const colors = useColors();
  const showAllEvents = Boolean(ViewType === 'All');
  const eventsArr = eventsList[index];
  const paginationDetails = eventsListPaginationDetails[index];
  const isPaginated = !showAllEvents && pagination;

  // refs
  const firstRender = useRef(true);

  // state
  const [displayType, setDisplayType] = useState(
    default_view ? default_view : 'list',
  );
  const [searchText, setSearchText] = useState('');
  const [currSearchKeyword, setCurrSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    value: string;
    id: number;
  }>();
  const [APICompleted, setAPICompleted] = useState(false);
  const [showViewAll, setShowViewAll] = useState(false);

  // get Postslist API
  const fetchEventsAPI = () => {
    const params: any = {
      offset,
      option_for_featured:
        showAllEvents && selectedItem
          ? selectedItem.value
          : option_for_featured,
      pagination: showAllEvents ? 0 : pagination,
      items_per_page,
      rule_type,
      groups_condition,
      categories_condition,
      tags_condition,
      id: index,
      sorting,
      type,
    };

    if (groups) params.groups = groups;
    if (categories) params.categories = categories;
    if (tags) params.tags = tags;

    dispatch(fetchEvents(params));
  };

  useEffect(() => {
    setIsLoading(true);
    fetchEventsAPI();
  }, []);

  const getupdatedEvents = () => {
    const updatedEvents = (eventsArr || []).filter(event => {
      return (event.title || '')
        .toLocaleLowerCase()
        .includes((searchText || '').toLocaleLowerCase());
    });
    return updatedEvents;
  };

  // set current Search text
  const onSearchPress = () => {
    setCurrSearchKeyword(searchText);
  };

  useThunkCallbackAction(
    fetchEventsPrefix,
    () => {
      setIsLoading(false);
      setAPICompleted(true);
    },
    () => {
      setIsLoading(false);
      setAPICompleted(true);
    },
  );

  const onSelectItemPress = (item: {
    name: string;
    value: string;
    id: number;
  }) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    if (selectedItem) {
      setIsLoading(true);
      fetchEventsAPI();
    }
  }, [selectedItem?.value]);

  // navigations
  const goToAllEvents = () => {
    NavigationService.pushToScreen(ScreenID.AllEvents, {
      content,
    });
  };
  const goToEventDetails = (event: EventType) => {
    NavigationService.pushToScreen(ScreenID.EventDetails, {
      event,
    });
  };

  const dropdownItems = [
    {name: 'Beiträge', value: 'unfeatured', id: 1},
    {name: 'Top-Beiträge', value: 'featured', id: 2},
    {name: 'Alle anzeigen', value: 'all', id: 3},
  ];

  const dropdownItemsTopIndex =
    dropdownItems.findIndex(v => v.value === option_for_featured) || 0;
  // const dropdownItemsTopIndex = 0;

  const displayEvents = getupdatedEvents();

  return (
    <View style={[l.mb30]}>
      <View
        style={[
          l.flexRow,
          l.alignCtr,
          l.justifyBtw,
          search_bar ? l.mb15 : l.mb20,
        ]}>
        {/* title */}
        {!showAllEvents ? (
          <Text style={[t.h4, l.flex, f.fontWeightMedium]}>{title}</Text>
        ) : null}

        {/* filter */}
        {showAllEvents && search_bar ? (
          <DropDown
            items={dropdownItems}
            onSelectItem={onSelectItemPress}
            defaultIndex={dropdownItemsTopIndex}
          />
        ) : null}

        {/* layout actions */}
        {switch_between_views ? (
          <View style={[l.flexRow, l.alignCtr, l.ml10]}>
            <TouchableOpacity
              onPress={() => {
                setDisplayType('list');
              }}>
              <Icon
                name={'format-list-bulleted'}
                color={displayType === 'list' ? primaryColor : colors.black400}
                size={23}
              />
            </TouchableOpacity>
            <View style={[l.ml10]} />
            <TouchableOpacity
              onPress={() => {
                setDisplayType('grid');
              }}>
              <Icon
                name={'grid-view'}
                color={displayType === 'grid' ? primaryColor : colors.black400}
                size={20}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* search */}
      {search_bar ? (
        <View style={[l.flexRow, l.alignCtr, l.mb20]}>
          <Input
            type={'search'}
            onClearSearch={() => {
              setCurrSearchKeyword('');
            }}
            widgetStyles={{
              container: {...l.flex, marginBottom: 0},
            }}
            placeholder={'Suchen'}
            leftIcon={{iconName: 'search'}}
            onChangeText={text => {
              setSearchText(text || '');
            }}
            value={searchText}
            returnKeyType={'search'}
            // onChangeText={onSearchPress}
            // onSubmitEditing={onSearchPress}
          />
        </View>
      ) : null}

      {isLoading ? (
        <FetchCoursesLoader
          numberOfItems={showAllEvents ? 4 : 2}
          type={displayType}
        />
      ) : null}

      {!isLoading && (
        <>
          <View
            style={
              displayType === 'list' ? {} : [l.flexRow, l.justifyBtw, l.wrap]
            }>
            {(!displayEvents || displayEvents.length === 0) && APICompleted ? (
              <Text>{'Keine Einträge gefunden'}</Text>
            ) : null}
            {displayEvents &&
              displayEvents.map((event, i) => {
                // const root = parse(news.description);
                // const parsedDescription =
                //   root.querySelector('p')?.textContent || '';
                const description = getParsedTextFromHTML(
                  event.description || '',
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
                            i !== displayEvents.length - 1 ? l.mb20 : {},
                          ]
                        : styles.courseGridContainer,
                    ]}
                    onPress={() => {
                      goToEventDetails(event);
                    }}>
                    {/* banner image */}
                    <FastImage
                      source={{
                        uri: event.event_image_url,
                      }}
                      style={[
                        displayType == 'list'
                          ? styles.courseListImg
                          : styles.courseGridImg,
                      ]}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    {/* topnews flag */}
                    {event.top_event ? (
                      <Text
                        style={[
                          displayType === 'list'
                            ? styles.topNewsList
                            : styles.topNewsGrid,
                          {backgroundColor: primaryColor},
                        ]}>
                        {'Top event'}
                      </Text>
                    ) : null}
                    <View
                      style={
                        displayType == 'list'
                          ? styles.courseWrapper
                          : styles.courseGridWrapper
                      }>
                      <View style={[]}>
                        {/* title */}
                        <Text
                          style={[t.h5, f.fontWeightMedium, {lineHeight: 20}]}
                          numberOfLines={2}>
                          {event.title}
                        </Text>

                        <View style={[l.flexRow, l.alignCtr]}>
                          <Text
                            style={[
                              t.pSM,
                              f.fontWeightMedium,
                              l.mb5,
                              {color: c.black150},
                              l.mt5,
                            ]}>
                            {event?.start_date
                              ? moment(
                                  event?.start_date,
                                  'YYYY-MM-DD HH:mm:ss',
                                ).format('DD.MM.YYYY | HH:mm')
                              : 'mehr erfahren'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>

          {/* view All */}
          {isPaginated &&
          paginationDetails &&
          paginationDetails.total_items <
            paginationDetails.actual_total_items ? (
            <View style={[l.mt20, l.flexRow, l.justifyCtr, l.alignCtr]}>
              {paginationDetails ? (
                <Text>{`Zeige ${paginationDetails.total_items} von ${paginationDetails.actual_total_items}`}</Text>
              ) : null}
              <View style={[l.ml10]}>
                <Button
                  theme={'simplePrimary'}
                  title={'Alle anzeigen'}
                  onPress={goToAllEvents}
                />
              </View>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  courseListContainer: {
    ...l.flexRow,
  },
  courseGridContainer: {
    width: '47.5%',
    ...l.mb15,
    overflow: 'hidden',
  },
  courseListImg: {
    width: 100,
    height: 65,
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  courseGridImg: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  courseWrapper: {
    ...l.ml15,
    flex: 1,
    ...l.flexRow,
  },
  courseGridWrapper: {
    ...l.mt5,
    ...l.mb10,
    flex: 1,
  },
  dot: {
    ...l.mx5,
  },
  topNewsList: {
    padding: 2,
    ...t.pXS,
    color: '#fff',
    ...f.fontWeightMedium,
    ...l.mt5,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'absolute',
    // top: -20,
    left: 5,
  },
  topNewsGrid: {
    padding: 2,
    ...t.pXS,
    color: '#fff',
    ...f.fontWeightMedium,
    ...l.mt5,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'absolute',
    // top: -20,
    left: 5,
  },
  description: {
    // color: c.black200,
  },
  readMore: {
    color: c.black150,
    // lineHeight: 18,
    ...l.mt5,
    // marginTop: 2,
    ...t.pSM,
    ...f.fontWeightMedium,
  },
});

export default EventsList;
