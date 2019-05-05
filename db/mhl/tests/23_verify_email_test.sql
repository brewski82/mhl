\set VERBOSITY terse

-- Add an email to an account. Save uuid into a temp table.
create temp table temp_uuid as select * from create_account_email
(
  (select min(account_id) from account where not account_deleted)
  , 'verify@example.com'
  , false
);

-- Should return zero due to bad account email id.
select verify_email
(
  (select min(account_email_id) from account_email)
  , (select uuid from temp_uuid)
);

-- Should return zero due to bad uuid;
select verify_email
(
  (select max(account_email_id) from account_email)
  , (select uuid from login order by login_id limit 1)
);

-- Should succeed, returning the account id.
with x as
(
  select verify_email
  (
    (select max(account_email_id) from account_email)
    , (select uuid from temp_uuid)
  )
)
select case when verify_email = 0 then 'fail' else 'success' end as result from x;
