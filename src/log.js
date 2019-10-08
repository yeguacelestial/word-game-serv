const chalk = require('chalk');

const bold = chalk.bold,
    keyword = chalk.keyboard,
    underline = chalk.underline;

const red = chalk.red,
    green = chalk.green,
    blue = chalk.blue,
    yellow = chalk.yellow;

const log = (...args) => console.log(...args);

module.exports = {
    info: (...args) => log(blue(...args)),
    infobold: (...args) => log(bold.blue(...args)),

    success: (...args) => log(green(...args)),
    successbold: (...args) => log(bold.green(...args)),

    error: (...args) => log(red(...args)),
    errorbold: (...args) => log(bold.red(...args)),

    warning: (...args) => log(yellow(...args)),
    warningbold: (...args) => log(bold.yellow(...args)),
}
