const inquirer = require('inquirer')
const chalk = require('chalk')

const fs = require('fs')

operation()

function operation() {

  inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'Oque você deseja fazer?',
    choices: ['Criar conta', 'Consultar saldo', 'Depositar', 'Sacar', 'Sair']
  }
]).then((answer => {
  const actions = answer['action']

  console.log(actions)

})).catch((error) => console.log(error))
}