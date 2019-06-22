import { getFileText, lintRunner } from '../helpers/lintRunner';

const RULE = 'if-padding';

describe('IfPaddingRule', () => {

	it.each([
		[`console.log(true);
		if(true){
			return true;
		}`, 1],
		[`console.log(true);
		if(true){
			return true;
		}else{
			return false;
		}`, 1],
		[`if(true){
			return 'só if';
		}
		else {
			return 'so else';
		}`, 1],
		[`if(true){
			return 'so if';
		}
		else
		if(false&&maria) {
			return 'else if';
		}
		else {
			return 'só else';
		}`, 2],
		[`if(true){
			return 'so if';
		}
		else if(false&&maria) {
			return 'else if';
		}`, 1],
		[`if(true){
			return 'so if';
		} else
		{
			return 'else if';
		}`, 1],
		[`if(true){
			return 'so if';
		} else if(false&&maria) {
			return 'else if';
		} else {
			return 'só else';
		}`, 0],
		[`console.log(true);

		if(true){
			return true;
		}`, 0]
	])('%s', (src, count) => {

		const result = lintRunner({ src, rule: RULE });

		expect(result.errorCount).toBe(count);
	});

	it.only.each([
		[`console.log(true);
		if(true){
			return true;
		}`],
		[`console.log(true);
		if(true){
			return true;
		}else{
			return false;
		}`],
		[`if(true){
			return 'só if';
		}
		else {
			return 'so else';
		}`],
		[`if(true){
			return 'so if';
		}
		else
		if(false&&maria) {
			return 'else if';
		}
		else {
			return 'só else';
		}`],
		[`if(true){
			return 'so if';
		}
		else if(false&&maria) {
			return 'else if';
		}`],
		[`if(true){
			return 'so if';
		} else
		{
			return 'else if';
		}`],
		[`if(true){
			return 'so if';
		}
		else
		{
			return 'else if 2';
		}`]
	])('%s', src => {

		const result = lintRunner({ src, rule: RULE, fix: true });

		expect(result.errorCount).toBe(0);

		expect(getFileText(result)).toMatchSnapshot();
	});
});