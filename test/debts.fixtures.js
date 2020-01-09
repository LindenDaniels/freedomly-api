function makeDebtsArray() {
  return [
    {
      id: 1,
      folderid: 4,
      debt_name: 'Sallie Mae',
      debt_amount: 40394,
    },
    {
      id: 2,
      folderid: 2,
      debt_name: 'Frannie Mae',
      debt_amount: 60,
    },
    {
      id: 3,
      folderid: 5,
      debt_name: 'Car Loan',
      debt_amount: 24000,
    },
    {
      id: 4,
      folderid: 1,
      debt_name: 'Mortgage',
      debt_amount: 160000,
    },
  ];
}

function makeMaliciousDebt() {
  const maliciousDebt = {
    id: 911,
    folderid: 5,
    debt_name: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    debt_amount: 0,
  }
  const expectedDebt = {
    ...maliciousDebt,
    debt_name: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    debt_amount: 0,
  }
  return {
    maliciousDebt,
    expectedDebt,
  }
}

module.exports = {
  makeDebtsArray,
  makeMaliciousDebt,
}