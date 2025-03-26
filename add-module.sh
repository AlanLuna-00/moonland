#!/bin/bash

# Verificar si se proporcionó un argumento
if [ $# -eq 0 ]; then
    echo "Por favor proporciona el nombre del módulo"
    echo "Uso: ./add-module.sh nombre-modulo"
    exit 1
fi

MODULE_NAME=$1

# Crear estructura de directorios
mkdir -p src/modules/$MODULE_NAME/{application,domain,infrastructure,components}

echo "✅ Módulo '$MODULE_NAME' creado exitosamente con la siguiente estructura:"
echo "
src/modules/$MODULE_NAME/
├── application/
├── domain/
├── infrastructure/
└── components/"

