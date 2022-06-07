import React, {FC} from 'react';
import {View} from 'react-native';

// custom
import {c, l, t} from '../../styles/shared';
import Text from '../Text';

interface Props {
  error: boolean;
  errorMessage?: string;
}

const FormError: FC<Props> = ({error, errorMessage}) => {
  return (
    <>
      {error && (
        <View
          style={[
            l.p10,
            l.mb10,
            l.defaultBorderRadius,
            {backgroundColor: '#ffeded'},
          ]}>
          <Text style={[t.pSM, {color: c.red800, lineHeight: 18}]}>
            {errorMessage}
          </Text>
        </View>
      )}
    </>
  );
};

export default FormError;
