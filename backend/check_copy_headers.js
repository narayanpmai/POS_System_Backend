const fs = require('fs');
const readline = require('readline');

async function checkHeaders() {
  const filePath = 'd:/POS_Production/koselighar-backend/backups/smartpos_backup_2026-07-26_21-55-47.sql';

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.startsWith('COPY public.')) {
      console.log(line);
    }
  }
}

checkHeaders().catch(console.error);
