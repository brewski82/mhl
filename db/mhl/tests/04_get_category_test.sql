select get_category('Frozen Foods');
select get_category('Deli');
select get_category('Meat/Poultry');

-- Non-existent category
select get_category('bad category');

-- NULL
select get_category(null::text);

select get_category(1);
select get_category(2);
select get_category(3);

-- Non-existent category
select get_category(1000);

-- NULL
select get_category(null::bigint);
