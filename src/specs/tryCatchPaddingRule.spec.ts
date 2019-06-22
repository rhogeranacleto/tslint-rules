import { getFileText, lintRunner } from '../helpers/lintRunner';

const RULE = 'try-catch-padding';

describe('LastLineRule', () => {

	it.each([
		[`console.log(true);
		try {
			return 0/0;
		}catch(e){
			return e;
		}`, 1],
		[`console.log(true);

		try {
			return 0/0;
		}catch(e){
			return e;
		}`, 0],
		[`try {
			return 0/0;
		}catch(e){
			return e;
		}`, 0],
		[`try {
			return 0/0;
		}
		catch (e) {
			return e;
		}`, 1],
		[`try {
			return 0/0;
		}
		catch (e)
		{
			return e;
		}`, 1],
		[`try {
			return 0/0;
		} catch (e)
		{
			return e;
		}`, 1]
	])('%s', (src, count) => {

		const result = lintRunner({ src, rule: RULE });

		expect(result.errorCount).toBe(count);
	});

	it.each([
		[`console.log(true);
		try {
			return 0/0;
		}catch(e){
			return e;
		}`],
		[`try {
			return 0/0;
		}
		catch (e) {
			return e;
		}`],
		[`try {
			return 0/0;
		}
		catch (e)
		{
			return e;
		}`],
		[`try {
			return 0/0;
		} catch (e)
		{
			return e;
		}`]
	])('%s', src => {

		const result = lintRunner({ src, rule: RULE, fix: true });

		expect(result.errorCount).toBe(0);

		expect(getFileText(result)).toMatchSnapshot();
	});
});