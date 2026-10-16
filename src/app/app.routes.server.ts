
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: 'loanaccount', renderMode: RenderMode.Server },
  { path: 'pendingdeals', renderMode: RenderMode.Client },
  { path: 'sanctionletter', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server }
];
