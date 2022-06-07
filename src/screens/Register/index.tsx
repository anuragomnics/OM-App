import React, {FC} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
// styles
import {t, f, l, c} from '../../styles/shared';
import {ContainerStyles} from '../../styles/elements';
// custom
import Header from '../../components/Header';
import RegisterForm from './components/RegisterForm';
import FormContainer from '../../components/FormContainer';
import NavigationService from '../../services/NavigationService';

const Register: FC<any> = () => {
  const goToSignIn = () => {
    NavigationService.pushToScreen('Login');
  };

  return (
    <View style={[ContainerStyles]}>
      <Header title={'Sign up'} useBack={true} />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <FormContainer
          widgetStyles={{
            childContainer: styles.childContainer,
          }}>
          <RegisterForm onSignIn={goToSignIn} />
        </FormContainer>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  childContainer: {
    ...l.p20,
  },
});

export default Register;
