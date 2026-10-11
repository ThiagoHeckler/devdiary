/**
 * Gera o hash da senha do admin para colocar em ADMIN_PASSWORD_HASH.
 * Uso: npm run hash-password  (a senha é pedida no terminal)
 */
import * as bcrypt from 'bcrypt';
import { createInterface } from 'node:readline/promises';

async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const password = await rl.question('Senha do admin (mínimo 12 caracteres): ');
  rl.close();

  if (password.length < 12) {
    throw new Error('Use uma senha com pelo menos 12 caracteres.');
  }
  const hash = await bcrypt.hash(password, 12);
  console.log(`\nADMIN_PASSWORD_HASH='${hash}'`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
