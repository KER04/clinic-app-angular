import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/authguard';

// Pacientes
import { GetallPatient } from './features/patient/getall-patient/getall-patient';
import { CreatePatient } from './features/patient/create-patient/create-patient';
import { UpdatePatient } from './features/patient/update-patient/update-patient';

// Especialidades
import { GetallSpecialty } from './features/specialty/getall-specialty/getall-specialty';
import { CreateSpecialty } from './features/specialty/create-specialty/create-specialty';
import { UpdateSpecialty } from './features/specialty/update-specialty/update-specialty';

// Doctores
import { GetallDoctor } from './features/doctor/getall-doctor/getall-doctor';
import { CreateDoctor } from './features/doctor/create-doctor/create-doctor';
import { UpdateDoctor } from './features/doctor/update-doctor/update-doctor';

// Citas
import { GetallAppointment } from './features/appointment/getall-appointment/getall-appointment';
import { CreateAppointment } from './features/appointment/create-appointment/create-appointment';
import { UpdateAppointment } from './features/appointment/update-appointment/update-appointment';

// Diagnósticos
import { GetallDiagnosis } from './features/diagnosis/getall-diagnosis/getall-diagnosis';
import { CreateDiagnosis } from './features/diagnosis/create-diagnosis/create-diagnosis';
import { UpdateDiagnosis } from './features/diagnosis/update-diagnosis/update-diagnosis';

// Medicamentos
import { GetallMedicine } from './features/medicine/getall-medicine/getall-medicine';
import { CreateMedicine } from './features/medicine/create-medicine/create-medicine';
import { UpdateMedicine } from './features/medicine/update-medicine/update-medicine';

// Prescripciones
import { GetallPrescription } from './features/prescription/getall-prescription/getall-prescription';
import { CreatePrescription } from './features/prescription/create-prescription/create-prescription';
import { UpdatePrescription } from './features/prescription/update-prescription/update-prescription';

// Detalles de Prescripción
import { GetallPrescriptiondetail } from './features/prescriptiondetail/getall-prescriptiondetail/getall-prescriptiondetail';
import { CreatePrescriptiondetail } from './features/prescriptiondetail/create-prescriptiondetail/create-prescriptiondetail';
import { UpdatePrescriptiondetail } from './features/prescriptiondetail/update-prescriptiondetail/update-prescriptiondetail';

// Procedimientos
import { GetallProcedure } from './features/procedure/getall-procedure/getall-procedure';
import { CreateProcedure } from './features/procedure/create-procedure/create-procedure';
import { UpdateProcedure } from './features/procedure/update-procedure/update-procedure';

// Pagos
import { GetallPayment } from './features/payment/getall-payment/getall-payment';
import { CreatePayment } from './features/payment/create-payment/create-payment';
import { UpdatePayment } from './features/payment/update-payment/update-payment';

// Auth
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },

    // Rutas de citas
    {
        path: "Appointment",
        component: GetallAppointment,
        canActivate: [AuthGuard]
    },
    {   
        path: "Appointment/Create",
        component: CreateAppointment,
        canActivate: [AuthGuard]
    },
    {
        path: "Appointment/Update/:id",
        component: UpdateAppointment,
        canActivate: [AuthGuard]
    },
    
    // Rutas de pacientes
    {
        path: "Patient",
        component: GetallPatient,
        canActivate: [AuthGuard]
    },
    {
        path: "Patient/Create",
        component: CreatePatient,
        canActivate: [AuthGuard]
    },
    {
        path: "Patient/Update/:id",
        component: UpdatePatient,
        canActivate: [AuthGuard]
    },
    // Rutas de especialidades
    {
        path: "Specialty",
        component: GetallSpecialty,
        canActivate: [AuthGuard]
    },
    {
        path: "Specialty/Create",
        component: CreateSpecialty,
        canActivate: [AuthGuard]
    },
    {
        path: "Specialty/Update/:id",
        component: UpdateSpecialty,
        canActivate: [AuthGuard]
    },

    // Rutas de doctores
    {
        path: "Doctor",
        component: GetallDoctor,
        canActivate: [AuthGuard]
    },
    {
        path: "Doctor/Create",
        component: CreateDoctor,
        canActivate: [AuthGuard]
    },
    {
        path: "Doctor/Update/:id",
        component: UpdateDoctor,
        canActivate: [AuthGuard]
    },

    // Rutas de diagnósticos
    {
        path: "Diagnosis",
        component: GetallDiagnosis,
        canActivate: [AuthGuard]
    },
    {
        path: "Diagnosis/Create",
        component: CreateDiagnosis,
        canActivate: [AuthGuard]
    },
    {
        path: "Diagnosis/Update/:id",
        component: UpdateDiagnosis,
        canActivate: [AuthGuard]
    },

    // Rutas de medicamentos
    {
        path: "Medicine",
        component: GetallMedicine,
        canActivate: [AuthGuard]
    },
    {
        path: "Medicine/Create",
        component: CreateMedicine,
        canActivate: [AuthGuard]
    },
    {
        path: "Medicine/Update/:id",
        component: UpdateMedicine,
        canActivate: [AuthGuard]
    },

    // Rutas de prescripciones
    {
        path: "Prescription",
        component: GetallPrescription,
        canActivate: [AuthGuard]
    },
    {
        path: "Prescription/Create",
        component: CreatePrescription,
        canActivate: [AuthGuard]
    },
    {
        path: "Prescription/Update/:id",
        component: UpdatePrescription,
        canActivate: [AuthGuard]
    },

    // Rutas de detalles de prescripción
    {
        path: "PrescriptionDetail",
        component: GetallPrescriptiondetail,
        canActivate: [AuthGuard]
    },
    {
        path: "PrescriptionDetail/Create",
        component: CreatePrescriptiondetail,
        canActivate: [AuthGuard]
    },
    {
        path: "PrescriptionDetail/Update/:id",
        component: UpdatePrescriptiondetail,
        canActivate: [AuthGuard]
    },

    // Rutas de procedimientos
    {
        path: "Procedure",
        component: GetallProcedure,
        canActivate: [AuthGuard]
    },
    {
        path: "Procedure/Create",
        component: CreateProcedure,
        canActivate: [AuthGuard]
    },
    {
        path: "Procedure/Update/:id",
        component: UpdateProcedure,
        canActivate: [AuthGuard]
    },

    // Rutas de pagos
    {
        path: "Payment",
        component: GetallPayment,
        canActivate: [AuthGuard]
    },
    {
        path: "Payment/Create",
        component: CreatePayment,
        canActivate: [AuthGuard]
    },
    {
        path: "Payment/Update/:id",
        component: UpdatePayment,
        canActivate: [AuthGuard]
    },

    // Rutas auth
    {
        path: "login",
        component: Login
    },
    {
        path: "register",
        component: Register
    },
    // ⚠️ IMPORTANTE: El wildcard SIEMPRE debe ir AL FINAL
    {
        path: "**",
        redirectTo: "",
        pathMatch: "full"
    }
];