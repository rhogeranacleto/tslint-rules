import * as Lint from 'tslint';
import ts from 'typescript';

const NOT_ALLOWED_BREAK_LINE = 'Not allowed break line with one dependency injection';
const NOT_ALLOWED_ALL_IN_THE_SAME = 'Not allowed body in the same line';
const NOT_ALLOWED_BREAK_BRACKET_LINE = 'Not allowed break without body';
const PARAMETERS_MUST_BE_UNDERNEATH_THE_OTHER = 'Parameters must be underneath the other';
const MUST_BE_IN_THE_SAME_LINE_OPEN_BRACKET = 'Close parenteses must be in the same line of open bracket';
const CLOSE_BRACKET_MUST_BREAK_LINE = 'Close parenteses must be in the next line of dependencies';

class Walker extends Lint.RuleWalker {

	public visitConstructorDeclaration(constructor: ts.ConstructorDeclaration) {

		if (constructor.parameters.every(p => p.modifiers !== undefined)) {

			if (constructor.parameters.length === 1) {

				this.allInOneLine(constructor);
			} else if (constructor.parameters.length > 1) {

				this.oneLineUnderneathTheOther(constructor);
			}
		}

		super.visitConstructorDeclaration(constructor);
	}

	private allInOneLine(constructor: ts.ConstructorDeclaration) {

		const startLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), constructor.getStart()).line;
		const endLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), constructor.getEnd()).line;

		if (constructor.body && constructor.body.getChildAt(1).getChildCount() > 0) {

			this.body(constructor, startLine, endLine);
		} else if (startLine !== endLine) {

			const fix = new Lint.Replacement(
				constructor.getStart(),
				constructor.getWidth(),
				constructor.getText().replace(/\n|\t/g, '')
			);

			this.addFailureAtNode(constructor, NOT_ALLOWED_BREAK_LINE, fix);
		}
	}

	private body(constructor: ts.ConstructorDeclaration, startLine: number, endLine: number) {

		if (constructor.body && constructor.body.getChildAt(1).getChildCount() > 0) {

			const declarationLineEnd = ts.getLineAndCharacterOfPosition(
				this.getSourceFile(),
				constructor.body.getChildAt(0).getStart()
			).line;
			const tabs = constructor.getFullText().split(/[^\t\n]/)[0].replace('\n', '').length;

			if (startLine !== declarationLineEnd) {

				this.addFailureAtNode(constructor, NOT_ALLOWED_BREAK_LINE);
			}

			if (endLine <= startLine) {

				const fix = new Lint.Replacement(
					constructor.getFullStart(),
					constructor.getFullWidth(),
					constructor.getFullText().replace('{', `{\n\n${'\t'.repeat(tabs)}`).replace('}', `\n${'\t'.repeat(tabs)}}`)
				);

				this.addFailureAtNode(constructor, NOT_ALLOWED_ALL_IN_THE_SAME, fix);
			}
		}
	}

	private oneLineUnderneathTheOther(constructor: ts.ConstructorDeclaration) {

		this.parametersLine(constructor);

		const endLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), constructor.getEnd()).line;
		const lastParameter = constructor.parameters[constructor.parameters.length - 1];
		const parameterLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), lastParameter.getStart()).line;

		if (constructor.body && constructor.body.getChildAt(1).getChildCount() > 0) {

			this.bodyLine(constructor, constructor.body, parameterLine);
		} else if (parameterLine !== endLine) {

			const fix = new Lint.Replacement(
				constructor.getFullStart(),
				constructor.getFullWidth(),
				constructor.getFullText().replace(/(\n|\t)+\)/, ')').replace(/\{[\n\t]+\}/, '{ }')
			);

			this.addFailureAtNode(constructor, NOT_ALLOWED_BREAK_BRACKET_LINE, fix);
		}
	}

	private parametersLine(constructor: ts.ConstructorDeclaration) {

		const startLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), constructor.getStart()).line;

		for (let i = 0; i < constructor.parameters.length; i++) {

			const parameter = constructor.parameters[i];
			const parameterLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), parameter.getStart()).line;

			if (parameterLine !== (startLine + i + 1)) {

				const tabs = constructor.getFullText().split(/[^\t\n]/)[0].replace('\n', '').length;

				const fix = new Lint.Replacement(
					constructor.getFullStart(),
					constructor.getFullWidth(),
					constructor.getFullText()
						.replace(/\(([^\n])/, `(\n${'\t'.repeat(tabs + 1)}$1`)
						.replace(/,([^\n])/g, `,\n${'\t'.repeat(tabs + 1)}$1`)
				);

				this.addFailureAtNode(constructor, PARAMETERS_MUST_BE_UNDERNEATH_THE_OTHER, fix);
				break;
			}
		}
	}

	private bodyLine(constructor: ts.ConstructorDeclaration, body: ts.Block, parameterLine: number) {

		const closeParenthesesLine = ts.getLineAndCharacterOfPosition(
			this.getSourceFile(),
			constructor.getChildAt(3).getStart()
		).line;
		const openBracketsLine = ts.getLineAndCharacterOfPosition(
			this.getSourceFile(),
			body.getChildAt(0).getStart()
		).line;

		if (closeParenthesesLine !== openBracketsLine) {

			this.addFailureAtNode(constructor, MUST_BE_IN_THE_SAME_LINE_OPEN_BRACKET);
		}

		if (closeParenthesesLine !== (parameterLine + 1)) {

			const tabs = constructor.getFullText().split(/[^\t\n]/)[0].replace('\n', '').length;

			const fix = new Lint.Replacement(
				constructor.getFullStart(),
				constructor.getFullWidth(),
				constructor.getFullText().replace(/\)[\n\t\s]*\{/, `\n${'\t'.repeat(tabs)}) {`)
			);

			this.addFailureAtNode(constructor, CLOSE_BRACKET_MUST_BREAK_LINE, fix);
		}
	}
}

export class Rule extends Lint.Rules.AbstractRule {

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {

		return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
	}
}