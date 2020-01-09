
function makeDebtsArray(debt_name) {
  return [
    {
      id: 1,
      debt_name: 'First test debt!',
      debt_name_id: debt_name[0].id,
      folderid: folder[1].id,
      debt_amount: 25000
    },
    {
      id: 2,
      debt_name: 'Second test debt!',
      debt_name_id: debt_name[1].id,
      folderid: folder[3].id,
      debt_amount: 10000
    },
    {
      id: 3,
      debt_name: 'Third test debt!',
      debt_name_id: debt_name[2].id,
      folderid: folder[4].id,
      debt_amount: 50000
    },
    {
      id: 4,
      debt_name: 'Fourth test debt!',
      folderid: folder[5].id,
      debt_name_id: debt_name[3].id,
      debt_amount: 90
    },
  ]
}

function makeExpectedDebt(debt_name, folderid, debt_amount) {
  return {
    id: debt.id,
    folderid: debt.folderid,
    debt_amount: debt.debt_amount,
    debt_name: debt.debt_name,
  }
}



function makeExpectedDebtAmounts(debt_name, debtId, debt_amount) {
  const expectedDebtAmounts = debt_amounts
    .filter(debt_amount => debt_amount.debt_id === debtId)

  return expectedDebtAmounts.map(debtAmount => {
    return {
      id: debt_amount.id,
      debt_name: debt.debt_name,
      debt_amount: debt.debt_amount
    }
  })
}

function makeMaliciousDebt(debt_name) {
  const maliciousDebt = {
    id: 911,
    debt_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    folderid: debt.folderid,
    debt_amount: `Bad debts <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedDebt = {
    ...makeExpectedDebt([debt_name], maliciousDebt),
    debt_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    folderid: debt.folderid,
    debt_amount: `Bad debts <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousDebt,
    expectedDebt,
  }
}

function makeDebtsFixtures() {
  const testNames = makeNamesArray()
  const testDebts = makeDebtsArray(testNames)
  const testAmounts = makeAmountsArray(testNames, testDebts)
  return { testNames, testDebts, testAmounts }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
        debts,
        debt_name,
        debt_amount,
        RESTART IDENTITY CASCADE`
  )
}

function seedDebtsTables(db, debt_name, folderid, debt_amount) {
  return db
    .into('debt_name')
    .insert(debt_name)
    .into('folderid')
    .insert(folderid)
    .into('debt_amount')
    .insert(debt_amount)
    .then(() =>
      db
        .into('debts')
        .insert(debts)
    )
    .then(() =>
      debts.length && db.into('debts').insert(debts)
    )
}

function seedMaliciousDebt(db, debt_name, debt_amount) {
  return db
    .into('debt_name')
    .insert([debt_name])
    .into('folderid')
    .insert(folderid)
    .into('debt_amount')
    .insert(debt_amount)
    .then(() =>
      db
        .into('debts')
        .insert([debt])
    )
}

module.exports = {
  makeDebtsArray,
  makeExpectedDebt,
  makeExpectedDebtAmounts,
  makeMaliciousDebt,
  makeDebtsFixtures,
  cleanTables,
  seedDebtsTables,
  seedMaliciousDebt,
}