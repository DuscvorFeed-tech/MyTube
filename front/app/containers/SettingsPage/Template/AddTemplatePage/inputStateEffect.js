import { useState } from 'react';
import useValidation from 'library/validator';
import validation from './validators';

export const PublishTwitterState = intl => {
  const validator = validation(intl);
  const content = useValidation('', validator.templateContent);
  return {
    content,
  };
};

export const useUploadFile = intl => {
  const validator = validation(intl);
  const [uploadFiles, setUploadFile] = useState([]);
  const [fileType, setFileType] = useState();
  const [uploadError, seUploadError] = useState();
  const imageFile = useValidation(
    UNDEF,
    validator.tweetImageUpload,
    UNDEF,
    ({ onChange, onSetError, value }) => ({
      onChange: e => {
        const target = [...e.target.files];
        onChange(target);
      },
      onSetError: e => {
        if (!e.invalid) {
          setFileType('PHOTO');
          setUploadFile(value);
        }
        seUploadError(e);
        onSetError(e);
      },
    }),
  );

  const gifFile = useValidation(
    UNDEF,
    validator.tweetGifUpload,
    UNDEF,
    ({ onChange, onSetError, value }) => ({
      onChange: e => {
        const target = [e.target.files[0]];
        if (target[0]) {
          onChange(target);
        }
      },
      onSetError: e => {
        if (!e.invalid) {
          setFileType('GIF');
          setUploadFile(value);
        }

        seUploadError(e);
        onSetError(e);
      },
    }),
  );

  const videoFile = useValidation(
    UNDEF,
    validator.tweetVideoUpload,
    UNDEF,
    ({ onChange, onSetError, value }) => ({
      onChange: e => {
        const target = [e.target.files[0]];
        if (target[0]) {
          onChange(target);
        }
      },
      onSetError: e => {
        if (!e.invalid) {
          setFileType('VIDEO');
          setUploadFile(value);
        }

        seUploadError(e);
        onSetError(e);
      },
    }),
  );

  function setUploadImage(formData) {
    if (uploadFiles && uploadFiles.length) {
      if (fileType === 'PHOTO') {
        uploadFiles.forEach(val => {
          formData.append('image', val);
        });
        return 'publish-photo-campaign';
      }
      if (fileType === 'GIF') {
        uploadFiles.forEach(val => {
          formData.append('gif', val);
        });
        return 'publish-gif-campaign';
      }
      if (fileType === 'VIDEO') {
        uploadFiles.forEach(val => {
          formData.append('video', val);
        });
        return 'publish-video-campaign';
      }
    }

    return 'publish-campaign';
  }

  function onRemove(index) {
    setUploadFile(oldFiles => {
      const newFiles = Array.from(oldFiles);
      newFiles.splice(index, 1);
      return newFiles;
    });
  }

  return {
    imageFile,
    gifFile,
    videoFile,
    uploadFiles,
    fileType,
    uploadError,
    setUploadImage,
    onRemove,
    setUploadFile,
  };
};
