import * as Lint from 'tslint';
import ts from 'typescript';
import { prevStatementChecker } from './helpers/prevChecker';

class Walk extends Lint.RuleWalker {

	public visitTryStatement(tryStatement: ts.TryStatement) {

		if (prevStatementChecker(tryStatement, this.getSourceFile())) {

			const fix = new Lint.Replacement(
				tryStatement.getFullStart(),
				tryStatement.getFullWidth(),
				`\n${tryStatement.getFullText()}`
			);

			this.addFailureAtNode(tryStatement, 'Missing blank line before try', fix);
		}

		this.catch(tryStatement);

		super.visitTryStatement(tryStatement);
	}

	private catch(tryStatement: ts.TryStatement) {

		if (tryStatement.catchClause) {

			const startLine = ts.getLineAndCharacterOfPosition(
				this.getSourceFile(),
				tryStatement.catchClause.getChildAt(4).getStart()
			).line;
			const prevLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), tryStatement.getChildAt(1).getEnd()).line;

			if (prevLine !== startLine) {

				const catchToken = tryStatement.catchClause.getChildAt(0).getText();
				const openToken = tryStatement.catchClause.getChildAt(1).getText();
				const errToken = tryStatement.catchClause.getChildAt(2).getText();
				const closeToken = tryStatement.catchClause.getChildAt(3).getText();

				const fix = new Lint.Replacement(
					tryStatement.getChildAt(1).getEnd(),
					tryStatement.catchClause.getChildAt(4).getStart() - tryStatement.getChildAt(1).getEnd(),
					` ${catchToken} ${openToken}${errToken}${closeToken} `
				);

				this.addFailureAtNode(tryStatement.catchClause, 'Not allowed break line on else', fix);
			}
		}
	}
}

export class Rule extends Lint.Rules.AbstractRule {

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {

		return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
	}
}