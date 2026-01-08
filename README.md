# @vafast/cron

Plugin for [Vafast](https://github.com/vafastjs/vafast) that adds support for running cron jobs.

## Installation

```bash
npm install @vafast/cron
# or
npm install @vafast/cron
```

## Example

```typescript
import { Server, createHandler } from 'vafast'
import { cron } from '@vafast/cron'
import type { Route } from 'vafast'

// Create cron jobs
const heartbeatCron = cron({
  name: 'heartbeat',
  pattern: '*/30 * * * * *', // Every 30 seconds
  run() {
    console.log('Heartbeat')
  }
})

const loggerCron = cron({
  name: 'logger',
  pattern: '*/1 * * * * *', // Every second
  run() {
    console.log(new Date().toISOString())
  }
})

// Define routes
const routes: Route[] = [
  {
    method: 'GET',
    path: '/stop',
    handler: createHandler(() => {
      loggerCron.stop()
      return { message: 'Stop logger' }
    })
  },
  {
    method: 'GET',
    path: '/start',
    handler: createHandler(() => {
      loggerCron.resume()
      return { message: 'Start logger' }
    })
  }
]

// Create server
const server = new Server(routes)

// Cron jobs start automatically, no need to call start()

export default {
  fetch: (req: Request) => server.fetch(req)
}
```

## API

This plugin exports `cron` function using [croner](https://github.com/hexagon/croner).

For documentation, `cron` uses the same syntax as [croner](https://github.com/hexagon/croner), so please refer to [croner documentation](https://github.com/hexagon/croner).

### Cron Expression Format

```
┌────────────── second (optional)
│ ┌──────────── minute
│ │ ┌────────── hour
│ │ │ ┌──────── day of month
│ │ │ │ ┌────── month
│ │ │ │ │ ┌──── day of week
│ │ │ │ │ │
* * * * * *
```

### Methods

- `start()` - Start the cron job
- `stop()` - Stop the cron job
- `resume()` - Resume a stopped cron job
- `isRunning()` - Check if the cron job is running
- `nextRun()` - Get the next run time

## License

MIT
