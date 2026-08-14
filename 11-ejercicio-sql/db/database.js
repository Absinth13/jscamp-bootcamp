"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var better_sqlite3_1 = require("better-sqlite3");
var db = new better_sqlite3_1.default('jobs.db');
exports.db = db;
db.pragma('journal_mode = WAL'); 
db.pragma('foreign_keys = ON'); 
