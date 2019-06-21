import { Configuration, Linter, LintResult } from 'tslint';

interface IMaria {
	src: string;
	// tslint:disable-next-line:no-any
	rule: any;
	fileName?: string;
	fix?: boolean;
}

export function lintRunner(data: IMaria) {

	const { src, rule, fileName = `/tmp/test-${Date.now()}.snap`, fix = false } = data;

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

export function getReplacements(result: LintResult) {

	if (result.fixes) {

		return result.fixes.map(fix => {

			const fixJson = fix.toJson().fix;

			if (fixJson) {

				if (Array.isArray(fixJson)) {

					return fixJson.map(replace => replace.innerText);
				}

				return [fixJson.innerText];
			}
		});
	}
}