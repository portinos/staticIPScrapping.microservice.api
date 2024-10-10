# Microservicio FPS 

Este proyecto es un microservicio básico desarrollado con Node.js y Express, diseñado para poder obtener los valores de los productos inicialmente de walmart que necesitan las diferentes APIs de Portinos

## Características

- Arquitectura de microservicio
- Implementado con Node.js y Express
- Redis

## Requisitos Previos

- Docker
- Node.js 20
- Npm

## Instalación

1. Clona este repositorio:
   ```
   git clone https://github.com/portinos/staticIPScrapping.microservice.api.git
   ```

2. Navega al directorio del proyecto:
   ```
   cd a la carpeta del repositorio
   ```

3. Instala las dependencias:
   ```
   npm install
   ```

4. Crea un archivo `.env` en la raíz del proyecto y configura las variables de entorno necesarias:
   Podes obtenerlo del env_local para desarrollar

5. Ejecuta el comando para levantar Docker

    ```
    docker compose up
    ```