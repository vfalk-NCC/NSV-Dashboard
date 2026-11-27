// Exempeldata för NSV. Datum räknas relativt dagens datum så att demon
// alltid ser aktuell ut. Ersätts av riktig data när den finns.

function d(offset) {
  const x = new Date(); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() + offset);
  const z = (n) => String(n).padStart(2, '0');
  return `${x.getFullYear()}-${z(x.getMonth() + 1)}-${z(x.getDate())}`;
}
function ts(offset, h = 9, m = 0) {
  const x = new Date(); x.setDate(x.getDate() + offset); x.setHours(h, m, 0, 0); return x.toISOString();
}

export function createSeed() {
  const P = { al: 'A. Lindqvist', mb: 'M. Berg', sn: 'S. Nilsson', jh: 'J. Holm', es: 'E. Sandberg', kp: 'K. Persson', lw: 'L. Wikström' };

  const areas = [
    { id: 'ar-745', code: '745', name: 'Processbyggnad', color: '#4f8cff' },
    { id: 'ar-746', code: '746', name: 'Transportörbro', color: '#a78bfa' },
    { id: 'ar-750', code: '750', name: 'Ställverk', color: '#f5b84b' },
    { id: 'ar-755', code: '755', name: 'Mark & VA', color: '#3ecf8e' }
  ];

  const packages = [
    { id: 'pk-f12', code: 'F12', name: 'Foundation F12', kind: 'Grundläggning', areaId: 'ar-745', wbs: '745.10.12', discipline: 'Konstruktion', contractor: 'NCC Grund', responsible: P.al, status: 'active', description: 'Platsgjuten grundplatta med pålning för processbyggnadens norra del. Kritisk för stålmontage.' },
    { id: 'pk-f13', code: 'F13', name: 'Foundation F13', kind: 'Grundläggning', areaId: 'ar-745', wbs: '745.10.13', discipline: 'Konstruktion', contractor: 'NCC Grund', responsible: P.al, status: 'risk', description: 'Grundplatta södra delen. Bergnivå avviker från förutsättning.' },
    { id: 'pk-s01', code: 'S01', name: 'Stålstomme S01', kind: 'Stomme', areaId: 'ar-745', wbs: '745.20.01', discipline: 'Konstruktion', contractor: 'UE Stålmontage', responsible: P.mb, status: 'planned', description: 'Montage av primärstomme, axel A–F.' },
    { id: 'pk-b02', code: 'B02', name: 'Bjälklag B02', kind: 'Bjälklag', areaId: 'ar-745', wbs: '745.30.02', discipline: 'Konstruktion', contractor: 'NCC Betong', responsible: P.sn, status: 'planned', description: 'Mellanbjälklag +12.0 med håltagningar för process.' },
    { id: 'pk-t01', code: 'T01', name: 'Transportörbro T01', kind: 'Bro', areaId: 'ar-746', wbs: '746.20.01', discipline: 'Konstruktion', contractor: 'UE Stålmontage', responsible: P.mb, status: 'active', description: 'Fackverksbro mellan 745 och 746, inklusive stödben.' },
    { id: 'pk-e01', code: 'E01', name: 'Ställverk E01', kind: 'El', areaId: 'ar-750', wbs: '750.40.01', discipline: 'El', contractor: 'UE El', responsible: P.jh, status: 'active', description: 'Byggnad och installation av mellanspänningsställverk.' },
    { id: 'pk-m03', code: 'M03', name: 'Markarbeten M03', kind: 'Mark', areaId: 'ar-755', wbs: '755.10.03', discipline: 'Mark', contractor: 'UE Mark', responsible: P.es, status: 'done', description: 'Schakt, fyllning och dagvatten öster om 745.' },
    { id: 'pk-v02', code: 'V02', name: 'VA-ledningar V02', kind: 'VA', areaId: 'ar-755', wbs: '755.20.02', discipline: 'VVS', contractor: 'UE Mark', responsible: P.es, status: 'active', description: 'Spill- och processvattenledningar till 745.' }
  ];

  const A = (id, code, name, packageId, start, end, progress, extra = {}) => {
    const pk = packages.find((p) => p.id === packageId);
    return { id, code, name, packageId, areaId: pk.areaId, discipline: pk.discipline, contractor: pk.contractor, responsible: pk.responsible, start: d(start), end: d(end), progress, ...extra };
  };
  const activities = [
    A('ac-f12-1', 'F12.01', 'Pålning F12', 'pk-f12', -38, -16, 100),
    A('ac-f12-2', 'F12.02', 'Armering grundplatta F12', 'pk-f12', -14, 3, 70),
    A('ac-f12-3', 'F12.03', 'Gjutning grundplatta F12', 'pk-f12', 4, 9, 0, { milestone: false }),
    A('ac-f12-4', 'F12.04', 'Ingjutningsgods & bultgrupper', 'pk-f12', -6, 6, 40),
    A('ac-f12-5', 'F12.05', 'Härdning & avformning F12', 'pk-f12', 10, 21, 0),
    A('ac-f13-1', 'F13.01', 'Bergsprängning F13', 'pk-f13', -30, -4, 85, { responsible: P.kp }),
    A('ac-f13-2', 'F13.02', 'Pålning F13', 'pk-f13', 2, 20, 0),
    A('ac-f13-3', 'F13.03', 'Grundplatta F13', 'pk-f13', 22, 44, 0),
    A('ac-s01-1', 'S01.01', 'Leverans stål etapp 1', 'pk-s01', 14, 16, 0),
    A('ac-s01-2', 'S01.02', 'Montage pelare axel A–C', 'pk-s01', 17, 38, 0),
    A('ac-s01-3', 'S01.03', 'Montage takstolar', 'pk-s01', 39, 62, 0),
    A('ac-b02-1', 'B02.01', 'Formsättning bjälklag +12.0', 'pk-b02', 46, 66, 0),
    A('ac-b02-2', 'B02.02', 'Gjutning bjälklag +12.0', 'pk-b02', 67, 72, 0),
    A('ac-t01-1', 'T01.01', 'Stödben T01 – fundament', 'pk-t01', -20, -2, 90),
    A('ac-t01-2', 'T01.02', 'Förmontage fackverk', 'pk-t01', -5, 12, 30),
    A('ac-t01-3', 'T01.03', 'Lyft bro T01', 'pk-t01', 13, 15, 0, { milestone: true }),
    A('ac-e01-1', 'E01.01', 'Grund ställverksbyggnad', 'pk-e01', -45, -22, 100),
    A('ac-e01-2', 'E01.02', 'Montage prefab ställverk', 'pk-e01', -21, 1, 75),
    A('ac-e01-3', 'E01.03', 'Kabeldragning MS', 'pk-e01', 2, 30, 0),
    A('ac-e01-4', 'E01.04', 'Provdrift ställverk', 'pk-e01', 31, 36, 0, { milestone: true }),
    A('ac-m03-1', 'M03.01', 'Schakt & fyllning öst', 'pk-m03', -70, -30, 100),
    A('ac-v02-1', 'V02.01', 'Ledningsschakt V02', 'pk-v02', -12, 8, 55),
    A('ac-v02-2', 'V02.02', 'Ledningsläggning & provtryckning', 'pk-v02', 9, 28, 0)
  ];

  const D = (id, number, name, rev, discipline, areaId, status, offset) => ({ id, number, name, rev, discipline, areaId, status, date: d(offset), source: '' });
  const drawings = [
    D('dr-1', 'F12-123', 'Grundplatta F12 – armering, plan', 'C', 'Konstruktion', 'ar-745', 'construction', -18),
    D('dr-2', 'F12-124', 'Grundplatta F12 – sektioner', 'B', 'Konstruktion', 'ar-745', 'construction', -18),
    D('dr-3', 'F12-130', 'Ingjutningsgods F12', 'D', 'Konstruktion', 'ar-745', 'review', -2),
    D('dr-4', 'F13-201', 'Grundplatta F13 – plan', 'A', 'Konstruktion', 'ar-745', 'review', -5),
    D('dr-5', 'F13-202', 'Pålplan F13', 'B', 'Konstruktion', 'ar-745', 'approved', -9),
    D('dr-6', 'S01-301', 'Stålstomme – pelarplan', 'A', 'Konstruktion', 'ar-745', 'prelim', -1),
    D('dr-7', 'S01-302', 'Stålstomme – takplan', 'A', 'Konstruktion', 'ar-745', 'prelim', -1),
    D('dr-8', 'B02-401', 'Bjälklag +12.0 – håltagningar', 'B', 'Konstruktion', 'ar-745', 'review', -7),
    D('dr-9', 'T01-501', 'Transportörbro – översikt', 'C', 'Konstruktion', 'ar-746', 'construction', -25),
    D('dr-10', 'T01-505', 'Stödben – detaljer', 'B', 'Konstruktion', 'ar-746', 'approved', -11),
    D('dr-11', 'E01-601', 'Ställverk – enlinjeschema', 'E', 'El', 'ar-750', 'construction', -14),
    D('dr-12', 'E01-610', 'Kabelstegar ställverk', 'B', 'El', 'ar-750', 'review', -3),
    D('dr-13', 'V02-701', 'VA-plan öst', 'C', 'VVS', 'ar-755', 'construction', -20),
    D('dr-14', 'A-745-101', 'Processbyggnad – planer', 'D', 'Arkitekt', 'ar-745', 'approved', -15)
  ];

  const models = [
    { id: 'md-k745', name: 'K-modell 745', discipline: 'Konstruktion', areaId: 'ar-745', responsible: P.sn, versions: [
      { v: 35, date: d(-28), author: P.sn, note: 'Pålar F12 uppdaterade', schema: 'IFC4', file: null },
      { v: 36, date: d(-14), author: P.sn, note: 'Ingjutningsgods F12', schema: 'IFC4', file: null },
      { v: 37, date: d(-3), author: P.sn, note: 'F13 bergnivå justerad', schema: 'IFC4', file: null }
    ] },
    { id: 'md-a745', name: 'A-modell 745', discipline: 'Arkitekt', areaId: 'ar-745', responsible: P.lw, versions: [
      { v: 21, date: d(-30), author: P.lw, note: 'Fasader', schema: 'IFC2X3', file: null },
      { v: 22, date: d(-9), author: P.lw, note: 'Dörrar och portar', schema: 'IFC2X3', file: null }
    ] },
    { id: 'md-e750', name: 'E-modell 750', discipline: 'El', areaId: 'ar-750', responsible: P.jh, versions: [
      { v: 12, date: d(-6), author: P.jh, note: 'Kabelstegar', schema: 'IFC4', file: null }
    ] },
    { id: 'md-p745', name: 'P-modell 745', discipline: 'Process', areaId: 'ar-745', responsible: P.kp, versions: [
      { v: 8, date: d(-40), author: P.kp, note: 'Utrustningsplacering', schema: 'IFC4', file: null },
      { v: 9, date: d(-12), author: P.kp, note: 'Rörgator', schema: 'IFC4', file: null }
    ] }
  ];

  const I = (id, code, name, status, priority, packageId, responsible, due, created, description, discipline = 'Konstruktion') => {
    const pk = packages.find((p) => p.id === packageId);
    return { id, code, name, status, priority, packageId, areaId: pk?.areaId, discipline, responsible, due: d(due), created: ts(created), description, contractor: pk?.contractor };
  };
  const issues = [
    I('is-18', 'DI-018', 'Kollision bultgrupp och armering axel C3', 'open', 'high', 'pk-f12', P.sn, 2, -4, 'Bultgrupp BG-07 krockar med huvudarmering i K-modell v37. Måste lösas före gjutning F12.03.'),
    I('is-19', 'DI-019', 'Bergnivå F13 avviker 0,6 m', 'inprogress', 'high', 'pk-f13', P.kp, 5, -9, 'Geoteknisk undersökning visar lägre bergnivå. Påverkar pållängder och tidplan.'),
    I('is-20', 'DI-020', 'Saknad håltagning för processrör +12.0', 'open', 'medium', 'pk-b02', P.lw, 14, -3, 'P-modell v9 visar rör DN300 genom bjälklag utan håltagning i B02-401.', 'Process'),
    I('is-21', 'DI-021', 'Kabelstege i konflikt med ventilationskanal', 'open', 'medium', 'pk-e01', P.jh, 9, -2, 'Höjdkonflikt i ställverksbyggnad, rum 750-03.', 'El'),
    I('is-22', 'DI-022', 'Lyftplan T01 ej godkänd', 'inprogress', 'high', 'pk-t01', P.mb, 6, -6, 'Kranplacering kräver förstärkt kranplan. Väntar på beräkning.'),
    I('is-17', 'DI-017', 'Fel revision på pålplan i fält', 'resolved', 'low', 'pk-f13', P.al, -3, -14, 'Rev A användes i fält. Rev B utdelad och gammal makulerad.'),
    I('is-16', 'DI-016', 'Dagvattenbrunn felplacerad', 'closed', 'low', 'pk-m03', P.es, -20, -35, 'Flyttad 1,2 m enligt beslut B-004.', 'Mark'),
    I('is-23', 'DI-023', 'Provtryckningsprotokoll saknas V02', 'open', 'low', 'pk-v02', P.es, 20, -1, 'Krav enligt AF. Mall skickad till UE.', 'VVS')
  ];

  const X = (id, code, name, status, responsible, due, packageId, extra = {}) => {
    const pk = packages.find((p) => p.id === packageId);
    return { id, code, name, status, responsible, due: d(due), packageId, areaId: pk?.areaId, discipline: pk?.discipline, contractor: pk?.contractor, created: ts(-5), ...extra };
  };
  const actions = [
    X('ax-31', 'A-031', 'Ta fram lösning för BG-07 med konstruktör', 'doing', P.sn, 1, 'pk-f12'),
    X('ax-32', 'A-032', 'Beställ betong för F12.03', 'open', P.al, 2, 'pk-f12'),
    X('ax-33', 'A-033', 'Uppdatera pållängder F13', 'doing', P.kp, 4, 'pk-f13'),
    X('ax-34', 'A-034', 'Boka mobilkran för lyft T01', 'open', P.mb, 7, 'pk-t01'),
    X('ax-35', 'A-035', 'Granska F12-130 rev D', 'open', P.al, 0, 'pk-f12'),
    X('ax-36', 'A-036', 'Samordningsmöte kabelstegar/vent', 'open', P.jh, 3, 'pk-e01'),
    X('ax-37', 'A-037', 'Skicka håltagningsunderlag till konstruktör', 'open', P.lw, -2, 'pk-b02'),
    X('ax-30', 'A-030', 'Kontrollera ingjutningsgods mot v37', 'done', P.sn, -3, 'pk-f12'),
    X('ax-29', 'A-029', 'Egenkontroll pålning F12', 'done', P.al, -10, 'pk-f12'),
    X('ax-38', 'A-038', 'Revidera lyftplan T01', 'doing', P.mb, 5, 'pk-t01'),
    X('ax-39', 'A-039', 'Ta fram provtryckningsplan V02', 'open', P.es, 12, 'pk-v02')
  ];

  const decisions = [
    { id: 'de-7', code: 'B-007', name: 'Förlängda pålar F13 (+0,6 m)', status: 'proposed', date: d(-2), packageId: 'pk-f13', areaId: 'ar-745', responsible: P.kp, description: 'Förslag att förlänga pålar i stället för att fylla upp. Kostnad och tid utreds.' },
    { id: 'de-6', code: 'B-006', name: 'Gjutning F12 i två etapper', status: 'decided', date: d(-8), packageId: 'pk-f12', areaId: 'ar-745', responsible: P.al, description: 'Grundplatta F12 gjuts i två etapper med gjutfog vid axel D.' },
    { id: 'de-5', code: 'B-005', name: 'Lyft T01 med 500-tonskran', status: 'decided', date: d(-16), packageId: 'pk-t01', areaId: 'ar-746', responsible: P.mb, description: 'En kran i stället för tandemlyft.' },
    { id: 'de-4', code: 'B-004', name: 'Flytt av dagvattenbrunn DB-3', status: 'decided', date: d(-28), packageId: 'pk-m03', areaId: 'ar-755', responsible: P.es, description: 'Brunn flyttas 1,2 m österut.' }
  ];

  const meetings = [
    { id: 'me-1', name: 'Byggmöte 14', kind: 'Byggmöte', date: d(-7), packageId: null, areaId: null, notes: 'Genomgång tidplan, F12 och T01 kritiska. Beslut B-006.' },
    { id: 'me-2', name: 'Projekteringsmöte K 22', kind: 'Projektering', date: d(-3), packageId: 'pk-f12', areaId: 'ar-745', notes: 'Kollision BG-07 (DI-018). K-modell v37 genomgången.' },
    { id: 'me-3', name: 'Samordning 745 v.' + weekNo(-1), kind: 'Samordning', date: d(-1), packageId: null, areaId: 'ar-745', notes: 'Bergnivå F13, håltagningar B02.' },
    { id: 'me-4', name: 'Byggmöte 15', kind: 'Byggmöte', date: d(7), packageId: null, areaId: null, notes: '' },
    { id: 'me-5', name: 'Lyftmöte T01', kind: 'Arbetsberedning', date: d(4), packageId: 'pk-t01', areaId: 'ar-746', notes: 'Lyftplan, kranplan och avspärrningar.' }
  ];

  const documents = [
    { id: 'do-1', kind: 'email', name: 'RE: BG-07 armering.eml', subject: 'RE: BG-07 krockar med armering', from: 'konstruktor@exempel.se', date: d(-3), packageId: 'pk-f12', file: null },
    { id: 'do-2', kind: 'email', name: 'Bergnivå F13.eml', subject: 'Bergnivå F13 – resultat sondering', from: 'geo@exempel.se', date: d(-9), packageId: 'pk-f13', file: null },
    { id: 'do-3', kind: 'email', name: 'Kranbokning.eml', subject: 'Kranbokning vecka ' + weekNo(13), from: 'kran@exempel.se', date: d(-4), packageId: 'pk-t01', file: null },
    { id: 'do-4', kind: 'photo', name: 'IMG_2231.jpg', subject: 'Armering F12 axel C', date: d(-2), packageId: 'pk-f12', file: null, hue: 210 },
    { id: 'do-5', kind: 'photo', name: 'IMG_2240.jpg', subject: 'Bultgrupp BG-07', date: d(-2), packageId: 'pk-f12', file: null, hue: 28 },
    { id: 'do-6', kind: 'photo', name: 'IMG_2190.jpg', subject: 'Berg i schakt F13', date: d(-9), packageId: 'pk-f13', file: null, hue: 140 },
    { id: 'do-7', kind: 'photo', name: 'IMG_2251.jpg', subject: 'Förmontage fackverk T01', date: d(-1), packageId: 'pk-t01', file: null, hue: 265 },
    { id: 'do-8', kind: 'pdf', name: 'Egenkontroll pålning F12.pdf', subject: 'Egenkontroll pålning F12', date: d(-15), packageId: 'pk-f12', file: null },
    { id: 'do-9', kind: 'pdf', name: 'Arbetsberedning lyft T01.pdf', subject: 'Arbetsberedning lyft T01', date: d(-5), packageId: 'pk-t01', file: null }
  ];

  const R = (at, aid, bt, bid, off = -5) => ({ id: `rel-${aid}-${bid}`, a: { t: at, id: aid }, b: { t: bt, id: bid }, ts: ts(off) });
  const relations = [
    R('drawing', 'dr-1', 'package', 'pk-f12'), R('drawing', 'dr-2', 'package', 'pk-f12'), R('drawing', 'dr-3', 'package', 'pk-f12'),
    R('drawing', 'dr-1', 'activity', 'ac-f12-2'), R('drawing', 'dr-3', 'activity', 'ac-f12-4'), R('drawing', 'dr-2', 'activity', 'ac-f12-3'),
    R('drawing', 'dr-4', 'package', 'pk-f13'), R('drawing', 'dr-5', 'package', 'pk-f13'),
    R('drawing', 'dr-6', 'package', 'pk-s01'), R('drawing', 'dr-7', 'package', 'pk-s01'), R('drawing', 'dr-8', 'package', 'pk-b02'),
    R('drawing', 'dr-9', 'package', 'pk-t01'), R('drawing', 'dr-10', 'package', 'pk-t01'), R('drawing', 'dr-11', 'package', 'pk-e01'),
    R('drawing', 'dr-12', 'package', 'pk-e01'), R('drawing', 'dr-13', 'package', 'pk-v02'),
    R('model', 'md-k745', 'package', 'pk-f12'), R('model', 'md-k745', 'package', 'pk-f13'), R('model', 'md-k745', 'package', 'pk-s01'),
    R('model', 'md-k745', 'package', 'pk-b02'), R('model', 'md-p745', 'package', 'pk-b02'), R('model', 'md-e750', 'package', 'pk-e01'),
    R('issue', 'is-18', 'drawing', 'dr-3'), R('issue', 'is-18', 'model', 'md-k745'), R('issue', 'is-18', 'activity', 'ac-f12-3'),
    R('issue', 'is-19', 'activity', 'ac-f13-2'), R('issue', 'is-20', 'drawing', 'dr-8'), R('issue', 'is-20', 'model', 'md-p745'),
    R('issue', 'is-22', 'activity', 'ac-t01-3'),
    R('action', 'ax-31', 'issue', 'is-18'), R('action', 'ax-33', 'issue', 'is-19'), R('action', 'ax-37', 'issue', 'is-20'),
    R('action', 'ax-38', 'issue', 'is-22'), R('action', 'ax-36', 'issue', 'is-21'), R('action', 'ax-35', 'drawing', 'dr-3'),
    R('decision', 'de-7', 'issue', 'is-19'), R('decision', 'de-6', 'activity', 'ac-f12-3'), R('decision', 'de-5', 'activity', 'ac-t01-3'),
    R('document', 'do-1', 'issue', 'is-18'), R('document', 'do-1', 'decision', 'de-6'), R('document', 'do-2', 'decision', 'de-7'),
    R('document', 'do-5', 'issue', 'is-18'), R('document', 'do-6', 'issue', 'is-19'), R('document', 'do-8', 'activity', 'ac-f12-1'),
    R('document', 'do-9', 'activity', 'ac-t01-3'), R('document', 'do-3', 'action', 'ax-34'),
    R('meeting', 'me-2', 'issue', 'is-18'), R('meeting', 'me-1', 'decision', 'de-6'), R('meeting', 'me-3', 'issue', 'is-19'),
    R('meeting', 'me-5', 'activity', 'ac-t01-3')
  ];

  const history = [
    { id: 'h-1', ts: ts(0, 8, 12), text: 'Åtgärd A-031 ändrad till Pågår', ref: { t: 'action', id: 'ax-31' }, kind: 'status' },
    { id: 'h-2', ts: ts(-1, 15, 40), text: 'Foto IMG_2251.jpg kopplat till Transportörbro T01', ref: { t: 'package', id: 'pk-t01' }, kind: 'link' },
    { id: 'h-3', ts: ts(-2, 11, 5), text: 'Ärende DI-021 skapat: Kabelstege i konflikt med ventilationskanal', ref: { t: 'issue', id: 'is-21' }, kind: 'create' },
    { id: 'h-4', ts: ts(-2, 9, 30), text: 'Ritning F12-130 rev D till granskning', ref: { t: 'drawing', id: 'dr-3' }, kind: 'status' },
    { id: 'h-5', ts: ts(-3, 14, 0), text: 'K-modell 745 v37 importerad', ref: { t: 'model', id: 'md-k745' }, kind: 'create' },
    { id: 'h-6', ts: ts(-3, 10, 20), text: 'Beslut B-007 föreslaget: Förlängda pålar F13', ref: { t: 'decision', id: 'de-7' }, kind: 'create' },
    { id: 'h-7', ts: ts(-4, 13, 10), text: 'Ärende DI-018 skapat: Kollision bultgrupp och armering', ref: { t: 'issue', id: 'is-18' }, kind: 'create' },
    { id: 'h-8', ts: ts(-8, 16, 0), text: 'Beslut B-006 fattat: Gjutning F12 i två etapper', ref: { t: 'decision', id: 'de-6' }, kind: 'status' }
  ];

  const whiteboard = {
    view: { x: 0, y: 0, z: 1 },
    cards: [
      { id: 'wb-1', ref: { t: 'package', id: 'pk-f12' }, x: 80, y: 80 },
      { id: 'wb-2', ref: { t: 'issue', id: 'is-18' }, x: 420, y: 40 },
      { id: 'wb-3', ref: { t: 'drawing', id: 'dr-3' }, x: 420, y: 230 },
      { id: 'wb-4', ref: { t: 'action', id: 'ax-31' }, x: 760, y: 110 },
      { id: 'wb-5', note: 'Gjutning F12.03 hänger på DI-018.\nKlart senast fredag?', x: 80, y: 300, color: 'amber' }
    ]
  };

  const now = new Date().toISOString();
  const tools = [
    { id: 'image-comparison', name: 'Bildjämförelse', description: 'Jämför två platsbilder med reglage – före/efter.', category: 'Visualisering', scope: 'personal', version: '1.0', icon: '◐', tags: ['foto', 'jämförelse'], entry: 'index.html', folder: 'user_tools/image-comparison', builtin: true, favourite: true, created: now, modified: now, lastUsed: null, useCount: 0, notes: '' },
    { id: 'concrete-calculator', name: 'Betongkalkylator', description: 'Volym, bilar och gjuttid för en gjutetapp.', category: 'Kalkyl', scope: 'personal', version: '1.0', icon: '▦', tags: ['betong', 'gjutning'], entry: 'index.html', folder: 'user_tools/concrete-calculator', builtin: true, favourite: true, created: now, modified: now, lastUsed: null, useCount: 0, notes: '' }
  ];

  return {
    version: 1,
    demo: true,
    project: { id: 'nsv', name: 'NSV', fullName: 'NSV – exempelprojekt', phase: 'Produktion', updated: now },
    people: Object.values(P),
    areas, packages, activities, drawings, models, issues, actions, decisions, meetings, documents, relations, history, whiteboard, tools,
    savedFilters: [
      { id: 'sf-1', name: '745 Konstruktion · 4 v', fav: true, filter: { area: ['ar-745'], discipline: ['Konstruktion'], period: '4w' } }
    ]
  };
}

function weekNo(offsetDays) {
  const x = new Date(); x.setDate(x.getDate() + offsetDays);
  const t = new Date(Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y0) / 86400000 + 1) / 7);
}
