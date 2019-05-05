\set VERBOSITY terse

-- Should fail.
select deactivate_email_safe(
  (select distinct account_id from account_email where email = 'new@example.com')
  , 'new@example.com'
);

-- Create a new email so we can deactive it.
with x as (
  select create_account_email(
    (select distinct account_id from account_email where email = 'recipetest@example.com')
    , 'newemailtodeactivate@example.com'
    , true
  )
) select 'yes' as result from x;

-- Should succeed.
select deactivate_email_safe(
  (select distinct account_id from account_email where email = 'newemailtodeactivate@example.com')
  , 'newemailtodeactivate@example.com'
);

select email, email_active from account_email where email = 'newemailtodeactivate@example.com';
