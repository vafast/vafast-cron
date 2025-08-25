import { Server, createRouteHandler } from 'vafast'
import { cron } from '../src'
import type { Route } from 'vafast'

// 创建cron任务
const heartbeatCron = cron({
	name: 'heartbeat',
	pattern: '*/30 * * * * *',
	run(store) {
		console.log('Working')
	}
})

const loggerCron = cron({
	name: 'logger',
	pattern: '*/1 * * * * *',
	run(store) {
		console.log(new Date().toISOString())
	}
})

// 定义路由
const routes: Route[] = [
	{
		method: 'GET',
		path: '/',
		handler: createRouteHandler(() => {
			// 停止logger任务
			loggerCron.stop()
			return { message: 'Stop logger' }
		})
	}
]

// 创建服务器
const server = new Server(routes)

// 启动cron任务
// croner会自动启动，无需手动调用start

export default {
	fetch: (req: Request) => server.fetch(req)
}
