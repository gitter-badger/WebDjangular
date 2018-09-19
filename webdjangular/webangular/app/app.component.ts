/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, OnInit} from '@angular/core';
import {AnalyticsService} from './@core/utils/analytics.service';
import {WDAConfig} from "./@core/services/wda-config.service";
import {Router} from "@angular/router";


@Component({
    selector: 'wda-app',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

    constructor(private wdaconfig: WDAConfig, private router: Router, private analytics: AnalyticsService,) {
        
    }

    ngOnInit(): void {
        this.analytics.trackPageViews();
    }
}
