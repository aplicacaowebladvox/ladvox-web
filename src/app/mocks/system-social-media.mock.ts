import { AddressModel } from '../models/address.model';
import { SystemContactModel } from '../models/system-contact.model';
import { SystemSocialMediaModel } from '../models/system-landing-page-social-media.model';

export class SystemSocialMediaMock {
  static facebook = {
    id: 1,
    iconClass: 'fa-brands fa-facebook',
    title: 'facebook',
    url: 'https://pt-br.facebook.com/FonoaudiologiaUfesOficial',
  } as SystemSocialMediaModel;
  static whatsapp = {
    id: 2,
    iconClass: 'fa-brands fa-whatsapp',
    title: 'whatsapp',
    url: 'https://wa.me/1555999999999?text=Olá',
  } as SystemSocialMediaModel;
  static linkedin = {
    id: 3,
    iconClass: 'fa-brands fa-linkedin',
    title: 'linkedin',
    url: 'https://br.linkedin.com/',
  } as SystemSocialMediaModel;
  static xtwitter = {
    id: 4,
    iconClass: 'fa-brands fa-x-twitter',
    title: 'X (twitter)',
    url: 'https://x.com/',
  } as SystemSocialMediaModel;
  static instagram = {
    id: 5,
    iconClass: 'fa-brands fa-instagram',
    title: 'instagram',
    url: 'https://www.instagram.com/ladvox.oficial/',
  } as SystemSocialMediaModel;
  static tiktok = {
    id: 6,
    iconClass: 'fa-brands fa-tiktok',
    title: 'tiktok',
    url: 'https://www.tiktok.com/pt-BR/',
  } as SystemSocialMediaModel;
  static youtube = {
    id: 7,
    iconClass: 'fa-brands fa-youtube',
    title: 'youtube',
    url: 'https://www.youtube.com/',
  } as SystemSocialMediaModel;
  static site = {
    id: 8,
    iconClass: 'fa-solid fa-globe',
    title: 'site',
    url: 'https://fonoaudiologia.ufes.br/conteudo/laborat%C3%B3rio-de-degluti%C3%A7%C3%A3o-e-voz-ladvox-ufes-promove-semana-de-aten%C3%A7%C3%A3o-%C3%A0-disfagia',
  } as SystemSocialMediaModel;
  static pinterest = {
    id: 9,
    iconClass: 'fa-brands fa-pinterest',
    title: 'pinterest',
    url: 'https://br.pinterest.com/',
  } as SystemSocialMediaModel;
  static snapchat = {
    id: 10,
    iconClass: 'fa-brands fa-snapchat',
    title: 'snapchat',
    url: 'https://www.snapchat.com/pt-BR',
  } as SystemSocialMediaModel;
  static spotify = {
    id: 11,
    iconClass: 'fa-brands fa-spotify',
    title: 'spotify',
    url: 'https://open.spotify.com/',
  } as SystemSocialMediaModel;

  static getAll(): SystemSocialMediaModel[] {
    return [
      this.facebook,
      this.whatsapp,
      this.linkedin,
      this.xtwitter,
      this.instagram,
      this.tiktok,
      this.youtube,
      this.site,
      this.pinterest,
      this.snapchat,
      this.spotify,
    ];
  }

  static getIconClassAvailableForSelectOptions(): any[] {
    return [
      { id: 'fa-brands fa-facebook', name: '<i class="fa-brands fa-facebook"></i>' },
      { id: 'fa-brands fa-whatsapp', name: '<i class="fa-brands fa-whatsapp"></i>' },
      { id: 'fa-brands fa-linkedin', name: '<i class="fa-brands fa-linkedin"></i>' },
      { id: 'fa-brands fa-x-twitter', name: '<i class="fa-brands fa-x-twitter"></i>' },
      { id: 'fa-brands fa-instagram', name: '<i class="fa-brands fa-instagram"></i>' },
      { id: 'fa-brands fa-tiktok', name: '<i class="fa-brands fa-tiktok"></i>' },
      { id: 'fa-brands fa-youtube', name: '<i class="fa-brands fa-youtube"></i>' },
      { id: 'fa-solid fa-globe', name: '<i class="fa-solid fa-globe"></i>' },
      { id: 'fa-brands fa-pinterest', name: '<i class="fa-brands fa-pinterest"></i>' },
      { id: 'fa-brands fa-snapchat', name: '<i class="fa-brands fa-snapchat"></i>' },
      { id: 'fa-brands fa-spotify', name: '<i class="fa-brands fa-spotify"></i>' },
    ];
  }
}
