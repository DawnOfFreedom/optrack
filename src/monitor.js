// Standalone Alert Monitor (without web server)
import 'dotenv/config';
import { startAlertMonitor } from './alerts.js';

console.log('═'.repeat(40));
console.log('  OPtrack Alert Monitor (Standalone)');
console.log('═'.repeat(40));

startAlertMonitor();
