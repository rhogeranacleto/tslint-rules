import * as Lint from 'tslint';
import ts from 'typescript';
import { prevStatementChecker } from './helpers/prevChecker';

class Walk extends Lint.RuleWalker {

	public visitIfStatement(ifStatement: ts.IfStatement) {

		if (prevStatementChecker(ifStatement, this.getSourceFile())) {

			const fix = new Lint.Replacement(
				ifStatement.getFullStart(),
				ifStatement.getFullWidth(),
				`\n${ifStatement.getFullText()}`
			);

			this.addFailureAtNode(ifStatement, 'Missing blank line before if', fix);
		}

		this.visitElse(ifStatement);

		super.visitIfStatement(ifStatement);
	}

	private visitElse(ifStatement: ts.IfStatement) {

		if (ifStatement.elseStatement) {

			const startLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), ifStatement.elseStatement.getStart()).line;
			const prevLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), ifStatement.getChildAt(4).getEnd()).line;

			if (prevLine !== startLine) {

				const fix = new Lint.Replacement(
					ifStatement.getChildAt(4).getEnd(),
					ifStatement.elseStatement.getStart() - ifStatement.getChildAt(4).getEnd(),
					' else '
				);

				this.addFailureAtNode(ifStatement.elseStatement, 'Not allowed break line on else', fix);
			}
		}
	}
}

export class Rule extends Lint.Rules.AbstractRule {

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {

		return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
	}
}