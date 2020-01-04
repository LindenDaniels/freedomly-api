function makeFoldersArray() {
    return [
      {
        id: 1,
        folder_name: 'Car Loans',
      },
      {
        id: 2,
        folder_name: 'Home Loans',
      },
      {
        id: 3,
        folder_name: 'Credit Cards',
      },
      {
        id: 4,
        folder_name: 'Student Loans',
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