create table debts (
	id INTEGER primary key generated by default as identity,
	folderId INTEGER not null,
	debt_name text not null,
    debt_amount INTEGER not null
	)