/**
 *
 * Chart2
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Chart from 'react-apexcharts';
import { createSelector } from 'reselect';
// import moment from 'moment';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import Theme from './Theme';

// import styled from 'styled-components';

function Chart2(props) {
  const {
    intl,
    locale,
    cate,
    series,
    axisType,
    chartType,
    showDataLabel,
    isStacked,
    showLegend,
    colorset,
  } = props;
  const formatTitle = title => title.replace(/ *\([^)]*\) */g, '');

  useEffect(() => {
    setState({
      options: {
        chart: {
          width: '100%',
          height: 'auto',
          animations: {
            initialAnimation: {
              enabled: true,
            },
          },
          stacked: isStacked,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        xaxis: {
          categories: cate,
          type: axisType,
          labels: {
            format: 'MM-dd-yyyy',
            // formatter(value, timestamp) {
            //   return moment(new Date(timestamp)).format('MMMM DD YYYY');
            // },
          },
          // type: 'datetime', possible
        },
        yaxis: {
          labels: {
            show: !isStacked,
          },
        },
        dataLabels: {
          enabled: showDataLabel,
        },
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        colors: colorset || Theme.colorSet4,
        fill: {
          colors: colorset || Theme.colorSet4,
        },
        tooltip: {
          x: {
            format: 'MM-dd-yyyy',
          },
          y: {
            formatter: value => Number(value),
            title: {
              formatter: seriesName => formatTitle(seriesName),
            },
          },
        },
        stroke: {
          curve: 'straight',
        },
        markers: {
          size: 5,
        },
        legend: {
          show: showLegend,
        },
      },
      series,
    });
  }, [series]);

  const [state, setState] = useState({
    options: {
      chart: {
        width: '100%',
        height: 'auto',
        animations: {
          initialAnimation: {
            enabled: true,
          },
        },
        scrolled: true,
        stacked: isStacked,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        defaultLocale: locale,
        locales: [
          {
            name: locale,
            options: {
              months: [
                intl.formatMessage({ id: 'January' }),
                intl.formatMessage({ id: 'February' }),
                intl.formatMessage({ id: 'March' }),
                intl.formatMessage({ id: 'April' }),
                intl.formatMessage({ id: 'May' }),
                intl.formatMessage({ id: 'June' }),
                intl.formatMessage({ id: 'July' }),
                intl.formatMessage({ id: 'August' }),
                intl.formatMessage({ id: 'September' }),
                intl.formatMessage({ id: 'October' }),
                intl.formatMessage({ id: 'November' }),
                intl.formatMessage({ id: 'December' }),
              ],
              shortMonths: [
                intl.formatMessage({ id: 'January' }),
                intl.formatMessage({ id: 'February' }),
                intl.formatMessage({ id: 'March' }),
                intl.formatMessage({ id: 'April' }),
                intl.formatMessage({ id: 'May' }),
                intl.formatMessage({ id: 'June' }),
                intl.formatMessage({ id: 'July' }),
                intl.formatMessage({ id: 'August' }),
                intl.formatMessage({ id: 'September' }),
                intl.formatMessage({ id: 'October' }),
                intl.formatMessage({ id: 'November' }),
                intl.formatMessage({ id: 'December' }),
              ],
              days: [
                intl.formatMessage({ id: 'Sunday' }),
                intl.formatMessage({ id: 'Monday' }),
                intl.formatMessage({ id: 'Tuesday' }),
                intl.formatMessage({ id: 'Wednesday' }),
                intl.formatMessage({ id: 'Thursday' }),
                intl.formatMessage({ id: 'Friday' }),
                intl.formatMessage({ id: 'Saturday' }),
              ],
              shortDays: [
                intl.formatMessage({ id: 'Su' }),
                intl.formatMessage({ id: 'Mo' }),
                intl.formatMessage({ id: 'Tu' }),
                intl.formatMessage({ id: 'We' }),
                intl.formatMessage({ id: 'Th' }),
                intl.formatMessage({ id: 'Fr' }),
                intl.formatMessage({ id: 'Sa' }),
              ],
            },
          },
        ],
      },
      xaxis: {
        categories: cate,
        type: axisType,
        // type: 'datetime', possible
      },
      yaxis: {
        labels: {
          show: !isStacked,
        },
      },
      dataLabels: {
        enabled: showDataLabel,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      colors: colorset || Theme.colorSet4,
      fill: {
        colors: colorset || Theme.colorSet4,
      },
      tooltip: {
        x: {
          format: 'MM-dd-yyyy',
        },
        y: {
          formatter: value => Number(value),
          title: {
            formatter: seriesName => formatTitle(seriesName),
          },
        },
      },
      stroke: {
        curve: 'straight',
      },
      markers: {
        size: 5,
      },
      legend: {
        show: showLegend,
      },
    },
    series,
  });

  return (
    <Chart
      options={state.options}
      series={state.series}
      type={chartType}
      colorset={colorset}
      width="100%"
    />
  );
}

Chart2.propTypes = {
  chartType: PropTypes.string,
  axisType: PropTypes.string,
  cate: PropTypes.array,
  series: PropTypes.array,
  showDataLabel: PropTypes.bool,
  isStacked: PropTypes.bool,
  showLegend: PropTypes.bool,
  colorset: PropTypes.any,
  locale: PropTypes.string,
  intl: intlShape,
};

const mapStateToProps = createSelector(
  makeSelectLocale(),
  locale => ({
    locale,
  }),
);

const withConnect = connect(
  mapStateToProps,
  null,
);

export default compose(
  withConnect,
  memo,
  injectIntl,
)(Chart2);
