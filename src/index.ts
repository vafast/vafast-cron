import { Cron, type CronOptions } from 'croner'

export interface CronConfig<Name extends string = string> extends CronOptions {
	/**
	 * Input pattern, input date, or input ISO 8601 time string
	 *
	 * ---
	 * ```plain
	 * ┌────────────── second (optional)
	 * │ ┌──────────── minute
	 * │ │ ┌────────── hour
	 * │ │ │ ┌──────── day of month
	 * │ │ │ │ ┌────── month
	 * │ │ │ │ │ ┌──── day of week
	 * │ │ │ │ │ │
	 * * * * * * *
	 * ```
	 */
	pattern: string
	/**
	 * Cronjob name to registered to `store`
	 */
	name: Name
	/**
	 * Function to execute on time
	 */
	run: (store: Cron) => any | Promise<any>
}

export const cron = <Name extends string = string>({
	pattern,
	name,
	run,
	...options
}: CronConfig<Name>) => {
	if (!pattern) throw new Error('pattern is required')
	if (!name) throw new Error('name is required')

	// Create a new cron job
	const cronJob = new Cron(pattern, options, () => {
		// Create a mock store for the cron job
		const mockStore = { cron: { [name]: cronJob } }
		run(mockStore as any)
	})

	// Return the cron job for external management
	return cronJob
}

export { Patterns } from './schedule'

export default cron
