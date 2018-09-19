import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbPasswordAuthStrategy, NbPasswordAuthStrategyOptions, NbAuthJWTToken } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataModule } from './data/data.module';
import { AnalyticsService } from './utils/analytics.service';

import { AuthGuard } from './services/auth-guard.service'
import { WDAConfig } from "./services/wda-config.service";

import { RoleProvider } from './services/role-provider.service';

export const NB_CORE_PROVIDERS = [
  AuthGuard,
  RoleProvider,
  ...DataModule.forRoot().providers,
  ...NbAuthModule.forRoot({
    strategies: [
      NbPasswordAuthStrategy.setup({
        name: 'email',
        baseEndpoint: '',
        login: {
          endpoint: 'api/token/',
          redirect: {
            success: 'admin/',
            failure: null,
          },
        },
        register: {
          endpoint: 'api/auth/register',
        },
        token: {
          key: 'data.token',
          class: NbAuthJWTToken,
          getter: (module: string, res: HttpResponse<Object>, options: NbPasswordAuthStrategyOptions) => {
            if (typeof res.body['data'] !== 'undefined'){
              return res.body['data']['token'];
            }
          },
        }
      }),
    ],
    forms: {
    }
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: RoleProvider,
  },
  WDAConfig,
  AnalyticsService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
