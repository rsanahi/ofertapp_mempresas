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
    loadChildren: () => import('./modules/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./folder-pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [IsAuthGuard]
  },
  {
    path: 'logout',
    loadChildren: () => import('./folder-pages/logout/logout.module').then( m => m.LogoutPageModule)
  },
  {
    path: 'newofert',
    loadChildren: () => import('./modules/newofert/newofert.module').then( m => m.NewofertPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
