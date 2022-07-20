import React from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';

// custom
import Text from '../../components/Text';
import {useAppSelector} from '../../hooks/useRedux';
import {UserSelector} from '../../store/Auth';
import {ContainerStyles} from '../../styles/elements';
import {c, f, l, t} from '../../styles/shared';
import AvatarSelector from '../Register/components/AvatarSelector';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import NavigationService from '../../services/NavigationService';
import {ScreenID} from '../../navigation/types';

const Profile = () => {
  const userProfile = useAppSelector(UserSelector());
  const primaryColor = usePrimaryStyles().color;

  return (
    <View style={[ContainerStyles, {backgroundColor: c.white}]}>
      <Header title={'Profile'} useBack />

      <ScrollView style={[l.p20]}>
        {/* avatar */}
        <View style={[l.mb20, l.flexRow, l.justifyCtr]}>
          {userProfile?.avatar ? (
            <FastImage
              source={{uri: userProfile?.avatar}}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.noAvatar}>
              <Icon name={'person-outline'} size={70} color={c.black200} />
            </View>
          )}
        </View>

        <Text style={[f.fontWeightMedium, t.h3, {textAlign: 'center'}]}>
          {userProfile?.first_name}, {userProfile?.last_name}
        </Text>
        <Text style={[l.mt5, {textAlign: 'center', color: c.black200}]}>
          {userProfile?.email}
        </Text>

        {/* change password */}
        <TouchableOpacity
          style={[l.flexRow, l.alignCtr, l.justifyCtr]}
          onPress={() => {
            NavigationService.pushToScreen(ScreenID.SetNewPassword);
          }}>
          <Icon
            name={'edit'}
            size={16}
            color={primaryColor}
            style={{marginTop: 7}}
          />
          <Text
            style={[
              l.mt10,
              {marginLeft: 2, textAlign: 'center', color: primaryColor},
            ]}>
            {'Passwort ändern'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* <Text style={[t.h4, f.fontWeightMedium]}>{'Personal Details'}</Text>
        {userProfile?.phone ? (
          <View style={[l.flexRow, l.alignCtr, l.mt15]}>
            <Icon name={'phone'} size={20} color={primaryColor} />
            <Text style={[l.ml10]}>{userProfile?.phone}</Text>
          </View>
        ) : null}
        {userProfile?.birthday ? (
          <View style={[l.flexRow, l.alignCtr, l.mt15]}>
            <Icon name={'cake'} size={20} color={primaryColor} />
            <Text style={[l.ml10]}>
              {moment(userProfile?.birthday, 'DD.MM.YYYY').format(
                'Do MMMM, YYYY',
              )}
            </Text>
          </View>
        ) : null}
        {userProfile?.addresses.map((address, i) => {
          const fullAddress = [
            address.address_company,
            address.address_name,
            address.street,
            address.state_name,
            address.country_name,
          ]
            .filter(val => {
              return val;
            })
            .join(', ');
          return (
            <View style={[l.flexRow, l.mt15]}>
              <Icon
                name={'place'}
                size={20}
                color={primaryColor}
                style={[l.mt5]}
              />
              <Text style={[l.ml10, l.flex, l.wrap]}>{fullAddress}</Text>
            </View>
          );
        })} */}

        {/* memberships */}
        <View>
          <Text style={[f.fontWeightMedium, t.h4, l.mb5]}>{'Abonnement'}</Text>
          {userProfile?.memberships.map((membership, i) => {
            return (
              <View
                key={i}
                style={[
                  {borderWidth: 1, borderColor: c.grey200},
                  l.p15,
                  l.mt10,
                ]}>
                <Text style={[t.h5]}>
                  {'Name:  '}
                  <Text
                    style={[{color: primaryColor}, t.h5, f.fontWeightMedium]}>
                    {membership.name}
                  </Text>
                </Text>
                <Text style={[l.mt10]}>
                  {'Zyklus:  '}
                  <Text
                    style={[{color: primaryColor}, f.fontWeightMedium, t.h5]}>
                    {membership.interval}
                  </Text>
                </Text>
                {membership.end_date && (
                  <Text style={[l.mt10]}>
                    {'Enddatum:  '}
                    <Text
                      style={[{color: primaryColor}, t.h5, f.fontWeightMedium]}>
                      {moment(membership.end_date, 'YYYY-MM-DD').format(
                        'Do MMMM, YYYY',
                      )}
                    </Text>
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1.2,
    backgroundColor: c.grey100,
    ...l.mt30,
    ...l.mb30,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  noAvatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: c.grey50,
    overflow: 'hidden',
    ...l.justifyCtr,
    ...l.alignCtr,
  },
});

export default Profile;
