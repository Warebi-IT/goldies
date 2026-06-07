alter table trips add column if not exists lat double precision default null;
alter table trips add column if not exists lng double precision default null;
