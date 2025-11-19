import { Routes } from '@angular/router';
import { AuthGuard } from './guards/authguard';
//rutas pacientes
import { GetallPatient } from './components/patient/getall-patient/getall-patient';
import { CreatePatient } from './components/patient/create-patient/create-patient';
import { UpdatePatient } from './components/patient/update-patient/update-patient';
// rutas especialidades
import { GetallSpecialty } from './components/specialty/getall-specialty/getall-specialty';
import { CreateSpecialty } from './components/specialty/create-specialty/create-specialty';
import { UpdateSpecialty } from './components/specialty/update-specialty/update-specialty';

//rutas doctores
import { GetallDoctor } from './components/doctor/getall-doctor/getall-doctor';
import { CreateDoctor } from './components/doctor/create-doctor/create-doctor';
import { UpdateDoctor } from './components/doctor/update-doctor/update-doctor';

//Rutas para citas
import { GetallAppointment } from './components/appointment/getall-appointment/getall-appointment';
import { CreateAppointment } from './components/appointment/create-appointment/create-appointment';
import { UpdateAppointment } from './components/appointment/update-appointment/update-appointment';




//aauthentication
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
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
        redirectTo: "login",
        pathMatch: "full"
    }
];