#!/bin/bash

if [ -z "$1" ]; then
  echo "❌ Tenés que pasar el nombre del módulo"
  echo "👉 Ejemplo: ./generate-module.sh resume"
  exit 1
fi

MODULE_NAME=$1
BASE_PATH="src/modules/$MODULE_NAME"

echo "🚀 Creando módulo: $MODULE_NAME"

# Crear módulo
npx nest g module modules/$MODULE_NAME --no-spec

# Crear controller en la carpeta correcta (sin subnivel extra)
npx nest g controller modules/$MODULE_NAME/infrastructure/http/controllers/$MODULE_NAME --flat --no-spec

# --- ESTRUCTURA HEXAGONAL ---

# Application
mkdir -p $BASE_PATH/application/{commands,queries,dtos,mappers,event-handlers}

# Domain
mkdir -p $BASE_PATH/domain/{entities,enums,exceptions,ports,value-objects}

# Infrastructure
mkdir -p $BASE_PATH/infrastructure/{adapters/{repositories,services},http/{controllers,filters,guards,middlewares}}

# --- .gitkeep SOLO EN CARPETAS ESPECÍFICAS ---

touch $BASE_PATH/application/commands/.gitkeep
touch $BASE_PATH/application/queries/.gitkeep
touch $BASE_PATH/application/dtos/.gitkeep
touch $BASE_PATH/application/event-handlers/.gitkeep

touch $BASE_PATH/domain/value-objects/.gitkeep
touch $BASE_PATH/domain/exceptions/.gitkeep
touch $BASE_PATH/domain/enums/.gitkeep

touch $BASE_PATH/infrastructure/adapters/services/.gitkeep

touch $BASE_PATH/infrastructure/http/guards/.gitkeep
touch $BASE_PATH/infrastructure/http/middlewares/.gitkeep
touch $BASE_PATH/infrastructure/http/filters/.gitkeep

# --- ARCHIVOS BASE ---

# Entity
touch $BASE_PATH/domain/entities/${MODULE_NAME}.entity.ts

# Mapper
touch $BASE_PATH/application/mappers/${MODULE_NAME}.mapper.ts

# Repository (infraestructura)
touch $BASE_PATH/infrastructure/adapters/repositories/${MODULE_NAME}.repository.ts

# Port
touch $BASE_PATH/domain/ports/${MODULE_NAME}.repository.port.ts

echo "✅ Módulo $MODULE_NAME creado correctamente 🚀"