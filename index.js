require('dotenv').config()
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
const statsJob = require('./jobs/statsJob')
const aggregateJob = require('./jobs/aggregateJob')
const scheduler = new ToadScheduler()

// Run once
// const start = async function () {
//   await aggregateJob()
// }
// start()

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
const job = new SimpleIntervalJob({ seconds: process.env.STATS_JOB_INTERVAL, runImmediately: true }, statsGrabberTask)
scheduler.addSimpleIntervalJob(job)

console.log(`[${new Date().toISOString()}] Starting aggregate job with ${process.env.AGGREGATE_JOB_INTERVAL/60} minutes interval`)
const aggregatejob = new SimpleIntervalJob({ seconds: process.env.AGGREGATE_JOB_INTERVAL, runImmediately: true }, aggregateTask)
scheduler.addSimpleIntervalJob(aggregatejob)

