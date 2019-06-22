import * as Lint from 'tslint';
import ts from 'typescript';
import { prevTokenChecker } from './helpers/prevChecker';

class Walk extends Lint.RuleWalker {

	public visitConstructorDeclaration(constructor: ts.ConstructorDeclaration) {

		if (prevTokenChecker(constructor, this.getSourceFile())) {

			const fix = new Lint.Replacement(
				constructor.getFullStart(),
				constructor.getFullWidth(),
				`\n${constructor.getFullText()}`
			);

			this.addFailureAtNode(constructor, 'Constructor must have a line before', fix);
		}

		super.visitConstructorDeclaration(constructor);
	}
}

export class Rule extends Lint.Rules.AbstractRule {

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {

		return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
	}
}