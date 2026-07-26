# @vafast/cron

基于 [croner](https://github.com/Hexagon/croner) 的**进程内定时任务**工具。

> **不是 HTTP 中间件。** 不要 `server.use(cron(...))`。在进程启动时调用 `cron({ pattern, name, run })`，与 `serve` 并列即可。

## 先搞清几个概念

- **Cron 表达式**：用空格分隔的字段描述何时执行；支持可选秒字段：`秒 分 时 日 月 周`
- **必填配置**：`pattern`（何时）、`name`（任务名）、`run`（回调）——是一个配置对象，不是 `cron(pattern, fn)`
- **返回值**：croner 的 `Cron` 实例，创建后即开始调度，可用 `stop()` / `resume()` / `nextRun()`

## 安装

```bash
npm install @vafast/cron
```

## 快速开始

```typescript
import { cron, Patterns } from '@vafast/cron'

const job = cron({
  name: 'cleanup',
  pattern: Patterns.EVERY_HOUR, // 或 '* * * * *'
  run: async () => {
    await cleanupTempFiles()
  },
})

// job.stop() / job.resume() / job.nextRun()
```

## 用法

### 与 HTTP 服务一起

```typescript
import { serve } from 'vafast'
import { cron, Patterns } from '@vafast/cron'

cron({
  name: 'hourly-report',
  pattern: Patterns.EVERY_HOUR,
  timezone: 'Asia/Shanghai',
  protect: true,
  catch: (error) => console.error(error),
  run: () => sendReport(),
})

// 再正常 serve HTTP...
```

### Patterns

从 `@vafast/cron` 导入（无 `@vafast/cron/schedule` 子路径）：

```typescript
import { Patterns } from '@vafast/cron'

// 常量
Patterns.EVERY_MINUTE
Patterns.EVERY_HOUR
Patterns.EVERY_DAY_AT_MIDNIGHT
Patterns.EVERY_WEEKDAY

// 函数
Patterns.daily()
Patterns.hourly()
Patterns.everyDayAt('09:30')
Patterns.everyWeekdayAt('08:00')
Patterns.everyWeekOn(Patterns.MONDAY, '10:00')
Patterns.everyMinutes(5)
Patterns.everyHours(2)
// 注意：everySenconds 拼写与源码一致
Patterns.everySenconds(10)
```

### 常用透传选项（croner `CronOptions`）

| 选项 | 说明 |
|------|------|
| `timezone` | 时区，如 `'Asia/Shanghai'` |
| `paused` | 创建后先暂停 |
| `maxRuns` | 最大执行次数 |
| `protect` | 防止上次未完成时重叠执行 |
| `catch` | 捕获 `run` 抛错 |
| `interval` | 最小间隔（秒） |
| `startAt` / `stopAt` | 调度起止时间 |
| `unref` | 不阻止进程退出 |

`name` / `pattern` / `run` 由本包处理；其余 `...options` 传给 croner。

## API

```typescript
cron(config: CronConfig): Cron
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `pattern` | 是 | cron 表达式等 |
| `name` | 是 | 任务名（mock store 键）；不会再作为 croner `options.name` 传入 |
| `run` | 是 | `(store) => ...`，`store` 形如 `{ cron: { [name]: Cron } }` |
| 其它 | 否 | 透传 croner |

导出：`cron` / `default`、`Patterns`、`CronConfig`。

## 最佳实践

- 只在进程入口注册，勿在请求 handler 里反复创建
- 长任务用 `protect` + 幂等
- 多实例用外部锁，避免重复跑
- 跨时区显式设 `timezone`

## 注意事项

- 不是中间件，不能 `server.use`
- 每进程独立调度
- `pattern` / `name` 为空会抛错

## 相关链接

- 文档：[Cron](https://vafast.dev/middleware/cron)（仓库内 `vafast-doc/docs/middleware/cron.md`）
- [croner](https://github.com/Hexagon/croner)

## License

MIT
