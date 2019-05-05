-- Login attempts should generate a random uuid. Since this may cause
-- problems when comparing test results to baseline files, save the
-- output into temp tables so it does not print to the screen.
create temp table login_tests (
  id int not null
  , email text not null
  , uuid uuid not null
);

-- Add a login record for an existing account.
insert into login_tests
select
  1
  , 'test@example.com'
  , create_login('test@example.com')
;

-- Add a login record for a new account.
insert into login_tests
select
  2
  , 'new@example.com'
  , create_login('new@example.com')
;

-- Add a login record and 'expire' the record.
insert into login_tests
select
  3
  , 'expire@example.com'
  , create_login('expire@example.com')
;
update login set login_exipred = login_exipred - interval '2 hours'
where email = 'expire@example.com';

-- Adding more than one login with the same email active at the same
-- time is allowed.
insert into login_tests
select
  4
  , '2@example.com'
  , create_login('2@example.com')
;
insert into login_tests
select
  5
  , '2@example.com'
  , create_login('2@example.com')
;


-- Test creating an account when the previous account has been
-- deactivated. If a user previously deactivated all emails associated
-- with their account, consider the account permenantly deleted with
-- no way to recover. If the user returns with the same email, they
-- will have a brand new account.
select create_account('deactivated@example.com');
select deactivate_email
(
  (select max(account_id) from account)
  , 'deactivated@example.com'
);
insert into login_tests
select
  6
  , 'deactivated@example.com'
  , create_login('deactivated@example.com')
;

-- First test should not create a new account.
select count(*) from account;
select get_or_create_account_from_login(
  (select uuid from login_tests where id = 1)
);
select count(*) from account;

-- Second test should create an account.
select get_or_create_account_from_login(
  (select uuid from login_tests where id = 2)
);
select count(*) from account;

-- Third test should not create an account as the login record
-- expired.
select get_or_create_account_from_login(
  (select uuid from login_tests where id = 3)
);
select count(*) from account;

-- These next two should only create one account as the login records
-- have the same email.
select get_or_create_account_from_login(
  (select uuid from login_tests where id = 4)
);
select count(*) from account;
select get_or_create_account_from_login(
  (select uuid from login_tests where id = 5)
);
select count(*) from account;

-- The last test should create a new account.
select get_or_create_account_from_login(
  (select uuid from login_tests where id = 6)
);
select count(*) from account;

select account_id, email, email_active from account_email order by account_id, email, email_active;
