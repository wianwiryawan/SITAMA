CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('staff', 'ketua', 'pimpinan');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('todo', 'doing', 'done');--> statement-breakpoint
CREATE TABLE "task_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"task_id" integer
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"status" "status" DEFAULT 'todo',
	"priority" "priority" DEFAULT 'medium',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" "role" DEFAULT 'staff',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;