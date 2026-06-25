# Frontend — Sistema de Gestión Clínica

Frontend SPA para administración de clínicas médicas. Gestiona pacientes, doctores, citas, diagnósticos, prescripciones, medicamentos, procedimientos y pagos desde una interfaz unificada con autenticación JWT.

---

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 20.2 | Framework principal (standalone components) |
| PrimeNG | 20.3 | Componentes UI (tablas, formularios, menús) |
| Tailwind CSS | 4.1 | Estilos utilitarios |
| RxJS | 7.8 | Estado reactivo y comunicación asíncrona |
| TypeScript | 5.9 | Tipado estático |

---

## Requisitos previos

- **Node.js** ≥ 20
- **Angular CLI** ≥ 20 (`npm install -g @angular/cli`)
- **Backend** corriendo en `http://localhost:3000` (ver repositorio `appker/backend`)

---

## Instalación y arranque

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start
# → http://localhost:4200
```

```bash
# Build para producción
npm run build
```

---

## Estructura del proyecto

```
src/app/
├── core/
│   ├── guards/
│   │   ├── authguard.ts          # Protege rutas privadas con JWT
│   │   └── role-guard.ts
│   ├── interceptors/
│   │   └── jwt-interceptor.ts    # Inyecta Authorization header en cada petición
│   ├── models/                   # Interfaces TypeScript por entidad
│   │   ├── auth.ts
│   │   ├── appointment.model.ts
│   │   ├── diagnosis.model.ts
│   │   ├── doctor.model.ts
│   │   ├── medicine.model.ts
│   │   ├── patient.model.ts
│   │   ├── payment.model.ts
│   │   ├── prescription.model.ts
│   │   ├── prescriptiondetail.model.ts
│   │   ├── procedure.model.ts
│   │   └── specialty.model.ts
│   └── services/                 # Servicios HTTP CRUD por entidad
│       ├── appointment.service.ts
│       ├── auth.service.ts
│       ├── diagnosis.service.ts
│       ├── doctor.service.ts
│       ├── medicine.service.ts
│       ├── patient.service.ts
│       ├── payment.service.ts
│       ├── prescription.service.ts
│       ├── prescriptiondetail.service.ts
│       ├── procedure.service.ts
│       └── specialty.service.ts
│
├── features/                     # Módulos funcionales (create / getall / update)
│   ├── appointment/
│   ├── auth/                     # login / register
│   ├── diagnosis/
│   ├── doctor/
│   ├── medicine/
│   ├── patient/
│   ├── payment/
│   ├── prescription/
│   ├── prescriptiondetail/
│   ├── procedure/
│   └── specialty/
│
└── shared/
    └── layout/
        ├── aside/                # Menú lateral (PanelMenu)
        ├── header/
        ├── footer/
        └── shell/
```

---

## Módulos y rutas

### Área Clínica

| Módulo | Listado | Crear | Editar |
|---|---|---|---|
| Pacientes | `/Patient` | `/Patient/Create` | `/Patient/Update/:id` |
| Doctores | `/Doctor` | `/Doctor/Create` | `/Doctor/Update/:id` |
| Especialidades | `/Specialty` | `/Specialty/Create` | `/Specialty/Update/:id` |
| Diagnósticos | `/Diagnosis` | `/Diagnosis/Create` | `/Diagnosis/Update/:id` |
| Medicamentos | `/Medicine` | `/Medicine/Create` | `/Medicine/Update/:id` |
| Prescripciones | `/Prescription` | `/Prescription/Create` | `/Prescription/Update/:id` |
| Detalle de Prescripción | `/PrescriptionDetail` | `/PrescriptionDetail/Create` | `/PrescriptionDetail/Update/:id` |

### Área Administrativa

| Módulo | Listado | Crear | Editar |
|---|---|---|---|
| Citas | `/Appointment` | `/Appointment/Create` | `/Appointment/Update/:id` |
| Procedimientos | `/Procedure` | `/Procedure/Create` | `/Procedure/Update/:id` |
| Pagos | `/Payment` | `/Payment/Create` | `/Payment/Update/:id` |

### Autenticación (rutas públicas)

| Ruta | Descripción |
|---|---|
| `/login` | Inicio de sesión |
| `/register` | Registro de usuario |

Todas las rutas excepto `/login` y `/register` están protegidas por `AuthGuard`.

---

## Autenticación

El sistema usa **JWT**. Al hacer login o register, el token se guarda en `localStorage` bajo la clave `auth_token`.

El `jwtInterceptor` inyecta automáticamente el header `Authorization: Bearer <token>` en cada petición HTTP saliente, por lo que los servicios no necesitan gestionar headers manualmente.

```
AuthService
  └── login() / register() → guarda token en localStorage
  └── logout()             → elimina token
  └── isLoggedIn()         → verifica presencia de token

jwtInterceptor (global)
  └── intercepta todas las peticiones HTTP
  └── agrega Authorization: Bearer <token> si existe
```

---

## Conexión con el backend

La URL base se configura en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### Convención de endpoints

| Entidad | Endpoint |
|---|---|
| appointment | `/api/appointment/public` |
| patient | `/api/patient/public` |
| doctor | `/api/doctor/public` |
| specialty | `/api/specialty/public` |
| diagnosis | `/api/diagnosis/public` |
| medicine | `/api/medicine/public` |
| prescription | `/api/prescriptions/public` *(plural)* |
| prescriptiondetail | `/api/prescriptiondetail/public` |
| procedure | `/api/procedure/public` |
| payment | `/api/payment/public` |

Todos los endpoints requieren el header `Authorization: Bearer <token>` (gestionado automáticamente por el interceptor).

---

## Layout

Cuando el usuario tiene sesión activa, la app muestra:

```
┌─────────────────────────────────────────┐
│               HEADER                    │
├──────────┬──────────────────────────────┤
│          │                              │
│  ASIDE   │      CONTENIDO               │
│  (menú)  │      <router-outlet>         │
│          │                              │
├──────────┴──────────────────────────────┤
│               FOOTER                    │
└─────────────────────────────────────────┘
```

Sin sesión activa, solo se muestra el `<router-outlet>` centrado (para login/register).

El menú lateral (`Aside`) está organizado en dos secciones:
- **Área Clínica** — Pacientes, Doctores, Especialidades, Diagnósticos, Medicamentos, Prescripciones
- **Administrativo** — Citas, Procedimientos, Pagos

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia servidor de desarrollo en `http://localhost:4200` |
| `npm run build` | Build de producción en `dist/frontend/` |
| `npm run watch` | Build en modo watch (desarrollo) |
| `npm test` | Ejecuta tests unitarios con Karma + Jasmine |
