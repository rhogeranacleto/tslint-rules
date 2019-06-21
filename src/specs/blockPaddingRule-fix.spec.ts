import { getReplacements, lintRunner } from '../helpers/lintRunner';

const RULE = 'block-padding';

describe('blockPadding Rule', () => {

	it.each([
		[`if (true) {

			console.log(true);

			joao();


		}`],
		[`class A {
			public b() {

				console.log(1);

			}
		}`],
		[`it('jj', () => {

			expect(result.errorCount).toBe(1);

		});`],
		[`function maria(){

			console.log('true');

		}`],
		[`if (true) {

			console.log(true);
		} else {

			console.log(false)

		}`],
		[`if (true) {

			console.log(true);

		} else {

			console.log(false)

		}`],
		[`if (true) {

			console.log(true);

		} else if (false) {

			console.log(false)

		}`],
		[`done(() => {

			return 'maria';

		})`],
		[`for (let i = 0; i < 10; i++) {

			console.log(i);

		}`],
		[`for (let test in testes) {

			console.log(test);

		}`],
		[`for (let test of testes) {

			console.log(test);

		}`],
		[`try {

			console.log(0/0);

		} catch(e){

			console.log(0)

		}`],
		[`if (true) {
			console.log(true);
		}`],
		[`class A {
			constructor() {
				console.log(1);
			}
		}`],
		[`class A {
			public b() {
				console.log(1);
			}
		}`],
		[`it('jj', () => {
			expect(result.errorCount).toBe(1);
	});`],
		[`function maria(){
		console.log('true');
	}`],
		[`if (true) {

		console.log(true);
	} else {
		console.log(false)
	}`],
		[`if (true) {
		console.log(true);
	} else {
		console.log(false)
	}`],
		[`if (true) {
		console.log(true);
	} else if (false) {
		console.log(false)
	}`],
		[`for (let i = 0; i < 10; i++) {
		console.log(i);
	}`],
		[`for (let test in testes) {
		console.log(test);
	}`],
		[`for (let test of testes) {
		console.log(test);
	}`],
		[`try {
		console.log(0/0);
	} catch(e){
		console.log(0)
	}`],
		[`done(() => {
		return 'maria';
	})`]
	])('%s should throw error for line after method', src => {

		const result = lintRunner({ src, rule: RULE, fix: true });

		expect(result.errorCount).toBe(0);

		expect(getReplacements(result)).toMatchSnapshot();
	});
});