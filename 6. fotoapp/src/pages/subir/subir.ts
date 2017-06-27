import { Component } from '@angular/core';
import { ViewController, ToastController, Platform, LoadingController } from "ionic-angular";


//Plugins
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

//Servicios
import { CargaArchivosService } from "../../providers/carga-archivos";

@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {

  titulo:string = "";
  imgPreview:string = null;
  img:string ="";

  constructor( private viewCtrl:ViewController,
               private toastCtrl:ToastController,
               private _cas: CargaArchivosService,
               private platform:Platform,
               private camera: Camera,
               private imagePicker: ImagePicker,
               private loadingCtrl: LoadingController) {
  }

  crear_post(){
    console.log("Subiendo Imagen...");

    let archivo ={
      'titulo': this.titulo,
      'img': this.img
    };

    let loader = this.loadingCtrl.create({
      content: "Subiendo...",
    });
    loader.present();

    this._cas.cargar_imagenes_firebase(archivo)
    .then(
      ()=>{
        loader.dismiss();
        this.cerrar_modal();
      },

      ( error )=>{
        loader.dismiss();
        this.mostrar_toast("Error al cargar "+ error);
        console.log("Error al cargar " + JSON.stringify( error ));
      }

    )
  }

  cerrar_modal(){
    this.viewCtrl.dismiss();
  }

  mostrar_camara(){

      if(!this.platform.is("cordova")){
        this.mostrar_toast("Error: No estamos en celular");
        return;
      }

      const options: CameraOptions = {
        quality: 40,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation:true,

      }

      this.camera.getPicture(options).then((imageData) => {
         // imageData is either a base64 encoded string or a file URI
         // If it's base64:
         this.imgPreview = 'data:image/jpeg;base64,' + imageData;
         this.img =imageData;

        }, (err) => {
         // Handle error
         this.mostrar_toast("Error: " + err)
         console.error("Error en la camara: ", err);
      });

  }

  seleccionar_imagen(){

    if(!this.platform.is("cordova")){
      this.mostrar_toast("Error: No estamos en celular");
      return;
    }

    let opciones: ImagePickerOptions = {

      maximumImagesCount: 1,
      quality: 40,
      width: 800,
      height: 800,
      outputType: 1
    }

    this.imagePicker.getPictures( opciones ).then((results) => {

      for (let img of results){

        this.imgPreview = img
        this.img = img

      break;
      }



    }, (err) => {

        this.mostrar_toast("Error seleccion: "+ err);
        console.error("Error en seleccion: " + JSON.stringify(err));
        console.log(  JSON.stringify(  err )  );
     });

  }

  private mostrar_toast( texto:string ){
    this.toastCtrl.create({
      message:texto,
      duration:2500
    }).present();
  }


}
