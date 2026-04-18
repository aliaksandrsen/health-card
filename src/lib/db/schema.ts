import {
	boolean,
	index,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
	"users",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull(),
		emailVerified: boolean("email_verified").notNull().default(false),
		image: text("image"),
		createdAt: timestamp("created_at", {
			mode: "date",
			precision: 3,
		})
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", {
			mode: "date",
			precision: 3,
		})
			.notNull()
			.$onUpdate(() => new Date()),
		password: text("password"),
	},
	(table) => [uniqueIndex("users_email_key").on(table.email)],
);

export const sessions = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at", {
			mode: "date",
			precision: 3,
		}).notNull(),
		token: text("token").notNull(),
		createdAt: timestamp("created_at", {
			mode: "date",
			precision: 3,
		})
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", {
			mode: "date",
			precision: 3,
		})
			.notNull()
			.$onUpdate(() => new Date()),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: integer("user_id")
			.notNull()
			.references(() => users.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
	},
	(table) => [
		uniqueIndex("session_token_key").on(table.token),
		index("session_user_id_idx").on(table.userId),
	],
);

export const accounts = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: integer("user_id")
			.notNull()
			.references(() => users.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at", {
			mode: "date",
			precision: 3,
		}),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
			mode: "date",
			precision: 3,
		}),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at", {
			mode: "date",
			precision: 3,
		})
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", {
			mode: "date",
			precision: 3,
		})
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("account_provider_account_key").on(
			table.providerId,
			table.accountId,
		),
		index("account_user_id_idx").on(table.userId),
	],
);

export const verifications = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at", {
			mode: "date",
			precision: 3,
		}).notNull(),
		createdAt: timestamp("created_at", {
			mode: "date",
			precision: 3,
		})
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", {
			mode: "date",
			precision: 3,
		})
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const visits = pgTable("visits", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "restrict",
			onUpdate: "cascade",
		}),
	createdAt: timestamp("created_at", {
		mode: "date",
		precision: 3,
	})
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", {
		mode: "date",
		precision: 3,
	})
		.notNull()
		.$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type Visit = typeof visits.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
