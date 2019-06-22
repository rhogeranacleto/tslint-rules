import * as Lint from 'tslint';
import ts from 'typescript';
import { prevStatementChecker } from './helpers/prevChecker';

class Walk extends Lint.RuleWalker {

	public visitFunctionDeclaration(functionDeclaration: ts.FunctionDeclaration) {

		if (prevStatementChecker(functionDeclaration, this.getSourceFile())) {

			const fix = new Lint.Replacement(
				functionDeclaration.getFullStart(),
				functionDeclaration.getFullWidth(),
					`\n${functionDeclaration.getFullText()}`
			);

			this.addFailureAtNode(functionDeclaration, 'Function must have a line before', fix);
		}

		super.visitFunctionDeclaration(functionDeclaration);
	}
}

export class Rule extends Lint.Rules.AbstractRule {

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {

		return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
	}
}