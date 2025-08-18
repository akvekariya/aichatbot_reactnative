import { useCallback, useState } from 'react';

interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
}

interface FormState {
  [key: string]: FormField;
}

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface UseFormReturn {
  values: { [key: string]: string };
  errors: { [key: string]: string | null };
  touched: { [key: string]: boolean };
  isValid: boolean;
  setValue: (field: string, value: string) => void;
  setError: (field: string, error: string | null) => void;
  setTouched: (field: string, touched: boolean) => void;
  validateField: (field: string) => boolean;
  validateForm: () => boolean;
  resetForm: () => void;
  resetField: (field: string) => void;
}

export const useForm = (
  initialValues: { [key: string]: string },
  validationRules: ValidationRules = {},
): UseFormReturn => {
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {};
    Object.keys(initialValues).forEach(key => {
      state[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
      };
    });
    return state;
  });

  const validateField = useCallback(
    (field: string): boolean => {
      const fieldValue = formState[field]?.value || '';
      const rules = validationRules[field];

      if (!rules) {
        return true;
      }

      let error: string | null = null;

      // Required validation
      if (rules.required && !fieldValue.trim()) {
        error = `${field} is required`;
      }
      // Min length validation
      else if (rules.minLength && fieldValue.length < rules.minLength) {
        error = `${field} must be at least ${rules.minLength} characters`;
      }
      // Max length validation
      else if (rules.maxLength && fieldValue.length > rules.maxLength) {
        error = `${field} must be less than ${rules.maxLength} characters`;
      }
      // Pattern validation
      else if (rules.pattern && !rules.pattern.test(fieldValue)) {
        error = `${field} format is invalid`;
      }
      // Custom validation
      else if (rules.custom) {
        error = rules.custom(fieldValue);
      }

      setFormState(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          error,
        },
      }));

      return error === null;
    },
    [formState, validationRules],
  );

  const validateForm = useCallback((): boolean => {
    let isFormValid = true;
    const newFormState = { ...formState };

    Object.keys(formState).forEach(field => {
      const fieldValue = formState[field].value;
      const rules = validationRules[field];

      if (!rules) {
        return;
      }

      let error: string | null = null;

      // Required validation
      if (rules.required && !fieldValue.trim()) {
        error = `${field} is required`;
        isFormValid = false;
      }
      // Min length validation
      else if (rules.minLength && fieldValue.length < rules.minLength) {
        error = `${field} must be at least ${rules.minLength} characters`;
        isFormValid = false;
      }
      // Max length validation
      else if (rules.maxLength && fieldValue.length > rules.maxLength) {
        error = `${field} must be less than ${rules.maxLength} characters`;
        isFormValid = false;
      }
      // Pattern validation
      else if (rules.pattern && !rules.pattern.test(fieldValue)) {
        error = `${field} format is invalid`;
        isFormValid = false;
      }
      // Custom validation
      else if (rules.custom) {
        error = rules.custom(fieldValue);
        if (error) {
          isFormValid = false;
        }
      }

      newFormState[field] = {
        ...newFormState[field],
        error,
        touched: true,
      };
    });

    setFormState(newFormState);
    return isFormValid;
  }, [formState, validationRules]);

  const setValue = useCallback((field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
      },
    }));
  }, []);

  const setError = useCallback((field: string, error: string | null) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        error,
      },
    }));
  }, []);

  const setTouched = useCallback((field: string, touched: boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        touched,
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    const state: FormState = {};
    Object.keys(initialValues).forEach(key => {
      state[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
      };
    });
    setFormState(state);
  }, [initialValues]);

  const resetField = useCallback(
    (field: string) => {
      setFormState(prev => ({
        ...prev,
        [field]: {
          value: initialValues[field] || '',
          error: null,
          touched: false,
        },
      }));
    },
    [initialValues],
  );

  // Computed values
  const values = Object.keys(formState).reduce((acc, key) => {
    acc[key] = formState[key].value;
    return acc;
  }, {} as { [key: string]: string });

  const errors = Object.keys(formState).reduce((acc, key) => {
    acc[key] = formState[key].error;
    return acc;
  }, {} as { [key: string]: string | null });

  const touched = Object.keys(formState).reduce((acc, key) => {
    acc[key] = formState[key].touched;
    return acc;
  }, {} as { [key: string]: boolean });

  const isValid = Object.values(formState).every(field => field.error === null);

  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setError,
    setTouched,
    validateField,
    validateForm,
    resetForm,
    resetField,
  };
};
