import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { resourceFromAttributes } from '@opentelemetry/resources'

const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318'

const sdk = new NodeSDK({
  resource        : resourceFromAttributes({ 'service.name': process.env.OTEL_SERVICE_NAME ?? 'house-staff-server' }),
  traceExporter   : new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
  metricReaders   : [new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({ url: `${endpoint}/v1/metrics` }),
  })],
  instrumentations: [getNodeAutoInstrumentations()],
})

sdk.start()

const shutdown = () => sdk.shutdown()

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)