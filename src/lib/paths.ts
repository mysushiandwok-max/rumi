// Raíz de los datos que no viven en git (base de datos y fotos subidas).
// En producción apunta fuera de la carpeta de la app (DATA_DIR) para que un deploy no los borre.
export const DATA_ROOT = process.env.DATA_DIR || process.cwd();
