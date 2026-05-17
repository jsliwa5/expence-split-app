DROP TABLE IF EXISTS splits CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS expense_items CASCADE;
DROP TABLE IF EXISTS item_splits CASCADE;

CREATE TABLE expenses (
                          expense_id UUID PRIMARY KEY,
                          group_id UUID NOT NULL REFERENCES groups(group_id),
                          payer_id UUID NOT NULL REFERENCES user_entity(user_id),
                          description VARCHAR(255) NOT NULL,
                          total_amount DECIMAL(10, 2) NOT NULL,
                          created_at TIMESTAMP NOT NULL
);

CREATE TABLE expense_items (
                               item_id UUID PRIMARY KEY,
                               expense_id UUID NOT NULL REFERENCES expenses(expense_id) ON DELETE CASCADE,
                               name VARCHAR(255) NOT NULL,
                               price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE item_splits (
                             split_id UUID PRIMARY KEY,
                             item_id UUID NOT NULL REFERENCES expense_items(item_id) ON DELETE CASCADE,
                             debtor_id UUID NOT NULL REFERENCES user_entity(user_id),
                             amount DECIMAL(10, 2) NOT NULL
);