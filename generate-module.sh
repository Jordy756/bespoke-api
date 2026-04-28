#!/bin/bash

# Validación básica
if [ -z "$1" ]; then
  echo "❌ Tenés que pasar el nombre del módulo"
  echo "👉 Ejemplo: ./generate-module.sh resume"
  exit 1
fi

MODULE_NAME=$1
BASE_PATH="src/modules/$MODULE_NAME"

echo "🚀 Creando módulo: $MODULE_NAME"

# Crear módulo y controller con Nest CLI
npx nest g module modules/$MODULE_NAME
npx nest g controller modules/$MODULE_NAME/infrastructure/http/controllers/$MODULE_NAME --no-spec

# --- ESTRUCTURA HEXAGONAL ---

# Application
mkdir -p $BASE_PATH/application/{commands,queries,dtos,mappers,event-handlers}

# Domain
mkdir -p $BASE_PATH/domain/{entities,enums,exceptions,ports,value-objects}

# Infrastructure
mkdir -p $BASE_PATH/infrastructure/{adapters/repositories,adapters/services,http/{filters,guards,middlewares}}

# Crear .gitkeep en cada carpeta
find $BASE_PATH -type d -exec touch {}/.gitkeep \;

# --- ARCHIVOS BASE ---

# Crear entidad base
ENTITY_FILE="$BASE_PATH/domain/entities/${MODULE_NAME}.entity.ts"

cat > $ENTITY_FILE << EOF
export class ${MODULE_NAME^}Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
EOF

echo "✅ Módulo $MODULE_NAME creado con arquitectura hexagonal 🚀"