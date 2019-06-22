import { getFileText, lintRunner } from '../helpers/lintRunner';

const rule = 'no-async-without-await';

describe('noAsyncWithoutAwait fix', () => {

	describe('Functions', () => {

		it(`should fail when the async function doesn't have an await`, () => {

			const src = `
			async function a(){
				let b = 1;
				console.log(b);
			}`;

			const result = lintRunner({ src, rule, fix: true });

			expect(result.errorCount).toBe(0);

			expect(getFileText(result)).toMatchSnapshot();
		});

		it('should fail when the async function has an await inside a arrow function declaration', () => {

			const src = `
			async function a(){
				let b = 1;
				let b = async () => {
					await fetch();
				};
			}`;
			const result = lintRunner({ src, rule, fix: true });

			expect(result.errorCount).toBe(0);

			expect(getFileText(result)).toMatchSnapshot();
		});

		it('should fail when the async function has an await inside a regular function declaration', () => {

			const src = `
			async function a(){
				let b = 1;
				async function f() {
					await fetch();
				};
			}`;
			const result = lintRunner({ src, rule, fix: true });

			expect(result.errorCount).toBe(0);

			expect(getFileText(result)).toMatchSnapshot();
		});

		it('should fail when the function is not at the top level', () => {

			const src = `
			function a(){
				let b = 1;
				async function f() {
					fetch();
				};
			}`;

			const result = lintRunner({ src, rule, fix: true });

			expect(result.errorCount).toBe(0);

			expect(getFileText(result)).toMatchSnapshot();
		});
	});

	describe('Arrow functions', () => {

		it(`should fail when the async arrow function doesn't have an await`, () => {

			const src = `
			const a = async () => {
				let b = 1;
				console.log(b);
			}`;

			const result = lintRunner({ src, rule, fix: true });

			expect(result.errorCount).toBe(0);

			expect(getFileText(result)).toMatchSnapshot();
		});
	});

	describe('Classes', () => {

		it('should fail when async class method has no await', () => {

			const src = `
			class A {
				async b() {
					console.log(1);
				}
			}
		`;
			const result = lintRunner({ src, rule, fix: true });

			expect(result.errorCount).toBe(0);

			expect(getFileText(result)).toMatchSnapshot();
		});

		it('should fail when async class method has no await', () => {

			const src = `
			class A {
				public async b() {
					console.log(1);
				}
			}
		`;
			const result = lintRunner({ src, rule, fix: true });

			expect(result.errorCount).toBe(0);

			expect(getFileText(result)).toMatchSnapshot();
		});

		it('should check classes that are inside functions', () => {

			const src = `
			async () => {
				await a();
				class A {
					async b() {
						console.log(1);
					}
				}
			};
		`;
			const result = lintRunner({ src, rule, fix: true });

			expect(result.errorCount).toBe(0);

			expect(getFileText(result)).toMatchSnapshot();
		});
	});

	describe('return statements', () => {

		it('should fail when the async function has a return statement', () => {

			const src = `
			async function a() {
				let b = 1;
				let a = () => {
				return 1;
				}
			}
		`;
			const result = lintRunner({ src, rule, fix: true });

			expect(result.errorCount).toBe(0);

			expect(getFileText(result)).toMatchSnapshot();
		});
	});
});