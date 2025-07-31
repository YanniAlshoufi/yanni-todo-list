#!/usr/bin/env node

import { createClient } from "@libsql/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the SQLite database
const dbPath = path.join(__dirname, "..", "db.sqlite");

// Initialize database connection
const client = createClient({ url: `file:${dbPath}` });

// Sample todo titles
const todoTitles = [
  "Buy groceries for the week",
  "Complete project documentation",
  "Schedule dentist appointment",
  "Read 30 pages of current book",
  "Call mom and catch up",
  "Organize desk workspace",
  "Backup computer files",
  "Plan weekend hiking trip",
  "Update resume and LinkedIn profile",
  "Research vacation destinations",
  "Fix leaky kitchen faucet",
  "Meal prep for next week",
  "Practice guitar for 30 minutes",
  "Review monthly budget",
  "Clean out email inbox",
  "Water indoor plants",
  "Write thank you notes",
  "Sort through old photos",
  "Learn 10 new vocabulary words",
  "Do laundry and fold clothes",
  "Research online courses",
  "Plan birthday party for friend",
  "Update emergency contact list",
  "Donate unused clothing",
  "Check tire pressure on car",
  "Organize spice rack",
  "Create workout playlist",
  "Set up automatic bill payments",
  "Research home security systems",
  "Plan garden for spring",
  "Update insurance policies",
  "Learn new recipe and cook it",
  "Schedule car maintenance",
  "Declutter bedroom closet",
  "Write in journal for 15 minutes",
  "Research investment options",
  "Plan date night activities",
  "Update social media profiles",
  "Create digital photo album",
  "Research local volunteering opportunities"
];

async function main() {
  try {
    console.log("🚀 Starting to create test todos...");

    // Get all users from the database
    const usersResult = await client.execute("SELECT DISTINCT userId FROM web_todos WHERE userId IS NOT NULL");
    const users = usersResult.rows;
    
    if (users.length === 0) {
      console.log("❌ No users found in the database. Please create some todos first through the app.");
      process.exit(1);
    }

    console.log(`📋 Found ${users.length} user(s) in the database`);

    // Create todos for each user
    for (const user of users) {
      const userId = String(user.userId);
      console.log(`👤 Creating todos for user: ${userId}`);

      // Generate between 30-40 todos per user
      const todoCount = Math.floor(Math.random() * 11) + 30; // 30-40 todos
      const shuffledTitles = [...todoTitles].sort(() => Math.random() - 0.5);

      for (let i = 0; i < todoCount; i++) {
        const title = shuffledTitles[i % shuffledTitles.length];
        const isDone = Math.random() < 0.3; // 30% chance of being done
        
        // Generate random creation date within the last 30 days
        const now = Date.now() / 1000; // Unix timestamp in seconds
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
        const createdAt = Math.floor(Math.random() * (now - thirtyDaysAgo)) + thirtyDaysAgo;

        try {
          await client.execute({
            sql: `INSERT INTO web_todos (userId, title, isDone, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
            args: [String(userId), `${title} #${i + 1}`, isDone ? 1 : 0, createdAt, null]
          });
        } catch (error) {
          console.error(`❌ Error creating todo for user ${userId}:`, error);
        }
      }

      console.log(`✅ Created ${todoCount} todos for user ${userId}`);
    }

    // Count total todos created
    const totalResult = await client.execute("SELECT COUNT(*) as count FROM web_todos");
    const totalTodos = totalResult.rows[0];
    console.log(`\n🎉 Script completed successfully!`);
    console.log(`📊 Total todos in database: ${totalTodos?.count ?? 'unknown'}`);

  } catch (error) {
    console.error("❌ Error running script:", error);
    process.exit(1);
  } finally {
    client.close();
  }
}

main();
