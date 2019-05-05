select create_account('test@example.com');

-- This should raise an error as two active accounts cannot share the
-- same email.
select create_account('test@example.com');

select create_account('test2@example.com');

-- Should raise an error due to bad account id.
select create_account_email(999, 'test3@example.com', true);

-- Should raise an error due to duplicate email.
select create_account_email
(
  (select min(account_id) from account)
  , 'test2@example.com'
  , true
);
select create_account_email
(
  (select min(account_id) from account)
  , 'test@example.com'
  , true
);

-- If we deactivate the email we should be able to add it to the other
-- account.
select deactivate_email
(
  (select max(account_id) from account)
  , 'test2@example.com'
);

with x as (
  select create_account_email
  (
    (select min(account_id) from account)
    , 'test2@example.com'
    , true
  )
)
select 'yes' as result from x;

-- Deactive the email again on the first account. We should be able to
-- add it back to the second account. The second account should have
-- two records with the same email, which is okay.
select deactivate_email
(
  (select min(account_id) from account)
  , 'test2@example.com'
);

with x as (
  select create_account_email
  (
    (select max(account_id) from account)
    , 'test2@example.com'
    , true
  )
)
select 'yes' as result from x;;

select account_id from account order by account;

select account_id, email, email_active from account_email order by account_id, email, email_active;
