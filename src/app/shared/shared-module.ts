import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormationCard } from './formation-card/formation-card';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';

@NgModule({
  imports: [
    CommonModule,
    Navbar,
    Footer,
    FormationCard
  ],
  exports: [
    Navbar,
    Footer,
    FormationCard
  ]
})
export class SharedModule {}