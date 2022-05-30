/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React, { useMemo } from 'react';
import { i18n } from '@kbn/i18n';
import { usePreviousPeriodLabel } from '../../../hooks/use_previous_period_text';
import { isTimeComparison } from '../../shared/time_comparison/get_comparison_options';
import { asPercent } from '../../../../common/utils/formatters';
import { useFetcher } from '../../../hooks/use_fetcher';
import { useTimeRange } from '../../../hooks/use_time_range';
import { Coordinate, TimeSeries } from '../../../../typings/timeseries';
import { TimeseriesChart } from '../../shared/charts/timeseries_chart';
import { useApmParams } from '../../../hooks/use_apm_params';
import {
  ChartType,
  getTimeSeriesColor,
} from '../../shared/charts/helper/get_timeseries_color';
import { getComparisonChartTheme } from '../../shared/time_comparison/get_comparison_chart_theme';

function yLabelFormat(y?: number | null) {
  return asPercent(y || 0, 1);
}

export function BackendFailedTransactionRateChart({
  height,
}: {
  height: number;
}) {
  const {
    query: {
      backendName,
      kuery,
      environment,
      rangeFrom,
      rangeTo,
      offset,
      comparisonEnabled,
    },
  } = useApmParams('/backends/overview');

  const { start, end } = useTimeRange({ rangeFrom, rangeTo });

  const comparisonChartTheme = getComparisonChartTheme();

  const { data, status } = useFetcher(
    (callApmApi) => {
      if (!start || !end) {
        return;
      }

      return callApmApi('GET /internal/apm/backends/charts/error_rate', {
        params: {
          query: {
            backendName,
            start,
            end,
            offset:
              comparisonEnabled && isTimeComparison(offset)
                ? offset
                : undefined,
            kuery,
            environment,
          },
        },
      });
    },
    [backendName, start, end, offset, kuery, environment, comparisonEnabled]
  );

  const { currentPeriodColor, previousPeriodColor } = getTimeSeriesColor(
    ChartType.FAILED_TRANSACTION_RATE
  );

  const previousPeriodLabel = usePreviousPeriodLabel();
  const timeseries = useMemo(() => {
    const specs: Array<TimeSeries<Coordinate>> = [];

    if (data?.currentTimeseries) {
      specs.push({
        data: data.currentTimeseries,
        type: 'linemark',
        color: currentPeriodColor,
        title: i18n.translate('xpack.apm.backendErrorRateChart.chartTitle', {
          defaultMessage: 'Failed transaction rate',
        }),
      });
    }

    if (data?.comparisonTimeseries) {
      specs.push({
        data: data.comparisonTimeseries,
        type: 'area',
        color: previousPeriodColor,
        title: previousPeriodLabel,
      });
    }

    return specs;
  }, [data, currentPeriodColor, previousPeriodColor, previousPeriodLabel]);

  return (
    <TimeseriesChart
      height={height}
      fetchStatus={status}
      id="errorRateChart"
      customTheme={comparisonChartTheme}
      timeseries={timeseries}
      yLabelFormat={yLabelFormat}
    />
  );
}
