import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  applicantName: text("applicant_name").notNull(),
  fathersName: text("fathers_name").notNull(),
  gender: text("gender").notNull(),
  age: integer("age").notNull(),
  mobile: text("mobile").notNull(),
  emergencyContactNumber: text("emergency_contact_number").notNull(),
  emergencyContactName: text("emergency_contact_name").notNull(),
  villageTown: text("village_town").notNull(),
  postOffice: text("post_office").notNull(),
  policeStation: text("police_station").notNull(),
  district: text("district").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
