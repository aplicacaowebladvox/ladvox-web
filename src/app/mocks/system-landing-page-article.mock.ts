import { FormBuilder, FormGroup } from '@angular/forms';
import { SystemLandingPageArticleModel } from '../models/system-landing-page-article.model';

export class SystemLandingPageArticleMock {
  static PRESENTATION: SystemLandingPageArticleModel = {
    id: 1,
    article:
      '<p> Em comemoração ao Dia de Atenção a Disfagia, 20 de março, o Laboratório de Deglutição e Voz- LaDVox do departamento de Fonoaudiologia- Ufes, está promovendo diversas ações durante a semana, em diferentes locais, como: na área verde, ambulatórios e semáforo em frente ao HUCAM, Hospital Dório Silva e Instituições de longa permanência nas cidades de Vitória e Vila Velha. </p><p _ngcontent-ng-c234172013=""> Com o objetivo de rastrear o risco de disfagia na população abordada, e realizar orientação e encaminhamento aos pacientes identificados com risco de disfagia. </p><p _ngcontent-ng-c234172013=""> As ações acontecem sob a supervisão das professoras do curso de Fonoaudiologia-Ufes, Dra. Elma Heitmann Mares Azevedo e Dra. Michelle Ferreira Guimarães, e conta com a colaboração das professoras Dra. Janaína de Alencar Nunes Queiroz e Msc. Renata Gama Lesqueves, e dos alunos do curso. </p>',
    title: 'Apresentação',
  } as SystemLandingPageArticleModel;

  static getAll(): SystemLandingPageArticleModel[] {
    return [this.PRESENTATION];
  }
}
