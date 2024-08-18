/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.addColumn('posts', {
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users'
        }
    });

    pgm.addColumn('comments', {
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users'
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropColumn('posts', 'user_id');
    pgm.dropColumn('comments', 'user_id');
};
