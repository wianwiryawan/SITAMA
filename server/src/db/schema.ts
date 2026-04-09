import { pgTable, serial, text, varchar, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum untuk Status dan Priority (Sesuai kebutuhan SITAMA)
export const statusEnum = pgEnum('status', ['todo', 'doing', 'done']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);
export const roleEnum = pgEnum('role', ['staff', 'ketua', 'pimpinan']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('staff'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  status: statusEnum('status').default('todo'),
  priority: priorityEnum('priority').default('medium'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Tabel Jembatan Many-to-Many
export const taskAssignments = pgTable('task_assignments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  taskId: integer('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
});

// Relasi agar Query jadi gampang (Tanpa Join manual yang ribet)
export const usersRelations = relations(users, ({ many }) => ({
  assignments: many(taskAssignments),
}));

export const tasksRelations = relations(tasks, ({ many }) => ({
  assignees: many(taskAssignments),
}));