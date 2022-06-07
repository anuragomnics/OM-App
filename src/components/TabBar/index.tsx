import React, {FC, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Text from '../Text';

// custom
import {l, t, c, f} from '../../styles/shared/index';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';

interface Tab {
  id: number;
  name: string;
}

interface Props {
  tabs: Tab[];
  onSelectTab: (tab: Tab) => void;
}

const TabBar: FC<Props> = ({tabs = [], onSelectTab}) => {
  const primaryColor = usePrimaryStyles().color;
  // state
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const onTabPress = (tab: Tab) => {
    setSelectedTab(tab);
    onSelectTab?.(tab);
  };

  return (
    <View
      style={[
        l.flexRow,
        l.alignCtr,
        l.px20,
        {
          backgroundColor: c.grey50,
        },
      ]}>
      {tabs.map((tab, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={[index !== 0 ? {...l.ml30} : {}]}
            onPress={() => {
              onTabPress(tab);
            }}>
            <Text
              style={[
                f.fontWeightMedium,
                tab.id === selectedTab.id
                  ? {color: c.black400}
                  : {color: c.black200},
                l.my15,
              ]}>
              {tab.name}
            </Text>
            {tab.id === selectedTab.id && (
              <View
                style={{
                  height: 3,
                  backgroundColor: primaryColor,
                  position: 'absolute',
                  ...l.fullWidth,
                  bottom: 0,
                  ...l.defaultBorderRadius,
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
