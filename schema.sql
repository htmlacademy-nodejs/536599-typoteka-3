DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS authors;

CREATE TABLE authors
(
	id SERIAL PRIMARY KEY,
	email VARCHAR(100) UNIQUE,
	firstname VARCHAR(100),
	surname VARCHAR(100),
	password VARCHAR(100),
	avatar BYTEA
);

CREATE TABLE comments
(
	id SERIAL PRIMARY KEY,
	create_date DATE,
	full_text VARCHAR(100),
	auth_id INTEGER,
	FOREIGN KEY (auth_id) REFERENCES authors (id)
		ON UPDATE CASCADE
		ON DELETE SET NULL
);

CREATE TABLE categories
(
	id SERIAL PRIMARY KEY,
	title VARCHAR(30)
);

CREATE TABLE articles
(
	id SERIAL PRIMARY KEY,
	title VARCHAR(250) NOT NULL,
	announce VARCHAR(250) NOT NULL,
	full_text VARCHAR(1000),
	create_date DATE,
	picture BYTEA,
	auth_id INTEGER,
	category_id INTEGER,
	comment_id INTEGER,
	FOREIGN KEY (auth_id) REFERENCES authors (id)
		ON UPDATE CASCADE
		ON DELETE SET NULL,
	FOREIGN KEY (category_id) REFERENCES categories (id)
		ON UPDATE CASCADE
		ON DELETE SET NULL,
	FOREIGN KEY (comment_id) REFERENCES comments (id)
		ON UPDATE CASCADE
		ON DELETE SET NULL
);
