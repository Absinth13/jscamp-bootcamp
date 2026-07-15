<!-- HolaAquí puedes dejar las dudas que tengas sobre el ejercicio -->
Hola Madeval mi primera duda es, cuando ya cree un usuario, el id me lo 
pone siempre abajo, no como el ejemplo que ustedes tienen , no supe como ponerlo al inicio :/

{
  "message": "Usuario creado",
  "user": {
    "name": "Miri",
    "age": 4,
    "id": "0db1344b-05d3-4dbd-859c-4bca75f7192e"
  }
}
asi se ve cuando ya abre los demas datos 

[
  {
    "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "name": "Miguel",
    "age": 28
  },
  {
    "id": "f6e5d4c3-b2a1-4f5e-6d7c-8b9a0e1f2a3b",
    "name": "Mateo",
    "age": 34
  },
  {
    "name": "Miri",
    "age": 4,
    "id": "0db1344b-05d3-4dbd-859c-4bca75f7192e"
  }
]


Para la ultima parte del ejercicio tres Probando tu API con curl , no me funciona con curl , use powershell en la terminal de Visual Studio C 
Cuando ponia 
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"María","age":27}'
 
 me marcaba errores , me pase a git bash y lo mismo 
 
 marma@Gizmo MINGW64 ~/jscamp-bootcamp/06-ejercicio-servidor-con-node (main)
$ curl -X POST http://localhost:1234/users \
  -H "Content-Type: application/json" \
  -d '{"name":"María","age":27}'
curl: (7) Failed to connect to localhost port 1234 after 2234 ms: Could not connect to server

mi puerto funcionaba pero me arrojaba este error en ambos powershell y bash también si ponia curl.exe. En este modulo de node uso la terminal de VSC trate de hacer como midu dijo en el video pero no me funciono. 

Al final me puse a buscar y el formato nativo de powershell funciono 
Invoke-WebRequest -Uri "http://localhost:1234/users" -Method POST -ContentType "application/json" -Body '{"name":"Maria","age":27}'
espero este bien :/

StatusCode        : 201
StatusDescription : Created
Content           : {"message":"Usuario 
                    creado","user":{"name":"Maria","age":27,"id":"e34a5bf0-f89d-4bef-b99e-ccff01548c11"}}
RawContent        : HTTP/1.1 201 Created
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Length: 105
                    Content-Type: application/json; chartset=utf-8
                    Date: Tue, 14 Jul 2026 13:18:31 GMT
                    
                    {"message":"Usuario cre...
Forms             : {}
Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], [Content-Length, 105], [Content-Type, 
                    application/json; chartset=utf-8]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 105
