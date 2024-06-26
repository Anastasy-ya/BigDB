# BigDB
_Изучение облачной базы данных и синтаксиса postgresql_

TypeScript - Nest.js - TypeORM - node-postgres

## Сервис работает с таблицей users размером 1млн и выше. Считает количество пользователей с "problems: true" и выставляет всем пользователям флаг "false"

## Ссылки

https://github.com/Anastasy-ya/postgresqlProject
<br>
https://github.com/Anastasy-ya/history-log-users-server
<br>
https://github.com/Anastasy-ya/BigDB
<br>

## Используется облачная база данных postgresql neon.tech

_Для подключения необходим .env файл в корневой директории приложения:_

```
USER=<your_login>

HOST=<your-host>

DATABASE=<db-name>

PASSWORD=<password>

PORT=3000
```


Строка, содержащая данные для подключения, располагается в Dashboard панели управления

```
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
           ^    ^         ^                                               ^
     role -|    |         |- hostname                                     |- database
                |
                |- password

```

[Документация](https://neon.tech/docs/get-started-with-neon/connect-neon "Переход на сайт neon.tech")

### Скрипт для создания SQL-таблицы и заполнения ее рандомными значениями: 

```
CREATE TABLE persons (
    id SERIAL PRIMARY KEY,
    first_name CHAR(3) NOT NULL,
    last_name CHAR(3) NOT NULL,
    age INT CHECK (age BETWEEN 18 AND 100),
    gender CHAR(1) CHECK (gender IN ('m', 'f')),
    problems BOOLEAN
);

CREATE OR REPLACE FUNCTION random_string(length INT) RETURNS TEXT AS $$
DECLARE
    result TEXT := '';
    i INT;
BEGIN
    FOR i IN 1..length LOOP
        result := result || CHR(65 + FLOOR(RANDOM() * 26)::INT);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION random_age() RETURNS INT AS $$
BEGIN
    RETURN FLOOR(RANDOM() * 83) + 18;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION random_gender() RETURNS CHAR(1) AS $$
BEGIN
    RETURN CASE WHEN RANDOM() < 0.5 THEN 'm' ELSE 'f' END;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION random_problems() RETURNS BOOLEAN AS $$
BEGIN
    RETURN RANDOM() < 0.5;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_random_person(num_users INT) RETURNS VOID AS $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..num_users LOOP
        INSERT INTO persons (first_name, last_name, age, gender, problems)
        VALUES (random_string(3), random_string(3), random_age(), random_gender(), random_problems());
    END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT insert_random_person(1000);

```

### Скрипт для создания SQL-таблицы с большим количеством полей и заполнения ее рандомными значениями: 

```
-- Создание таблицы users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name CHAR(3) NOT NULL,
    last_name CHAR(3) NOT NULL,
    age INT CHECK (age BETWEEN 18 AND 100),
    gender CHAR(1) CHECK (gender IN ('m', 'f')),
    problems BOOLEAN
);

-- Функция для генерации случайной строки заданной длины
CREATE OR REPLACE FUNCTION random_string(length INT) RETURNS TEXT AS $$
DECLARE
    result TEXT := '';
    i INT;
BEGIN
    FOR i IN 1..length LOOP
        result := result || CHR(65 + FLOOR(RANDOM() * 26)::INT);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Функция для генерации случайного возраста
CREATE OR REPLACE FUNCTION random_age() RETURNS INT AS $$
BEGIN
    RETURN FLOOR(RANDOM() * 83) + 18;
END;
$$ LANGUAGE plpgsql;

-- Функция для генерации случайного пола
CREATE OR REPLACE FUNCTION random_gender() RETURNS CHAR(1) AS $$
BEGIN
    RETURN CASE WHEN RANDOM() < 0.5 THEN 'm' ELSE 'f' END;
END;
$$ LANGUAGE plpgsql;

-- Функция для генерации случайного значения для проблемы
CREATE OR REPLACE FUNCTION random_problems() RETURNS BOOLEAN AS $$
BEGIN
    RETURN RANDOM() < 0.5;
END;
$$ LANGUAGE plpgsql;

-- Функция для вставки случайного пользователя
CREATE OR REPLACE FUNCTION insert_random_person(num_users INT) RETURNS VOID AS $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..num_users LOOP
        INSERT INTO users (first_name, last_name, age, gender, problems)
        VALUES (random_string(3), random_string(3), random_age(), random_gender(), random_problems());
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Вставка пользователей
SELECT insert_random_person(1000);
```

### Cкрипт для создания связанной таблицы с историей изменения первой таблицы

```
CREATE TABLE person_changes (
  action_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  action_date TIMESTAMP NOT NULL,
  action VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES persons(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
```

## Запуск
git clone git@github.com:Anastasy-ya/postgresqlProject.git
<br>
cd bigdb
<br>
npm install
<br>
npm run build
npm start

## Проверка

### reset problems:
Возвраащает количество пользователей с Problems: true и меняет флаг на false

PATCH http://localhost:3000/users/reset-problems

### 404:

GET http://localhost:3000/404

## Планы по улучшению:
 - Написать тесты
 - Валидация входных значений при помощи express-validator
