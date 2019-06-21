export function removeLastEmptyLineOfTheBlock(block: string) {

	const lines = block.split('\n');
	const bracket = lines.pop();

	for (let i = lines.length - 1; i > 0; i--) {

		if (lines[i].trim()) {

			break;
		}

		lines.pop();
	}

	lines.push(bracket as string);

	return lines.join('\n');
}