import { getFileText, lintRunner } from '../helpers/lintRunner';

const RULE = 'constructor-padding';

describe('Constructor', () => {

	it.each([
		[`class Maria {
			constructor(private jj: JJ) {}
		}`, 1],
		[`class Maria {
			@Otro()
			constructor(private jj: JJ) {}
		}`, 1],
		[`class Maria {

			@Otro()
			constructor(private jj: JJ) {}
		}`, 0],
		[`class Maria {
			public maria = true;
			constructor(private jj: JJ) {}
		}`, 1],
		[`class Maria {
			public maria = true;
			@Otro()
			constructor(private jj: JJ) {}
		}`, 1],
		[`class Maria {
			public maria = true;

			@Otro()
			constructor(private jj: JJ) {}
		}`, 0],
		[`class Maria {
			public maria = true;

			constructor(private jj: JJ) {}
		}`, 0]
	])('%s', (src, count) => {

		const result = lintRunner({ src, rule: RULE });

		expect(result.errorCount).toBe(count);
	});

	it.each([
		[`class Maria {
			constructor(private jj: JJ) {}
		}`],
		[`class Maria {
			@Otro()
			constructor(private jj: JJ) {}
		}`],
		[`class Maria {
			public maria = true;
			constructor(private jj: JJ) {}
		}`],
		[`class Maria {
			public maria = true;
			@Otro()
			constructor(private jj: JJ) {}
		}`]
	])('%s', src => {

		const result = lintRunner({ src, rule: RULE, fix: true });

		expect(result.errorCount).toBe(0);

		expect(getFileText(result)).toMatchSnapshot();
	});
});