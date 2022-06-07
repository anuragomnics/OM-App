import React, {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  BackHandler,
  Share,
  Linking,
  Alert,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNGallery from 'react-native-image-gallery';

// custom
import TabBar from '../../components/TabBar';
import Text from '../../components/Text';
import {RootStackParams, ScreenID} from '../../navigation/types';
import NavigationService from '../../services/NavigationService';
import {c, f, l, t} from '../../styles/shared';
import {BoxTopShadowStyles, ContainerStyles} from '../../styles/elements';
import DetailsBannerImage from '../../components/DetailsBannerImage';
import {ScrollView} from 'react-native-gesture-handler';
import {useSingleNews} from './hook';
import Gallery from '../CourseDetails/Components/Gallery';
import Authors from '../CourseDetails/Components/Authors';
import Description from '../CourseDetails/Components/Description';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import FastImage from 'react-native-fast-image';
import Button from '../../components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector} from '../../hooks/useRedux';
import {FontsSelector} from '../../store/Configuration';
import moment from 'moment';
import DeviceHelper from '../../config/DeviceHelper';
import Header from '../../components/Header';
import RNFetchBlob from 'rn-fetch-blob';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.CouseDetails>;
}

interface TAB {
  name: string;
  id: number;
}

const TABS = [
  {
    name: 'Details',
    id: 0,
  },
  {
    name: 'Authors',
    id: 1,
  },
  {
    name: 'Gallery',
    id: 2,
  },
];

const FontScales = ['75%', '100%', '125%', '150%'];

const NewsDetails: FC<Props> = ({route}) => {
  const primaryColor = usePrimaryStyles().color;
  const fonts = useAppSelector(FontsSelector());
  const normalFont = fonts.filter(font => {
    return font.fontWeight == '300';
  });

  const fontUrl = normalFont[0]
    ? normalFont[0].fontURL
    : fonts?.[0]?.fontURL || '';

  // @ts-ignore
  const {news = {}, fromSlider, fromRelatedNews} = route.params;
  const {newsDetails, isLoading} = useSingleNews(news.id);
  const {bottom, top} = useSafeAreaInsets();

  console.log('newsnewsnews', news);

  const title = fromRelatedNews
    ? news.title
    : fromSlider
    ? news?.name
    : news.title;
  const newsBannerImage = fromRelatedNews
    ? news?.thumbnail
    : fromSlider
    ? news?.image
    : news.primary_image;

  // refs
  const scrollRef = useRef();

  // state
  // const [selectedNewsID, setSelectedNewsID] = useState<number>(
  //   newsDetails?.id || -1,
  // );
  const [fontScaleIndex, setFontScaleIndex] = useState<number>(2);

  // navigations
  const goBack = () => {
    NavigationService.goBack();
  };

  const scrollToTop = () => {
    // @ts-ignore
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const onRelatedNewsPress = (relatedNews: any) => {
    scrollToTop();
    NavigationService.pushToScreen(ScreenID.NewsDetails, {
      news: relatedNews,
      fromRelatedNews: true,
    });
  };

  useEffect(() => {
    scrollToTop();
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

  const increaseFontScale = () => {
    if (fontScaleIndex !== FontScales.length - 1) {
      setFontScaleIndex(fontScaleIndex + 1);
    }
  };
  const decreaseFontScale = () => {
    if (fontScaleIndex !== 0) {
      setFontScaleIndex(fontScaleIndex - 1);
    }
  };
  const currFontScale = FontScales[fontScaleIndex];

  return (
    <View
      style={[
        ContainerStyles,
        {backgroundColor: '#fff', position: 'relative'},
      ]}>
      {/* <StatusBar barStyle={'light-content'} networkActivityIndicatorVisible /> */}
      {/* <View style={styles.statusBar} /> */}

      <Header useBack title={' '} />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{height: '100%'}}
        // @ts-ignore
        ref={scrollRef}>
        <View style={[l.p20]}>
          {/* Date */}
          <View style={[l.flexRow, l.alignCtr]}>
            <Text
              style={[t.h5, f.fontWeightMedium, l.mb5, {color: c.black200}]}>
              {news?.available_date || newsDetails?.available_date
                ? moment(
                    news?.available_date || newsDetails?.available_date,
                    'DD.MM.YYYY HH:mm',
                  ).format('DD.MM.YYYY')
                : ''}
            </Text>
          </View>

          {/* title */}
          <Text style={[t.h2SM, f.fontWeightMedium, {lineHeight: 24}]}>
            {title}
          </Text>

          {/* categories */}
          {newsDetails?.categories && newsDetails?.categories.length > 0 && (
            <View style={[l.flexRow, l.alignCtr, l.wrap, l.mt5]}>
              {newsDetails?.categories.map((category, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      {backgroundColor: primaryColor},
                      l.p5,
                      l.defaultBorderRadius,
                      l.mt5,
                      index !== 0 ? l.ml5 : null,
                    ]}>
                    <Text style={[t.pSM, {color: c.white}]}>
                      {category.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <TouchableOpacity
            style={[l.mt10]}
            onPress={() => {
              NavigationService.pushToScreen(ScreenID.FullScreenImage, {
                imageUrl: newsBannerImage,
              });
            }}>
            <DetailsBannerImage
              onBackPress={goBack}
              imageUrl={newsBannerImage}
              hideBackIcon
            />
          </TouchableOpacity>
          {newsDetails?.copyright_primary_image && (
            <Text style={[{color: c.black200}]}>
              {newsDetails?.copyright_primary_image}
            </Text>
          )}

          {/* Details */}
          {(newsDetails?.description || newsDetails?.introduction) && (
            <View style={[l.mt15]}>
              <Description
                newsDetails={newsDetails}
                fontSize={currFontScale}
                fontUrl={fontUrl}
                scrollToTop={scrollToTop}
              />
            </View>
          )}

          {/* Gallery */}
          {newsDetails?.gallery && newsDetails?.gallery.length > 0 && (
            <View style={[l.mt15]}>
              <Gallery news={newsDetails} />
            </View>
          )}

          {/* Authors */}
          {newsDetails?.authors && newsDetails?.authors.length > 0 && (
            <View style={[l.mt15]}>
              <Authors news={newsDetails} />
            </View>
          )}

          {/* related News */}
          {newsDetails?.related_news && newsDetails?.related_news.length > 0 && (
            <View style={[l.mt15]}>
              <Text style={[t.h5, f.fontWeightMedium]}>{'Related News'}</Text>
              {newsDetails?.related_news.map((relatedNews, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[l.flexRow, l.alignCtr, l.mt15]}
                    onPress={() => {
                      onRelatedNewsPress(relatedNews);
                    }}>
                    <FastImage
                      source={{uri: relatedNews.thumbnail}}
                      style={styles.relatedNewsImage}
                    />
                    <Text style={[l.ml10, l.flex]}>{relatedNews.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={[
          l.flexRow,
          l.alignCtr,
          l.justifyBtw,
          l.px50,
          l.py15,
          {
            paddingBottom: bottom + 10,
            backgroundColor: c.white,
          },
          BoxTopShadowStyles,
        ]}>
        <View style={[l.flexRow, l.alignCtr]}>
          <Text
            style={[t.h3, l.mr30]}
            onPress={() => {
              decreaseFontScale();
            }}>
            T-
          </Text>
          <Text
            style={[t.h3]}
            onPress={() => {
              increaseFontScale();
            }}>
            T+
          </Text>
        </View>
        <View style={[l.flexRow, l.alignCtr]}>
          <Icon
            name={'vertical-align-top'}
            size={22}
            color={c.black800}
            style={[l.mr30]}
            onPress={scrollToTop}
          />

          <Icon
            name={'ios-share'}
            size={22}
            color={
              newsDetails?.share_information?.url ? c.black800 : c.black200
            }
            onPress={() => {
              if (newsDetails?.share_information?.url) {
                if (DeviceHelper.isIOS) {
                  Share.share({
                    message: newsDetails?.share_information?.description || '',
                    url: newsDetails?.share_information?.url,
                  });
                } else {
                  Share.share({
                    title: newsDetails?.share_information?.description || '',
                    message: newsDetails?.share_information?.url,
                  });
                }
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    // position: 'absolute',
    backgroundColor: c.white,
    height: 40,
    width: '100%',
    // opacity: 0.5,
    zIndex: 999,
  },
  relatedNewsImage: {
    height: 35,
    width: 35,
    ...l.defaultBorderRadius,
  },
});

export default NewsDetails;
