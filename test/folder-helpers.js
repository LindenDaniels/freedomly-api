
  function makeFoldersArray(folder_name) {
    return [
      {
        id: 1,
        folder_name: 'First test folder!',
        folderid: folder[1].id,
      },
      {
        id: 2,
        folder_name: 'Second test folder!',
        folderid: folder[2].id,
      },
      {
        id: 3,
        folder_name: 'Third test folder!',
        folderid: folder[3].id,
      },
      {
        id: 4,
        folder_name: 'Fourth test folder!',
        folderid: folder[4].id,
      },
    ]
  }

  function makeExpectedFolder(folder_name, folderId) {
    const expectedFolders = folders
      .filter(folder => folder.id === folderId)
  
    return expectedFolders.map(recipe => {
      const folderName = folder_name.find(folder_name => folder_name.id === folder.folder_name_id)
      return {
        id: recipe.id,
        folder_name: folder.folder_name,
        }
      })
    }
  
  function makeMaliciousFolder(folder_name) {
    const maliciousFolder = {
      id: 911,
      folder_name: 'Naughty naughty very naughty <script>alert("xss");</script> Bad folder_name <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
      folder_name_id: folder_name.id,
    }
    const expectedFolder = {
      ...makeExpectedFolder([folder_name], maliciousFolder),
      folder_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt; Bad folder_name <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
    }
    return {
      maliciousFolder,
      expectedFolder,
    }
  }
  
  function makeFoldersFixtures() {
    const testNames = makeNamesArray()
    const testFolders = makeFoldersArray(testNames)
    return { testNames, testFolders }
  }
  
  function cleanTables(db) {
    return db.raw(
      `TRUNCATE
        folders
        RESTART IDENTITY CASCADE`
    )
  }
  
  function seedFoldersTable(db, folder_name, folders, debtss=[]) {
    return db
      .into('folder_name')
      .insert(folder_name)
      .then(() =>
        db
          .into('folders')
          .insert(folders)
      )
      .then(() =>
        debts.length && db.into('folder_debts').insert(debts)
      )
  }
  
  function seedMaliciousFolder(db, folder_name, folder) {
    return db
      .into('folder_name')
      .insert([folder_name])
      .then(() =>
        db
          .into('folders')
          .insert([folder])
      )
  }
  
  module.exports = {
    makeFoldersArray,
    makeExpectedFolder,
    makeExpectedFolder,
    makeMaliciousFolder,
    makeFoldersFixtures,
    cleanTables,
    seedFoldersTable,
    seedMaliciousFolder,
  }