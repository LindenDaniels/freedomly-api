const knex = require('knex')
const app = require('../src/App/app')
const { makeDebtsArray, makeMaliciousDebt } = require('./debts.fixtures')

describe('Debt Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('debts').truncate())

  afterEach('cleanup', () => db('debts').truncate())

  describe(`GET /api/debts`, () => {
    context(`Given no debts`, () => {
      it(`responds with 200 and an empty debt`, () => {
        return supertest(app)
          .get('/api/debts')
          .expect(200, [])
      })
    })

    context('Given there are debts in the database', () => {
      const testDebts = makeDebtsArray()

      beforeEach('insert debt', () => {
        return db
          .into('debts')
          .insert(testDebts)
      })

      it('responds with 200 and all of the debts', () => {
        return supertest(app)
          .get('/api/debts')
          .expect(200, testDebts)
      })
    })

    context(`Given an XSS attack debt`, () => {
      const { maliciousDebt, expectedDebt } = makeMaliciousDebt()

      beforeEach('insert malicious debt', () => {
        return db
          .into('debts')
          .insert([maliciousDebt])
      })

      it('removes XSS attack debt', () => {
        return supertest(app)
          .get(`/api/debts`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].debt_name).to.eql(expectedDebt.debt_name)
            expect(res.body[0].folderid).to.eql(expectedDebt.folderid)
            expect(res.body[0].debt_amount).to.eql(expectedDebt.debt_amount)
      })
    })
  })

  describe(`GET /api/debts/:debt_id`, () => {
    context(`Given no debts`, () => {
      it(`responds with 404`, () => {
        const debtId = 123456
        return supertest(app)
          .get(`/api/debts/${debtId}`)
          .expect(404, { error: { message: 'Debt Not Found' } })
      })
    })

    context('Given there are debts in the database', () => {
      const testDebts = makeDebtsArray()

      beforeEach('insert debts', () => {
        return db
          .into('debts')
          .insert(testDebts)
      })

      it('responds with 200 and the specified debt', () => {
        const debtId = 2
        const expectedDebt = testDebts[debtId - 1]
        return supertest(app)
          .get(`/api/debts/${debtId}`)
          .expect(200, expectedDebt)
      })
    })

    context(`Given an XSS attack debt`, () => {
      const { maliciousDebt, expectedDebt } = makeMaliciousDebt()

      beforeEach('insert malicious debt', () => {
        return db
          .into('debts')
          .insert([maliciousDebt])
      })

      it('removes XSS attack debt_amount', () => {
        return supertest(app)
          .get(`/api/debts/${maliciousDebt.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.debt_name).to.eql(expectedDebt.debt_name)
            expect(res.body.folderid).to.eql(expectedDebt.folderid)
            expect(res.body.debt_amount).to.eql(expectedDebt.debt_amount)
          })
      })
    })
  })

  describe(`POST /api/debts`, () => {
    it(`creates a debt, responding with 201 and the new debt`, () => {
      const newDebt = {
        debt_name: 'Test new debt',
        folderid: 2,
        debt_amount: '$800',
      }
      return supertest(app)
        .post('/api/debts')
        .send(newDebt)
        .expect(201)
        .expect(res => {
          expect(res.body.debt_name).to.eql(newDebt.debt_name)
          expect(res.body.debt_amount).to.eql(newDebt.debt_amount)
          expect(res.body).to.have.property('id')
          expect(res.body).to.have.property('folderid')
          expect(res.headers.location).to.eql(`/api/debts/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/debts/${res.body.id}`)
            .expect(res.body)
        )
    })

    const requiredFields = ['debt_name', 'folderid', 'debt_amount']

    requiredFields.forEach(field => {
      const newDebt = {
        debt_name: 'Test new debt',
        folderid: '2',
        debt_amount:
          '$4000',
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newDebt[field]

        return supertest(app)
          .post('/api/debts')
          .send(newDebt)
          .expect(400, {
            error: { message: `Field '${field}' is required` }
          })
      })
    })

    it('removes XSS attack debt_amount from response', () => {
      const { maliciousDebt, expectedDebt } = makeMaliciousDebt()
      return supertest(app)
        .post(`/api/debts`)
        .send(maliciousDebt)
        .expect(201)
        .expect(res => {
          expect(res.body.debt_name).to.eql(expectedDebt.debt_name)
          expect(res.body.folderid).to.eql(expectedDebt.folderid)
          expect(res.body.debt_amount).to.eql(expectedDebt.debt_amount)
        })
    })
  })

  describe(`DELETE /api/debts/:debt_id`, () => {
    context(`Given no debts`, () => {
      it(`responds with 404`, () => {
        const debtId = 123456
        return supertest(app)
          .delete(`/api/debts/${debtId}`)
          .expect(404, { error: { message: 'Debt Not Found' } })
      })
    })

    context('Given there are debts in the database', () => {
      const testDebts = makeDebtsArray()

      beforeEach('insert debts', () => {
        return db
          .into('debts')
          .insert(testDebts)
      })

      it('responds with 204 and removes the debt', () => {
        const idToRemove = 2
        const expectedDebts = testDebts.filter(debt => debt.id !== idToRemove)
        return supertest(app)
          .delete(`/api/debts/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/debts`)
              .expect(expectedDebts)
          )
      })
    })
  })

  describe(`PATCH /api/debts/:debt_id`, () => {
    context(`Given no debts`, () => {
      it(`responds with 404`, () => {
        const debtId = 123456
        return supertest(app)
          .delete(`/api/debts/${debtId}`)
          .expect(404, { error: { message: 'Debt Not Found' } }
          )
      })
    })

    context('Given there are debts in the database', () => {
      const testDebts = makeDebtsArray()

      beforeEach('insert debts', () => {
        return db
          .into('debts')
          .insert(testDebts)
      })

      it('responds with 204 and updates the debt', () => {
        const idToUpdate = 2
        const updateDebt = {
          debt_name: 'updated debt name',
          debt_amount:
            '$4000',
        }
        const expectedDebt = {
          ...testDebts[idToUpdate - 1],
          ...updateDebt
        }
        return supertest(app)
          .patch(`/api/debts/${idToUpdate}`)
          .send(updateDebt)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/debts/${idToUpdate}`)
              .expect(expectedDebt)
          )
      })

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/debts/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain fields debt name and debt amount`
            }
          })
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateDebt = {
          debt_name: 'updated debt name',
        }
        const expectedDebt = {
          ...testDebts[idToUpdate - 1],
          ...updateDebt
        }

        return supertest(app)
          .patch(`/api/debts/${idToUpdate}`)
          .send({
            ...updateDebt,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/debts/${idToUpdate}`)
              .expect(expectedDebt)
          )
      })
    })
  })
}
  )})