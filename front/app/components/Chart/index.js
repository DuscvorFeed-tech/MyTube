/**
 *
 * Chart
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// eslint-disable-next-line import/extensions
import CanvasJS from 'assets/js/canvasjs.min.js';

import StyledChart from './StyledChart';

const canvasJs = props => {
  const { theme, title, data, axisX, axisY, paletteSet } = props;

  const checkNoLabelX = e => {
    if (axisX && axisX.noLabel) {
      return '';
    }
    return e.value;
  };
  const checkNoLabelY = e => {
    if (axisY && axisY.noLabel) {
      return '';
    }
    return e.value;
  };

  const checkNoIndexLabel = e => {
    if (data && data.noIndexLabel) {
      return '';
    }
    return e.dataPoint.label;
  };

  CanvasJS.addColorSet('palette', paletteSet);

  const charts = new CanvasJS.Chart(props.id, {
    animationEnabled: true,
    backgroundColor: 'transparent',
    colorSet: 'palette',
    title: {
      fontFamily: theme.title.fontFamily,
      fontSize: theme.title.fontSize,
      fontColor: theme.title.fontColor,
      text: title ? title.text : '',
    },
    legend: {
      maxWidth: 250,
    },
    axisX: {
      title: axisX ? axisX.title : '',
      gridThickness: theme.axisX.gridThickness,
      lineThickness: theme.axisX.lineThickness,
      tickThickness: theme.axisX.tickThickness,
      tickLength: theme.axisX.tickLength,
      labelFormatter: checkNoLabelX,
    },
    axisY: {
      title: axisX ? axisY.title : '',
      gridThickness: theme.axisY.gridThickness,
      lineThickness: theme.axisY.lineThickness,
      tickThickness: theme.axisY.tickThickness,
      tickLength: theme.axisY.tickLength,
      labelFormatter: checkNoLabelY,
      includeZero: false,
    },
    data: [
      {
        type: data.type,
        dataPoints: data.dataPoints,
        showInLegend: data.showLegend,
        legendText: '{label}',
        indexLabelFormatter: checkNoIndexLabel,
        indexLabelPlacement: data.indexLabelPlacement
          ? data.indexLabelPlacement
          : '',
        indexLabelFontFamily: theme.data.fontFamily,
        indexLabelFontSize: theme.data.fontSize,
        indexLabelFontColor: theme.data.fontColor,
        indexLabelLineDashType: 'dot',
        indexLabelWrap: true,
        radius: theme.data.radius,
        innerRadius: theme.data.innerRadius,
      },
    ],
  });
  charts.render();
};

function Chart(props) {
  useEffect(() => {
    canvasJs(props);
  }, []);
  const {
    id,
    className,
    width,
    height,
    data,
    theme,
    title,
    axisX,
    axisY,
    paletteSet,
    legend,
  } = props;
  return (
    <StyledChart
      id={id}
      className={className}
      width={width}
      height={height}
      data={data}
      theme={theme}
      title={title}
      axisX={axisX}
      axisY={axisY}
      paletteSet={paletteSet}
      legend={legend}
    />
  );
}

Chart.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  data: PropTypes.object,
  title: PropTypes.object,
  legend: PropTypes.object,
  theme: PropTypes.object,
  axisX: PropTypes.object,
  axisY: PropTypes.object,
  paletteSet: PropTypes.array,
};

export default memo(Chart);
