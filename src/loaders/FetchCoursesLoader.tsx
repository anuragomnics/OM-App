import React, {FC} from 'react';
import {View} from 'react-native';
import {Placeholder, PlaceholderLine, Fade} from 'rn-placeholder';
import {l} from '../styles/shared';

interface Props {
  numberOfItems: number;
  type?: string;
}

const FetchCoursesLoader: FC<Props> = ({numberOfItems = 2, type}) => {
  const items = new Array(numberOfItems).fill(0);

  return (
    <Placeholder Animation={Fade}>
      {type === 'grid' ? (
        <FetchCoursesGridLoader numberOfItems={numberOfItems} />
      ) : (
        <FetchCoursesListLoader numberOfItems={numberOfItems} />
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
            height: 130,
            backgroundColor: '#fff',
            ...l.p15,
            ...l.flexRow,
            ...l.defaultBorderRadius,
            marginTop: index !== 0 ? 15 : 0,
          }}>
          <PlaceholderLine style={[{height: 70, width: 70}]} />
          <View style={{...l.ml10, ...l.flex}}>
            <PlaceholderLine style={[{height: 15}]} />
            <PlaceholderLine style={[{height: 30, marginTop: -5}]} />
            <PlaceholderLine style={[{height: 15, width: 150, ...l.mt10}]} />
          </View>
        </View>
      ))}
    </>
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
            height: 200,
            backgroundColor: '#fff',
            width: '48%',
            ...l.mb15,
            ...l.defaultBorderRadius,
            overflow: 'hidden',
          }}>
          <PlaceholderLine style={[{width: '100%', height: 120}]} />
          <View style={[l.p10]}>
            <PlaceholderLine style={[{height: 15, marginTop: -10}]} />
            <PlaceholderLine style={[{height: 30}]} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default FetchCoursesLoader;
