import {
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
		emailVerified: timestamp("email_verified", {
			mode: "date",
			precision: 3,
		}),
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
		password: text("password").notNull(),
	},
	(table) => [uniqueIndex("users_email_key").on(table.email)],
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
