import * as Lint from 'tslint';
import ts from 'typescript';
import { prevStatementChecker } from './helpers/prevChecker';

class Walk extends Lint.RuleWalker {

	public visitForStatement(forStatement: ts.ForStatement) {

		this.checkPrev(forStatement);

		super.visitForStatement(forStatement);
	}

	public visitForInStatement(forStatement: ts.ForInStatement) {

		this.checkPrev(forStatement);

		super.visitForInStatement(forStatement);
	}

	public visitForOfStatement(forStatement: ts.ForOfStatement) {

		this.checkPrev(forStatement);

		super.visitForOfStatement(forStatement);
	}

	private checkPrev(forStatement: ts.ForStatement | ts.ForInStatement | ts.ForOfStatement) {

		if (prevStatementChecker(forStatement, this.getSourceFile())) {

			const fix = new Lint.Replacement(
				forStatement.getFullStart(),
				forStatement.getFullWidth(),
				`\n${forStatement.getFullText()}`
			);

			this.addFailureAtNode(forStatement, 'For must have a line before', fix);
		}
	}
}

export class Rule extends Lint.Rules.AbstractRule {

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {

		return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
	}
}