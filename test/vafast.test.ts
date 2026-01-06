import { cron } from '../src'
import { Patterns } from '../src/schedule'
import { describe, expect, it } from 'vitest'

describe('Cron for Vafast', () => {
	it('should create cron job', () => {
		let done = false

		const job = cron({
			pattern: '*/1 * * * * *',
			name: 'test',
			run() {
				done = true
			}
		})

		expect(job).toBeDefined()
		expect(typeof job.isRunning).toBe('function')
	})

	it('should use predefined patterns', () => {
		const job = cron({
			pattern: Patterns.EVERY_SECOND,
			name: 'test',
			run() {
				// Test function
			}
		})

		expect(job).toBeDefined()
	})

	it('should use function patterns', () => {
		const job = cron({
			pattern: Patterns.everyMinutes(5),
			name: 'test',
			run() {
				// Test function
			}
		})

		expect(job).toBeDefined()
	})

	it('should handle cron job lifecycle', () => {
		const job = cron({
			pattern: '*/1 * * * * *',
			name: 'test',
			run() {
				// Test function
			}
		})

		expect(job.isRunning()).toBe(true)

		// Test stop functionality
		job.stop()
		expect(job.isRunning()).toBe(false)

		// Note: resume() might not immediately set isRunning to true
		// This is expected behavior for croner
	})
})
