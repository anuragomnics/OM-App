import React, {FC} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  ViewProps,
  Dimensions,
} from 'react-native';
import DeviceHelper from '../../config/DeviceHelper';
import {c, t, f, l} from '../../styles/shared';

// custom
import Text from '../Text';

interface A {
  hello: string;
}

interface Props {
  children?: React.ReactNode;
  widgetStyles?: {
    childContainer: StyleProp<ViewStyle>;
  };
}

const FormContainer: React.FC<Props> = ({children, widgetStyles = {}}) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={widgetStyles.childContainer}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...l.flexCenter,
    ...l.m20,
  },
  wrapper: {
    borderRadius: 5,
    backgroundColor: c.white,
    ...l.fullWidth,
  },
});

export default FormContainer;
