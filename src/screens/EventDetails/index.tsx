import {RouteProp} from '@react-navigation/core';
import * as React from 'react';
import {Alert} from 'react-native';

// custom
import {useAppSelector} from '../../hooks/useRedux';
import {RootStackParams, ScreenID} from '../../navigation/types';
import {SettingsSelector} from '../../store/Configuration';
import EventDetailsStyle1 from './Components/EventDetails';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.PostDetails>;
}

const PostDetails: React.FC<Props> = ({route}) => {
  const settings = useAppSelector(SettingsSelector());
  // @ts-ignore
  const {event = {}} = route.params;

  return (
    <>
      {/* {settings.posts_general_settings?.posts_details_display_style ===
      'style-1' ? (
        <PostDetailsStyle1 post={post} />
      ) : (
        <PostDetailsStyle2 post={post} />
      )} */}
      <EventDetailsStyle1 event={event} />
    </>
  );
};

export default PostDetails;
