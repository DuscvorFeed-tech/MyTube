import { isEqual } from 'lodash';
import * as parseTweet from 'twitter-text/dist/parseTweet';

const isNumeric = value => {
  const target = Number(value).toString();
  return value !== '' && value !== null && /[\d]/.test(target);
};

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.length === 0);

export const required = (config = {}) => {
  const { errorCode = 'ERROR0001' } = config;

  return props => {
    const { value } = props;

    switch (typeof value) {
      case 'undefined':
        return {
          errorCode,
          formatIntl: { id: errorCode, values: { ...config } },
        };
      case 'string':
        if (value === '') {
          return {
            errorCode,
            formatIntl: { id: errorCode, values: { ...config } },
          };
        }
        return undefined;
      case 'object':
        if (value === null) {
          return {
            errorCode,
            formatIntl: { id: errorCode, values: { ...config } },
          };
        }
        switch (Object.getPrototypeOf(value)) {
          case FileList.prototype:
          case Array.prototype:
            if (!value.length > 0) {
              return {
                errorCode,
                formatIntl: { id: errorCode, values: { ...config } },
              };
            }
            return undefined;
          default:
            return undefined;
        }
      default:
        return undefined;
    }
  };
};

export const emailAddress = (config = {}) => {
  const { errorCode = 'ERROR0036' } = config;
  return props => {
    const { value } = props;
    return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
      ? { errorCode, formatIntl: { id: errorCode, values: { ...config } } }
      : undefined;
  };
};

export const number = (config = {}) => {
  const { errorCode = 'ERROR0018' } = config;
  return props => {
    const { value } = props;
    // eslint-disable-next-line no-restricted-globals
    return value && isNaN(Number(value))
      ? { errorCode, formatIntl: { id: errorCode, values: { ...config } } }
      : undefined;
  };
};

export const range = (config = {}) => {
  const { errorCode = 'ERROR0020', from, to, nullable = false } = config;
  return props => {
    const { value } = props;
    if (nullable && isEmpty(value)) {
      return undefined;
    }
    return value.length < from || value.length > to
      ? { errorCode, formatIntl: { id: errorCode, values: { ...config } } }
      : undefined;
  };
};

export const maxLength = (config = {}) => {
  const { errorCode = 'ERROR0002', max } = config;
  return props => {
    const { value } = props;
    return value && value.length > max
      ? { errorCode, formatIntl: { id: errorCode, values: { ...config } } }
      : undefined;
  };
};

export const maxPrizeNameLength = (config = {}) => {
  const { errorCode = 'ERROR00050', max } = config;
  return props => {
    const { value } = props;
    const { weightedLength } = parseTweet(value);
    return value && weightedLength > max
      ? { errorCode, formatIntl: { id: errorCode, values: { ...config } } }
      : undefined;
  };
};

export const minLength = (config = {}) => {
  const { errorCode = 'ERROR0003', min } = config;
  return props => {
    const { value } = props;
    return value && value.length < min
      ? { errorCode, formatIntl: { id: errorCode, values: { ...config } } }
      : undefined;
  };
};

export const maxValue = (config = {}) => {
  const { errorCode = 'ERROR0004', max } = config;
  return props => {
    const { value } = props;
    return isNumeric(value) && value > max
      ? { errorCode, formatIntl: { id: errorCode, values: { ...config } } }
      : undefined;
  };
};

export const minValue = (config = {}) => {
  const { errorCode = 'ERROR0005', min } = config;
  return props => {
    const { value } = props;
    return isNumeric(value) && value < min
      ? { errorCode, formatIntl: { id: errorCode, values: { ...config } } }
      : undefined;
  };
};

export const katakana = (config = {}) => {
  const { errorCode = 'ERROR0019' } = config;
  return props => {
    const { value } = props;
    if (
      [...value].some(
        char =>
          !(char >= '\u30a0' && char <= '\u30ff') &&
          !(char >= '\uff00' && char <= '\uff9f') &&
          char !== '' &&
          char !== ' ',
      )
    ) {
      return { errorCode };
    }
    const re = /[＀_！＂＃＄％＆＇（）＊＋，－．：；＜＝＞？＾／]/gm;
    if (re.test(value)) {
      return {
        errorCode,
        formatIntl: { id: errorCode, values: { ...config } },
      };
    }
    return undefined;
  };
};

export const englishAlphabet = (config = {}) => {
  const { errorCode = 'ERROR0021' } = config;
  return props => {
    const { value } = props;
    if (!/^[a-zA-Z0-9. ]+$/.test(value)) {
      return {
        errorCode,
        formatIntl: { id: errorCode, values: { ...config } },
      };
    }
    return undefined;
  };
};

export const alphanumeric = (config = {}) => {
  const { errorCode = 'ERROR0022', nullable = false } = config;
  return props => {
    const { value } = props;
    if (nullable && isEmpty(value)) {
      return undefined;
    }
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return {
        errorCode,
        formatIntl: { id: errorCode, values: { ...config } },
      };
    }
    return undefined;
  };
};

export const fileExt = (config = {}) => {
  const { errorCode = 'ERROR0044', ext = [] } = config;
  return props => {
    const { value } = props;
    if (value) {
      if (value instanceof File) {
        const modExt = ext.toString().replace(/,/g, '|');
        const regexp = RegExp(`.(${modExt})$`, 'i');
        if (!regexp.test(value.name ? value.name : value)) {
          return {
            errorCode,
            formatIntl: { id: errorCode, values: { ...config } },
          };
        }
      }
    }
    return undefined;
  };
};

// /  { ext = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'] } = {},
export const imageExt = (config = {}, exts) => {
  const { errorCode = 'ERROR0044' } = config;
  return props => {
    const { value } = props;
    if (value && value instanceof File && exts) {
      const invalid = exts.some(ext => this.FileExt({ ...config, ext }));
      if (invalid) {
        return {
          errorCode,
          formatIntl: { id: errorCode, values: { ...config } },
        };
      }
    }
    return undefined;
  };
};

export const equalsTo = (config = {}) => {
  const { errorCode = 'ERROR0023', ref } = config;
  return props => {
    const { value } = props;
    if (value && !isEqual(value, ref)) {
      return {
        errorCode,
        formatIntl: { id: errorCode, values: { ...config } },
      };
    }
    return undefined;
  };
};

export const checkFileCount = (config = {}) => {
  const { errorCode = 'ERROR0046', max } = config;

  return props => {
    const { value } = props;
    return value && value.length > max
      ? { errorCode, formatIntl: { id: errorCode, values: { ...config } } }
      : undefined;
  };
};

export const checkFileSize = (config = {}) => {
  const { errorCode = 'ERROR0029', max } = config;
  return props => {
    const { value } = props;
    if (value) {
      const fileInMB = value.size / 1024 / 1024;
      return fileInMB > max
        ? { errorCode, formatIntl: { id: errorCode, values: { ...config } } }
        : undefined;
    }
    return undefined;
  };
};

// const validator = {

//   email: (value, { errorCode = 'CSE0000036' } = {}) =>
//     value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
//       ? { errorCode }
//       : undefined,

//   range: (value, { errorCode = 'E0000020', from, to } = {}) =>
//     value.length < from || value.length > to ? { errorCode } : undefined,

//   maxLength: (value, { errorCode = 'E0000002', max } = {}) =>
//     value && value.length > max ? { errorCode, maxLength: max } : undefined,

//   minLength: (value, { errorCode = 'E0000003', min } = {}) =>
//     value && value.length < min ? { errorCode, minLength: min } : undefined,

//   maxValue: (value, { errorCode = 'E0000004', max } = {}) =>
//     value && value > max ? { errorCode, maxR: max } : undefined,

//   minValue: (value, { errorCode = 'E0000005', min } = {}) =>
//     value && value < min ? { errorCode, minR: min } : undefined,

//   confirmpassword: (value, confirmvalue, { errorCode = 'E0000022' } = {}) =>
//     value !== confirmvalue ? { errorCode } : undefined,
//   katakana: (value, { errorCode = 'E0000019' } = {}) => {
//     // if ([...value].some(char => !(char >= '\uff00' && char <= '\uff9f'))) {
//     if (
//       [...value].some(
//         char =>
//           !(char >= '\u30a0' && char <= '\u30ff') &&
//           !(char >= '\uff00' && char <= '\uff9f') &&
//           char !== '' &&
//           char !== ' ',
//       )
//     ) {
//       return { errorCode };
//     }
//     const re = /[＀_！＂＃＄％＆＇（）＊＋，－．：；＜＝＞？＾／]/gm;
//     if (re.test(value)) {
//       return { errorCode };
//     }
//     return undefined;
//   },
//   englishAlphabet: (value, { errorCode = 'E0000021' } = {}) => {
//     if (!/^[a-zA-Z0-9. ]+$/.test(value)) {
//       return { errorCode };
//     }
//     return undefined;
//   },
//   file: (
//     value,
//     {
//       ext = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
//       maxSize,
//       minSize,
//       maxFile,
//       maxSizeErrorCode = 'E0000026',
//       minSizeErrorCode = 'E0000025',
//       extErrorCode = 'E0000027',
//       maxFileErrorCode = 'E0000028',
//     } = {},
//   ) => {
//     if (value && value instanceof File) {
//       const { type, size } = value;
//       if (size > Math.ceil(maxSize * 1024 * 1024)) {
//         return {
//           errorCode: maxSizeErrorCode,
//           maxSize,
//         };
//       }
//       if (size < Math.ceil(minSize * 1024 * 1024)) {
//         return {
//           errorCode: minSizeErrorCode,
//           minSize,
//         };
//       }

//       if (ext.indexOf(type) === -1) {
//         return { errorCode: extErrorCode, extensions: ext };
//       }

//       return undefined;
//     }
//     if (value && value instanceof FileList) {
//       if (maxFile && value.length > maxFile) {
//         return {
//           errorCode: maxFileErrorCode,
//         };
//       }
//       for (let i = 0; i < value.length; i += 1) {
//         const { type, size } = value[i];
//         if (size > Math.ceil(maxSize * 1024 * 1024)) {
//           return {
//             errorCode: maxSizeErrorCode,
//             maxSize,
//           };
//         }
//         if (size < Math.ceil(minSize * 1024 * 1024)) {
//           return {
//             errorCode: minSizeErrorCode,
//             minSize,
//           };
//         }

//         if (ext.indexOf(type) === -1) {
//           return { errorCode: extErrorCode, extensions: ext };
//         }
//       }
//     }
//     return undefined;
//   },
//   csvFile: (value, { errorCode = 'E0000044' } = {}) => {
//     if (value) {
//       if (!/.(csv)$/.test(value)) {
//         return { errorCode };
//       }
//     }
//     return undefined;
//   },
// };
