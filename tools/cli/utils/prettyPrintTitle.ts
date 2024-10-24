import chalk from "chalk";
import gradient from "gradient-string";

export default function prettyPrintTitle(title: string) {
  const openedxGradient = gradient(['#B82669', '#22358C'])

  const borderedTitle = `█ ${title} █`;

  const whitespace = Array.from({ length: borderedTitle.length }, () => '█').join('');

  console.log(chalk.bgWhite(openedxGradient(whitespace)));
  console.log(chalk.bold.bgWhite(openedxGradient(borderedTitle)));
  console.log(chalk.bgWhite(openedxGradient(whitespace)));
  console.log('');
}
