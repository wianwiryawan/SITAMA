import { pgTable, serial, text, varchar, integer, timestamp, pgEnum, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const statusEnum = pgEnum('status', ['todo', 'doing', 'done']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);
export const roleEnum = pgEnum('role', ['staff', 'ketua', 'pimpinan']);
export const typeEnum = pgEnum('type', ['rapat', 'perdin']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('staff'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  startDate: date('start_date').notNull(), // Format: YYYY-MM-DD
  endDate: date('end_date').notNull(),
  startTime: text('start_time').notNull(), // Format: HH:mm
  endTime: text('end_time').notNull(),
  location: text('location'),
  type: typeEnum('type').default('rapat'),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  status: statusEnum('status').default('todo'),
  priority: priorityEnum('priority').default('medium'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const taskAssignments = pgTable('task_assignments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  taskId: integer('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
});

export const usersRelations = relations(users, ({ many }) => ({
  assignments: many(taskAssignments),
}));

export const tasksRelations = relations(tasks, ({ many }) => ({
  assignees: many(taskAssignments),
}));

export const taskAssignmentsRelations = relations(taskAssignments, ({ one }) => ({
  user: one(users, {
    fields: [taskAssignments.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [taskAssignments.taskId],
    references: [tasks.id],
  }),
}));

export const eventParticipants = pgTable('event_participants', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
});

export const eventsRelations = relations(events, ({ many }) => ({
  participants: many(eventParticipants),
}));

export const eventParticipantsRelations = relations(eventParticipants, ({ one }) => ({
  event: one(events, {
    fields: [eventParticipants.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventParticipants.userId],
    references: [users.id],
  }),
}));

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  action: text('action').notNull(),
  feature: text('feature').notNull(),
  targetName: text('target_name').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
});