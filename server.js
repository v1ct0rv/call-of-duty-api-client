require('dotenv').config()
const express = require("express")
const path = require('path')
const app = express()
const port = 5000
const mongoose = require("mongoose")
const { graphqlHTTP } = require("express-graphql")
const logger = require("./core/logger")
var cors = require('cors')
// const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
// const statsJob = require('./jobs/statsJob')

const extensions = ({ context }) => {
  return {
    runTime: Date.now() - context.startTime,
  }
}

app.use(logger)
app.use(cors({
  //origin: ['https://www.section.io', 'https://www.google.com/']
  origin: 'http://localhost:3000'
}))

if(process.env.DEBUG) {
  console.log(`Starting in debug mode...`)
  mongoose.set('debug', process.env.DEBUG)
}

app.listen(port, async () => {
  console.log(`Server is listening at http://localhost:${port}`)
  await mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

app.use(express.static(path.join(__dirname, 'public')))

mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
)

const graphqlSchema = require("./schemas/index")

app.use(
  "/graphql",
  graphqlHTTP((request) => {
    return {
      context: { startTime: Date.now() },
      graphiql: true,
      schema: graphqlSchema,
      extensions,
    }
  })
)

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname , '/public/index.html'))
})

// // Recurrent Jobs Configuration
// const scheduler = new ToadScheduler()
// const statsGrabberTask = new AsyncTask(
//     'Call of Duty Stats Grabber',
//     () => { return statsJob().then((result) => { console.log(`[${new Date().toISOString()}]: Stats Job Finished.`) }) },
//     (err) => { console.error(err) }
// )

// const job = new SimpleIntervalJob({ seconds: process.env.STATS_JOB_INTERVAL }, statsGrabberTask)

// scheduler.addSimpleIntervalJob(job)

// // Run once at startup
// const start = async function () {
//   await statsJob()
// }
// // start()
