const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'winnerboys';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash du mot de passe "winnerboys":');
  console.log(hash);
}

hashPassword().catch(console.error);
