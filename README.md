# Gestor de tareas — Proyecto Final Módulo 4 

 SPA de gestión de tareas hecha con **React + TypeScript**, con autenticación y persistencia
en **Firebase** (Auth + Firestore), notificaciones por email vía **AWS SES** a través de una
función serverless, y deploy en **Vercel**. Proyecto integrador del Módulo 4 del bootcamp de
Soy Henry, para el cliente ficticio **MateCode**.

🔗 **Demo en producción:** https://proyecto-m4-gisella-massiero.vercel.app

📂 Repositorio:
https://github.com/GiseMassiero/ProyectoM4_GisellaMassiero

---

## 📋  Funcionalidades

- **Página de BIENVENIDA AL GESTOR DE TAREAS
- 

<img width="1247" height="763" alt="Captura de pantalla_28-7-2026_223213_proyecto-m4-gisella-massiero vercel app" src="https://github.com/user-attachments/assets/de8a868c-f593-4ccc-9ee5-6bfed58e676d" />

 
 
**Autenticación:** registro y login con email/contraseña y con Google, rutas privadas,
  sesión persistente, errores de Firebase traducidos a mensajes legibles.


<img width="1891" height="757" alt="Captura de pantalla_28-7-2026_223224_proyecto-m4-gisella-massiero vercel app" src="https://github.com/user-attachments/assets/4aebb055-492f-47de-bdaa-dbd376214df0" />


**Registro** con email/contraseña:


<img width="745" height="721" alt="Captura de pantalla_28-7-2026_223237_proyecto-m4-gisella-massiero vercel app" src="https://github.com/user-attachments/assets/317d8af6-7a9c-45fe-af6d-fdfeb63fffb6" />



- **Gestión de tareas (CRUD):** crear, editar, eliminar y marcar como completada. Cada usuario ve únicamente sus propias tareas.


<img width="753" height="634" alt="Captura de pantalla_27-7-2026_233415_localhost" src="https://github.com/user-attachments/assets/eafbf063-b671-46f3-8de3-bc60891a9704" />


- **Tiempo real:** la lista se actualiza sola con `onSnapshot`, sin recargar la página.


- **Filtros:** Todas / Pendientes / Completadas.


<img width="732" height="692" alt="Captura de pantalla_27-7-2026_233315_localhost" src="https://github.com/user-attachments/assets/200c1295-00b3-49e7-81e8-c2b61ba9312b" />


- **Resumen por email:** un botón dispara una función serverless que envía por AWS SES un
  resumen del estado de las tareas al email del usuario logueado.

<img width="594" height="556" alt="Captura de pantalla_28-7-2026_02559_mail google com" src="https://github.com/user-attachments/assets/8b8339b8-291c-4347-bc8d-b9eb1f993352" />


- **Modo claro/oscuro** con preferencia guardada en el navegador.

<img width="626" height="620" alt="Captura de pantalla_27-7-2026_233440_localhost" src="https://github.com/user-attachments/assets/ceafb517-184d-4f61-a682-c149b2a3f9b3" />


- **Tests** de componentes y del servicio de Firestore, con mocks (sin llamadas reales a
  Firebase ni a AWS).
  

  <img width="1091" height="500" alt="Captura de pantalla 2026-07-27 160016" src="https://github.com/user-attachments/assets/c241c0be-3c0f-49d2-9c87-3286c507e4f1" />


---

## 🛠️ Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Ruteo | React Router v7 |
| Backend as a Service | Firebase (Authentication + Firestore) |
| Email | AWS SES, invocado desde una función serverless de Vercel |
| Tests | Vitest + React Testing Library |
| Deploy | Vercel |

---

## 📂 Estructura del proyecto

```
src/
├── components/            # Componentes reutilizables (UI)
│   ├── Navbar/
│   ├── RequireAuth/        # Protege las rutas privadas
│   ├── TaskForm/           # Crear tarea
│   ├── TaskList/           # Listar tareas
│   ├── TaskItem/           # Una tarea: toggle, editar, eliminar
│   ├── TaskEditModal/      # Modal para editar una tarea
│   ├── EmailSummaryButton/ # Botón para mandar el resumen por email
│   └── ThemeToggle/        # Modo claro/oscuro
├── pages/                  # Componentes de ruta (una página = una URL)
│   ├── WelcomePage/        # "/" — bienvenida pública
│   ├── HomePage/           # "/app" — ruta privada, arma TaskForm + TaskList
│   ├── LoginPage/          # "/login"
│   └── RegisterPage/       # "/register"
├── features/auth/          # Contexto de autenticación (useAuth) + traducción de errores
├── services/                # Conexión con servicios externos
│   ├── firebase.ts         # Init de Firebase (Auth + Firestore) + proveedor de Google
│   ├── firestore.ts        # CRUD de tareas (con tests mockeados)
│   └── email.ts             # Llama a la función serverless de email
├── helpers/                 # Funciones puras de validación de formularios
└── types/                   # Interfaces de TypeScript (Task, TaskFormData)

api/
└── send-summary.ts         # Función serverless de Vercel: arma y manda el email con AWS SES


## 🚀 Cómo correrlo en local


###  📥 1. Clonar e instalar

git clone https://github.com/GiseMassiero/ProyectoM4_GisellaMassiero.git
cd ProyectoM4_GisellaMassiero
npm install


### 🔐 2. Variables de entorno

Copiá `.env.example` a `.env` y completá los valores:


cp .env.example .env


```
# Firebase (frontend — se puede exponer, la seguridad real la dan las Reglas de Firestore)
VITE_FIREBASE_API_KEY=

VITE_FIREBASE_AUTH_DOMAIN=

VITE_FIREBASE_PROJECT_ID=

VITE_FIREBASE_STORAGE_BUCKET=

VITE_FIREBASE_MESSAGING_SENDER_ID=

VITE_FIREBASE_APP_ID=


---

# AWS SES (solo se usan del lado del servidor, en api/send-summary.ts)
AWS_ACCESS_KEY_ID=

AWS_SECRET_ACCESS_KEY=

AWS_REGION=

SES_SENDER_EMAIL=


Las claves de Firebase se obtienen en Firebase Console → Configuración del proyecto → Tus apps.
Las de AWS se generan en IAM (usuario con permiso `AmazonSESFullAccess`) → Credenciales de
seguridad → Claves de acceso.


### ▶️ 3. Levantar el proyecto

Para trabajar solo en el frontend (sin probar el email):

```bash
npm run dev
```

Para probar también la función serverless del email, hace falta la CLI de Vercel (levanta
frontend + funciones juntos):

```bash
npm i -g vercel
vercel dev
```

### 🧪 4. Tests

```bash
npm test
```

### 📦 5. Build de producción

```bash
npm run build
```

---

## 🔒 Seguridad

- `.env` nunca se sube al repositorio (está en `.gitignore`); `.env.example` documenta qué
  variables hacen falta, sin valores reales.
  
  
- Las credenciales de AWS **solo** existen del lado del servidor, dentro de
  `api/send-summary.ts`. El frontend nunca las toca ni las descarga al navegador.


- **Reglas de Firestore:** cada tarea solo puede ser leída, editada o borrada por el usuario
  dueño (`request.auth.uid == resource.data.userId`), verificado explícitamente probando con
  dos usuarios distintos que ninguno ve las tareas del otro.


<img width="1135" height="515" alt="Captura de pantalla_25-7-2026_18852_console firebase google com" src="https://github.com/user-attachments/assets/225bc83d-14d2-4be9-b582-fd893f33b150" />


## 🧪 Tests

- `TaskForm.test.tsx`: valida que no se cree una tarea con título vacío, y que se llame
  correctamente a `onAddTask` con los datos del formulario.
- `TaskList.test.tsx`: mensaje de lista vacía, y renderizado de cada tarea.
- `EmailSummaryButton.test.tsx`: estado de éxito, estado de carga (botón deshabilitado), y
  **el caso borde de error del serverless** (mockeando que la función de email falla).
- `firestore.test.ts`: mockea **todo** el SDK de Firebase (`firebase/firestore`) — ningún test
  se conecta a una base de datos real. Verifica que `createTask`, `updateTask`,
  `toggleTaskCompleted` y `deleteTask` llaman a las funciones correctas con los datos
  correctos, y que `subscribeToUserTasks` arma bien el filtro por usuario y maneja tanto el
  caso de éxito como el de error de Firestore.

---

## Deploy

Deployado en Vercel, con las 10 variables de entorno cargadas en
Project Settings → Environment Variables (marcadas como "Sensitive"). El dominio de
producción está agregado como dominio autorizado en Firebase Authentication
(Authentication → Configuración → Dominios autorizados), paso necesario para que el login
funcione fuera de `localhost`.

<img width="819" height="410" alt="image" src="https://github.com/user-attachments/assets/9aca55b3-39e7-49c1-933e-58eae80d7198" />


---

## 🏗️ Decisiones arquitectónicas

- **Carpeta `api/` para la función serverless (no `functions/`)**: esto no es una preferencia
  estética, es un requisito técnico de Vercel — su detección automática de funciones
  serverless busca específicamente una carpeta llamada `api/` en la raíz del proyecto. Usar
  otro nombre haría que el deploy no reconozca la función de email.
- **Rutas definidas directamente en `App.tsx`** en vez de en una carpeta `routes/` separada:
  para el tamaño de este proyecto (4 rutas), una carpeta aparte agregaría indirección sin
  beneficio real.
- **`helpers/` en vez de `utils/`**: mismo propósito (funciones puras reutilizables), distinto nombre de carpeta.

---

## 📧 Flujo de envío de emails

1. El usuario, ya logueado, hace click en "Enviar resumen por email" (`EmailSummaryButton`).
2. El componente llama a `sendTaskSummaryEmail` (`src/services/email.ts`), que hace un
   `fetch` a `/api/send-summary` con el email del usuario y la lista de tareas.
3. Esa función serverless (`api/send-summary.ts`) corre **del lado del servidor de Vercel**,
   nunca en el navegador. Ahí arma el HTML del resumen, separado en tareas pendientes y
   completadas.
4. La función instancia el `SESClient` de AWS con las credenciales que viven como variables
   de entorno del servidor, y manda el email con `SendEmailCommand`.
5. El frontend recibe la respuesta y actualiza el estado a éxito o error, mostrándoselo al
   usuario (`EmailSummaryButton` maneja los tres estados: carga, éxito y error).

Las credenciales de AWS nunca viajan al navegador: el frontend solo conoce la URL
`/api/send-summary`, no sabe nada de SES ni de las claves.

---


##  ⚠️ Limitación conocida: AWS SES en modo sandbox

La cuenta de AWS usada en este proyecto es nueva, por lo que SES está en **modo sandbox**:
mientras esto no cambie, el envío de email solo funciona si **tanto el remitente como el
destinatario** están verificados manualmente como identidades en SES. Esto significa que,
por ahora, un evaluador logueado con un email distinto al verificado va a ver el mensaje de
error manejado en la UI ("No se pudo enviar el resumen"), en vez de recibir el email.

La función y la integración están completas y probadas (funcionan de punta a punta entre
identidades verificadas) —

---

## 🤖 Uso de IA durante el desarrollo


Durante el desarrollo del proyecto utilicé Inteligencia Artificial como herramienta de asistencia técnica y apoyo en el proceso de implementación. 

La IA no reemplazó el diseño ni la lógica del proyecto, sino que se empleó para acelerar tareas repetitivas y resolver dudas puntuales.

¿En qué situaciones fue utilizada?:

* Resolución de errores de React, TypeScript y Firebase;
* Explicación de conceptos relacionados con Firestore, autenticación y funciones serverless;
* Organización de la estructura de carpetas y componentes;
* Revisión y mejora de estilos CSS;
* Optimización y refactorización de código;
* Generación de ejemplos para pruebas unitarias con Vitest y React Testing Library;


¿Dónde fue más efectiva?:

La IA me resultó especialmente útil para:

* Analizar mensajes de error y proponer posibles soluciones;
* Explicar el funcionamiento de librerías y APIs utilizadas;
* Sugerir mejoras de organización sin modificar la funcionalidad del proyecto;
* Acelerar la documentación y la redacción técnica.


Buenas prácticas aprendidas:

Durante el desarrollo comprobé que la IA ofrece mejores resultados cuando:

* Se proporcionan fragmentos completos de código y el contexto del problema;
* Se validan todas las respuestas antes de incorporarlas al proyecto;
* Se utilizan sus sugerencias como apoyo y no como sustituto del razonamiento propio;
* Se realizan consultas específicas y acotadas en lugar de preguntas generales.

La implementación final, las decisiones arquitectónicas y la validación del funcionamiento fueron realizadas y verificadas por mí.  
