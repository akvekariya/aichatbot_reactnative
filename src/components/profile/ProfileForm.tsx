import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { APP_CONSTANTS } from '../../constants';
import { Input } from '../ui';

interface ProfileFormProps {
  values: { [key: string]: string };
  errors: { [key: string]: string | null };
  onValueChange: (field: string, value: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  values,
  errors,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <Input
        label="Full Name"
        value={values.name}
        onChangeText={text => onValueChange('name', text)}
        placeholder="Enter your full name"
        error={errors.name || undefined}
        maxLength={APP_CONSTANTS.VALIDATION.MAX_NAME_LENGTH}
      />

      <Input
        label="Age"
        value={values.age}
        onChangeText={text => onValueChange('age', text)}
        placeholder="Enter your age"
        keyboardType="numeric"
        error={errors.age || undefined}
      />

      <Input
        label="Additional Information (Optional)"
        value={values.additionalInfo}
        onChangeText={text => onValueChange('additionalInfo', text)}
        placeholder="Tell us more about yourself..."
        multiline
        numberOfLines={3}
        maxLength={APP_CONSTANTS.VALIDATION.MAX_ADDITIONAL_INFO_LENGTH}
        error={errors.additionalInfo || undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
});

export default memo(ProfileForm);
