import fs from 'fs/promises';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const EMAIL_QUEUE_FILE = path.join(DB_DIR, 'email_jobs.json');

async function ensureQueueFile() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    try {
      await fs.access(EMAIL_QUEUE_FILE);
    } catch (_) {
      await fs.writeFile(EMAIL_QUEUE_FILE, JSON.stringify([]), 'utf8');
    }
  } catch (err) {
    console.warn('Failed to ensure email queue file:', err);
  }
}

export async function pushEmailJob(job: any) {
  try {
    await ensureQueueFile();
    const raw = await fs.readFile(EMAIL_QUEUE_FILE, 'utf8');
    const arr = JSON.parse(raw || '[]');
    arr.push(job);
    await fs.writeFile(EMAIL_QUEUE_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to push email job:', err);
  }
}

export async function readEmailJobs() {
  try {
    await ensureQueueFile();
    const raw = await fs.readFile(EMAIL_QUEUE_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Failed to read email jobs:', err);
    return [];
  }
}

export default { pushEmailJob, readEmailJobs };
