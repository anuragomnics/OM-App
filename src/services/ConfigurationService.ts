// @ts-ignore
import {loadFonts} from 'react-native-dynamic-fonts';
import FetchBlob from 'rn-fetch-blob';

// custom
import Settings from '../config/Settings';
import {LoadAppFontsParams, FontType} from '../types/request';
import {
  SettingResponseType,
  DashboardSettingResponseType,
} from '../types/responses/SettingResponseType';
import {NavigationsResponseType} from '../types/responses/NavigationsResponseType';
import HttpService from './HttpService';
import RobotoFontBlobData from '../config/RobotoFontBlobData';
import {Alert, Platform} from 'react-native';
import HttpServiceNew from './HttpServiceNew';
import DeviceHelper from '../config/DeviceHelper';

const fetchAppSettings = async () => {
  return await HttpService.Get<SettingResponseType>('/web-and-app/setting');
};

const fetchAppSettingsNew = async () => {
  return await HttpServiceNew.Get<SettingResponseType>(
    `/websiteApp/generalSettings?channel=${DeviceHelper.OS}`,
  );
};

const fetchAppNavigations = async () => {
  return await HttpServiceNew.Get<NavigationsResponseType>(
    `/websiteApp/navigationMenu?channel=app`,
  );
};

const fetchDashboardSettings = async (id: number) => {
  return await HttpService.Get<DashboardSettingResponseType>(
    `/websiteApp/pageSettings/${id}`,
  );
};

const loadAppFonts = async (fonts: Array<FontType>) => {
  const names = await loadFonts(
    fonts.map((v: FontType) => {
      return {
        name: v.fontFamily,
        data: v.base64,
        type: 'ttf',
      };
    }),
  );

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('Loaded all fonts successfully. Font names are: ', names);
  }
  return fonts;
};

const fetchLoadAppFonts = async ({
  fontName,
}: LoadAppFontsParams): Promise<Array<FontType>> => {
  try {
    const fontID = fontName.toLowerCase().replace(/ /g, '-');
    const data = await fetch(`${Settings.GOOGLE_FONT_API_URL}/${fontID}`);

    let fonts = await data.json();

    fonts = fonts.variants
      .filter((v: any) => v.fontStyle === 'normal')
      .map((v: any) => {
        return {
          fontFamily: fonts.family,
          fontStyle: v.fontStyle,
          fontWeight: v.fontWeight,
          fontURL: v.ttf,
        };
      });

    fonts = await Promise.all(
      fonts.map((v: any) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          try {
            const response = await FetchBlob.fetch('GET', v.fontURL);
            const data = {
              ...v,
              base64: response.data,
            };
            resolve(data);
          } catch (error) {
            reject(error);
          }
        });
      }),
    );
    return await loadAppFonts(fonts);
  } catch (err) {
    return await loadAppFonts([RobotoFontBlobData]);
  }
};

const ConfigurationService = {
  fetchAppSettings,
  fetchLoadAppFonts,
  fetchDashboardSettings,
  fetchAppSettingsNew,
  fetchAppNavigations,
};

export default ConfigurationService;
