function makeFoldersArray() {
    return [
      {
        id: 1,
        folder_name: 'Breakfast',
      },
      {
        id: 2,
        folder_name: 'Lunch',
      },
      {
        id: 3,
        folder_name: 'Dinner',
      },
      {
        id: 4,
        folder_name: 'Dessert',
      },
    ];
  }
  
  function makeMaliciousFolder() {
    const maliciousFolder = {
      id: 911,
      folder_name: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad. Naughty naughty very naughty <script>alert("xss");</script>`,
    }
    const expectedFolder = {
      ...maliciousFolder,
      folder_name: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad. Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;`, 
    }
    return {
      maliciousFolder,
      expectedFolder,
    }
  }
  
  module.exports = {
    makeFoldersArray,
    makeMaliciousFolder,
  }