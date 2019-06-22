import { getReplacements, lintRunner } from '../helpers/lintRunner';

const RULE = 'function-padding';

describe('LastLineRule', () => {

	it.each([
		[`console.log(true);
		function maria() {
			console.log(1);
		}`, 1],
		[`console.log(true);
		export function maria() {
			console.log(1);
		}`, 1],
		[`console.log(true);

		function maria() {
			console.log(1);
		}`, 0],
		[`console.log(true);

		export function maria() {
			console.log(1);
		}`, 0],
		[`export function maria() {
			console.log(1);
		}`, 0],
		[`console.log(true);
		chama(function () {
			console.log(1);
		})`, 0]
	])('%s', (src, count) => {

		const result = lintRunner({ src, rule: RULE });

		expect(result.errorCount).toBe(count);
	});

	it.each([
		[`console.log(true);
		function maria() {
			console.log(1);
		}`],
		[`console.log(true);
		export function maria() {
			console.log(1);
		}`]
	])('%s', src => {

		const result = lintRunner({ src, rule: RULE, fix: true });

		expect(result.errorCount).toBe(0);

		expect(getReplacements(result)).toMatchSnapshot();
	});
});