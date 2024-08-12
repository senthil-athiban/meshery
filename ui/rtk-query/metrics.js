import { api } from './index';

const TAGS = {
  METRICS: 'metrics',
};

export const metricsApi = api
  .enhanceEndpoints({
    addTagTypes: [TAGS.METRICS],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      pingGrafana: builder.query({
        query: (queryArg) => ({
          url: `telemetry/metrics/grafana/ping/${queryArg.connectionId}`,
          providesTags: () => [{ type: TAGS.METRICS, id: 'GRAFANA' }],
        }),
      }),
      pingPrometheus: builder.query({
        query: (queryArg) => ({
          url: `telemetry/metrics/ping/${queryArg.connectionId}`,
          providesTags: () => [{ type: TAGS.METRICS, id: 'PROMETHEUS' }],
        }),
      }),
      updatePrometheusBoard: builder.mutation({
        query: (queryArg) => ({
          url: `/api/telemetry/metrics/board_import/${self.props.connectionID}`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: queryArg.body,
        }),
      }),
      configureGrafana: builder.mutation({
        query: (queryArg) => ({
          url: 'telemetry/metrics/grafana/config',
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: queryArg.params,
        }),
        invalidatesTags: [{ type: TAGS.METRICS, id: 'GRAFANA' }],
      }),
      configurePrometheus: builder.mutation({
        query: (queryArg) => ({
          url: '/telemetry/metrics/config',
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: queryArg.params,
        }),
        invalidatesTags: [{ type: TAGS.METRICS, id: 'PROMETHEUS' }],
      }),
    }),
  });

export const {
  usePingGrafanaQuery,
  usePingPrometheusQuery,
  useUpdatePrometheusBoardMutation,
  useConfigureGrafanaMutation,
  useConfigurePrometheusMutation,
} = metricsApi;
