import { useEffect, useState } from 'react';
import { isFunction, isArray } from 'util';

export default (
  initialValue,
  rules,
  isTouched = false,
  extraProps = () => {},
) => {
  const [value, setvalue] = useState(initialValue);
  const [touched, setTouched] = useState(isTouched);
  const [error, setError] = useState({ invalid: false });
  const [effects, setEffects] = useState(0);

  function onChange(e) {
    let target = e;
    if (e && e.type === 'change') {
      target = e.target.value;
      if (e.target.type === 'checkbox') {
        if (isArray(value)) {
          if (e.target.checked) {
            target = [...value, e.target.value];
          } else {
            target = value.filter(val => val !== e.target.value);
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (e.target.checked) {
            target = e.target.value || e.target.checked;
          } else {
            target = '';
          }
        }

        // if (e.target.checked) {
        //   target = e.target.value || e.target.checked;
        // } else {
        //   target = '';
        // }
      }
      if (e.target.type === 'file') {
        target =
          e.target.files.length > 1 ? [...e.target.files] : e.target.files[0];
      }
      if (rules && rules.length) {
        const obj = rules.find(({ normalize }) => normalize);
        if (obj && isFunction(obj.normalize)) {
          target = obj.normalize(target, value);
        }
      }
    }
    target = returnProps.beforesetvalue(target);
    setvalue(target);
    setTouched(true);
  }

  function onBlur() {
    setTouched(true);
  }

  function onUseEffect() {
    setEffects(effects + 1);
  }

  function beforesetvalue(target) {
    return target;
  }

  function toString() {
    return value;
  }

  function runValidation() {
    let list = [];
    if (rules && rules.length) {
      list = rules
        .map(rule => isFunction(rule) && rule({ value }))
        .filter(err => err);
    }
    returnProps.onSetError({ list, touched, invalid: list.length > 0 });
  }

  function onSetError(e) {
    setError(e);
  }

  function onClearValue(val, clearError = false, touch = false) {
    setTouched(touch);
    setvalue(val);

    if (clearError) {
      setError({ invalid: false });
    }
  }

  useEffect(() => {
    if (touched) {
      runValidation();
    }
  }, [value, touched, effects]);

  const props = {
    value,
    setvalue,
    onChange,
    onClearValue,
    onBlur,
    onUseEffect,
    error,
    onSetError,
    beforesetvalue,
    toString,
  };

  const returnProps = {
    ...props,
    ...extraProps(props),
  };

  return returnProps;
};

export const isValid = (state, istouch = true) => {
  if (state) {
    return state.every(
      ({ error }) =>
        !error.invalid && (error.touched ? error.touched === istouch : true),
    );
  }

  return true;
};
