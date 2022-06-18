require('dotenv').config()
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
const statsJob = require('./jobs/statsJob')
const aggregateJob = require('./jobs/aggregateJob')
const scheduler = new ToadScheduler()
const DISABLE_INTERVAL_JOBS = process.env.DISABLE_INTERVAL_JOBS || false;


// Run once
// const start = async function () {
//   await aggregateJob()
// }
// start()

// const start = async function () {
//   await statsJob()
// }
// start()

if(!DISABLE_INTERVAL_JOBS) {
    const statsGrabberTask = new AsyncTask(
        'Call of Duty Stats Grabber',
        () => { return statsJob().then((result) => { console.log(`[${new Date().toISOString()}]: Stats Job Finished.`) }) },
        (err) => { console.error(err) }
    )

    const aggregateTask = new AsyncTask(
        'Call of Duty Stats Aggegator',
        () => { return aggregateJob().then((result) => { console.log(`[${new Date().toISOString()}]: Aggregate Job Finished.`) }) },
        (err) => { console.error(err) }
    )

    console.log(`[${new Date().toISOString()}] Starting jobs with ${process.env.STATS_JOB_INTERVAL/60} minutes interval`)
    const intervalStatsJob = new SimpleIntervalJob({ seconds: process.env.STATS_JOB_INTERVAL, runImmediately: true }, statsGrabberTask)
    scheduler.addSimpleIntervalJob(intervalStatsJob)

    console.log(`[${new Date().toISOString()}] Starting aggregate job with ${process.env.AGGREGATE_JOB_INTERVAL/60} minutes interval`)
    const intervaltAggregateJob = new SimpleIntervalJob({ seconds: process.env.AGGREGATE_JOB_INTERVAL, runImmediately: true }, aggregateTask)
    scheduler.addSimpleIntervalJob(intervaltAggregateJob)
} else {
    console.log(`[${new Date().toISOString()}]: Interval Jobs are disabled!.`)
    const job = (process.env.ACTIVE_JOB === "aggregateJob") ? aggregateJob: statsJob
    const start = async function () {
      await job()
    }
    start()
}

