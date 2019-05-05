select account_id, account_deleted from account where account_id = 3;
select email, email_active from account_email where account_id = 3;

select deactivate_account(3);

select account_id, account_deleted from account where account_id = 3;
select email, email_active from account_email where account_id = 3;
