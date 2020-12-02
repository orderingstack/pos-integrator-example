require('dotenv').config();

const appInsights = require("applicationinsights");
appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(false)
    .start(); // assuming ikey is in env var
let client = appInsights.defaultClient;

client.trackEventEx = function (ev) {
    if (ev.properties) {
        ev.properties.Tenant = process.env.TENANT;
        ev.properties.Venue = process.env.VENUE;
    }
    client.trackEvent(ev);
}

module.exports = client; 