import { useEffect, useState } from 'react';
import { isFunction } from 'util';

export default (config, enterHandler = () => true) => {
  // disabled when user click button
  const [submittedfn, setSubmittedfn] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [counter, setCounter] = useState(0);
  const [submitted, onSubmitted] = useState(false);

  function onClick() {
    setSubmitting(true);
    onSubmitted(false);
    setCounter(counter + 1);
  }

  function onPressedEnter(e) {
    e.persist();
    if (e.key === 'Enter') {
      const valid = enterHandler();
      if (valid) {
        onClick();
      }
    }
  }

  function submittedcallback(fn) {
    if (isFunction(fn)) {
      setSubmittedfn({ fn });
    }
  }

  useEffect(() => {
    if (counter === 1 && config) {
      const [callback, values] = config;
      if (isFunction(callback)) {
        callback(values, onSubmitted);
      }
    }

    return () => setCounter(0);
  }, [counter]);

  useEffect(() => {
    if (submitted) {
      setCounter(0);
      setSubmitting(false);
      // eslint-disable-next-line no-unused-expressions
      submittedfn.fn && submittedfn.fn();
    }

    return () => onSubmitted(false);
  }, [submitted]);

  return { submitting, onClick, onPressedEnter, submittedcallback };
};
