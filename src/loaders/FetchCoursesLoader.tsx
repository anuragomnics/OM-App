import React, {FC} from 'react';
import {View, ScrollView, Dimensions} from 'react-native';

import {
  Placeholder,
  PlaceholderLine,
  Fade,
  PlaceholderMedia,
} from 'rn-placeholder';
import {useAppSelector} from '../hooks/useRedux';
import {ThemeSelector} from '../store/Configuration';
import {c, l} from '../styles/shared';

interface Props {
  numberOfItems: number;
  type?: string;
  maximumCarouselItems?: number;
}

interface CarouselProps {
  numberOfItems: number;
  type?: string;
  maximumCarouselItems: number;
}

const deviceWidth = Dimensions.get('window').width;

const FetchCoursesLoader: FC<Props> = ({
  numberOfItems = 2,
  type,
  maximumCarouselItems,
}) => {
  const items = new Array(numberOfItems).fill(0);
  const appTheme = useAppSelector(ThemeSelector());
  const backgroundColor = appTheme === 'light' ? c.grey200 : '#303030';

  return (
    <Placeholder
      Animation={props => (
        <Fade {...props} style={{backgroundColor, opacity: 1}} />
      )}>
      {type === 'grid' && (
        <FetchCoursesGridLoader numberOfItems={numberOfItems} />
      )}
      {type === 'list' && (
        <FetchCoursesListLoader numberOfItems={numberOfItems} />
      )}
      {type === 'carousel' && (
        <FetchCoursesCarouselLoader
          numberOfItems={numberOfItems}
          // @ts-ignore
          maximumCarouselItems={maximumCarouselItems}
        />
      )}
    </Placeholder>
  );
};

const FetchCoursesListLoader: FC<Props> = ({numberOfItems}) => {
  const items = new Array(numberOfItems).fill(0);

  return (
    <>
      {items.map((item, index) => (
        <View
          key={index}
          style={{
            marginTop: index !== 0 ? 20 : 0,
            ...l.flexRow,
            // ...l.alignCtr,
          }}>
          <PlaceholderMedia
            style={[{width: 90, height: 60, borderRadius: 10}]}
          />
          <View style={{...l.ml15, ...l.flex}}>
            <PlaceholderLine style={[{height: 14}]} />
            <PlaceholderLine style={[{height: 14, marginTop: -5}]} />
            <PlaceholderLine style={[{height: 12, opacity: 1}]} />
          </View>
        </View>
      ))}
    </>
  );
};

const FetchCoursesCarouselLoader: FC<CarouselProps> = ({
  numberOfItems,
  maximumCarouselItems,
}) => {
  const items = new Array(numberOfItems).fill(0);
  const endSlideWidth = maximumCarouselItems === 1 ? 120 : 40;
  const courseItemWidth =
    deviceWidth / maximumCarouselItems -
    maximumCarouselItems * 20 -
    endSlideWidth / maximumCarouselItems;

  return (
    <ScrollView
      contentContainerStyle={[l.flexRow]}
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}>
      {items.map((item, index) => (
        <View
          key={index}
          style={{
            width: courseItemWidth,
            ...l.mr20,
          }}>
          <PlaceholderLine
            style={[
              maximumCarouselItems === 1
                ? {height: 130, borderRadius: 10}
                : {height: 100, borderRadius: 10},
            ]}
          />
          <View style={{...l.flex}}>
            <PlaceholderLine style={[{height: 15, width: '100%'}]} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const FetchCoursesGridLoader: FC<Props> = ({numberOfItems}) => {
  const items = new Array(numberOfItems * 2).fill(0);

  return (
    <View style={[l.flexRow, l.justifyBtw, l.wrap]}>
      {items.map((item, index) => (
        <View
          key={index}
          style={{
            width: '47.5%',
            ...l.mb15,
            overflow: 'hidden',
          }}>
          <PlaceholderLine
            style={[{width: '100%', height: 110, borderRadius: 10}]}
          />
          <View
            style={{
              ...l.mt5,
              ...l.mb10,
              flex: 1,
            }}>
            <PlaceholderLine style={[{height: 15, marginTop: -10}]} />
            <PlaceholderLine style={[{height: 30}]} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default FetchCoursesLoader;
