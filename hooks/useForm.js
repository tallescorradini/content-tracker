import { useState } from "react";

// FormEasy v0.1 - lightning fast
// [ ] TODO feat: spread input attributes in the subscribe function
// [ ] TODO feat: handle errors if validation is not set properly
// [ ] TODO feat: add uncontrolled form option

const useForm = (yup) => {
  const [values, setValues] = useState({});
  const [changed, setChanged] = useState({});
  const [errors, setErrors] = useState({});

  let schema;
  let initialValues;

  function resetField(fieldName) {
    if (Object.keys(values).includes(fieldName))
      setValues((prev) => ({ ...prev, [fieldName]: initialValues[fieldName] }));

    if (Object.keys(errors).includes(fieldName)) {
      const { [fieldName]: field, ...rest } = errors;
      setErrors(rest);
    }

    if (Object.keys(changed).includes(fieldName)) {
      const { [fieldName]: field, ...rest } = changed;
      setChanged(rest);
    }
  }

  const _getValidationErrors = async ({ schema, values }) => {
    let validationErrors = [];
    try {
      await yup.object().shape(schema).validate(values, { abortEarly: false });
      validationErrors = Object.keys(values).reduce(
        (prev, key) => ({ ...prev, [key]: [] }),
        {}
      );
    } catch (err) {
      validationErrors = err.inner.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.path]: [...(prev[curr.path] || []), curr.message],
        }),
        {}
      );
    }
    return validationErrors;
  };

  const _sanitizeFormErrors = (errors) => {
    return Object.keys(errors).reduce((prev, fieldName) => {
      if (errors[fieldName].length > 0) {
        return { ...prev, [fieldName]: errors[fieldName] };
      } else {
        return { ...prev };
      }
    }, {});
  };

  const _handleInputBlur = (e) => {
    _validateField(e.target.name, e.target.value);
  };

  const _handleInputChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    const fieldHasErrors = errors[fieldName] && errors[fieldName].length > 0;
    if (fieldHasErrors) _validateField(fieldName, fieldValue);

    setValues((prev) => ({ ...prev, [fieldName]: fieldValue }));
    setChanged((prev) => ({
      ...prev,
      [fieldName]: fieldValue !== initialValues[fieldName],
    }));
  };

  const _handleCheckboxChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.checked;

    const fieldHasErrors = errors[fieldName] && errors[fieldName].length > 0;
    if (fieldHasErrors) _validateField(fieldName, fieldValue);

    setValues((prev) => ({ ...prev, [fieldName]: fieldValue }));
    setChanged((prev) => ({
      ...prev,
      [fieldName]: fieldValue !== initialValues[fieldName],
    }));
  };

  const _validateField = async (fieldName, fieldValue) => {
    const validationErrors = await _getValidationErrors({
      schema: { [fieldName]: schema[fieldName] },
      values: { [fieldName]: fieldValue },
    });
    setErrors((prev) => _sanitizeFormErrors({ ...prev, ...validationErrors }));
  };

  const _validateForm = async () => {
    const currentValues = { ...initialValues, ...values };

    const validationErrors = await _getValidationErrors({
      schema: schema,
      values: currentValues,
    });

    setErrors((prev) => _sanitizeFormErrors({ ...prev, ...validationErrors }));

    const formIsValid = Object.keys(validationErrors).reduce(
      (prev, fieldName) => validationErrors[fieldName].length === 0,
      false
    );

    return formIsValid;
  };

  const onSubmit = (handleSubmit) => ({
    onSubmit: async (e) => {
      e.preventDefault();
      const validForm = await _validateForm();
      if (!validForm) return;

      setChanged({});
      handleSubmit(e);
    },
  });

  function _makeCheckboxField(field) {
    const fieldName = field.attribute.name;
    return {
      id: field.attribute.id,
      name: fieldName,
      label: field.attribute.label,
      type: field.attribute.type,
      checked: changed[fieldName]
        ? values[fieldName]
        : initialValues[fieldName],
      onChange: _handleCheckboxChange,
      errors: errors[fieldName],
    };
  }

  const subscribe = (field) => {
    const fieldName = field.attribute.name;
    initialValues = { ...initialValues, [fieldName]: field.initialValue };
    schema = { ...schema, [fieldName]: field.validation };

    console.log({ [fieldName]: field.initialValue });
    const inputFields = {
      id: field.id,
      name: fieldName,
      label: field.attribute.label,
      value: changed[fieldName] ? values[fieldName] : initialValues[fieldName],
      type: field.attribute.type,
      onChange: _handleInputChange,
      errors: errors[fieldName],
      onBlur: _handleInputBlur,
    };

    return field.attribute.type === "checkbox"
      ? _makeCheckboxField(field)
      : inputFields;
  };

  return {
    subscribe,
    onSubmit,
    values,
    changed,
    errors,
    resetField,
  };
};

export default useForm;
