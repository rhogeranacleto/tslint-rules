import { Configuration, Linter } from 'tslint';

interface IMaria {
	src: string;
	// tslint:disable-next-line:no-any
	rule: any;
	fileName?: string;
	fix?: boolean;
}

export function lintRunner(data: IMaria) {

	const { src, rule, fileName = `/tmp/${Date.now()}.snap`, fix = false } = data;

	const linter = new Linter({ fix });

	linter.lint(
		fileName,
		src,
		Configuration.parseConfigFile({
			rules: {
				[rule.name || rule]: [true]
			},
			rulesDirectory: 'src'
		})
	);

	return linter.getResult();
}