ALTER TABLE "clan" RENAME TO "clans";--> statement-breakpoint
ALTER TABLE "player" RENAME TO "players";--> statement-breakpoint
ALTER TABLE "war" RENAME TO "wars";--> statement-breakpoint
ALTER TABLE "clans" DROP CONSTRAINT "clan_name_unique";--> statement-breakpoint
ALTER TABLE "clans" DROP CONSTRAINT "clan_tag_unique";--> statement-breakpoint
ALTER TABLE "players" DROP CONSTRAINT "player_tag_unique";--> statement-breakpoint
ALTER TABLE "attacks" DROP CONSTRAINT "attacks_war_id_war_id_fk";
--> statement-breakpoint
ALTER TABLE "attacks" DROP CONSTRAINT "attacks_player_id_player_id_fk";
--> statement-breakpoint
ALTER TABLE "clans" DROP CONSTRAINT "clan_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "wars" DROP CONSTRAINT "war_clan_id_clan_id_fk";
--> statement-breakpoint
ALTER TABLE "attacks" ADD CONSTRAINT "attacks_war_id_wars_id_fk" FOREIGN KEY ("war_id") REFERENCES "public"."wars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attacks" ADD CONSTRAINT "attacks_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clans" ADD CONSTRAINT "clans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wars" ADD CONSTRAINT "wars_clan_id_clans_id_fk" FOREIGN KEY ("clan_id") REFERENCES "public"."clans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clans" ADD CONSTRAINT "clans_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "clans" ADD CONSTRAINT "clans_tag_unique" UNIQUE("tag");--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_tag_unique" UNIQUE("tag");