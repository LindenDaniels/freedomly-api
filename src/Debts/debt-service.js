const xss = require('xss')
const Treeize = require('treeize')

const DebtService = {
  getAllDebts(db) {
    return db
      .from('debts')
      .select(
        'debts.id',
        'debts.folderid',
        'debts.debt_name',
        'debts.debt_amount',
      )

  },

  getById(db, id) {
    return DebtService.getAllDebts(db)
      .where('debts.id', id)
      .first()
  },

  insertDebt(knex, newDebt) {
    return knex
      .insert(newDebt)
      .into('debts')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  deleteDebt(knex, id) {
    return knex('debts')
      .where({ id })
      .delete();
  },

  updateDebt(knex, id, newDebtFields) {
    return knex('debts')
      .where({ id })
      .update(newDebtFields);
  },


  serializeDebts(debts) {
    return debts.map(this.serializeDebt)
  },

  serializeDebt(debt) {
    const debtTree = new Treeize()

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const debtData = debtTree.grow([debt]).getData()[0]

    return {
      id: debtData.id,
      folderid: debtData.folderid,
      name: xss(debtData.debt_name),
      amount: xss(debtData.debt_amount),
    }
  },
}


module.exports = DebtService