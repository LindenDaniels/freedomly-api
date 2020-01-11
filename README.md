<h1>Freedomly API</h1>

<a href="https://github.com/LindenDaniels/freedomly-app">Freedomly App</a>

<h2>Folders</h2>
<ul>
  <li>URL<br/>
    /folders
  </li>
  <li>Method:<br/>
    <code>GET</code>
  </li>
  <li>URL Params<br>
    None
  </li>
  <li>Data Params<br>
    None
  </li>
  <li>Success Response<br>
    Code: 200<br />
    Content: <code>[{"id":1,"folder_name":"Student Loans"},{"id":2,"folder_name":"Car Loans"},{"id":3,"folder_name":"Credit Cards"}]</code>
  </li>
  <li>Error Response<br>
    Code: 404 NOT FOUND<br />
    Content: <code>Cannot GET</code>
  </li>
  <li>Sample Call:
    <code>return fetch(`${config.API_ENDPOINT}/folders`, {<br>
      headers: {<br>
      },<br>
    })<br>
      .then(res => <br>
         (!res.ok)<br>
          ? res.json().then(e => Promise.reject(e))<br>
          : res.json()<br>
      )},</code>
  </li>
  <li>Method:<br/>
    <code>POST</code>
  </li>
  <li>URL Params<br>
    Required:<br/>
    <code>folder_id=[integer]</code><br/>
    <code>folder_name=[text]</code>
  </li>
  <li>Data Params<br>
    None
  </li>
  <li>Success Response<br>
    Code: 201<br />
    Content: <code>Folder with id ${folder.id} created.</code>
  </li>
  <li>Error Response<br>
    Code: 400<br />
    Content: <code>error: { message: `Missing ${field}.` }</code>
  </li>
  <li>Sample Call:
    <code>return fetch(`${config.API_ENDPOINT}/folders`, {<br>
      headers: {<br>
      },<br>
    })<br>
      .then(res => <br>
         (!res.ok)<br>
          ? res.json().then(e => Promise.reject(e))<br>
          : res.json()<br>
      )},</code>
  </li>
  </ul>
  <br/>
  
  <h3>Get Folders by ID</h3>
<ul>Gets recipes in a single folder.<br/>
  <li>URL<br/>
    /folders/:folder_Id
  </li>
  <li>Method:<br/>
    <code>GET</code>
  </li>
  <li>URL Params<br>
    Required:<br/>
    <code>folder_id=[integer]</code>
  </li>
  <li>Data Params<br>
    None
  </li>
  <li>Success Response<br>
    Code: 200<br />
    Content: <code>{"id":2,"folder_name":"Car Loans"}</code>
  </li>
  <li>Error Response<br>
    Code: 404 NOT FOUND<br />
    Content: <code>Folder with id ${folder} not found.</code>
  </li>
  <li>Sample Call:
    <code>return fetch(`${config.API_ENDPOINT}/folders/${folder_id}`, {
      headers: {
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )},}</code>
  </li>
  
  <h2>Debts</h2>
<ul>
  <li>URL<br/>
    /debts
  </li>
  <li>Method:<br/>
    <code>GET</code>
  </li>
  <li>URL Params<br>
    None
  </li>
  <li>Data Params<br>
    None
  </li>
  <li>Success Response<br>
    Code: 200<br />
    Content: <code>[{"id":1,"folderid":1,"debt_name":"Sallie Mae","debt_amount":100000},{"id":2,"folderid":2,"debt_name":"Toyota","debt_amount":55000}</code>
  </li>
  <li>Error Response<br>
    Code: 404 NOT FOUND<br />
    Content: <code>Cannot GET</code>
  </li>
  <li>Sample Call:
    <code>return fetch(`${config.API_ENDPOINT}/debts`, {<br>
      headers: {<br>
      },<br>
    })<br>
      .then(res => <br>
         (!res.ok)<br>
          ? res.json().then(e => Promise.reject(e))<br>
          : res.json()<br>
      )},</code>
  </li>
  <li>Method:<br/>
    <code>POST</code>
  </li>
  <li>URL Params<br>
    Required:<br/>
    <code>folderid=[integer]</code><br/>
    <code>debt_name=[text]</code><br/>
    <code>debt_amount=[number]</code><br/>
  </li>
  <li>Data Params<br>
    None
  </li>
  <li>Success Response<br>
    Code: 201<br />
    Content: <code>Recipe with id ${debt.id} created.</code>
  </li>
  <li>Error Response<br>
    Code: 400<br />
    Content: <code>error: { message: `Field '${field}' is required` }</code>
  </li>
  <li>Sample Call:
    <code>return fetch(`${config.API_ENDPOINT}/debts`, {<br>
      headers: {<br>
      },<br>
    })<br>
      .then(res => <br>
         (!res.ok)<br>
          ? res.json().then(e => Promise.reject(e))<br>
          : res.json()<br>
      )},</code>
  </li>
  </ul>
  <br/>
  
  <h3>Get Debt by ID</h3>
<ul>Get a single debt.<br/>
  <li>URL<br/>
    /folders/:debt_id
  </li>
  <li>Method:<br/>
    <code>GET</code>
  </li>
  <li>URL Params<br>
    Required:<br/>
    <code>debt_id=[integer]</code>
  </li>
  <li>Data Params<br>
    None
  </li>
  <li>Success Response<br>
    Code: 200<br />
    Content: <code>{"id":3,"folderid":3,"debt_name":"New Computer","debt_amount":2500}</code>
  </li>
  <li>Error Response<br>
    Code: 404 NOT FOUND<br />
    Content: <code>Debt with id ${debt.id} not found.</code>
  </li>
  <li>Sample Call:
    <code>return fetch(`${config.API_ENDPOINT}/debts/${debt_id}`, {
      headers: {
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )},}</code>
  </li>
  
Technology Used: Node, Express

