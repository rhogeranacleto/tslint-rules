import * as Lint from 'tslint';
import ts from 'typescript';

const NEW_LINE_AFTER = 'Missing blank line after block declaration';
const NEW_LINE_END = 'Not allowed blank line before block ends';

class Walker extends Lint.RuleWalker {

	public visitBlock(block: ts.Block) {

		if (block.getChildAt(1).getChildCount() > 0) {

			this.hasLineBetweenBlockStartsAndContent(block);

			this.hasntLineBetweenBlockEndsAndContent(block);
		}

		super.visitBlock(block);
	}

	private hasLineBetweenBlockStartsAndContent(block: ts.Block) {

		const startLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), block.getStart()).line;
		const childLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), block.getChildAt(1).getStart()).line;

		if (childLine <= (startLine + 1)) {

			const fix = new Lint.Replacement(
				block.getFullStart(),
				block.getFullWidth(),
				block.getFullText().replace('{', '{\n')
			);

			this.addFailureAtNode(block, NEW_LINE_AFTER, fix);
		}
	}

	private hasntLineBetweenBlockEndsAndContent(block: ts.Block) {

		const endLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), block.getEnd()).line;
		const childEndLine = ts.getLineAndCharacterOfPosition(this.getSourceFile(), block.getChildAt(1).getEnd()).line;

		if (endLine > (childEndLine + 1)) {

			const lines = block.getFullText().split('\n');
			const bracket = lines.pop();

			for (let i = lines.length - 1; i > 0; i--) {

				if (lines[i].trim()) {

					break;
				}

				lines.pop();
			}

			lines.push(bracket as string);

			const fix = new Lint.Replacement(block.getFullStart(), block.getFullWidth(), lines.join('\n'));

			this.addFailureAtNode(block, NEW_LINE_END, fix);
		}
	}
}

export class Rule extends Lint.Rules.AbstractRule {

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {

		return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
	}
}