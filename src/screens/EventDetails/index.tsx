import React, {FC, useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  BackHandler,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// custom
import TabBar from '../../components/TabBar';
import Text from '../../components/Text';
import {RootStackParams, ScreenID} from '../../navigation/types';
import NavigationService from '../../services/NavigationService';
import {c, f, l, t} from '../../styles/shared';
import {ContainerStyles} from '../../styles/elements';
import DetailsBannerImage from '../../components/DetailsBannerImage';
import AboutEvent from './Components/AboutEvent';
import Organizer from './Components/Organizer';
import Schedule from './Components/Schedule';
import {useSingleEvent} from './hook';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import moment from 'moment';
import {useThunkCallbackAction} from '../../hooks/useRedux';
import Header from '../../components/Header';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.CouseDetails>;
}

interface TAB {
  name: string;
  id: number;
}

const TABS = [
  {
    name: 'About',
    id: 0,
  },
  {
    name: 'organizer',
    id: 1,
  },
  {
    name: 'Schedule',
    id: 2,
  },
];

const EventDetails: FC<Props> = ({route}) => {
  // @ts-ignore
  const {event = {}} = route.params;
  const {eventDetails, isLoading} = useSingleEvent(event.id, true);

  // state
  const [selectedTab, setSelectedTab] = useState<TAB>(TABS[2]);

  // navigations
  const goBack = () => {
    NavigationService.goBack();
  };

  useEffect(() => {
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

  return (
    <View
      style={[
        ContainerStyles,
        {backgroundColor: '#fff', position: 'relative'},
      ]}>
      {/* <StatusBar barStyle={'light-content'} networkActivityIndicatorVisible /> */}
      <Header useBack title={' '} />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* <View style={styles.statusBar} /> */}

        {/* title */}
        <View style={[l.p20]}>
          <Text style={[t.h2SM, f.fontWeightMedium, {lineHeight: 24}]}>
            {event.title}
          </Text>

          <TouchableOpacity
            style={[l.mt10]}
            onPress={() => {
              event.image &&
                NavigationService.pushToScreen(ScreenID.FullScreenImage, {
                  imageUrl: event.image,
                });
            }}>
            <DetailsBannerImage
              onBackPress={goBack}
              imageUrl={event.image}
              hideBackIcon
            />
          </TouchableOpacity>
          {eventDetails?.image_copyright && (
            <Text style={[{color: c.black200}]}>
              {eventDetails?.image_copyright}
            </Text>
          )}

          {/* {event?.event_date ? (
            <View style={[l.flexRow, l.alignCtr, l.mt30]}>
              <Icon name={'event-available'} size={25} color={c.black400} />
              <Text style={[t.h5, l.ml5]}>
       
                {event?.event_date}
              </Text>
            </View>
          ) : null} */}
        </View>

        {/* tabs  */}
        {/* <TabBar
          tabs={TABS}
          onSelectTab={tab => {
            setSelectedTab(tab);
          }}
        /> */}

        {/* content */}
        {!isLoading && (
          <View style={[l.px20]}>
            {/* about */}
            {selectedTab.id === 0 && <AboutEvent event={eventDetails} />}
            {/* organizers */}
            {selectedTab.id === 1 && <Organizer event={eventDetails} />}
            {/* Schedule */}
            {selectedTab.id === 2 && <Schedule event={eventDetails} />}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    position: 'absolute',
    backgroundColor: c.black1000,
    height: 40,
    width: '100%',
    opacity: 0.5,
    zIndex: 999,
  },
});

export default EventDetails;
