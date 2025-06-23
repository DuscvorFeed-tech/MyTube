/* eslint-disable prettier/prettier */
import moment from 'moment';

export function modalToggler(modalID) {
  const elem = document.getElementById(`modal-toggler-${modalID}`);
  if (elem) {
    elem.click();
  }
  return null;
}

export function rightSidebarToggler() {
  document.body.classList.toggle('show-sidebar-right');
  const overlay = document.getElementById('right-sidebar-overlay');
  overlay.classList.toggle('d-block');
}

export function modalHide(modalID) {
  const elem = document.getElementById(`${modalID}`);
  if (elem) {
    elem.style.display = 'none';
  }
  const body = document.getElementsByClassName(`modal-open`);
  if (body) {
    body[0].className = '';
  }
  const divModal = document.getElementsByClassName(`modal-backdrop fade show`);
  if (divModal) {
    divModal[0].className = '';
  }
  return null;
}

export function divShow(e, divID) {
  const elem = document.getElementById(`${divID}`);
  const { target } = e;

  if (elem.style.height !== 'fit-content') {
    elem.style.height = 'fit-content';
    target.classList.remove('icofont-plus');
    target.classList.add('icofont-minus');
  } else {
    elem.style.height = '50px';
    target.classList.remove('icofont-minus');
    target.classList.add('icofont-plus');
  }
}

export function alertToggler(alertID, autoClose) {
  const closeBtn = document.getElementById(`alert-toggler-${alertID}`);
  const hideElem = closeBtn.getAttribute('data-hide');
  const elem = document.getElementById(hideElem);
  elem.classList.remove('hide');

  if (autoClose) {
    window.setTimeout(() => {
      elem.classList.add('hide');
    }, 2500);
  }

  return null;
}

/* sample output without time 2019-06-25 */
/* sample output with time 2019-06-25 12:59:59 */
export function setFormattedDate(
  data = false,
  withTime = false,
  toLocale = false,
) {
  let dt = data ? new Date(data) : new Date();

  if (toLocale) {
    const localeOffset = Math.abs(new Date().getTimezoneOffset()) * 60000;
    const tzMilliseconds = dt.getTime() + localeOffset;
    dt = new Date(tzMilliseconds);
  }

  const date = dt
    .getDate()
    .toString()
    .padStart(2, '0');
  const month = (dt.getMonth() + 1).toString().padStart(2, '0');
  if (withTime) {
    const time = `${dt
      .getHours()
      .toString()
      .padStart(2, '0')}:${dt
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${dt
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
    dt = `${dt.getFullYear()}-${month}-${date} ${time}`;
  } else {
    dt = `${dt.getFullYear()}-${month}-${date}`;
  }
  return dt;
}

export const countRecord = data => {
  if (data) {
    return data.list.length;
  }
  return 0;
};

export const checkNumber = val => {
  const re = /^[0-9\b]+$/;
  if (val !== '') {
    return re.test(val);
  }
  return true;
};

export const expandDateTime = (val = false, addTime = 0, adjustMin = true) => {
  const dateWithAmFormat = 'YYYY/MM/DD HH:mm';
  const td = !val
    ? new Date()
    : new Date(
      moment(val).format('MM/DD/YYYY HH:mm:ss'),
    );
  const adjustedDate = new Date(td.getTime() + addTime * 60000);
  const hours = adjustedDate.getHours();
  let minutes = adjustedDate.getMinutes();
  const lastNum = minutes > 9 && minutes % 10 !== 0 ? minutes % 10 : minutes;

  if (adjustMin) {
    // eslint-disable-next-line default-case
    switch (lastNum) {
      case 4:
      case 9:
        minutes += 1;
        break;
      case 3:
      case 8:
        minutes += 2;
        break;
      case 2:
      case 7:
        minutes += 3;
        break;
      case 1:
      case 6:
        minutes += 4;
        break;
    }
  }

  const dt = moment(td, 'MM/DD/YYYY').format('YYYY/MM/DD');
  const toMoment = moment(`${dt} ${hours}:${minutes}`, dateWithAmFormat);
  return { dt, hours, minutes, toMoment };
};

export const numeralFormat = (value = 0) => {
  const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
  // what tier? (determines SI symbol)
  // eslint-disable-next-line no-bitwise
  const tier = (Math.log10(Number(value)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier === 0) {
    return value;
  }

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier];
  const scale = 10 ** (tier * 3);

  // scale the number
  const scaled = Number(value) / scale;

  if (scaled % 1 !== 0) {
    const scales = scaled.toString().split('.');
    return `${scales[0]}.${scales[1][0]}${suffix}`;
  }

  // format number and add suffix
  return scaled + suffix;
};

export const addHashtag = value => {
  if(value && typeof(value) === 'string' && !value.startsWith('#')) {
    return `#${value}`;
  }

  return value;
}

export const nonHashtag = value => {
  if(value && typeof(value) === 'string' && value.startsWith('#')) {
    return value.substring(1);
  }

  return value;
}

export const nonUrlSearch = url => {
  if(url && typeof(url) === 'string') {
    const [baseHref] = url.split('?');
    return baseHref;
  }
  return url;
}

// Only used for Claim Form Value
export const asEmpty = value => {
  // eslint-disable-next-line eqeqeq
  if(!value || value === 'null') {
    return '';
  }
  return value;
}

export const formatDateTime = dt => moment(new Date(dt), 'MM/DD/YYYY (hh:mm A)').format('YYYY/MM/DD (HH:mm)')
  
