import React, {FC, useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {parse} from 'node-html-parser';

// custom
import FastImage from 'react-native-fast-image';
import {c, f, l, t} from '../../../styles/shared';
import Text from '../../../components/Text';
import {usePrimaryStyles} from '../../../hooks/useThemeStyles';
import {EventsListSettings} from '../../../types/responses/SettingResponseType';
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
  fetchEvents,
  fetchEventsPrefix,
  EventsListSelector,
} from '../../../store/Events';
import DropDown from '../../../components/DropDown';
import {BoxShadowStyles} from '../../../styles/elements';
import {EventType} from '../../../types/responses/EventsResponseType';
import {getParsedTextFromHTML} from '../../../utils/HTMLParser';

interface Props extends EventsListSettings {
  content: EventsListSettings;
  index: number;
  ViewType?: string;
}

const EventsList: FC<Props> = ({
  type,
  title,
  top,
  display_search_and_filter,
  display_the_search_bar,
  pagination,
  limit,
  list_background_color_code,
  content,
  ViewType,
  index,
}) => {
  const dispatch = useAppDispatch();
  const primaryColor = usePrimaryStyles().color;
  const newsList = useAppSelector(EventsListSelector());
  const showAllEvents = Boolean(ViewType === 'AllEvents');

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

  // get EventsList API
  const fetchEventsAPI = () => {
    const params: any = {
      pagination: pagination ? 1 : 0,
      top: selectedItem ? selectedItem.value : top,
      id: index,
    };
    if (searchText) {
      params['keyword'] = searchText;
    }
    if (limit) {
      params['limit'] = limit;
    } else {
      params['limit'] = 1000;
    }
    dispatch(fetchEvents(params));
  };

  useEffect(() => {
    setIsLoading(true);
    fetchEventsAPI();
  }, [selectedItem?.value, currSearchKeyword]);

  // set current Search text
  const onSearchPress = () => {
    setCurrSearchKeyword(searchText);
  };

  useThunkCallbackAction(
    fetchEventsPrefix,
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

  const myEventsList = newsList[index];
  const total = myEventsList?.total;
  const defaultPagination = 4;
  let EventsArr = myEventsList?.data;
  // if pagination is enabled slice the data with default pagination count
  if (total > defaultPagination && !showAllEvents) {
    EventsArr = EventsArr.slice(0, defaultPagination);
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
  const goToAllEvents = () => {
    NavigationService.pushToScreen(ScreenID.AllEvents, {
      content,
    });
  };
  const goToEventsDetails = (event: EventType) => {
    NavigationService.pushToScreen(ScreenID.EventDetails, {
      event,
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
      <View style={[l.flexRow, l.alignCtr, l.justifyBtw, l.mb10]}>
        {/* title */}
        {!showAllEvents && (
          <Text style={[t.h3, f.fontWeightMedium, l.flex]}>{title}</Text>
        )}

        {/* filter */}
        {/* {showAllEvents && display_search_and_filter && (
          <View style={[l.flex, l.mr15]}>
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
          </View>
        )} */}

        {/* layout actions */}
        {!showAllEvents && display_search_and_filter && (
          <View style={[l.flexRow, l.alignCtr]}>
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
      <View style={[l.flexRow, l.alignCtr, l.mb15]}>
        {display_the_search_bar && (
          <View style={[l.flex, l.flexRow, l.alignCtr]}>
            <Input
              type={'search'}
              onClearSearch={() => {
                setCurrSearchKeyword('');
              }}
              widgetStyles={{
                container: {...l.flex, marginBottom: 0},
                wrapper: {backgroundColor: c.white},
              }}
              placeholder={'Suchen'}
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
        {showAllEvents && display_search_and_filter && (
          <View style={[l.flexRow, l.alignCtr, l.ml15]}>
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

      {/* News data */}
      {isLoading && (
        <FetchCoursesLoader numberOfItems={showAllEvents ? 4 : 2} />
      )}
      {!isLoading && (
        <>
          <View
            style={
              displayType === 'list' ? {} : [l.flexRow, l.justifyBtw, l.wrap]
            }>
            {(!EventsArr || EventsArr.length === 0) && (
              <Text>{'No Matches Found'}</Text>
            )}
            {EventsArr &&
              EventsArr.map((event, i) => {
                const description = getParsedTextFromHTML(event.description);

                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      // BoxShadowStyles,
                      displayType == 'list'
                        ? [
                            styles.eventsListContainer,
                            i !== EventsArr.length - 1 ? l.mb15 : {},
                          ]
                        : styles.eventsGridContainer,
                      list_background_color_code
                        ? {backgroundColor: list_background_color_code}
                        : {},
                    ]}
                    onPress={() => {
                      goToEventsDetails(event);
                    }}>
                    {/* banner image */}
                    <FastImage
                      source={{uri: event.image}}
                      style={
                        displayType == 'list'
                          ? styles.eventsListImg
                          : styles.eventGridImg
                      }
                    />
                    <View
                      style={
                        displayType == 'list'
                          ? styles.eventWrapper
                          : styles.eventGridWrapper
                      }>
                      <View>
                        {/* title */}
                        <Text
                          style={[t.h5, f.fontWeightMedium]}
                          numberOfLines={1}>
                          {event.title}
                        </Text>

                        {/* description */}
                        {description ? (
                          <Text style={styles.description} numberOfLines={2}>
                            {description ? description : ''}
                          </Text>
                        ) : null}

                        {/* EVent Date */}
                        {event?.full_event_date ? (
                          <View style={[l.flexRow, l.mt10, l.alignCtr]}>
                            <Icon
                              name={'event'}
                              color={primaryColor}
                              size={16}
                            />
                            <Text
                              style={[
                                l.ml5,
                                t.pSM,
                                f.fontWeightMedium,
                                {color: c.black200},
                              ]}
                              numberOfLines={1}>
                              {event.full_event_date}
                            </Text>
                          </View>
                        ) : null}

                        {/* Oragnizer */}
                        {event?.organizer ? (
                          <View
                            style={[
                              l.flexRow,
                              event?.full_event_date ? l.mt5 : l.mt10,
                              l.alignCtr,
                            ]}>
                            <Icon
                              name={'people'}
                              color={primaryColor}
                              size={16}
                            />
                            <Text
                              style={[
                                l.ml5,
                                t.pSM,

                                f.fontWeightMedium,
                                {color: c.black200},
                              ]}
                              numberOfLines={1}>
                              {event.organizer.name}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      {/* price */}
                      <View style={[l.flexRow, l.alignCtr, l.mt10]}>
                        {event?.price && (
                          <Text
                            style={[
                              t.h5,
                              f.fontWeightBold,
                              l.flex,
                              {color: primaryColor},
                            ]}>
                            {event.display_price}
                          </Text>
                        )}
                        {event.top_event && displayType === 'list' && (
                          <Text
                            style={[
                              styles.topEvent,
                              {backgroundColor: primaryColor},
                            ]}>
                            {'Top event'}
                          </Text>
                        )}
                      </View>

                      {/* top event flag */}
                      {event.top_event && displayType !== 'list' && (
                        <Text
                          style={[
                            styles.topEventGrid,
                            {backgroundColor: primaryColor},
                          ]}>
                          {'Top event'}
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
              <Text>{`Zeige ${defaultPagination} von ${total}`}</Text>
              <View style={[l.ml10]}>
                <Button
                  theme={'simplePrimary'}
                  title={'Alle anzeigen'}
                  onPress={goToAllEvents}
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
  eventsListContainer: {
    ...l.flexRow,
    backgroundColor: c.white,
    ...l.p15,
    ...l.defaultBorderRadius,
  },
  eventsGridContainer: {
    width: '48%',
    ...l.mb15,
    backgroundColor: c.white,
    ...l.defaultBorderRadius,
    overflow: 'hidden',
  },
  eventsListImg: {
    width: 70,
    height: 70,
    borderWidth: 0.5,
    borderColor: '#ccc',
    ...l.defaultBorderRadius,
  },
  eventGridImg: {
    width: '100%',
    height: 120,
  },
  eventWrapper: {
    ...l.ml10,
    flex: 1,
    justifyContent: 'space-between',
  },
  eventGridWrapper: {
    ...l.p10,
    flex: 1,
    justifyContent: 'space-between',
  },
  dot: {
    ...l.mx5,
  },
  topEvent: {
    padding: 2,
    ...t.pXS,
    color: '#fff',
    ...f.fontWeightMedium,
    borderRadius: 2,
    overflow: 'hidden',
  },
  topEventGrid: {
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

export default EventsList;
