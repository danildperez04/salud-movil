![logo](shared/assets/logo_default.png)

# Salud Movil

## Descripción

Salud movil es una solución para personas con enfermedades cronica y discapacidades

## Funcionalidades

## Instalación

Primero clona el repositorio en tu entorno local usando el siguiente comando

``` bash
  git clone https://github.com/danildperez04/salud-movil.git
```

### Dependencias

### Instalación del backend

Primero hay que inicializar y correr el servidor backend con los siguientes comandos

``` bash
  cd api
  npm install
  npm run start:dev
```

### Instalacion del frontend

Luego desde la carpeta root hay que inicializar y correr el servidor del frontend

``` bash
  cd frontend
  npm install
  npm run dev
```

### Entorno

Crea un archivo .env donde definiras las siguientes variables

``` bash
HOST=your_host
PORT=your_port

DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_db_password

JWT_SECRET=your_secret
JWT_EXPIRES_IN=your_expiration
```

## Arquitectura

### Estructura de carpetas
### Stack Tecnologico

## Uso Básico

### Auth

```
POST /auth/login
```

### Users

```
GET /users/
```