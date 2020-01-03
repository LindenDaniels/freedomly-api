const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const DebtService = require('./debt-service')
const DebtRouter = express.Router()
const bodyParser = express.json()

const serializeDebt = debt => ({
  id: debt.id,
  folderid: debt.folderid,
  debt_name: xss(debt.debt_name),
  debt_amount: xss(debt.debt_amount),
})

DebtRouter
.route('/')

.get((req, res, next) => {
    DebtService.getAllDebts(req.app.get('db'))
    .then(debt => {
        res.json(debt.map(serializeDebt))
    })
    .catch(next)
})

.post(bodyParser, (req, res, next) => {
  const { folderid, debt_name, debt_amount } = req.body;
  const newDebt = { folderid, debt_name, debt_amount }

for (const field of ['debt_name', 'folderid', 'debt_amount']) {
  if (!newDebt[field]) {
    logger.error(`${field} is required`)
    return res.status(400).send({
      error: { message: `Field '${field}' is required` }
    })
  }
}

DebtService.insertDebt(
  req.app.get('db'),
  newDebt
)
  .then(debt => {
    logger.info(`Debt with id ${debt.id} created.`)
    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `${debt.id}`))
      .json(serializeDebt(debt))
  })
  .catch(next)

})

DebtRouter
  .route('/:debt_id')

  .all((req, res, next) => {
    const { debt_id } = req.params
    DebtService.getById(req.app.get('db'), debt_id)
      .then(debt => {
        if (!debt) {
          logger.error(`Debt with id ${debt} not found.`)
          return res.status(404).json({
            error: { message: `Debt Not Found` }
          })
        }

        res.debt = debt
        next()
      })
      .catch(next)

  })

  .get((req, res) => {
    res.json(serializeDebt(res.debt))
  })

  .delete((req, res, next) => {
    const { debt_id } = req.params
    DebtService.deleteDebt(
      req.app.get('db'),
      debt_id
    )
      .then(numRowsAffected => {
        logger.info(`Debt with id ${debt_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(bodyParser, (req, res, next) => {
    const { debt_name, folderid, debt_amount,  } = req.body
    const debtToUpdate = { debt_name, folderid, debt_amount }
    const numberOfValues = Object.values(debtToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`)
      return res.status(400).json({
        error: {
          message: `Request body must contain fields debt_name, debt_amount, and .`
        }
      })
    }

    DebtService.updateDebt(
      req.app.get('db'),
      req.params.debt_id,
      debtToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })


module.exports = DebtRouter