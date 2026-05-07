-- 1. Użytkownicy
CREATE TABLE user_entity (
                             user_id UUID PRIMARY KEY,
                             first_name VARCHAR(255),
                             last_name VARCHAR(255),
                             username VARCHAR(255) UNIQUE NOT NULL
);

-- 2. Grupy
CREATE TABLE groups (
                        group_id UUID PRIMARY KEY,
                        name VARCHAR(255) NOT NULL
);

-- Tabela łącząca dla @ElementCollection (membersIds) w Group
CREATE TABLE group_members (
                               group_id UUID NOT NULL,
                               user_id UUID NOT NULL,
                               CONSTRAINT fk_group_members_group FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
                               CONSTRAINT fk_group_members_user FOREIGN KEY (user_id) REFERENCES user_entity(user_id) ON DELETE CASCADE
);

-- 3. Wydatki (Korzeń agregatu)
CREATE TABLE expenses (
                          expense_id UUID PRIMARY KEY,
                          payer_id UUID NOT NULL,
                          group_id UUID NOT NULL,
                          total_amount DECIMAL(10, 2) NOT NULL,
                          CONSTRAINT fk_expenses_group FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
                          CONSTRAINT fk_expenses_payer FOREIGN KEY (payer_id) REFERENCES user_entity(user_id)
);

-- Tabela dla @ElementCollection (items) w Expense
CREATE TABLE expense_items (
                               expense_id UUID NOT NULL,
                               name VARCHAR(255) NOT NULL,
                               price DECIMAL(10, 2) NOT NULL,
                               quantity DOUBLE PRECISION NOT NULL,
                               CONSTRAINT fk_expense_items_expense FOREIGN KEY (expense_id) REFERENCES expenses(expense_id) ON DELETE CASCADE
);

-- 4. Podziały rachunku (Encja wewnętrzna w Expense)
CREATE TABLE splits (
                        split_id UUID PRIMARY KEY,
                        expense_id UUID NOT NULL,
                        debtor_id UUID NOT NULL,
                        owed_amount DECIMAL(10, 2) NOT NULL,
                        type VARCHAR(50) NOT NULL,
                        CONSTRAINT fk_splits_expense FOREIGN KEY (expense_id) REFERENCES expenses(expense_id) ON DELETE CASCADE,
                        CONSTRAINT fk_splits_debtor FOREIGN KEY (debtor_id) REFERENCES user_entity(user_id)
);