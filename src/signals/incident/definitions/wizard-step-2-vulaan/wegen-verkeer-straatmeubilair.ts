// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import appConfiguration from 'shared/services/configuration/configuration'
import {
  falsyOrNumberOrNow,
  inPast,
} from 'signals/incident/services/custom-validators'
import { QuestionFieldType } from 'types/question'

import locatie from './locatie'
import type ConfigurationType from '../../../../../app.amsterdam.json'

export const ICON_SIZE = 40

const configuration = appConfiguration as unknown as typeof ConfigurationType

export const wegenVerkeerStraatmeubilair = {
  locatie,
  dateTime: {
    meta: {
      label: 'Wanneer was het?',
      canBeNull: true,
      ifOneOf: {
        subcategory: [
          'autom-verzinkbare-palen',
          'bewegwijzering',
          'camerasystemen',
          'oplaadpunt',
          'parkeerautomaten',
          'parkeer-verwijssysteem',
          'put-riool-kapot',
          'stadsplattegronden',
          'lantaarnpaal-straatverlichting',
          'verkeerslicht',
          'verkeerssituaties',
          'omleiding',
        ],
      },
    },
    options: {
      validators: [falsyOrNumberOrNow, inPast],
    },
    render: QuestionFieldType.DateTimeInput,
  },
  extra_onderhoud_stoep_straat_en_fietspad: {
    meta: {
      ifOneOf: {
        subcategory: ['gladheid'],
      },
      label: 'Om wat voor soort wegdek gaat het?',
      shortLabel: 'Soort wegdek',
      subtitle: 'Bijvoorbeeld: asfalt, klinkers of stoeptegels',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.TextInput,
  },
  extra_wegen_gladheid: {
    meta: {
      ifAllOf: {
        subcategory: 'gladheid',
      },
      type: 'caution',
      value: `
Let op:

Is het glad bij een trein-, bus- of metrostation? Neem dan contact op met de NS of GVB: [gvb.nl/klantenservice](https://gvb.nl/klantenservice)`,
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.PlainText,
  },
  extra_verkeerslicht_welk: {
    meta: {
      label: 'Welk verkeerslicht werkt niet goed?',
      shortLabel: 'Type verkeerslicht',
      ifAllOf: {
        subcategory: 'verkeerslicht',
      },
      values: {
        voetganger: 'Voetganger',
        fiets: 'Fiets',
        auto: 'Auto',
        tram_bus: 'Tram of bus',
        niet_van_toepassing: 'Niet van toepassing',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_verkeerslicht: {
    meta: {
      label: 'Zijn er ook beschadigingen aan het verkeerslicht?',
      shortLabel: 'Beschadigingen aan verkeerslicht',
      ifAllOf: {
        subcategory: 'verkeerslicht',
      },
      ifOneOf: {
        extra_verkeerslicht_welk: ['voetganger', 'fiets', 'auto', 'tram_bus'],
      },
      values: {
        geen_beschadigingen: 'Nee, geen beschadigingen',
        verkeerslicht_scheef: 'Ja, het verkeerslicht staat scheef',
        verkeerslicht_op_grond:
          'Ja, de lamp of het verkeerslicht ligt op de grond',
        lamp_hangt_los: 'Ja, de lamp hangt los',
        losse_kabels_zichtbaar: 'Ja, er hangen losse stroomkabels',
        deurtje_weg_of_open:
          'Ja, er zit geen deurtje in het verkeerslicht of het deurtje staat open',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_verkeerslicht_gevaar: {
    meta: {
      ifAllOf: {
        subcategory: 'verkeerslicht',
      },
      ifOneOf: {
        extra_verkeerslicht: [
          'verkeerslicht_scheef',
          'verkeerslicht_op_grond',
          'deurtje_weg_of_open',
          'losse_kabels_zichtbaar',
          'lamp_hangt_los',
        ],
      },
      label: `Dit kan een gevaarlijke situatie zijn, bel ${configuration.language.phoneNumber}`,
      type: 'info',
      value: `Wij verzoeken u om ons te bellen op ${configuration.language.phoneNumber} zodat we dit met spoed kunnen oppakken. U hoeft het formulier niet meer verder in te vullen.`,
    },
    render: QuestionFieldType.PlainText,
  },
  extra_verkeerslicht_probleem_voetganger: {
    meta: {
      label: 'Wat is het probleem?',
      shortLabel: 'Probleem',
      ifAllOf: {
        subcategory: 'verkeerslicht',
        extra_verkeerslicht: 'geen_beschadigingen',
        extra_verkeerslicht_welk: 'voetganger',
      },
      ifOneOf: {
        extra_verkeerslicht_welk: ['voetganger'],
      },
      values: {
        rood_werkt_niet: 'Rood licht werkt niet',
        groen_werkt_niet: 'Groen licht werkt niet',
        blindentikker_werkt_niet: 'Blindentikker werkt niet',
        groen_duurt_te_lang: 'Duurt (te) lang voordat het groen wordt',
        anders: 'Anders',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.CheckboxInput,
  },
  extra_verkeerslicht_probleem_fiets_auto: {
    meta: {
      label: 'Wat is het probleem?',
      shortLabel: 'Probleem',
      ifAllOf: {
        subcategory: 'verkeerslicht',
        extra_verkeerslicht: 'geen_beschadigingen',
      },
      ifOneOf: {
        extra_verkeerslicht_welk: ['fiets', 'auto'],
      },
      values: {
        rood_werkt_niet: 'Rood licht werkt niet',
        oranje_werkt_niet: 'Oranje/geel licht werkt niet',
        groen_werkt_niet: 'Groen licht werkt niet',
        groen_duurt_te_lang: 'Duurt (te) lang voordat het groen wordt',
        anders: 'Anders',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.CheckboxInput,
  },
  extra_verkeerslicht_probleem_bus_tram: {
    meta: {
      label: 'Wat is het probleem?',
      shortLabel: 'Probleem',
      ifAllOf: {
        subcategory: 'verkeerslicht',
        extra_verkeerslicht: 'geen_beschadigingen',
        extra_verkeerslicht_welk: 'tram_bus',
      },
      values: {
        rood_werkt_niet: 'Rood licht werkt niet',
        oranje_werkt_niet: 'Oranje/geel licht werkt niet',
        wit_werkt_niet: 'Wit licht werkt niet',
        waarschuwingslicht_tram_werkt_niet:
          'Licht dat waarschuwt voor aankomende tram werkt niet',
        anders: 'Anders',
      },
      pathMerge: 'extra_properties',
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.CheckboxInput,
  },
  extra_verkeerslicht_nummer: {
    meta: {
      label: 'Wat is het nummer van het verkeerslicht?',
      shortLabel: 'Verkeerslicht nummer',
      subtitle:
        'Deze kunt u meestal vinden in witte tekst onder of boven de lampen',
      pathMerge: 'extra_properties',
      ifAllOf: {
        subcategory: 'verkeerslicht',
        extra_verkeerslicht: 'geen_beschadigingen',
      },
    },
    render: QuestionFieldType.TextInput,
  },

  extra_fietsrek_aanvragen: {
    meta: {
      ifAllOf: {
        subcategory: 'fietsrek-nietje',
      },
      label: "Wilt u een nieuw fietsenrek of 'nietje' aanvragen?",
      shortLabel: 'Fietsenrek aanvragen',
      pathMerge: 'extra_properties',
      values: {
        ja: 'Ja, dat ik wil ik',
        nee: 'Nee, ik wil direct verder gaan',
      },
    },
    options: {
      validators: ['required'],
    },
    render: QuestionFieldType.RadioInput,
  },
  extra_fietsrek_aanvraag: {
    meta: {
      ifAllOf: {
        subcategory: 'fietsrek-nietje',
        extra_fietsrek_aanvragen: 'ja',
      },
      value:
        'Een nieuw fietsenrek of ‘nietje’ kunt u aanvragen met het [aanvraagformulier](https://formulier.amsterdam.nl/thema/wonen/fietsnietje/aanvragen/).',
      type: 'info',
      pathMerge: 'extra_properties',
    },
    render: QuestionFieldType.PlainText,
  },
}

export default wegenVerkeerStraatmeubilair
