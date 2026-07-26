# Gestor de tareas — Proyecto Final Módulo 4 (Henry)

SPA de gestión de tareas hecha con React + TypeScript, Firebase (Auth + Firestore),
notificaciones por email con AWS SES y deploy en Vercel.

## Estructura del proyecto

```
src/
├── components/           # Componentes reutilizables (UI)
│   ├── Navbar/
│   ├── RequireAuth/       # Protege rutas privadas
│   ├── TaskForm/          # Crear tarea
│   ├── TaskList/          # Listar tareas
│   ├── TaskItem/          # Una tarea (toggle, editar, eliminar)
│   ├── TaskEditModal/     # Modal para editar una tarea
│   └── EmailSummaryButton/# Botón para mandar el resumen por email
├── pages/                 # Componentes de ruta (una página = una URL)
│   ├── HomePage/          # Ruta privada "/" — arma TaskForm + TaskList
│   ├── LoginPage/          
│   └── RegisterPage/
├── features/auth/         # Contexto de autenticación (useAuth) + errores
├── services/               # Conexión con servicios externos
│   ├── firebase.ts        # Init de Firebase (Auth + Firestore)
│   ├── firestore.ts       # CRUD de tareas
│   └── email.ts            # Llama a la función serverless de email
├── helpers/                # Funciones puras de validación
└── types/                  # Interfaces de TypeScript (Task, TaskFormData)

api/
└── send-summary.ts        # Función serverless de Vercel (AWS SES)
```

Cada componente vive en su propia carpeta con su `.tsx` y su `.css` al lado
(mismo patrón que usamos en las lecturas del módulo, ej. M4L9-Firestore).

## Cómo seguir desde acá

1. `npm install` para bajar las dependencias.
2. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/),
   activar **Authentication** (Email/Password) y **Firestore Database**.
3. Copiar `.env.example` a `.env` y completar las variables `VITE_FIREBASE_*`
   con los datos de tu proyecto de Firebase.
4. `npm run dev` para levantar el proyecto.

## Pendientes (para ir armando juntos, uno a la vez)

- [ ] **Reglas de seguridad de Firestore**: por ahora cualquiera con la config
      podría leer la colección `tasks`. Hay que restringir para que cada
      usuario solo lea/escriba documentos donde `userId == request.auth.uid`.
- [ ] **Índice compuesto de Firestore**: la primera vez que corra
      `subscribeToUserTasks`, la consola del navegador va a tirar un link
      para crear el índice (where + orderBy juntos lo piden). Hay que crearlo
      desde ahí.
- [ ] **AWS SES real**: `api/send-summary.ts` está armado pero el envío en sí
      está comentado como TODO — falta instalar `@aws-sdk/client-ses` y armar
      el `SendEmailCommand`.
- [ ] **Tests**: ya hay ejemplos funcionando en `TaskForm.test.tsx` y
      `TaskList.test.tsx`. Faltarían tests para `TaskItem`, los helpers de
      validación, y mockear Firebase/Firestore para testear `HomePage`.
- [ ] **Deploy en Vercel**: conectar el repo, y cargar ahí las variables de
      entorno (las `VITE_FIREBASE_*` y también las de AWS, que en Vercel NO
      deben llevar el prefijo `VITE_` para que no terminen en el bundle del
      cliente).

## Notas sobre el código de las lecturas

Al armar esto vi un par de detalles del material de la lectura que dejé
corregidos acá (te los cuento por si el profe pregunta por qué difiere):

- En `TaskForm.tsx` de la lectura, el tipo del evento del submit era
  `React.SubmitEvent<HTMLFormElement>`, que no existe en React — el tipo
  correcto es `React.FormEvent<HTMLFormElement>`. Ya está corregido en todos
  los formularios de este proyecto.
- El `Task` de la lectura no tenía `id` ni `userId`, necesarios para poder
  editar/eliminar una tarea puntual en Firestore y para filtrar por usuario.
