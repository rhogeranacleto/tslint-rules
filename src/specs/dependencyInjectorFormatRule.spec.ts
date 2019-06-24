import { getFileText, lintRunner } from '../helpers/lintRunner';

const RULE = 'dependency-injector-format';

describe('DependecyInjectorFormat tests', () => {

	it.each([
		[`class Den {
			constructor (private readonly on: On) { }
		}`, 0],
		[`class Den {
			constructor (private readonly on: On) {

				console.log(on);
			}
		}`, 0],
		[`class Den {
			constructor (
				private readonly on: On) { }
		}`, 1],
		[`class Den {
			constructor (private readonly on: On) {

			}
		}`, 1],
		[`class Den {
			constructor (private readonly on: On) { console.log(on); }
		}`, 1],
		[`class Dan {
			constructor(adminUser: AdminUser, clientUser?: ClientUser) {
				this.id = adminUser.id;
			}
		}`, 0]
	])('%s', (src, count) => {

		const result = lintRunner({ src, rule: RULE });

		expect(result.errorCount).toBe(count);
	});

	it.each([
		[`class Den {
			constructor (
				private readonly on: On,
				private readonly off: Off) { }
		}`, 0],
		[`class Den {
			constructor (
				private readonly on: On,
				private readonly off: Off
			) { }
		}`, 1],
		[`class Den {
			constructor (private readonly on: On,private readonly off: Off) { }
		}`, 2],
		[`class Den {
			constructor (private readonly on: On,private readonly off: Off) { console.log(on); }
		}`, 3],
		[`class Den {
			constructor (
				private readonly on: On,private readonly off: Off
			) { }
		}`, 2],
		[`class Den {
			constructor (private readonly on: On,
				private readonly off: Off
			) { }
		}`, 3],
		[`class Den {
			constructor (
				private readonly on: On,
				private readonly midle: Midle,
				private readonly off: Off) {
				}
		}`, 1],
		[`class Den {
			constructor (
				private readonly on: On,
				private readonly off: Off
			) {

				console.log(on);
			}
		}`, 0],
		[`class Den {
			constructor (
				private readonly on: On,
				private readonly off: Off) {

				console.log(on);
			}
		}`, 1],
		[`class Den {
			constructor (
				private readonly on: On,
				private readonly off: Off)
			{

				console.log(on);
			}
		}`, 2]
	])('%s', (src, count) => {

		const result = lintRunner({ src, rule: RULE });

		expect(result.errorCount).toBe(count);
	});

	it.only.each([
		[`class Den1 {
			constructor (
				private readonly on: On) { }
		}`],
		[`class Den2 {
			constructor (private readonly on: On) {

			}
		}`],
		[`class Den3 {
			constructor (private readonly on: On) { console.log(on); }
		}`],
		[`class Den4 {
			constructor (
				private readonly on: On,
				private readonly off: Off
			) { }
		}`],
		[`class Den5 {
			constructor (private readonly on: On,private readonly off: Off) { }
		}`],
		[`class Den6 {
			constructor (
				private readonly on: On,private readonly off: Off) { }
		}`],
		[`class Den7 {
			constructor (private readonly on: On,
				private readonly off: Off) { }
		}`],
		[`class Den8 {
			constructor (
				private readonly on: On,
				private readonly midle: Midle,
				private readonly off: Off) {
				}
		}`],
		[`class Den9 {
			constructor (
				private readonly on: On,
				private readonly off: Off) {

				console.log(on);
			}
		}`],
		[`class Den10 {
			constructor (
				private readonly on: On,
				private readonly off: Off)
			{

				console.log(on);
			}
		}`]
	])('should fix %s', src => {

		const result = lintRunner({ src, rule: RULE, fix: true });

		expect(result.errorCount).toBe(0);

		expect(getFileText(result)).toMatchSnapshot();
	});
});