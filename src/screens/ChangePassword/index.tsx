import React, {FC, useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
// styles
import {t, f, l, c} from '../../styles/shared';
// custom
import Header from '../../components/Header';
import {ContainerStyles} from '../../styles/elements';
import FormContainer from '../../components/FormContainer';
import ChangePasswordForm from './components/ChangePasswordForm';
import {ScrollView} from 'react-native-gesture-handler';
import CustomKeyboardAvoidingView from '../../components/CustomKeyboardAvoidingView';

const ChangePassword: FC<any> = () => {
  return (
    <View style={[ContainerStyles]}>
      <Header title={'Change password'} />
      <CustomKeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <FormContainer
            widgetStyles={{
              childContainer: styles.FormContainerWidgetContainer,
            }}>
            <Image
              style={styles.bannerImg}
              source={require('../../assets/images/banner_woman.png')}
            />
            <ChangePasswordForm />
          </FormContainer>
        </ScrollView>
      </CustomKeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  FormContainerWidgetContainer: {
    ...l.p40,
  },
  bannerImg: {
    ...l.fullWidth,
    height: 300,
    borderRadius: 5,
    ...l.mb40,
  },
});

export default ChangePassword;
