import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Aside } from './shared/layout/aside/aside';
import { Header } from './shared/layout/header/header';
import { Footer } from './shared/layout/footer/footer';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, Aside, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('appfront');

  constructor(public authService: AuthService) {}
}