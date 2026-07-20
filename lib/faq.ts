export type FaqItem = {
  question: string
  answer: string
}

export function buildFaqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/** /meriseabeebid — ainult beebid, pedigree, broneering */
export const meriseabeebidFaq: FaqItem[] = [
  {
    question: 'Kas müüte täiskasvanud merisead?',
    answer:
      'Ei. PetsVilla müüb ainult meriseabeebisid (vanus 5–8 nädalat). Aretuse vanemad ei ole müügiks.',
  },
  {
    question: 'Kuidas meriseabeebi broneerimine käib?',
    answer:
      'Vali galeriist sobiv beebi ja vajuta „Broneeri“ — see saadab meile päringu. Elusloomad ei lähe ostukorvi. Lepime kokku külastuse Soinastes; ost vormistatakse kohtumisel koos pedigree info ja hooldussoovitustega.',
  },
  {
    question: 'Mis on meriseabeebi dokumenteeritud päritolu?',
    answer:
      'Dokumenteeritud päritolu (pedigree) tähendab, et meie meriseabeebid on tõuloomad, kelle vanemate ja vanavanemate informatsioon on täpselt dokumenteeritud. See kinnitab nende tõuomadusi ja tervise tausta.',
  },
  {
    question: 'Kui vanad on meriseabeebid müümisel?',
    answer:
      'Meie meriseabeebid on müümisel vanuses 5–8 nädalat. Selles vanuses on nad juba iseseisvad, söövad ise ja on valmis liikuma uude koju.',
  },
  {
    question: 'Kas meriseabeebid on tervisekontrolliga?',
    answer:
      'Jah, kõik meie beebid saavad enne uude koju minekut parasiiditõrje ja tervisekontrolli. Me paneme suurt rõhku vanemapopulatsiooni tervisele ja iseloomule.',
  },
  {
    question: 'Millised värvid on saadaval?',
    answer:
      'Meil on üle 50 tõumeriseaga erinevate värvide ja karvastruktuuriga: pruun, hõbedane, must, kreemikas, rosette, valge, must-valge, valge-hall ja tume-pruun. Täpne valik muutub — vaata galeriid.',
  },
]

/** /telli-hein — hind, tarne, kogused */
export const telliHeinFaq: FaqItem[] = [
  {
    question: 'Kui palju maksab heinakott?',
    answer:
      'Üks 80L viljakott (~4 kg) maksab 9€. Hind sisaldab SmartPost tarnet Eestis.',
  },
  {
    question: 'Kuidas tarne töötab?',
    answer:
      'Hein läheb SmartPost pakiautomaati. Vali vormil sobiv automaat; pärast makset ja teekonda saad SMS-i, kui pakk on kapis.',
  },
  {
    question: 'Mitu kotti saab korraga tellida?',
    answer:
      'Vormil saad valida soovitud koguse. Suurema tellimuse või erisoovi korral kirjuta service@petsvilla.ee või helista +372 512 7938.',
  },
  {
    question: 'Kas saab lisada ka meriseatoitu?',
    answer:
      'Jah — tellimusvormil saab lisada meriseatoitu (1 kg = 9€). Makse toimub turvaliselt Montonio kaudu.',
  },
  {
    question: 'Millistele loomadele hein sobib?',
    answer:
      'Meie hein sobib merisigadele, küülikutele ja teistele närilistele. Hein moodustab merisigade toidulauast suure osa.',
  },
]

/** /viirpapagoid — broneering, üleandmine, papagoi.ee */
export const viirpapagoidFaq: FaqItem[] = [
  {
    question: 'Kuidas viirpapagoi broneerida?',
    answer:
      'Vaata galeriist saadaval linde ja vajuta „Broneeri“. Saadame päringu; lepime kokku üleandmise. Linnud ei lähe ostukorvi nagu e-poe tooted.',
  },
  {
    question: 'Kus ja kuidas lind üle antakse?',
    answer:
      'Üleandmine toimub kokkuleppel Soinastes (Tartu mnt 80). Kohtumisel saad lindu näha ja saad kaasa hooldussoovitused.',
  },
  {
    question: 'Mis vahe on petsvilla.ee ja papagoi.ee vahel?',
    answer:
      'petsvilla.ee on PetsVilla OÜ müük ja aretus (viirpapagoid, merisead, hein). papagoi.ee on eraldi bränd külastuselamusele (toidmine, grupid) — seal ei müüda PetsVilla aretuse linde.',
  },
  {
    question: 'Kas linnud on inimestega harjunud?',
    answer:
      'Jah. Kasvatame näitusekvaliteediga viirpapagoisid, pöörates tähelepanu tervisele, sulestikule ja sotsialiseerimisele. Pakume eluaegset nõustamist.',
  },
]

/** /kontakt — maksed, tagastus, üldine (ei korda looma-/heina-detaili) */
export const kontaktFaq: FaqItem[] = [
  {
    question: 'Kuidas teiega ühendust võtta?',
    answer:
      'Helista +372 512 7938 või kirjuta service@petsvilla.ee. Võid kasutada ka selle lehe vormi. Aadress: Tartu mnt 80, Soinaste, Kambja vald.',
  },
  {
    question: 'Kuidas maksta heina või toodete eest?',
    answer:
      'Heinatellimus makstakse online Montonio kaudu (/telli-hein). E-poe kataloogitooted on praegu päringupõhised — makse lepime kokku pärast kontakti.',
  },
  {
    question: 'Kuidas maksta merisea või viirpapagoi eest?',
    answer:
      'Elusloomad broneeritakse päringuga; makse ja üleandmine lepime kokku kohtumisel Soinastes. Online ostukorvi elusloomadele ei ole.',
  },
  {
    question: 'Milline on tagastuspoliitika?',
    answer:
      'Kauba tagastamise tingimused on kirjas tagastuspoliitika lehel (https://petsvilla.ee/tagastuspoliitika). Elusloomadele kehtivad eritingimused — küsi meilt enne ostu.',
  },
]
