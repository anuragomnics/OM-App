import React, {FC} from 'react';
import {View, KeyboardAvoidingView, ViewProps} from 'react-native';

// custom
import DeviceHelper from '../../config/DeviceHelper';

const CustomKeyboardAvoidingView: FC<ViewProps> = ({children, ...rest}) => {
  return (
    <>
      {DeviceHelper.isIOS ? (
        <KeyboardAvoidingView {...rest} behavior="padding">
          {children}
        </KeyboardAvoidingView>
      ) : (
        <View {...rest}>{children}</View>
      )}
    </>
  );
};

export default CustomKeyboardAvoidingView;
