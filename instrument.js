import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://2d481dbaa68142628ed6886361f36d65@o4511253777809409.ingest.de.sentry.io/4511253782265936",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});