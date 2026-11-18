import { type Request, type Response } from 'express';
import { LoginModel } from '../models/login.model.js';

export const iniciarSesion = async (req: Request, res: Response) => {
  const { usuario, contrasena } = req.body;

  if (typeof usuario !== 'string' || typeof contrasena !== 'string' || !usuario.trim() || !contrasena) {
    return res.status(400).json({
      message: 'El usuario y la contraseña son obligatorios'
    });
  }

  const valido = await LoginModel.validar(usuario, contrasena);

  if (!valido) {
    return res.status(401).json({
      message: 'Usuario o contraseña incorrectos'
    });
  }

  res.json({
    message: 'Inicio de sesión correcto',
    usuario
  });
};

export const registrarUsuario = async (req: Request, res: Response) => {
  const { usuario, contrasena } = req.body;

  if (typeof usuario !== 'string' || typeof contrasena !== 'string' || !usuario.trim() || !contrasena) {
    return res.status(400).json({
      message: 'El usuario y la contraseña son obligatorios'
    });
  }

  const registrado = await LoginModel.registrar(usuario.trim(), contrasena);

  if (!registrado) {
    return res.status(409).json({
      message: 'El usuario ya está registrado'
    });
  }

  return res.status(201).json({
    message: 'Registro correcto',
    usuario: usuario.trim()
  });
};
