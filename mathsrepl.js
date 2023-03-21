const { input } = require("./input")
const { solve } = require("./solver")

const helpText = `Help Page

help    - Open the Help Page 
?       - same as help
clear   - clear the teriminal
cls     - same as clear
quit    - exit the menu
q       - same as quit
version - gives the version of the repl
ver     - same as version
`

const version = '1.0.0'

console.log('Welcome to Mathematics REPL (Read Evaluate Print Loop)\nCreated by Venger King\t\tVersion:', version)
console.log('Common commands:\n1. help - loads up a help screen\n2. quit - exit the program')

const repl = async () => {
    while (true) {
        let userinput = (await input('>> ', 'utf-8')).toLowerCase()
        if (!userinput || userinput == 'quit' || userinput[0] == 'q') {
            break
        }

        switch (userinput) {
            case 'help':
            case '?':
                console.log(helpText)
                break
            case 'cls':
            case 'clear':
                console.clear()
                break
            case 'version':
            case 'ver':
                console.log(version)
                break
            default:
                let output = solve(userinput)

                if (output.type == 'error') {
                    console.log(`${userinput.slice(0, output.value.col)}\x1b[31m${output.value.value}\x1b[0m${userinput.slice(output.value.col + output.value.length)}`)
                    console.log(`${' '.repeat(output.value.col)}\x1b[31m${'^'.repeat(output.value.length)}\x1b[0m`)
                    console.log(`${output.value.type}: ${output.value.reason}`)
                } else {
                    console.log(output.value)
                }
                break
        }
    }

    return 0
}

repl()