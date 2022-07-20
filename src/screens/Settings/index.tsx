import React, {FC, useState} from 'react';
import {Alert, Appearance, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ToggleSwitch from 'toggle-switch-react-native';

// custom
import Checkbox from '../../components/FormControls/Checkbox';
import Header from '../../components/Header';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import {
  setAppTheme,
  setAppThemeSettingType,
  ThemeSelector,
  ThemeSetttingTypeSelector,
} from '../../store/Configuration';
import {useContainerStyles} from '../../styles/elements';
import {c, f, l, t} from '../../styles/shared';
import {ThemeSettingType} from '../../store/Configuration';
import {useSelector} from 'react-redux';

interface SettingsProps {}

const Settings: FC<SettingsProps> = () => {
  // hooks
  const ContainerStyle = useContainerStyles();
  const primaryColor = usePrimaryStyles().color;
  const dispatch = useAppDispatch();

  //   selectors
  const appTheme = useAppSelector(ThemeSelector());
  const themeSetting = useSelector(ThemeSetttingTypeSelector());

  // state
  const [themeSettingType, setThemeSettingType] =
    useState<ThemeSettingType>(themeSetting);

  const getSystemThemeHandler = () => {
    const colorScheme = Appearance.getColorScheme();
    if (colorScheme === 'dark') {
      dispatch(setAppTheme('dark'));
    } else {
      dispatch(setAppTheme('light'));
    }
  };

  return (
    <View style={ContainerStyle}>
      <Header useBack title={'Einstellungen'} />
      <ScrollView style={[l.p20]}>
        <Text style={[t.h5, f.fontWeightMedium]}>
          Bitte wählen Sie das Erscheinungsbild Ihrer App aus?
        </Text>
        {/* theme setting options */}
        <View style={[l.mt20]}>
          <View style={[l.flexRow, l.alignCtr, l.justifyBtw, l.mt5]}>
            {/* <Checkbox
              onValueChange={() => {
                setThemeSettingType('system');
              }}
              checked={themeSettingType === 'system'}
            /> */}
            <Text style={[t.h5SM]}>System</Text>
            <ToggleSwitch
              // @ts-ignore
              isOn={themeSettingType === 'system'}
              onColor={primaryColor}
              offColor={c.grey50}
              size="small"
              onToggle={isOn => {
                setThemeSettingType('system');
                dispatch(setAppThemeSettingType('system'));
                getSystemThemeHandler();
              }}
            />
          </View>
          <View style={{...l.my15}} />
          <View style={[l.flexRow, l.alignCtr, l.justifyBtw]}>
            {/* <Checkbox
              onValueChange={() => {
                setThemeSettingType('manual');
              }}
              checked={themeSettingType === 'manual'}
            /> */}
            <Text style={[t.h5SM]}>Dark Mode</Text>
            <ToggleSwitch
              // @ts-ignore
              isOn={themeSettingType === 'dark'}
              onColor={primaryColor}
              offColor={c.grey50}
              size="small"
              onToggle={isOn => {
                setThemeSettingType('dark');
                dispatch(setAppThemeSettingType('dark'));
                dispatch(setAppTheme('dark'));
              }}
            />
          </View>
          <View style={{...l.my15}} />
          <View style={[l.flexRow, l.alignCtr, l.justifyBtw]}>
            {/* <Checkbox
              onValueChange={() => {
                setThemeSettingType('none');
              }}
              checked={themeSettingType === 'none'}
            /> */}
            <Text style={[t.h5SM]}>Light</Text>
            <ToggleSwitch
              // @ts-ignore
              isOn={themeSettingType === 'light'}
              onColor={primaryColor}
              offColor={c.grey50}
              size="small"
              onToggle={isOn => {
                setThemeSettingType('light');
                dispatch(setAppThemeSettingType('light'));
                dispatch(setAppTheme('light'));
              }}
            />
          </View>
          {/* <View style={{height: 1, backgroundColor: c.grey50, ...l.my15}} /> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
