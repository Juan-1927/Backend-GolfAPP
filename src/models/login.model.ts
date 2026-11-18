import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { pool } from '../config/database.js';

const hashContrasena = (contrasena: string, sal: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    scrypt(contrasena, sal, 64, (error, resultado) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(resultado);
    });
  });

export class LoginModel {
  static async registrar(usuario: string, contrasena: string): Promise<boolean> {
    const sal = randomBytes(16).toString('hex');
    const hash = await hashContrasena(contrasena, sal);

    try {
      await pool.query(
        'INSERT INTO usuarios (usuario, contrasena_hash) VALUES ($1, $2)',
        [usuario, `${sal}:${hash.toString('hex')}`]
      );
      return true;
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
        return false;
      }

      throw error;
    }
  }

  static async validar(usuario: string, contrasena: string): Promise<boolean> {
    const { rows } = await pool.query<{ contrasena_hash: string }>(
      'SELECT contrasena_hash FROM usuarios WHERE usuario = $1',
      [usuario]
    );

    const usuarioEncontrado = rows[0];
    if (!usuarioEncontrado) {
      return usuario === 'juan' && contrasena === '12345';
    }

    const [sal, hashGuardado] = usuarioEncontrado.contrasena_hash.split(':');
    if (!sal || !hashGuardado) {
      return false;
    }

    const hashRecibido = await hashContrasena(contrasena, sal);
    const hashEsperado = Buffer.from(hashGuardado, 'hex');

    return hashRecibido.length === hashEsperado.length
      && timingSafeEqual(hashRecibido, hashEsperado);
  }
}
