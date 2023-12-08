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
    }])
    .then((answer => {
      const actions = answer['action']

      if (actions == 'Criar conta') {
        createAccount()
      } else if (actions == 'Consultar saldo') {
        buscarSaldo()
      } else if (actions == 'Depositar') {
        depositar()
      } else if (actions == 'Sacar') {
        withdraw()
      } else if (actions == 'Sair') {
        console.log(chalk.bgBlue.black(`Obrigado por usar o account!`))
        process.exit()
      }

    }))
    .catch((error) => console.log(error))
}

function createAccount() {
  console.log(chalk.bgGreenBright.black(`Você acaba de criar uma conta, seja bem vindo!`))
  console.log(chalk.bgBlack.white.bold(`Prossiga para preenchimento dos dados complementares:`))

  buildAccount()
}

function buildAccount() {

  inquirer.prompt([{
      name: 'accountName',
      message: 'Digite o seu nome para criação da sua conta:'
    }])
    .then((answer) => {
      const accountName = answer['accountName']

      console.info(accountName)

      if (!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts')
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black(`Esta conta já existe`))
        buildAccount()
        return
      }

      fs.writeFileSync(`accounts/${accountName}.json`,
        '{"balance": 0}',
        (error) => console.log(error))

      console.log(chalk.bgGreenBright.black(`Parabéns, sua conta foi criada com sucesso!`))

      operation()

    })
    .catch((error) => console.log(error))
}

function depositar() {
  inquirer.prompt([{
    name: 'accountName',
    message: 'Qual é o nome da sua conta?'
  }]).then((answer) => {
    const accountName = answer['accountName']

    if (!checkAccount(accountName)) {
      return depositar()
    }

    inquirer.prompt([{
      name: 'amount',
      message: 'Quanto você deseja depositar?'
    }]).then((answer) => {
      const amount = answer['amount']

      addAmount(accountName, amount)
      operation()
    })
  }).catch((error) => console.log(error))
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black(`Está conta não existe, por favor tente novamente.`))
    return false
  }
  return true
}

function addAmount(accountName, amount) {

  const account = getAccount(accountName)
  if (!amount) {
    console.log(chalk.bgRed.black(`Ocorreu um erro, tente novamente mais tarde!`))
    return depositar()
  }

  account.balance = parseFloat(amount) + parseFloat(account.balance)

  fs.writeFileSync(`accounts/${accountName}.json`,
    JSON.stringify(account),
    (error) => {
      console.log(error)
    },

  )

  console.log(chalk.green(`Foi depositado R$${amount} na sua conta`))
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf-8',
    flag: 'r'
  })

  return JSON.parse(accountJSON)
}

function buscarSaldo() {
  inquirer.prompt(
    [{
      name: 'accountName',
      message: 'Qual o nome da sua conta?'
    }]
  ).then((answer) => {
    const accountName = answer['accountName']
    if (!checkAccount(accountName)) {
      return buscarSaldo()
    }

    const account = getAccount(accountName)

    console.log(chalk.bgBlue(`O saldo da sua conta é de $${account.balance}`))

    operation()
  })

}

function withdraw() {
  inquirer.prompt([{
    name: 'accountName',
    message: 'Qual é o nome da sua conta?'
  }]).then((answer) => {
    const accountName = answer['accountName']

    if (!checkAccount(accountName)) {
      return withdraw()
    }

    inquirer.prompt([{
      name: 'amount',
      message: 'Quanto você deseja sacar?'
    }]).then((answer) => {
      const amount = answer['amount']
      removeAmount(accountName, amount)
    })
  })
}

function removeAmount(accountName, amount) {

  const account = getAccount(accountName)

  if (!amount) {
    console.log(chalk.bgRed(`Ocorreu um erro, tente novamente mais tarde.`))
    return withdraw()
  }

  if (account.balance < amount) {
    console.log(chalk.bgRed(`Valor indisponível.`))
    return withdraw()
  }

  account.balance = parseFloat(account.balance) - parseFloat(amount)

  fs.writeFileSync(`accounts/${accountName}.json`,
    JSON.stringify(account),
    (error) => {
      console.log(error)
    })

  console.log(chalk.green(`Foi realizado um saque de $${amount} da sua conta!`))

  operation()
}