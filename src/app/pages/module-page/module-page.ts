import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-module-page',
  imports: [CommonModule, RouterLinkWithHref],
  templateUrl: './module-page.html',
  styleUrl: './module-page.scss'
})
export class ModulePage {
  route = inject(ActivatedRoute);
  moduleId = this.route.snapshot.paramMap.get('id') || 'module';
}
