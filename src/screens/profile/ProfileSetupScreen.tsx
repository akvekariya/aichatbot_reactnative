import React, { memo, useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../components';
import {
  ProfileForm,
  TopicsSection,
  UserProfileCard,
} from '../../components/profile';
import { APP_CONSTANTS, SUCCESS_MESSAGES } from '../../constants';
import { useForm, useTheme } from '../../hooks';
import { AppDispatch, RootState } from '../../store';
import { createProfile, updateProfile } from '../../store/slices/authSlice';
import { setSuccess } from '../../store/slices/uiSlice';
import { validateAge, validateName } from '../../utils';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type ProfileSetupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileSetup'
>;

interface ProfileSetupScreenProps {
  navigation: ProfileSetupScreenNavigationProp;
}

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { colors, typography } = useTheme();

  const { user, profile, isLoading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const { values, errors, setValue, validateForm } = useForm(
    {
      name: user?.name || '',
      age: '',
      additionalInfo: '',
    },
    {
      name: {
        required: true,
        maxLength: APP_CONSTANTS.VALIDATION.MAX_NAME_LENGTH,
        custom: value => validateName(value),
      },
      age: {
        required: true,
        custom: value => {
          const ageNum = parseInt(value, 10);
          if (isNaN(ageNum)) {
            return 'Please enter a valid age';
          }
          return validateAge(ageNum);
        },
      },
      additionalInfo: {
        maxLength: APP_CONSTANTS.VALIDATION.MAX_ADDITIONAL_INFO_LENGTH,
      },
    },
  );

  // Note: We removed the automatic redirect to Chat when profile exists
  // This allows users to edit their profile if they navigate back to this screen

  // Pre-fill form with existing profile data if available
  useEffect(() => {
    if (profile && !values.name) {
      setValue('name', profile.name);
      setValue('age', profile.age.toString());
      setValue('additionalInfo', profile.additionalInfo || '');
    }
  }, [profile, setValue, values.name]);

  useEffect(() => {
    if (error) {
      Alert.alert('Profile Setup Error', error);
    }
  }, [error]);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else {
        // Limit to 2 topics as per API requirements
        if (prev.length >= 2) {
          return [prev[1], topic]; // Replace first topic
        }
        return [...prev, topic];
      }
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (selectedTopics.length === 0) {
      Alert.alert(
        'Topics Required',
        'Please select at least one topic of interest.',
      );
      return;
    }

    try {
      const profileData = {
        name: values.name.trim(),
        age: parseInt(values.age, 10),
        additionalInfo: values.additionalInfo.trim() || undefined,
      };

      const result = profile
        ? await dispatch(updateProfile(profileData))
        : await dispatch(createProfile(profileData));

      if (
        profile
          ? updateProfile.fulfilled.match(result)
          : createProfile.fulfilled.match(result)
      ) {
        dispatch(
          setSuccess(
            profile
              ? 'Profile updated successfully!'
              : SUCCESS_MESSAGES.PROFILE_CREATED,
          ),
        );
        navigation.replace('Chat', {});
      }
    } catch (error) {
      console.error('Profile operation error:', error);
    }
  };

  const topicOptions = [
    {
      key: APP_CONSTANTS.TOPICS.HEALTH,
      label: 'Health & Wellness',
      icon: 'health-and-safety',
      description: 'Get advice on health, fitness, and wellness topics',
    },
    {
      key: APP_CONSTANTS.TOPICS.EDUCATION,
      label: 'Education & Learning',
      icon: 'school',
      description: 'Explore educational content and learning resources',
    },
  ];

  // If no user data, something went wrong with authentication
  if (!user) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={[styles.content, styles.errorContainer]}>
          <Text
            style={[
              styles.errorText,
              { color: colors.error, ...typography.h3 },
            ]}
          >
            Authentication Error
          </Text>
          <Text
            style={[
              styles.errorSubtext,
              { color: colors.textSecondary, ...typography.body1 },
            ]}
          >
            Unable to load user information. Please try logging in again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* User Profile Card */}
          <UserProfileCard user={user} showTitle={true} />

          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: colors.text, ...typography.h2 }]}
            >
              {profile ? 'Update Your Profile' : 'Complete Your Profile'}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: colors.textSecondary, ...typography.body1 },
              ]}
            >
              {profile
                ? 'Update your information to personalize your experience'
                : 'Tell us a bit about yourself to personalize your experience'}
            </Text>
          </View>

          {/* Form */}
          <ProfileForm
            values={values}
            errors={errors}
            onValueChange={setValue}
          />

          {/* Topics Selection */}
          <TopicsSection
            title="Topics of Interest"
            subtitle="Select topics you'd like to discuss (up to 2)"
            topics={topicOptions}
            selectedTopics={selectedTopics}
            onTopicToggle={handleTopicToggle}
          />

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <Button
              title={profile ? 'Update Profile' : 'Complete Setup'}
              onPress={handleSubmit}
              variant="primary"
              size="large"
              loading={isLoading}
              disabled={isLoading || selectedTopics.length === 0}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 24,
  },
  submitContainer: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default memo(ProfileSetupScreen);
