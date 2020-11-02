import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IsAuthGuard } from './guards/is-auth.guard';
import { IsLoginGuard } from './guards/is-login.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule),
    canActivate: [IsAuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then( m => m.LoginPageModule),
    canActivate: [IsLoginGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./modules/register/register.module').then( m => m.RegisterPageModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./folder-pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [IsAuthGuard]
  },
  {
    path: 'newofert',
    loadChildren: () => import('./modules/newofert/newofert.module').then( m => m.NewofertPageModule),
    canActivate: [IsAuthGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./folder-pages/main/main.module').then( m => m.MainPageModule),
    canActivate: [IsAuthGuard]
  },
  {
    path: 'config',
    loadChildren: () => import('./folder-pages/config/config.module').then( m => m.ConfigPageModule),
    canActivate: [IsAuthGuard]
  },
  {
    path: 'scan',
    loadChildren: () => import('./folder-pages/scan/scan.module').then( m => m.ScanPageModule),
    canActivate: [IsAuthGuard]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
