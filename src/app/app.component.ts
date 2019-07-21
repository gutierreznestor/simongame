import { Component, OnInit } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private swUpdate: SwUpdate,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.reloadCache();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  reloadCache() {
    if( this.swUpdate.isEnabled ) {
        this.swUpdate.available.subscribe( async ()=> {
        const alerta = await this.alertCtrl.create({
          message: 'Hay una nueva versión disponible. ¿Desea actualizar?',
          buttons: [{
            text: 'Cancelar',
            role: 'Cancel',
            cssClass: 'Secondary'
          }, {
            text: 'Aceptar',
            handler: () => {
              window.location.reload();
            }
          }]
        });
        await alerta.present();
      });
    }
  }
}
