const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
const path = require('path')
const dbPath = path.join(__dirname, 'todoApplication.db')
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

app.get('/todo/', async (request, response) => {
  let data = null
  let query = ''
  const {search_q = '', status, priority} = request.query
  const bothPriorityAndStatus = requestQuery => {
    return (
      requestQuery.status !== undefined && requestQuery.priority !== undefined
    )
  }
  const hasPriority = requestQuery => {
    return requestQuery.priority !== undefined
  }
  const hasStatus = requestQuery => {
    return requestQuery.status !== undefined
  }
  switch (true) {
    case bothPriorityAndStatus(request.query):
      query = `
     SELECT * FROM todo WHERE
     todo LIKE '%{search_q}%' AND
     status='${status}' AND
     priority = '${priority}';`
      break

    case hasPriority(request.query):
      query = `
     SELECT * FROM todo WHERE
     todo LIKE '%{search_q}%' AND
     priority='${priority}';`
      break

    case hasStatus(request.query):
      query = `
     SELECT * FROM todo 
     WHERE todo LIKE '%{search_q}%' AND
     status='${status}';`
      break

    default:
      query = `
     SELECT * FROM todo 
     WHERE todo LIKE '%{search_q}%';`
      break
  }
  const dbResponse = await db.all(query)
  response.send(dbResponse)
})
module.exports = app
