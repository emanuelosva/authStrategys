# Guía de Autenticación y Atorización
> Ref: 
> 1. [Platzi](https://platzi.com/clases/passport/)
> 2. [Guillermo Rodas](https://guillermorodas.com/)

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

En terminos generales una sesion es una manera de preservar un estado deseado.

Cada que se hace una petición http por primera vez, se crea una sesión. Esta sesión
guarda información del usuario aunque no esté autenticado.
La sesión genera un Id que se guarda en una cookie (archivo guardado en el navegador)
En procesos de autenticación. La sesión se relaciona con el usuario.

#### Cookies
Es un archivo creado por un sitio web que tiene pequeños pedazos de datos.
Su propósito principal es almacenar a un usuario mediante el almacenamiento de su
historial.
Tienen un almacenamiento máximo de 4 kb.

Tipos:
* cookies session: Tiempo de vida corto. Se remueven al cerrar el tab o el navegador.
* persistent cookies: usadas para rastrear al usuario guardando información de su interés.
* secury cookies: Almacenan datos de manera cifrada, para evitar ser robadas. Usadas en conexiones seguras (https).

Leyes (básicas):
* Siempre avisar al usuario que estás haciedo uso de cookies en el sitio.
* Es necesario el consentimiento del usuario para implementar el uso de cookies.
* Si las cookies se usan para autenticación del usuario o para problemas de seguridad, esas leyes no aplica.

#### Local Storage
Almacenamiento máximo de 5 kb.
La información almacenada en el local storage no se va a cada request que hacemos al servidor.
Persiste aunque cerremos la ventana del navegador.

En el navegador se puede acceder a la API:
```javascript
// Almacencar un valor
localStorage.setItem('key', 'value');

// Acceder a un valor
localStorage.getItem('key') //ouput: 'value'
```

#### Session storage
Similar al local storeage, sin embargo, su información solo está disponible por tab o por window.

En el navegador se puede acceder a la API:
```javascript
// Almacencar un valor
sessionStorage.setItem('key', 'value');

// Acceder a un valor
sessionStorage.getItem('key') //ouput: 'value'
```

**Comparación**

| Tipo            | Capacidad | Tiempo de vida                 | Request             |
| --------------- | --------- | ------------------------------ | ------------------- |
| Cookies         | 4 kb | Puede definirse | Toda la información viaja en el request |
| Local storage | 5 kb | Igual a la sesión del browse | La info no viaja en el request |
| Session storage | 5 kb | Solo dispobible por tab/window | Igual que local storage |

* Las cookies se pueden hacer seguras a través del flag ***httpOnly***, esto permite que la información de la cookie solo sea accedida y modificada en el srvidor.

**Usos**

| Tipo de información | Método recomentado |
| ---------------------- | ------------------------- |
| No sensible | Local storage o Session storage |
| Medianamente sensible | Session storage o cookie |
| Información sensible | Cookies (con flag: ***httpOnly***  ) |


#### JsonWebToken
**JsonWebToken** Es un estandar de la industría. Permite generar demandas entre dos clientes de manera segura. Se compone de:
* Header -> {typ: "JWT", alg: "algotitmo de encriptación de la firma"}
* Payload -> {...información del usuario}
* Signature -> (header+payload)-enciptados_por_un_secreto

La autenticación ocurre de la siguiente manera:
> Autenticación -> Se firma un token que se envia al cliente
> -> Lo almacena en memoria o en una cockie.

A partír de ahí todos los request llevan ese token.

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

#### Buenas prácticas con JWT
JsonWebToken es una forma muy popular para lograr el proceso de autenticación, sin embargo se recomiendad algunas buenas prácticas para evitar huecos de seguridad:

###### Evitar almacenar información sensible
Debido a que el JWT es decodificable es posible visualizar la información del payload,
por lo que ningún tipo de información sensible como contraseñas o keys, o información confidencial como número de identificación o historiales médicos deben ser enviados dentro del JWT.

###### Mantener su peso lo más liviano posible
Debido a que el JWT es mandado en cada petición, consume ancho de bada extra, por lo que para mantener un buen performance es prefirible mandar el payload solo lo necesario para mantener el flujo de la aplicación.

###### Establecer tiempos de expiración cortos
De no tomarse las medidas de almacenamiento seguras, los tokens pueden ser robados, por lo que para combatir este escho el tiempo de de expiración debe ser de 15 min hasta un máximo de 2 hrs.

###### Tratar al token como opaco
No deberiamos decodificar el token del lado del cliente, pues solo el servidor puede hacer la verificación de que la firma del token, por lo que solo éste debería de mandarlo.

###### No almacenar tokens de manera insegura
En una SPA nunca debe de almacenarse el token en el local storage o session storage.
Debería ser almacenados en una Cockie, pero solo de manera segura y con el flah ***httOnly***, esto quire decir que la cockie solo puede provenir del servidor con el token almacenado.

## Server-side vs Client-side sessions 

#### Sesiones del lado del servidor
Son una pieza de información que se guarda en memoria o en una base de datos temporal,
como Redis, ésta permite hacerle seguimiento a la información de autenticación con el 
fin de identificar al usuario y determinar cual es su estado de autenticación.
Mantener la sesión de esta manera se denomina ***stateful***, es decir que maneja
un estado.

#### Sesiones del lado del cliente
Son una manera en la que las SPA que están muy desacopladas del backend y/o no
suelen refrescar la pagina como lo hacen las aplicaciones renderizadas desde el servidor, pueden autenticar usuarios.

El mecanismo predilecto es a través de JsonWebToken. JWT es un mecanismo de autenticación sin estado ***stateless***. Por lo que no hay una sesión que exista
del lado del servidor.

Comportamiento de la sesión del lado del cliente:
* Cuando el usuario hace “login” agregamos una bandera para indicar que lo esta.
* En cualquier punto de la aplicación verificamos la expiración del token.
* Si el token expira, cambiamos la bandera para indicar que el usuario no está logueado
* Se suele chequear cuando la ruta cambia.
* Si el token expiró lo redireccionamos a la ruta de “login” y actualizamos el estado como “logout”.
* Se actualiza la UI para mostrar que el usuario ha cerrado la sesión.
