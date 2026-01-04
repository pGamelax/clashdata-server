CREATE TABLE "attacks" (
	"id" text PRIMARY KEY NOT NULL,
	"war_id" text NOT NULL,
	"player_id" text NOT NULL,
	"stars" integer NOT NULL,
	"destruction" integer NOT NULL,
	"attack_number" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "war_player_attack_unique" UNIQUE("war_id","player_id","attack_number")
);
--> statement-breakpoint
CREATE TABLE "clan" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tag" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clan_name_unique" UNIQUE("name"),
	CONSTRAINT "clan_tag_unique" UNIQUE("tag")
);
--> statement-breakpoint
CREATE TABLE "player" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tag" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "player_tag_unique" UNIQUE("tag")
);
--> statement-breakpoint
CREATE TABLE "war" (
	"id" text PRIMARY KEY NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"clan_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attacks" ADD CONSTRAINT "attacks_war_id_war_id_fk" FOREIGN KEY ("war_id") REFERENCES "public"."war"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attacks" ADD CONSTRAINT "attacks_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clan" ADD CONSTRAINT "clan_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "war" ADD CONSTRAINT "war_clan_id_clan_id_fk" FOREIGN KEY ("clan_id") REFERENCES "public"."clan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attacks_war_id_idx" ON "attacks" USING btree ("war_id");--> statement-breakpoint
CREATE INDEX "attacks_player_id_idx" ON "attacks" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "clan_user_id_idx" ON "clan" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "war_clan_id_idx" ON "war" USING btree ("clan_id");