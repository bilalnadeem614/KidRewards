import Database from 'better-sqlite3';
import { Task } from './types';

const db = new Database('kidrewards.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS kids (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    points INTEGER NOT NULL,
    assignedTo TEXT NOT NULL,
    category TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    recurrence TEXT DEFAULT 'none',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const kidsCount = db.prepare('SELECT count(*) as count FROM kids').get() as { count: number };
if (kidsCount.count === 0) {
  const insertKid = db.prepare('INSERT INTO kids (id, name, points, avatar) VALUES (?, ?, ?, ?)');
  insertKid.run('bilal', 'Bilal', 1250, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI9cXXtMxjVeAfnz5JXs2p4Vq_NYrlcwzynCTUpcA1CPFVuvFBklD2iS522CcuZJtjdY5RQoKiiT4F6qlqJ6GfpeTyASe7K_DceBilPKdkwpn8cKmmOVgQe-zi_nlGYolJIEa_1x0NZmaFQjqWir5eEgBfEU2A4z9IIra9ORUAv9w0cz1uXwLC0m0ufFY12k6Mx2RXUOuzJX1RU_rle4-JmQgHO7aJXnmMpkEvPTnUgKUAaOTlvL6koTpqEmWlMCXlmoNLRoU6Ixxo');
  insertKid.run('zainab', 'Zainab', 800, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy_NNTnd9aoBz5zSGHma69BM6R23uy9a7DJBuOLiOwxR8KFkVdycFyvUFUKFC2HB-V_5pn5Y_SY2PCp6Tn366CMWY7TEloJXwQC9y6Yz-G6DTbxGEIDKvois4Skn3KMNIsrimSJ_IMR0TH48Dl98iL0y1L0wQckrDPK2GBiC5y4o7xX1Ygt_yXx3-nEOOcvamUIn17z3YGO57HqtSwdYkeEpe9Maw74iDadj2IvHhheP1BxA6Vyqqs0aYpcn6DytCRLscYDRApn1M0');

  const insertTask = db.prepare('INSERT INTO tasks (title, points, assignedTo, category, recurrence) VALUES (?, ?, ?, ?, ?)');
  insertTask.run('Clean room', 20, 'bilal', 'Daily Routine', 'daily');
  insertTask.run('Read for 30 mins', 15, 'zainab', 'Education', 'daily');
  insertTask.run('Help with dinner', 10, 'bilal', 'Social', 'daily');
}

export default db;
