import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * This repo is the FRONTEND. Per NEXTJS_MIGRATION.md §1.5 it must never import
 * a database driver, hold DATABASE_URL, or contain SQL — the API service owns
 * the schema and every query. That boundary is only real if it fails CI rather
 * than code review, which is what this list is for.
 */
const DB_PACKAGES = [
  "pg",
  "pg-native",
  "postgres",
  "drizzle-orm",
  "drizzle-kit",
  "@prisma/client",
  "prisma",
  "mysql2",
  "better-sqlite3",
  "knex",
  "typeorm",
  "sequelize",
];

const NO_DB_MESSAGE =
  "The frontend must not talk to the database directly. Call the API service instead — see NEXTJS_MIGRATION.md §1.5.";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: DB_PACKAGES.map((name) => ({ name, message: NO_DB_MESSAGE })),
          patterns: [
            {
              group: DB_PACKAGES.map((name) => `${name}/*`),
              message: NO_DB_MESSAGE,
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
