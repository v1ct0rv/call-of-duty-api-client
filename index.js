require('dotenv').config()
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
const statsJob = require('./jobs/statsJob')
const scheduler = new ToadScheduler()

// Run once
const start = async function () {
  await statsJob();
}
start();

const statsGrabberTask = new AsyncTask(
    'Call of Duty Stats Grabber',
    () => { return statsJob().then((result) => { console.log(`[${new Date().toISOString()}]: Stats Job Finished.`) }) },
    (err) => { console.error(err) }
)

const job = new SimpleIntervalJob({ seconds: process.env.STATS_JOB_INTERVAL }, statsGrabberTask)

scheduler.addSimpleIntervalJob(job)

//setTimeout(() => {  console.log("World!"); }, 2000000);

//start().catch(console.dir)
