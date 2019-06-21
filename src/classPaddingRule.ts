import * as Lint from 'tslint';
import ts from 'typescript';
import { removeLastEmptyLineOfTheBlock } from './helpers/modifiers';
import { prevTokenChecker } from './helpers/prevChecker';

class Walker extends Lint.RuleWalker {

	public visitClassDeclaration(classDeclaration: ts.ClassDeclaration) {

		this.checkBody(classDeclaration);

		if (prevTokenChecker(classDeclaration, this.getSourceFile())) {

			const fix = new Lint.Replacement(
				classDeclaration.getFullStart(),
				classDeclaration.getFullWidth(),
				`\n${classDeclaration.getFullText()}`
			);

			this.addFailureAtNode(classDeclaration, 'Class must have a line before', fix);
		}

		super.visitClassDeclaration(classDeclaration);
	}

	private checkBody(classDeclaration: ts.ClassDeclaration) {

		const endLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), classDeclaration.getEnd()).line;

		if (classDeclaration.getChildren()[classDeclaration.getChildCount() - 2].getChildCount() > 0) {

			this.addBody(classDeclaration, endLine);
		} else {

			const classToken = classDeclaration.getChildren().find(c => c.kind === ts.SyntaxKind.ClassKeyword);

			if (classToken) {

				const startLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), classToken.getStart()).line;

				if (startLine !== endLine) {

					const fix = new Lint.Replacement(
						classDeclaration.getFullStart(),
						classDeclaration.getFullWidth(),
						classDeclaration.getFullText().replace(/\{(\n|\t)+\}/, '{ }')
					);

					this.addFailureAtNode(classDeclaration, 'Classes without body must be in the same line', fix);
				}
			}
		}
	}

	private addBody(classDeclaration: ts.ClassDeclaration, endLine: number) {

		const startLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), classDeclaration.getStart()).line;
		const body = classDeclaration.getChildren()[classDeclaration.getChildCount() - 2];

		const bodyStartLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), body.getStart()).line;
		const bodyEndLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), body.getEnd()).line;

		if (bodyStartLine === (startLine + 1)) {

			const fix = new Lint.Replacement(
				classDeclaration.getFullStart(),
				classDeclaration.getFullWidth(),
				classDeclaration.getFullText().replace('{', '{\n')
			);

			this.addFailureAtNode(classDeclaration, 'Must have line after class declaration', fix);
		}

		if (endLine > (bodyEndLine + 1)) {

			const fix = new Lint.Replacement(
				classDeclaration.getFullStart(),
				classDeclaration.getFullWidth(),
				removeLastEmptyLineOfTheBlock(classDeclaration.getFullText())
			);

			this.addFailureAtNode(classDeclaration, 'Not allowed line before class ends', fix);
		}
	}
}

export class Rule extends Lint.Rules.AbstractRule {

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {

		return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
	}
}