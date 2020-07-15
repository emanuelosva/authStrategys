# Guía de Autenticación y Atorización

### Stack de seguridad moderno
Estándares adaptdos para las tecnologías móbiles y los nuevos
paradigmas de diseño de software.

* JWT
* OAuth 2.0 (Open Authorization 2.0)
* OpenId

## Conceptos principales

#### Autenticación.
Es la acción de verificar la identidad de un usuario.
Con los datos del usuario se pueden generar tokens de Autorización

#### Autorización.
Otorgar permisos y acceso de manera limitado a los recursos

> **Autenticación:** quién soy | **Autorización:** qué permiso tengo.

#### Sesiones
Las solicitudes HTTP no contiene estado. Diferentes peticiones http nunca comparten información entre si.

Cada que se hace una petición http por primera vez, se crea una sesión. Esta sesión
guarda información del usuario aunque no esté autenticado.
La sesión genera un Id que se guarda en una Cockie (archivo guardado en el navegador)
En procesos de autenticación. La sesión se relaciona con el usuario.

## Métodos de autenticación

#### Autenticación tradicional
Es un método básico que permite guardar la sesión en el cliente. Su flujo
de trabajo es:

> Autenticación -> Se crea una sesión -> Se guarda el Id de la sesión en una cockie
> -> Se guarda en el navegador 

A partir de ahí todos los request tienen la cockie con el Id de la sesión
que es usado para verificar la sesión previamente definida.

**Desventajas:**
* SPA no refrescan siempre. No pueden saber de cambios en la sesión inmediatamente
* REST-API por definición no deben de generar estado
* Complica de escalabilidad de microservicios

#### Autenticación con JWT
**JsonWebToken** Es un estandar de la industría. Permite generar demandas entre dos clientes de manera segura. Se compone de:
* Header -> {typ: "JWT", alg: "algotitmo de encriptación de la firma"}
* Payload -> {...información del usuario}
* Signature -> (header+payload)-enciptados_por_un_secreto

La autenticación ocurre de la siguiente manera:
> Autenticación -> Se firma un token que se envia al cliente
> -> Lo almacena en memoria o en una cockie.

A partír de ahí todos los request llevan ese token.

**Ventajas:**
* SPA y clientes en genral ya no requieren del backend para saber si el usuario está authenticado.
* El backend puede recibir múltiples request de múltiples clientes. 
Solo es necesario saber si el token está bien firmado.
* El cliente es el que sabe que permisos tiene y no tiene que ir a base de datos para conocer esta información.

**Implementación básica**
Primero debes de instalar el paquete de ***jsonwebtoken*** de node:
```bash
npm i jasonwebtoken
```

Los princiaples dos métodos para implementarlo son:
* sign: Firma el token

```javascript
const jwt = require('jsonwebtoken')

const payload = {sub: "usernameExample"};
const secret = 'a256bytesSecretString';
const token = jwt.sign(payload, secret)
console.log(token)
```
```bash
output: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlbWFudWVsIiwiaWF0IjoxNTk0ODMzNDU1fQ.QQk1R8c6wNRLFZ89xVWQDDZdtTgJwGlLbKziAu2zGo
```
* verify: Verifica la autenticidad del token y lo devuelve decodificado

```javascript
const jwt = require('jsonwebtoken')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlbWFudWVsIiwiaWF0IjoxNTk0ODMzNDU1fQ.QQk1R8c6wNRLFZ89xVWQDDZdtTgJwGlLbKziAu2zGo';

const secret = 'a256bytesSecretString';
const username = jwt.verify(token, secret)
console.log(username)
```
```bash
output: { sub: 'usernameExample', iat: 1594833455 }
```