import React, {FC, useState} from 'react';
import {View, Image, Alert} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PagerView, {PagerViewOnPageSelectedEvent} from 'react-native-pager-view';
import {StackNavigationProp} from '@react-navigation/stack';
// styles
import styles from './styles';
// meta
import {metaFinder} from '../../meta';
// custom
import Button from '../../components/Button';
import Text from '../../components/Text';
import NavigationService from '../../services/NavigationService';
import {RootStackParams, ScreenID} from '../../navigation/types';
import {useAppSelector, useAppDispatch} from '../../hooks/useRedux';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import {onBoardingSelector, SettingsSelector} from '../../store/Configuration';
import {IsAuthSelector} from '../../store/Auth';
import FastImage from 'react-native-fast-image';

interface Props {
  navigation: StackNavigationProp<RootStackParams, ScreenID.Onboarding>;
}

interface onboardingItem {
  title: string;
  description: string;
}

interface DotPaginationProps {
  activeIndex: number;
  steps: Array<onboardingItem>;
}

const DotPagination: FC<DotPaginationProps> = ({activeIndex, steps}) => {
  return (
    <View style={styles.dotsContainer}>
      {steps.map((step, index) => (
        <View
          key={index}
          style={[styles.dotStyle, {width: index === activeIndex ? 40 : 10}]}
        />
      ))}
    </View>
  );
};

const Onboarding: FC<any> = Props => {
  const dispatch = useAppDispatch();
  const {top} = useSafeAreaInsets();
  const onBoardingSelected = useAppSelector(onBoardingSelector());
  const steps = onBoardingSelected?.steps || [];
  const isAuth = useAppSelector(IsAuthSelector());
  // const logoPath = useAppSelector(state => {
  //   return state.configuration.logo_color_ci?.logo_rectangle_full_path;
  // });

  const [activeIndex, setActiveIndex] = useState(0);
  const refPagerView: any = React.useRef(null);

  const renderItem = (item: onboardingItem, index: number) => {
    return (
      <View key={index} style={styles.pagerItemContainer}>
        <View style={styles.pagerItemWrapper}>
          <Text style={styles.pagerItemTitle}>{item.title}</Text>
          <Text style={styles.pagerItemDescription}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const onPageSelected = ({
    nativeEvent: {position},
  }: PagerViewOnPageSelectedEvent) => {
    setActiveIndex(position);
  };

  const OnPress = async () => {
    if (activeIndex < steps.length - 1) {
      refPagerView?.current.setPage(activeIndex + 1);
    } else {
      NavigationService.resetToScreen(ScreenID.Memberships);
    }
  };

  return (
    <View style={[styles.container, {paddingTop: top + 5}]}>
      <View style={styles.bannerImagecontainer}>
        <FastImage
          source={{
            uri: onBoardingSelected?.steps[activeIndex]?.picture_full_path,
          }}
          style={styles.bannerImg}
          resizeMode={'cover'}
        />
      </View>

      <View style={[usePrimaryStyles()?.viewStyle, styles.bodyContainer]}>
        <PagerView
          ref={refPagerView}
          initialPage={0}
          onPageSelected={onPageSelected}
          overdrag={false}
          style={styles.pagerContainer}>
          {onBoardingSelected?.steps.map(renderItem)}
        </PagerView>
        <DotPagination key={1} steps={steps} activeIndex={activeIndex} />

        <View style={styles.signinBtnContainer}>
          <Button title={'Weiter'} theme={'light'} onPress={OnPress} />
        </View>
      </View>
    </View>
  );
};

export default Onboarding;
