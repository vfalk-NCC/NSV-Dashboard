/* Genererad av tools/build.js – redigera inte. Källkoden finns i js/. */
(function () {
'use strict';
const __defs = {}, __cache = {};
function __r(id) {
  if (__cache[id]) return __cache[id];
  const exports = __cache[id] = {};
  __defs[id](exports, __r);
  return exports;
}
__defs["js/seed.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "createSeed": { get: () => createSeed, enumerable: true }
});
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

function createSeed() {
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

};

__defs["js/store.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "TYPES": { get: () => TYPES, enumerable: true },
  "STATUS": { get: () => STATUS, enumerable: true },
  "STATUS_SETS": { get: () => STATUS_SETS, enumerable: true },
  "ACTION_STATUS_LABEL": { get: () => ACTION_STATUS_LABEL, enumerable: true },
  "PRIORITY": { get: () => PRIORITY, enumerable: true },
  "TOOL_CATEGORIES": { get: () => TOOL_CATEGORIES, enumerable: true },
  "store": { get: () => store, enumerable: true },
  "on": { get: () => on, enumerable: true },
  "emit": { get: () => emit, enumerable: true },
  "DAY": { get: () => DAY, enumerable: true },
  "today": { get: () => today, enumerable: true },
  "parseDate": { get: () => parseDate, enumerable: true },
  "isoDate": { get: () => isoDate, enumerable: true },
  "addDays": { get: () => addDays, enumerable: true },
  "daysBetween": { get: () => daysBetween, enumerable: true },
  "uid": { get: () => uid, enumerable: true },
  "refKey": { get: () => refKey, enumerable: true },
  "parseKey": { get: () => parseKey, enumerable: true },
  "sameRef": { get: () => sameRef, enumerable: true },
  "all": { get: () => all, enumerable: true },
  "get": { get: () => get, enumerable: true },
  "latestVersion": { get: () => latestVersion, enumerable: true },
  "codeOf": { get: () => codeOf, enumerable: true },
  "titleOf": { get: () => titleOf, enumerable: true },
  "labelOf": { get: () => labelOf, enumerable: true },
  "statusOf": { get: () => statusOf, enumerable: true },
  "areaOf": { get: () => areaOf, enumerable: true },
  "packageProgress": { get: () => packageProgress, enumerable: true },
  "areaProgress": { get: () => areaProgress, enumerable: true },
  "related": { get: () => related, enumerable: true },
  "relatedOfType": { get: () => relatedOfType, enumerable: true },
  "isLinked": { get: () => isLinked, enumerable: true },
  "people": { get: () => people, enumerable: true },
  "distinct": { get: () => distinct, enumerable: true },
  "nextCode": { get: () => nextCode, enumerable: true },
  "canUndo": { get: () => canUndo, enumerable: true },
  "undo": { get: () => undo, enumerable: true },
  "log": { get: () => log, enumerable: true },
  "mutate": { get: () => mutate, enumerable: true },
  "create": { get: () => create, enumerable: true },
  "update": { get: () => update, enumerable: true },
  "remove": { get: () => remove, enumerable: true },
  "link": { get: () => link, enumerable: true },
  "unlink": { get: () => unlink, enumerable: true },
  "historyFor": { get: () => historyFor, enumerable: true },
  "persist": { get: () => persist, enumerable: true },
  "init": { get: () => init, enumerable: true },
  "resetToSeed": { get: () => resetToSeed, enumerable: true },
  "clearAll": { get: () => clearAll, enumerable: true },
  "idbPut": { get: () => idbPut, enumerable: true },
  "idbGet": { get: () => idbGet, enumerable: true },
  "idbDel": { get: () => idbDel, enumerable: true },
  "fileToBase64": { get: () => fileToBase64, enumerable: true },
  "storeAttachment": { get: () => storeAttachment, enumerable: true },
  "fileUrl": { get: () => fileUrl, enumerable: true },
  "kindOfFile": { get: () => kindOfFile, enumerable: true }
});
// Datalager: entitetstyper, relationer, ändringar med ångra, och lagring
// mot den lokala servern (data/db.json) eller webbläsaren (demoläge).
const { createSeed } = __r("js/seed.js");

const TYPES = {
  area:     { coll: 'areas',      label: 'Område',      plural: 'Områden',     icon: 'map' },
  package:  { coll: 'packages',   label: 'Arbetspaket', plural: 'Arbetspaket', icon: 'box' },
  activity: { coll: 'activities', label: 'Aktivitet',   plural: 'Aktiviteter', icon: 'calendar' },
  drawing:  { coll: 'drawings',   label: 'Ritning',     plural: 'Ritningar',   icon: 'drawing' },
  model:    { coll: 'models',     label: 'Modell',      plural: 'Modeller',    icon: 'cube' },
  issue:    { coll: 'issues',     label: 'Ärende',      plural: 'Ärenden',     icon: 'alert' },
  action:   { coll: 'actions',    label: 'Åtgärd',      plural: 'Åtgärder',    icon: 'check' },
  decision: { coll: 'decisions',  label: 'Beslut',      plural: 'Beslut',      icon: 'gavel' },
  meeting:  { coll: 'meetings',   label: 'Möte',        plural: 'Möten',       icon: 'users' },
  document: { coll: 'documents',  label: 'Dokument',    plural: 'Dokument',    icon: 'paperclip' },
  tool:     { coll: 'tools',      label: 'Verktyg',     plural: 'Verktyg',     icon: 'tool' }
};

const STATUS = {
  // arbetspaket
  planned: { label: 'Planerad', tone: 'neutral' },
  active: { label: 'Pågår', tone: 'info' },
  risk: { label: 'Risk', tone: 'warn' },
  done: { label: 'Klar', tone: 'ok' },
  late: { label: 'Försenad', tone: 'bad' },
  // ritningar
  prelim: { label: 'Preliminär', tone: 'neutral' },
  review: { label: 'Granskning', tone: 'warn' },
  approved: { label: 'Godkänd', tone: 'ok' },
  construction: { label: 'Bygghandling', tone: 'accent' },
  // ärenden
  open: { label: 'Öppen', tone: 'info' },
  inprogress: { label: 'Under arbete', tone: 'warn' },
  resolved: { label: 'Löst', tone: 'ok' },
  closed: { label: 'Stängd', tone: 'neutral' },
  // åtgärder
  doing: { label: 'Pågår', tone: 'warn' },
  // beslut
  proposed: { label: 'Förslag', tone: 'warn' },
  decided: { label: 'Beslutat', tone: 'ok' }
};

const STATUS_SETS = {
  package: ['planned', 'active', 'risk', 'done'],
  activity: ['planned', 'active', 'late', 'done'],
  drawing: ['prelim', 'review', 'approved', 'construction'],
  issue: ['open', 'inprogress', 'resolved', 'closed'],
  action: ['open', 'doing', 'done'],
  decision: ['proposed', 'decided']
};
const ACTION_STATUS_LABEL = { open: 'Öppen', doing: 'Pågår', done: 'Klar' };

const PRIORITY = {
  high: { label: 'Hög', tone: 'bad' },
  medium: { label: 'Medel', tone: 'warn' },
  low: { label: 'Låg', tone: 'neutral' }
};

const TOOL_CATEGORIES = ['Planering', 'VDC', 'Produktion', 'Kalkyl', 'Visualisering', 'Dokument', 'Experiment', 'Övrigt'];

// ------------------------------------------------------------------ state
const store = {
  db: null,
  mode: 'local',          // 'server' | 'local'
  server: null,           // /api/health-svaret
  saveState: 'saved'      // 'saved' | 'saving' | 'error'
};

const listeners = new Map();
function on(evt, fn) {
  if (!listeners.has(evt)) listeners.set(evt, new Set());
  listeners.get(evt).add(fn);
  return () => listeners.get(evt).delete(fn);
}
function emit(evt, payload) {
  (listeners.get(evt) || []).forEach((fn) => { try { fn(payload); } catch (e) { console.error(e); } });
}

// ------------------------------------------------------------------ datum
const DAY = 86400000;
function today() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function parseDate(s) { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function isoDate(d) { const z = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function daysBetween(a, b) { return Math.round((b - a) / DAY); }

// ------------------------------------------------------------------ uppslag
const uid = (p = 'x') => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const refKey = (r) => `${r.t}:${r.id}`;
const parseKey = (k) => { const i = k.indexOf(':'); return { t: k.slice(0, i), id: k.slice(i + 1) }; };
const sameRef = (a, b) => a && b && a.t === b.t && a.id === b.id;

function all(t) { return store.db[TYPES[t].coll] || []; }
function get(ref) { if (!ref || !TYPES[ref.t]) return null; return all(ref.t).find((x) => x.id === ref.id) || null; }

function latestVersion(model) {
  return (model.versions || []).reduce((a, b) => (!a || b.v > a.v ? b : a), null);
}

/** Kort kod, t.ex. F12, DI-018, F12-123 */
function codeOf(ref, e = get(ref)) {
  if (!e) return '';
  switch (ref.t) {
    case 'area': return e.code;
    case 'drawing': return e.number;
    case 'model': { const v = latestVersion(e); return v ? `v${v.v}` : ''; }
    case 'meeting': return e.date?.slice(5) || '';
    case 'document': return (e.kind || '').toUpperCase();
    case 'tool': return e.version ? `v${e.version}` : '';
    default: return e.code || '';
  }
}
function titleOf(ref, e = get(ref)) {
  if (!e) return '(borttagen)';
  switch (ref.t) {
    case 'area': return `Område ${e.code} · ${e.name}`;
    case 'document': return e.subject || e.name;
    default: return e.name || e.title || e.code || e.id;
  }
}
function labelOf(ref) { const c = codeOf(ref); const t = titleOf(ref); return c && !t.includes(c) ? `${c} ${t}` : t; }

/** Status för en entitet – aktiviteter räknas fram från datum och framdrift. */
function statusOf(ref, e = get(ref)) {
  if (!e) return null;
  if (ref.t === 'activity') {
    const t = today();
    if (e.progress >= 100) return 'done';
    if (parseDate(e.end) < t) return 'late';
    if (parseDate(e.start) <= t) return 'active';
    return 'planned';
  }
  return e.status || null;
}

function areaOf(ref, e = get(ref)) {
  if (!e) return null;
  if (ref.t === 'area') return e;
  if (e.areaId) return get({ t: 'area', id: e.areaId });
  if (e.packageId) { const p = get({ t: 'package', id: e.packageId }); if (p) return get({ t: 'area', id: p.areaId }); }
  return null;
}

function packageProgress(pkg) {
  const acts = all('activity').filter((a) => a.packageId === pkg.id);
  if (!acts.length) return pkg.progress || 0;
  const tot = acts.reduce((s, a) => s + Math.max(1, daysBetween(parseDate(a.start), parseDate(a.end))), 0);
  const done = acts.reduce((s, a) => s + Math.max(1, daysBetween(parseDate(a.start), parseDate(a.end))) * (a.progress / 100), 0);
  return Math.round((done / tot) * 100);
}

function areaProgress(area) {
  const pk = all('package').filter((p) => p.areaId === area.id);
  if (!pk.length) return 0;
  return Math.round(pk.reduce((s, p) => s + packageProgress(p), 0) / pk.length);
}

/**
 * Allt som hänger ihop med ref: explicita relationer plus strukturella
 * kopplingar via packageId/areaId. Returnerar [{ref, relId|null}].
 */
function related(ref) {
  const out = new Map();
  const add = (r, relId = null) => {
    if (!r || sameRef(r, ref) || !get(r)) return;
    const k = refKey(r);
    if (!out.has(k) || relId) out.set(k, { ref: r, relId: relId || out.get(k)?.relId || null });
  };
  for (const rel of store.db.relations) {
    if (sameRef(rel.a, ref)) add(rel.b, rel.id);
    else if (sameRef(rel.b, ref)) add(rel.a, rel.id);
  }
  const e = get(ref);
  if (!e) return [];
  if (e.packageId) add({ t: 'package', id: e.packageId });
  if (e.areaId && ref.t !== 'package') add({ t: 'area', id: e.areaId });
  if (ref.t === 'package') {
    add({ t: 'area', id: e.areaId });
    for (const t of ['activity', 'issue', 'action']) all(t).filter((x) => x.packageId === e.id).forEach((x) => add({ t, id: x.id }));
  }
  if (ref.t === 'area') {
    for (const t of ['package', 'activity', 'drawing', 'model', 'issue', 'action']) {
      all(t).filter((x) => x.areaId === e.id).forEach((x) => add({ t, id: x.id }));
    }
  }
  return [...out.values()];
}
function relatedOfType(ref, t) { return related(ref).filter((x) => x.ref.t === t); }

function isLinked(a, b) {
  return store.db.relations.some((r) => (sameRef(r.a, a) && sameRef(r.b, b)) || (sameRef(r.a, b) && sameRef(r.b, a)));
}

function people() {
  const s = new Set(store.db.people || []);
  for (const t of ['package', 'activity', 'issue', 'action']) all(t).forEach((x) => x.responsible && s.add(x.responsible));
  return [...s].sort((a, b) => a.localeCompare(b, 'sv'));
}
function distinct(field, types = ['package', 'activity', 'drawing', 'issue', 'action', 'model']) {
  const s = new Set();
  types.forEach((t) => all(t).forEach((x) => x[field] && s.add(x[field])));
  return [...s].sort((a, b) => String(a).localeCompare(String(b), 'sv'));
}

function nextCode(t, prefix, pad = 3) {
  let max = 0;
  all(t).forEach((x) => { const m = String(x.code || '').match(/(\d+)$/); if (m) max = Math.max(max, +m[1]); });
  return `${prefix}${String(max + 1).padStart(pad, '0')}`;
}

// ------------------------------------------------------------------ ändringar
let undoSnapshot = null;
let undoLabel = '';

function snapshot(label) { undoSnapshot = JSON.stringify(store.db); undoLabel = label; }
function canUndo() { return !!undoSnapshot; }
function undo() {
  if (!undoSnapshot) return false;
  store.db = JSON.parse(undoSnapshot);
  undoSnapshot = null;
  persist();
  emit('change', { type: 'undo' });
  return undoLabel;
}

function log(text, ref = null, kind = 'edit') {
  store.db.history.unshift({ id: uid('h'), ts: new Date().toISOString(), text, ref, kind });
  if (store.db.history.length > 800) store.db.history.length = 800;
}

/** Kör en ändring: tar ögonblicksbild för ångra, loggar, sparar och signalerar. */
function mutate(label, fn, { ref = null, kind = 'edit', silent = false } = {}) {
  snapshot(label);
  const result = fn(store.db);
  if (!silent) log(label, ref, kind);
  store.db.project.updated = new Date().toISOString();
  persist();
  emit('change', { type: kind, ref });
  return result;
}

function create(t, data, label) {
  const e = { id: uid(t.slice(0, 2)), created: new Date().toISOString(), ...data };
  const ref = { t, id: e.id };
  mutate(label || `${TYPES[t].label} skapad: ${data.code ? data.code + ' ' : ''}${data.name || data.title || ''}`, (db) => db[TYPES[t].coll].unshift(e), { ref, kind: 'create' });
  return ref;
}

function update(ref, patch, label) {
  const e = get(ref);
  if (!e) return;
  mutate(label || `${TYPES[ref.t].label} uppdaterad: ${labelOf(ref)}`, () => Object.assign(e, patch, { modified: new Date().toISOString() }), { ref });
}

function remove(ref) {
  const name = labelOf(ref);
  mutate(`${TYPES[ref.t].label} borttagen: ${name}`, (db) => {
    const coll = db[TYPES[ref.t].coll];
    const i = coll.findIndex((x) => x.id === ref.id);
    if (i >= 0) coll.splice(i, 1);
    db.relations = db.relations.filter((r) => !sameRef(r.a, ref) && !sameRef(r.b, ref));
    db.whiteboard.cards = db.whiteboard.cards.filter((c) => !sameRef(c.ref, ref));
  }, { kind: 'delete' });
}

function link(a, b) {
  if (sameRef(a, b) || isLinked(a, b)) return false;
  mutate(`${labelOf(a)} kopplad till ${labelOf(b)}`, (db) => db.relations.push({ id: uid('rel'), a, b, ts: new Date().toISOString() }), { ref: b, kind: 'link' });
  return true;
}

function unlink(relId) {
  const rel = store.db.relations.find((r) => r.id === relId);
  if (!rel) return;
  mutate(`Koppling borttagen: ${labelOf(rel.a)} ↔ ${labelOf(rel.b)}`, (db) => { db.relations = db.relations.filter((r) => r.id !== relId); }, { ref: rel.b, kind: 'link' });
}

function historyFor(ref) {
  return store.db.history.filter((h) => h.ref && (sameRef(h.ref, ref)));
}

// ------------------------------------------------------------------ lagring
const LS_KEY = 'pch.db.v1';
let saveTimer = null;

function persist() {
  store.saveState = 'saving';
  emit('save', store.saveState);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 250);
}

async function flush() {
  try {
    const json = JSON.stringify(store.db);
    if (store.mode === 'server') {
      const r = await fetch('api/db', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: json });
      if (!r.ok) throw new Error(await r.text());
    } else {
      localStorage.setItem(LS_KEY, json);
    }
    store.saveState = 'saved';
  } catch (e) {
    console.error('Kunde inte spara', e);
    store.saveState = 'error';
  }
  emit('save', store.saveState);
}
window.addEventListener('beforeunload', () => { if (saveTimer && store.saveState === 'saving') { clearTimeout(saveTimer); flushSync(); } });
function flushSync() {
  const json = JSON.stringify(store.db);
  if (store.mode === 'server') navigator.sendBeacon?.('api/db', new Blob([json], { type: 'application/json' }));
  else try { localStorage.setItem(LS_KEY, json); } catch {}
}

function migrate(db) {
  const colls = ['areas', 'packages', 'activities', 'drawings', 'models', 'issues', 'actions', 'decisions', 'meetings', 'documents', 'relations', 'history', 'tools', 'savedFilters', 'people'];
  colls.forEach((c) => { if (!Array.isArray(db[c])) db[c] = []; });
  if (!db.whiteboard) db.whiteboard = { cards: [], view: { x: 0, y: 0, z: 1 } };
  if (!db.whiteboard.view) db.whiteboard.view = { x: 0, y: 0, z: 1 };
  if (!db.project) db.project = { name: 'Projekt' };
  if (!db.sync) db.sync = { interval: 15, lastSync: null, state: {} };
  return db;
}

async function init() {
  try {
    const r = await fetch('api/health', { cache: 'no-store' });
    if (r.ok) {
      const j = await r.json();
      if (j && j.mode === 'server') { store.mode = 'server'; store.server = j; }
    }
  } catch { /* inget API – demoläge */ }

  let db = null;
  if (store.mode === 'server') {
    db = await (await fetch('api/db', { cache: 'no-store' })).json();
  } else {
    try { db = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { db = null; }
  }
  const fresh = !db;
  if (fresh) db = createSeed();
  store.db = migrate(db);
  if (fresh) persist();
  return { fresh };
}

function resetToSeed() {
  snapshot('Återställ exempeldata');
  store.db = migrate(createSeed());
  persist();
  emit('change', { type: 'reset' });
}
function clearAll() {
  snapshot('Töm all data');
  const keepTools = store.db.tools;
  store.db = migrate({ version: 1, project: { ...store.db.project, updated: new Date().toISOString() }, tools: keepTools });
  persist();
  emit('change', { type: 'reset' });
}

// ------------------------------------------------------------------ filer
const IDB_NAME = 'pch-files';
function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(IDB_NAME, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('files');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbPut(key, blob) {
  const db = await idb();
  return new Promise((res, rej) => { const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').put(blob, key); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
}
async function idbGet(key) {
  const db = await idb();
  return new Promise((res, rej) => { const tx = db.transaction('files'); const q = tx.objectStore('files').get(key); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
}
async function idbDel(key) {
  const db = await idb();
  return new Promise((res) => { const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').delete(key); tx.oncomplete = res; tx.onerror = res; });
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1] || '');
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });
}

/** Sparar en bilaga och returnerar filbeskrivningen som lagras på dokumentet. */
async function storeAttachment(file) {
  if (store.mode === 'server') {
    const r = await fetch('api/attachments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: file.name, type: file.type, data: await fileToBase64(file) })
    });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Uppladdningen misslyckades');
    const j = await r.json();
    return { store: 'server', url: j.url, size: j.size };
  }
  const key = uid('blob');
  await idbPut(key, file);
  return { store: 'idb', key, size: file.size };
}

const urlCache = new Map();
async function fileUrl(f) {
  if (!f) return null;
  if (f.store === 'server') return f.url;
  if (f.store === 'source') return `api/source-file?s=${encodeURIComponent(f.sourceId)}&p=${encodeURIComponent(f.path)}`;
  if (f.store === 'idb') {
    if (urlCache.has(f.key)) return urlCache.get(f.key);
    const blob = await idbGet(f.key);
    if (!blob) return null;
    const u = URL.createObjectURL(blob);
    urlCache.set(f.key, u);
    return u;
  }
  return f.url || null;
}

function kindOfFile(file) {
  const n = file.name.toLowerCase();
  if (n.endsWith('.ifc') || n.endsWith('.ifczip')) return 'ifc';
  if (n.endsWith('.pdf')) return 'pdf';
  if (n.endsWith('.eml') || n.endsWith('.msg')) return 'email';
  if (/\.(dwg|dxf)$/.test(n)) return 'cad';
  if ((file.type || '').startsWith('image/') || /\.(png|jpe?g|gif|webp|heic|bmp)$/.test(n)) return 'photo';
  return 'file';
}

};

__defs["js/ui.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "h": { get: () => h, enumerable: true },
  "$": { get: () => $, enumerable: true },
  "$$": { get: () => $$, enumerable: true },
  "esc": { get: () => esc, enumerable: true },
  "icon": { get: () => icon, enumerable: true },
  "typeIcon": { get: () => typeIcon, enumerable: true },
  "docIcon": { get: () => docIcon, enumerable: true },
  "fmtDate": { get: () => fmtDate, enumerable: true },
  "relDays": { get: () => relDays, enumerable: true },
  "ago": { get: () => ago, enumerable: true },
  "fmtSize": { get: () => fmtSize, enumerable: true },
  "initials": { get: () => initials, enumerable: true },
  "hueOf": { get: () => hueOf, enumerable: true },
  "badge": { get: () => badge, enumerable: true },
  "prioBadge": { get: () => prioBadge, enumerable: true },
  "avatar": { get: () => avatar, enumerable: true },
  "progressBar": { get: () => progressBar, enumerable: true },
  "ring": { get: () => ring, enumerable: true },
  "kbd": { get: () => kbd, enumerable: true },
  "dueChip": { get: () => dueChip, enumerable: true },
  "emptyState": { get: () => emptyState, enumerable: true },
  "skeleton": { get: () => skeleton, enumerable: true },
  "refChip": { get: () => refChip, enumerable: true },
  "preserve": { get: () => preserve, enumerable: true },
  "pushOverlay": { get: () => pushOverlay, enumerable: true },
  "closeTopOverlay": { get: () => closeTopOverlay, enumerable: true },
  "hasOverlay": { get: () => hasOverlay, enumerable: true },
  "popover": { get: () => popover, enumerable: true },
  "selectList": { get: () => selectList, enumerable: true },
  "norm": { get: () => norm, enumerable: true },
  "dropdown": { get: () => dropdown, enumerable: true },
  "contextMenu": { get: () => contextMenu, enumerable: true },
  "modal": { get: () => modal, enumerable: true },
  "confirmDialog": { get: () => confirmDialog, enumerable: true },
  "formDialog": { get: () => formDialog, enumerable: true },
  "toast": { get: () => toast, enumerable: true },
  "drag": { get: () => drag, enumerable: true },
  "makeDraggable": { get: () => makeDraggable, enumerable: true },
  "dropTarget": { get: () => dropTarget, enumerable: true },
  "endDrag": { get: () => endDrag, enumerable: true },
  "readDropped": { get: () => readDropped, enumerable: true }
});
// UI-primitiver: element, ikoner, popovers, menyer, dialoger, toasts, dra-och-släpp.
const { STATUS, PRIORITY, TYPES, parseDate, today, daysBetween, labelOf, codeOf, titleOf, refKey } = __r("js/store.js");

// ------------------------------------------------------------------ element
function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { children.unshift(attrs); attrs = null; }
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
  }
  append(el, children);
  return el;
}
function append(el, children) {
  for (const c of children) {
    if (c == null || c === false) continue;
    if (Array.isArray(c)) append(el, c);
    else el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ------------------------------------------------------------------ ikoner
const P = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  calendar: 'M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  gantt: 'M4 5h9M8 10h11M6 15h8M11 20h8',
  box: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
  drawing: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5',
  cube: 'M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5',
  alert: 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
  check: 'M20 6 9 17l-5-5',
  checkCircle: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3',
  gavel: 'm14 13-7.5 7.5a2.1 2.1 0 0 1-3-3L11 10M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  paperclip: 'm21.4 11-9.2 9.2a6 6 0 0 1-8.5-8.5l8.6-8.6A4 4 0 1 1 18 8.8l-8.6 8.6a2 2 0 0 1-2.8-2.8l8.5-8.5',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  image: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l4 2',
  tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  board: 'M2 4h20v13H2zM8 21l4-4 4 4M6 8h5M6 12h3M14 8h4v5h-4z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  plus: 'M12 5v14M5 12h14',
  x: 'M18 6 6 18M6 6l12 12',
  chevR: 'm9 18 6-6-6-6', chevD: 'm6 9 6 6 6-6', chevL: 'm15 18-6-6 6-6', chevU: 'm18 15-6-6-6 6',
  filter: 'M22 3H2l8 9.5V19l4 2v-8.5z',
  star: 'm12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.1 2 9.3l6.9-1z',
  pin: 'M12 17v5M9 10.8a2 2 0 0 1-1.1 1.8l-1.8.9A2 2 0 0 0 5 15.2V17h14v-1.8a2 2 0 0 0-1.1-1.8l-1.8-.9a2 2 0 0 1-1.1-1.8V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z',
  external: 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  refresh: 'M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5',
  maximize: 'M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16v-4M12 8h.01',
  link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.8 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  copy: 'M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  note: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  trash: 'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
  sidebar: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 3v18',
  panelR: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM15 3v18',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  file: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6',
  dots: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  back: 'M19 12H5M12 19l-7-7 7-7',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  layers: 'm12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5',
  keyboard: 'M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10',
  grip: 'M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01',
  save: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8',
  bolt: 'M13 2 3 14h9l-1 8 10-12h-9z',
  server: 'M2 3h20v8H2zM2 13h20v8H2zM6 7h.01M6 17h.01',
  window: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 9h18',
  minus: 'M5 12h14',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
  sparkle: 'M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z',
  kanban: 'M4 3h4v14H4zM10 3h4v9h-4zM16 3h4v18h-4z',
  zoomIn: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3M11 8v6M8 11h6',
  zoomOut: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3M8 11h6',
  play: 'M6 3l14 9-14 9z',
  cloud: 'M17.5 19H7a5 5 0 1 1 1.6-9.7A6 6 0 0 1 20 11.5a3.8 3.8 0 0 1-2.5 7.5z'
};
function icon(name, size = 16, cls = '') {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('width', size); s.setAttribute('height', size);
  s.setAttribute('class', `ic ${cls}`);
  s.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', P[name] || P.dots);
  s.append(p);
  return s;
}
const typeIcon = (t, size = 14) => icon(TYPES[t]?.icon || 'dots', size, `ti ti-${t}`);
function docIcon(kind) { return { email: 'mail', photo: 'image', pdf: 'file', ifc: 'cube', cad: 'drawing' }[kind] || 'paperclip'; }

// ------------------------------------------------------------------ format
const MON = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
function fmtDate(s, withYear = false) {
  const d = typeof s === 'string' ? parseDate(s.slice(0, 10)) : s;
  if (!d || isNaN(d)) return '–';
  return `${d.getDate()} ${MON[d.getMonth()]}${withYear ? ' ' + d.getFullYear() : ''}`;
}
function relDays(s) {
  if (!s) return '';
  const n = daysBetween(today(), parseDate(s.slice(0, 10)));
  if (n === 0) return 'idag';
  if (n === 1) return 'imorgon';
  if (n === -1) return 'igår';
  return n > 0 ? `om ${n} d` : `${-n} d sen`;
}
function ago(iso) {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 60) return 'nyss';
  if (s < 3600) return `${Math.floor(s / 60)} min sedan`;
  if (s < 86400) return `${Math.floor(s / 3600)} h sedan`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d sedan`;
  return fmtDate(iso);
}
function fmtSize(n) {
  if (n == null) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} kB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
function initials(name) { return String(name || '?').replace(/\./g, '').split(/\s+/).map((x) => x[0]).join('').slice(0, 2).toUpperCase(); }
function hueOf(str) { let h = 0; for (const c of String(str)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; }

// ------------------------------------------------------------------ små komponenter
function badge(status, extraCls = '') {
  const s = STATUS[status];
  if (!s) return null;
  return h('span', { class: `badge tone-${s.tone} ${extraCls}` }, h('i', { class: 'dot' }), s.label);
}
function prioBadge(p) {
  const s = PRIORITY[p];
  if (!s) return null;
  return h('span', { class: `prio prio-${p}`, title: `Prioritet: ${s.label}` }, h('i'), h('i'), h('i'), h('span', { class: 'sr' }, s.label));
}
function avatar(name, size = 20) {
  return h('span', { class: 'avatar', title: name, style: { width: size + 'px', height: size + 'px', '--h': hueOf(name), fontSize: Math.round(size * 0.42) + 'px' } }, initials(name));
}
function progressBar(pct, tone = '') {
  return h('span', { class: `pbar ${tone}`, title: `${pct}%` }, h('i', { style: { width: Math.max(0, Math.min(100, pct)) + '%' } }));
}
function ring(pct, size = 36) {
  const r = (size - 5) / 2, c = 2 * Math.PI * r;
  const wrap = h('span', { class: 'ring', style: { width: size + 'px', height: size + 'px' } });
  wrap.innerHTML = `<svg viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/></svg><b>${pct}</b>`;
  return wrap;
}
function kbd(...keys) { return h('span', { class: 'kbds' }, keys.map((k) => h('kbd', k))); }
function dueChip(s, done = false) {
  if (!s) return null;
  const n = daysBetween(today(), parseDate(s));
  const tone = done ? 'muted' : n < 0 ? 'bad' : n <= 2 ? 'warn' : 'muted';
  return h('span', { class: `due tone-${tone}`, title: fmtDate(s, true) }, icon('clock', 12), relDays(s));
}
function emptyState(title, text, action) {
  return h('div', { class: 'empty' }, h('div', { class: 'empty-art' }, icon('sparkle', 22)), h('b', title), text && h('p', text), action);
}
function skeleton(rows = 6) {
  return h('div', { class: 'skeleton' }, Array.from({ length: rows }, (_, i) => h('i', { style: { width: 60 + ((i * 37) % 40) + '%' } })));
}

/** Rad/chip för en entitet – dragbar, klickbar, högerklickbar. */
function refChip(ref, opts = {}) {
  const code = codeOf(ref), title = titleOf(ref);
  const el = h('span', { class: `refchip ${opts.cls || ''}`, title: labelOf(ref), dataset: { ref: refKey(ref) } },
    typeIcon(ref.t, 12), code && h('b', code), h('span', title.replace(code, '').trim() || title));
  return el;
}

// ------------------------------------------------------------------ fokus & scroll
function preserve(root, fn) {
  const a = document.activeElement;
  const key = a && root.contains(a) ? a.dataset.fkey : null;
  const sel = key && 'selectionStart' in a ? [a.selectionStart, a.selectionEnd] : null;
  const scrolls = $$('[data-skey]', root).map((e) => [e.dataset.skey, e.scrollTop, e.scrollLeft]);
  const rootScroll = [root.scrollTop, root.scrollLeft];
  fn();
  root.scrollTop = rootScroll[0]; root.scrollLeft = rootScroll[1];
  for (const [k, t, l] of scrolls) { const e = $(`[data-skey="${k}"]`, root); if (e) { e.scrollTop = t; e.scrollLeft = l; } }
  if (key) {
    const n = $(`[data-fkey="${key}"]`, root);
    if (n) { n.focus({ preventScroll: true }); if (sel) try { n.setSelectionRange(...sel); } catch {} }
  }
}

// ------------------------------------------------------------------ overlay-stack (Esc stänger översta)
const stack = [];
function pushOverlay(close) { stack.push(close); return () => { const i = stack.indexOf(close); if (i >= 0) stack.splice(i, 1); }; }
function closeTopOverlay() { const c = stack.pop(); if (c) { c(); return true; } return false; }
function hasOverlay() { return stack.length > 0; }

// ------------------------------------------------------------------ popover
function popover(anchor, content, { align = 'start', cls = '', offset = 6, onClose, x, y } = {}) {
  const layer = $('#layer');
  const el = h('div', { class: `popover ${cls}` }, content);
  layer.append(el);
  const place = () => {
    const pw = el.offsetWidth, ph = el.offsetHeight, vw = innerWidth, vh = innerHeight;
    let left, top;
    if (anchor) {
      const r = anchor.getBoundingClientRect();
      left = align === 'end' ? r.right - pw : r.left;
      top = r.bottom + offset;
      if (top + ph > vh - 8) top = Math.max(8, r.top - ph - offset);
    } else { left = x; top = y; if (top + ph > vh - 8) top = Math.max(8, vh - ph - 8); }
    left = Math.max(8, Math.min(left, vw - pw - 8));
    el.style.left = left + 'px'; el.style.top = top + 'px';
  };
  place();
  requestAnimationFrame(() => el.classList.add('open'));
  let closed = false;
  const close = () => {
    if (closed) return; closed = true;
    removeOverlay(); document.removeEventListener('pointerdown', outside, true); removeEventListener('resize', close);
    el.classList.remove('open'); el.classList.add('closing');
    setTimeout(() => el.remove(), 130);
    anchor?.classList.remove('is-open');
    onClose?.();
  };
  const outside = (e) => { if (!el.contains(e.target) && !anchor?.contains(e.target)) close(); };
  setTimeout(() => document.addEventListener('pointerdown', outside, true));
  addEventListener('resize', close);
  const removeOverlay = pushOverlay(close);
  anchor?.classList.add('is-open');
  return { el, close, place };
}

/** Sökbar fler- eller enkelvalslista. options: [{value,label,hint,color,icon}] */
function selectList({ options, selected = [], multi = true, searchable = options.length > 7, placeholder = 'Sök…', onChange, onCommit, emptyText = 'Inga träffar' }) {
  const sel = new Set(selected);
  let q = '', active = 0, filtered = options;
  const input = searchable ? h('input', { class: 'sl-search', placeholder, spellcheck: 'false' }) : null;
  const list = h('div', { class: 'sl-list', role: 'listbox' });
  const render = () => {
    const n = norm(q);
    filtered = options.filter((o) => !n || norm(o.label + ' ' + (o.hint || '')).includes(n));
    active = Math.min(active, Math.max(0, filtered.length - 1));
    list.replaceChildren(...(filtered.length ? filtered.map((o, i) => h('div', {
      class: `sl-opt ${sel.has(o.value) ? 'on' : ''} ${i === active ? 'act' : ''}`, role: 'option',
      onpointerenter: () => { active = i; mark(); },
      onclick: () => toggle(o)
    },
    multi ? h('span', { class: 'cbox' }, icon('check', 12)) : h('span', { class: 'rdot' }),
    o.color && h('i', { class: 'swatch', style: { background: o.color } }),
    o.icon && icon(o.icon, 14),
    h('span', { class: 'sl-label' }, o.label),
    o.hint && h('span', { class: 'sl-hint' }, o.hint))) : [h('div', { class: 'sl-empty' }, emptyText)]));
  };
  const mark = () => $$('.sl-opt', list).forEach((e, i) => e.classList.toggle('act', i === active));
  const toggle = (o) => {
    if (multi) { sel.has(o.value) ? sel.delete(o.value) : sel.add(o.value); }
    else { sel.clear(); sel.add(o.value); }
    render();
    onChange?.([...sel]);
    if (!multi) onCommit?.(o.value);
  };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { active = Math.min(filtered.length - 1, active + 1); mark(); scrollAct(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { active = Math.max(0, active - 1); mark(); scrollAct(); e.preventDefault(); }
    else if (e.key === 'Enter') { const o = filtered[active]; if (o) toggle(o); e.preventDefault(); }
  };
  const scrollAct = () => $('.sl-opt.act', list)?.scrollIntoView({ block: 'nearest' });
  input?.addEventListener('input', () => { q = input.value; active = 0; render(); });
  const root = h('div', { class: 'selectlist', tabindex: '-1', onkeydown: onKey }, input, list);
  render();
  setTimeout(() => (input || root).focus(), 20);
  return { el: root, get value() { return [...sel]; }, set(v) { sel.clear(); v.forEach((x) => sel.add(x)); render(); } };
}
function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

/** Knapp som öppnar en selectList. */
function dropdown({ label, iconName, options, value, multi = false, onChange, cls = '', title, footer }) {
  const btn = h('button', { class: `dd ${cls}`, type: 'button', title });
  const paint = () => {
    const v = Array.isArray(value) ? value : value == null ? [] : [value];
    const lab = !v.length ? label : multi ? (v.length === 1 ? options.find((o) => o.value === v[0])?.label : `${v.length} valda`) : options.find((o) => o.value === v[0])?.label;
    btn.replaceChildren(iconName ? icon(iconName, 14) : '', h('span', { class: 'dd-label' }, multi && v.length ? [h('span', { class: 'dd-key' }, label + ':'), ' ', lab] : (lab || label)), icon('chevD', 14, 'dd-chev'));
    btn.classList.toggle('has-value', multi && v.length > 0);
  };
  paint();
  btn.addEventListener('click', () => {
    let pop;
    const sl = selectList({
      options, multi, selected: Array.isArray(value) ? value : value == null ? [] : [value],
      onChange: (v) => { if (multi) { value = v; paint(); onChange?.(v); } },
      onCommit: (v) => { value = v; paint(); onChange?.(v); pop.close(); }
    });
    pop = popover(btn, [sl.el, footer && footer(() => pop.close())], { cls: 'pop-select' });
  });
  return btn;
}

// ------------------------------------------------------------------ högerklicksmeny
function contextMenu(x, y, items) {
  let pop, sub;
  const build = (list, isSub = false) => h('div', { class: 'menu', role: 'menu' }, list.filter(Boolean).map((it) => {
    if (it.divider) return h('div', { class: 'menu-div' });
    if (it.header) return h('div', { class: 'menu-head' }, it.header);
    const row = h('button', {
      class: `menu-item ${it.danger ? 'danger' : ''} ${it.submenu ? 'has-sub' : ''}`, type: 'button', disabled: it.disabled, role: 'menuitem',
      onclick: (e) => {
        if (it.submenu) return openSub(row, it.submenu);
        closeAll(); it.action?.(e);
      },
      onpointerenter: () => { if (it.submenu) openSub(row, it.submenu); else if (!isSub) { sub?.close(); sub = null; } }
    },
    h('span', { class: 'mi-ic' }, it.checked ? icon('check', 14) : it.icon ? icon(it.icon, 14) : null),
    h('span', { class: 'mi-label' }, it.label),
    it.kbd && h('span', { class: 'mi-kbd' }, it.kbd),
    it.submenu && icon('chevR', 14, 'mi-sub'));
    return row;
  }));
  const openSub = (row, list) => {
    if (sub && sub.row === row) return;
    sub?.close();
    const r = row.getBoundingClientRect();
    sub = popover(null, build(list, true), { x: r.right + 2, y: r.top - 4, cls: 'pop-menu' });
    sub.row = row;
    if (r.right + 2 + sub.el.offsetWidth > innerWidth - 8) { sub.el.style.left = Math.max(8, r.left - sub.el.offsetWidth - 2) + 'px'; }
  };
  const closeAll = () => { sub?.close(); pop?.close(); };
  pop = popover(null, build(items), { x, y, cls: 'pop-menu', onClose: () => sub?.close() });
  const first = $('.menu-item:not([disabled])', pop.el); first?.focus({ preventScroll: true });
  pop.el.addEventListener('keydown', (e) => {
    const btns = $$('.menu-item:not([disabled])', pop.el);
    const i = btns.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { btns[(i + 1) % btns.length]?.focus(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { btns[(i - 1 + btns.length) % btns.length]?.focus(); e.preventDefault(); }
  });
  return pop;
}

// ------------------------------------------------------------------ dialoger
function modal({ title, subtitle, body, actions = [], width = 520, cls = '', onClose }) {
  const layer = $('#layer');
  const close = () => {
    removeOverlay();
    wrap.classList.remove('open'); wrap.classList.add('closing');
    setTimeout(() => wrap.remove(), 160);
    onClose?.();
  };
  const foot = actions.length ? h('div', { class: 'modal-foot' }, actions.map((a) => a.spacer ? h('span', { class: 'grow' }) : h('button', {
    class: `btn ${a.primary ? 'primary' : ''} ${a.danger ? 'danger' : ''} ${a.ghost ? 'ghost' : ''}`, type: 'button', disabled: a.disabled,
    onclick: async () => { const r = await a.onClick?.(); if (r !== false) close(); }
  }, a.icon && icon(a.icon, 14), a.label, a.kbd && h('kbd', a.kbd)))) : null;
  const box = h('div', { class: `modal ${cls}`, style: { width: `min(${width}px, calc(100vw - 32px))` }, role: 'dialog', 'aria-modal': 'true' },
    h('div', { class: 'modal-head' }, h('div', h('h2', title), subtitle && h('p', subtitle)), h('button', { class: 'iconbtn', onclick: close, title: 'Stäng (Esc)' }, icon('x', 16))),
    h('div', { class: 'modal-body' }, body), foot);
  const wrap = h('div', { class: 'modal-wrap', onpointerdown: (e) => { if (e.target === wrap) close(); } }, box);
  layer.append(wrap);
  requestAnimationFrame(() => wrap.classList.add('open'));
  const removeOverlay = pushOverlay(close);
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { $('.modal-foot .btn.primary', box)?.click(); e.preventDefault(); }
  });
  setTimeout(() => ($('input,textarea,select', box) || box).focus?.(), 40);
  return { el: box, close };
}
function confirmDialog({ title, text, okLabel = 'Bekräfta', danger = false }) {
  return new Promise((resolve) => {
    let done = false;
    const m = modal({
      title, body: h('p', { class: 'confirm-text' }, text), width: 420,
      actions: [
        { spacer: true },
        { label: 'Avbryt', ghost: true, onClick: () => { done = true; resolve(false); } },
        { label: okLabel, primary: !danger, danger, onClick: () => { done = true; resolve(true); } }
      ],
      onClose: () => { if (!done) resolve(false); }
    });
    setTimeout(() => $('.modal-foot .btn:last-child', m.el)?.focus(), 50);
  });
}

/** Formulärdialog. fields: [{key,label,type,options,value,required,placeholder,full}] */
function formDialog({ title, subtitle, fields, okLabel = 'Spara', width = 560 }) {
  return new Promise((resolve) => {
    let done = false;
    const inputs = {};
    const grid = h('div', { class: 'form-grid' }, fields.map((f) => {
      let input;
      if (f.type === 'select') {
        input = h('select', { class: 'input' }, (f.options || []).map((o) => {
          const opt = typeof o === 'object' ? o : { value: o, label: o };
          return h('option', { value: opt.value, selected: String(opt.value) === String(f.value ?? '') }, opt.label);
        }));
      } else if (f.type === 'textarea') {
        input = h('textarea', { class: 'input', rows: f.rows || 3, placeholder: f.placeholder || '' });
        input.value = f.value ?? '';
      } else {
        input = h('input', { class: 'input', type: f.type || 'text', placeholder: f.placeholder || '', list: f.list ? `dl-${f.key}` : null, min: f.min, max: f.max, step: f.step });
        input.value = f.value ?? '';
      }
      inputs[f.key] = input;
      return h('label', { class: `field ${f.full || f.type === 'textarea' ? 'full' : ''}` }, h('span', f.label, f.required && h('em', ' *')), input,
        f.list && h('datalist', { id: `dl-${f.key}` }, f.list.map((v) => h('option', { value: v }))));
    }));
    const collect = () => Object.fromEntries(Object.entries(inputs).map(([k, el]) => [k, el.type === 'number' ? (el.value === '' ? null : +el.value) : el.value.trim()]));
    modal({
      title, subtitle, body: grid, width,
      actions: [{ spacer: true }, { label: 'Avbryt', ghost: true }, {
        label: okLabel, primary: true, kbd: 'Ctrl ↵', onClick: () => {
          const v = collect();
          const missing = fields.find((f) => f.required && !v[f.key]);
          if (missing) { inputs[missing.key].classList.add('invalid'); inputs[missing.key].focus(); return false; }
          done = true; resolve(v);
        }
      }],
      onClose: () => { if (!done) resolve(null); }
    });
  });
}

// ------------------------------------------------------------------ toasts
function toast(msg, { tone = 'info', action, iconName, timeout = 4200 } = {}) {
  const host = $('#toasts');
  const el = h('div', { class: `toast tone-${tone}`, role: 'status' },
    icon(iconName || ({ ok: 'checkCircle', bad: 'alert', warn: 'alert' }[tone] || 'info'), 16),
    h('span', { class: 'toast-msg' }, msg),
    action && h('button', { class: 'toast-act', onclick: () => { action.fn(); dismiss(); } }, action.label),
    h('button', { class: 'toast-x', onclick: () => dismiss(), title: 'Stäng' }, icon('x', 12)));
  host.append(el);
  requestAnimationFrame(() => el.classList.add('open'));
  let t = setTimeout(() => dismiss(), timeout);
  el.addEventListener('pointerenter', () => clearTimeout(t));
  el.addEventListener('pointerleave', () => { t = setTimeout(() => dismiss(), 1800); });
  function dismiss() { el.classList.remove('open'); el.classList.add('closing'); setTimeout(() => el.remove(), 180); }
  while (host.children.length > 4) host.firstElementChild.remove();
  return dismiss;
}

// ------------------------------------------------------------------ dra & släpp
// Interna entiteter dras med typen application/x-pch-ref. Släppmål markeras med
// data-drop och en egenskap el._drop = { accept(src), onDrop(src, e), label(src) },
// där src = { ref } eller { files, items }.
const drag = { src: null };
const MIME_REF = 'application/x-pch-ref';

let ghost;
function makeDraggable(el, ref, { label } = {}) {
  el.draggable = true;
  el.addEventListener('dragstart', (e) => {
    e.stopPropagation();
    drag.src = { ref };
    e.dataTransfer.effectAllowed = 'copyLink';
    e.dataTransfer.setData(MIME_REF, refKey(ref));
    e.dataTransfer.setData('text/plain', label || labelOf(ref));
    ghost?.remove();
    ghost = h('div', { class: 'drag-ghost' }, typeIcon(ref.t, 14), h('b', codeOf(ref)), h('span', titleOf(ref)));
    document.body.append(ghost);
    e.dataTransfer.setDragImage(ghost, 14, 14);
    requestAnimationFrame(() => startDrag());
  });
  el.addEventListener('dragend', endDrag);
}

function dropTarget(el, spec) {
  el.dataset.drop = '1';
  el._drop = spec;
  el.addEventListener('dragenter', (e) => { if (accepts(el)) { e.preventDefault(); el.classList.add('drop-over'); } });
  el.addEventListener('dragover', (e) => {
    if (!accepts(el)) return;
    e.preventDefault(); e.stopPropagation();
    e.dataTransfer.dropEffect = drag.src?.ref ? 'link' : 'copy';
    el.classList.add('drop-over');
    showHint(e, spec.label?.(drag.src) || 'Släpp här');
  });
  el.addEventListener('dragleave', (e) => { if (!el.contains(e.relatedTarget)) { el.classList.remove('drop-over'); hideHint(); } });
  el.addEventListener('drop', (e) => {
    if (!accepts(el)) return;
    e.preventDefault(); e.stopPropagation();
    const src = drag.src?.ref ? drag.src : {
      files: [...(e.dataTransfer.files || [])],
      // webkitGetAsEntry måste anropas synkront under drop-händelsen
      entries: [...(e.dataTransfer.items || [])].map((it) => it.webkitGetAsEntry?.()).filter(Boolean)
    };
    el.classList.remove('drop-over');
    endDrag();
    spec.onDrop(src, e);
  });
}
function accepts(el) {
  const src = drag.src || (drag.files ? { files: true } : null);
  if (!src) return false;
  try { return !!el._drop?.accept(src); } catch { return false; }
}
function startDrag() {
  document.body.classList.add('is-dragging');
  $$('[data-drop]').forEach((t) => t.classList.toggle('drop-ok', accepts(t)));
}
function endDrag() {
  drag.src = null; drag.files = false;
  document.body.classList.remove('is-dragging', 'is-dragging-files');
  $$('.drop-ok, .drop-over').forEach((t) => t.classList.remove('drop-ok', 'drop-over'));
  hideHint();
  ghost?.remove(); ghost = null;
}
let hintEl;
function showHint(e, text) {
  if (!hintEl) { hintEl = h('div', { class: 'drop-hint' }); document.body.append(hintEl); }
  hintEl.textContent = text;
  hintEl.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 18}px)`;
  hintEl.classList.add('show');
}
function hideHint() { hintEl?.classList.remove('show'); }

// Filer från operativsystemet
let fileDepth = 0;
addEventListener('dragenter', (e) => {
  if (drag.src || !e.dataTransfer?.types?.includes('Files')) return;
  fileDepth++;
  if (!drag.files) { drag.files = true; document.body.classList.add('is-dragging', 'is-dragging-files'); $$('[data-drop]').forEach((t) => t.classList.toggle('drop-ok', accepts(t))); }
});
addEventListener('dragleave', () => { if (drag.files && --fileDepth <= 0) { fileDepth = 0; endDrag(); } });
addEventListener('dragover', (e) => { if (drag.files || drag.src) e.preventDefault(); });
addEventListener('drop', (e) => { e.preventDefault(); fileDepth = 0; endDrag(); });

/** Läs filer ur ett drop, inklusive mappar (webkitGetAsEntry). Returnerar [{file, path}] */
async function readDropped(src) {
  const entries = src.entries || [];
  if (!entries.length) return (src.files || []).map((f) => ({ file: f, path: f.name }));
  const out = [];
  const walk = async (entry, prefix) => {
    if (entry.isFile) {
      const file = await new Promise((res, rej) => entry.file(res, rej));
      out.push({ file, path: prefix + entry.name });
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      let batch;
      do {
        batch = await new Promise((res, rej) => reader.readEntries(res, rej));
        for (const c of batch) await walk(c, prefix + entry.name + '/');
      } while (batch.length);
    }
  };
  for (const e of entries) await walk(e, '');
  return out;
}

};

__defs["js/app.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "app": { get: () => app, enumerable: true },
  "layout": { get: () => layout, enumerable: true },
  "saveLayout": { get: () => saveLayout, enumerable: true }
});
// Delad app-yta som vyer och komponenter anropar. Fylls i av main.js.
const app = {
  route: { view: 'overview', params: [] },
  selection: null,
  navigate: (hash) => { location.hash = hash; },
  select: () => {},
  open: () => {},
  openFloat: () => {},
  render: () => {},
  palette: () => {}
};

const LAYOUT_KEY = 'pch.layout.v1';
const layout = (() => {
  const def = { nav: true, navW: 232, ctx: true, ctxW: 380, pinned: null, theme: 'dark', floats: [], density: 'comfortable' };
  try { return { ...def, ...JSON.parse(localStorage.getItem(LAYOUT_KEY) || '{}') }; } catch { return def; }
})();
function saveLayout() { try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout)); } catch {} }

};

__defs["js/actions.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "isFav": { get: () => isFav, enumerable: true },
  "toggleFav": { get: () => toggleFav, enumerable: true },
  "deepLink": { get: () => deepLink, enumerable: true },
  "copyLink": { get: () => copyLink, enumerable: true },
  "linkWithFeedback": { get: () => linkWithFeedback, enumerable: true },
  "pickEntity": { get: () => pickEntity, enumerable: true },
  "linkPicker": { get: () => linkPicker, enumerable: true },
  "setStatus": { get: () => setStatus, enumerable: true },
  "assign": { get: () => assign, enumerable: true },
  "changeDeadline": { get: () => changeDeadline, enumerable: true },
  "addNote": { get: () => addNote, enumerable: true },
  "deleteEntity": { get: () => deleteEntity, enumerable: true },
  "addToWhiteboard": { get: () => addToWhiteboard, enumerable: true },
  "attachFiles": { get: () => attachFiles, enumerable: true },
  "readIfcHeader": { get: () => readIfcHeader, enumerable: true },
  "importIfc": { get: () => importIfc, enumerable: true },
  "openSource": { get: () => openSource, enumerable: true },
  "createIssue": { get: () => createIssue, enumerable: true },
  "createAction": { get: () => createAction, enumerable: true },
  "quickAction": { get: () => quickAction, enumerable: true },
  "createDecision": { get: () => createDecision, enumerable: true },
  "createMeeting": { get: () => createMeeting, enumerable: true },
  "editEntity": { get: () => editEntity, enumerable: true },
  "entityMenu": { get: () => entityMenu, enumerable: true },
  "showEntityMenu": { get: () => showEntityMenu, enumerable: true },
  "bindEntity": { get: () => bindEntity, enumerable: true },
  "entityDropSpec": { get: () => entityDropSpec, enumerable: true }
});
// Gemensamma kommandon: skapa, koppla, ändra status, bifoga filer, menyer.
const { store, TYPES, STATUS, STATUS_SETS, PRIORITY, get, all, labelOf, codeOf, titleOf, statusOf, refKey, parseKey, sameRef, create, update, remove, link, unlink, mutate, undo, people, distinct, nextCode, isLinked, uid, today, isoDate, addDays, storeAttachment, kindOfFile, latestVersion, fileUrl, persist, emit } = __r("js/store.js");
const { h, icon, typeIcon, toast, confirmDialog, formDialog, modal, norm, contextMenu, fmtDate, makeDraggable, dropTarget, $, $$ } = __r("js/ui.js");
const { app } = __r("js/app.js");

const undoAction = { label: 'Ångra', fn: () => { const l = undo(); if (l) toast(`Ångrade: ${l}`); } };

// ------------------------------------------------------------------ favoriter
function isFav(ref) { return (store.db.favourites || []).includes(refKey(ref)); }
function toggleFav(ref) {
  const k = refKey(ref);
  store.db.favourites = store.db.favourites || [];
  const on = !store.db.favourites.includes(k);
  store.db.favourites = on ? [k, ...store.db.favourites] : store.db.favourites.filter((x) => x !== k);
  persist(); emit('change', { type: 'fav', ref });
  toast(on ? `${labelOf(ref)} tillagd i favoriter` : `${labelOf(ref)} borttagen från favoriter`, { iconName: 'star' });
}

// ------------------------------------------------------------------ länkar
function deepLink(ref) { return `${location.origin}${location.pathname}#/item/${ref.t}/${encodeURIComponent(ref.id)}`; }
async function copyLink(ref) {
  const url = deepLink(ref);
  try { await navigator.clipboard.writeText(url); toast('Länk kopierad', { tone: 'ok', iconName: 'link' }); }
  catch { toast(url, { timeout: 8000 }); }
}

// ------------------------------------------------------------------ koppla
function linkWithFeedback(a, b) {
  if (sameRef(a, b)) return;
  if (isLinked(a, b)) { toast(`${labelOf(a)} är redan kopplad till ${labelOf(b)}`); return; }
  link(a, b);
  toast(h('span', h('b', codeOf(a) || titleOf(a)), ' kopplad till ', h('b', labelOf(b))), { tone: 'ok', iconName: 'link', action: undoAction });
}

/** Sökbar väljare för entiteter. */
function pickEntity({ title = 'Välj', types, exclude = [], onPick, multi = false }) {
  const ex = new Set(exclude.map(refKey));
  const items = types.flatMap((t) => all(t).map((e) => ({ ref: { t, id: e.id }, e }))).filter((x) => !ex.has(refKey(x.ref)));
  let q = '', act = 0, view = items;
  const chosen = new Set();
  const input = h('input', { class: 'input pick-search', placeholder: `Sök ${types.map((t) => TYPES[t].plural.toLowerCase()).join(', ')}…` });
  const list = h('div', { class: 'pick-list' });
  const render = () => {
    const n = norm(q).split(/\s+/).filter(Boolean);
    view = items.filter((x) => { const hay = norm(`${codeOf(x.ref, x.e)} ${titleOf(x.ref, x.e)} ${x.e.discipline || ''}`); return n.every((w) => hay.includes(w)); }).slice(0, 80);
    act = Math.min(act, Math.max(0, view.length - 1));
    list.replaceChildren(...view.map((x, i) => h('div', { class: `pick-row ${i === act ? 'act' : ''} ${chosen.has(refKey(x.ref)) ? 'on' : ''}`, onclick: () => choose(x), onpointerenter: () => { act = i; mark(); } },
      multi && h('span', { class: 'cbox' }, icon('check', 12)), typeIcon(x.ref.t, 14), h('b', codeOf(x.ref, x.e)), h('span', { class: 'grow ellipsis' }, titleOf(x.ref, x.e)),
      statusOf(x.ref, x.e) && h('small', STATUS[statusOf(x.ref, x.e)]?.label))));
    if (!view.length) list.append(h('div', { class: 'sl-empty' }, 'Inga träffar'));
  };
  const mark = () => $$('.pick-row', list).forEach((r, i) => r.classList.toggle('act', i === act));
  const choose = (x) => {
    if (multi) { const k = refKey(x.ref); chosen.has(k) ? chosen.delete(k) : chosen.add(k); render(); return; }
    m.close(); onPick(x.ref);
  };
  input.addEventListener('input', () => { q = input.value; act = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { act = Math.min(view.length - 1, act + 1); mark(); $('.pick-row.act', list)?.scrollIntoView({ block: 'nearest' }); e.preventDefault(); }
    if (e.key === 'ArrowUp') { act = Math.max(0, act - 1); mark(); $('.pick-row.act', list)?.scrollIntoView({ block: 'nearest' }); e.preventDefault(); }
    if (e.key === 'Enter' && !e.ctrlKey) { if (view[act]) choose(view[act]); e.preventDefault(); }
  });
  const m = modal({
    title, body: h('div', { class: 'picker' }, input, list), width: 560,
    actions: multi ? [{ spacer: true }, { label: 'Avbryt', ghost: true }, { label: 'Koppla valda', primary: true, onClick: () => onPick([...chosen].map(parseKey)) }] : []
  });
  render();
}

function linkPicker(ref, types) {
  const ex = [ref, ...store.db.relations.filter((r) => sameRef(r.a, ref) || sameRef(r.b, ref)).map((r) => (sameRef(r.a, ref) ? r.b : r.a))];
  pickEntity({
    title: `Koppla till ${labelOf(ref)}`, types, exclude: ex, multi: true,
    onPick: (refs) => {
      if (!refs.length) return;
      mutate(`${refs.length} kopplingar till ${labelOf(ref)}`, (db) => refs.forEach((r) => db.relations.push({ id: uid('rel'), a: r, b: ref, ts: new Date().toISOString() })), { ref, kind: 'link' });
      toast(`${refs.length} ${refs.length === 1 ? 'koppling' : 'kopplingar'} till ${labelOf(ref)}`, { tone: 'ok', iconName: 'link', action: undoAction });
    }
  });
}

// ------------------------------------------------------------------ status, tilldela, deadline
function setStatus(ref, status) {
  const e = get(ref); if (!e || e.status === status) return;
  const patch = { status };
  if (ref.t === 'package' && status === 'done') patch.progress = 100;
  mutate(`${TYPES[ref.t].label} ${codeOf(ref)} ändrad till ${STATUS[status].label}`, () => Object.assign(e, patch, { modified: new Date().toISOString() }), { ref, kind: 'status' });
  toast(h('span', h('b', codeOf(ref)), ' → ', STATUS[status].label), { tone: status === 'done' || status === 'resolved' ? 'ok' : 'info', action: undoAction });
}
function assign(ref, person) {
  update(ref, { responsible: person }, `${codeOf(ref)} tilldelad ${person}`);
  toast(h('span', h('b', codeOf(ref)), ` tilldelad ${person}`), { action: undoAction, iconName: 'user' });
}
async function changeDeadline(ref) {
  const e = get(ref);
  const field = ref.t === 'activity' ? 'end' : 'due';
  const v = await formDialog({ title: `Ändra ${ref.t === 'activity' ? 'slutdatum' : 'deadline'}`, subtitle: labelOf(ref), fields: [{ key: 'd', label: 'Datum', type: 'date', value: e[field] || isoDate(today()), required: true, full: true }] });
  if (!v) return;
  update(ref, { [field]: v.d }, `${codeOf(ref)} ny deadline ${fmtDate(v.d)}`);
  toast(h('span', h('b', codeOf(ref)), ` ny deadline ${fmtDate(v.d)}`), { action: undoAction, iconName: 'calendar' });
}
async function addNote(ref) {
  const v = await formDialog({ title: 'Lägg till anteckning', subtitle: labelOf(ref), fields: [{ key: 'text', label: 'Anteckning', type: 'textarea', rows: 4, required: true }] });
  if (!v) return;
  const e = get(ref);
  mutate(`Anteckning på ${labelOf(ref)}`, () => { e.notes = [{ id: uid('n'), ts: new Date().toISOString(), text: v.text }, ...(e.notes || [])]; }, { ref, kind: 'note' });
  toast('Anteckning sparad', { tone: 'ok', iconName: 'note' });
}

async function deleteEntity(ref) {
  const ok = await confirmDialog({ title: `Ta bort ${TYPES[ref.t].label.toLowerCase()}?`, text: `${labelOf(ref)} och dess kopplingar tas bort. Du kan ångra direkt efteråt.`, okLabel: 'Ta bort', danger: true });
  if (!ok) return;
  if (sameRef(app.selection, ref)) app.select(null);
  remove(ref);
  toast(`${labelOf(ref) || TYPES[ref.t].label} borttagen`, { action: undoAction, iconName: 'trash' });
}

// ------------------------------------------------------------------ whiteboard
function addToWhiteboard(ref, pos) {
  const wb = store.db.whiteboard;
  if (wb.cards.some((c) => sameRef(c.ref, ref))) { toast(`${labelOf(ref)} finns redan på whiteboarden`); return; }
  const n = wb.cards.length;
  const p = pos || { x: 60 + (n % 4) * 300 - wb.view.x, y: 60 + Math.floor(n / 4) * 170 - wb.view.y };
  mutate(`${labelOf(ref)} lagd på whiteboarden`, () => wb.cards.push({ id: uid('wb'), ref, x: Math.round(p.x), y: Math.round(p.y) }), { ref, kind: 'whiteboard' });
  toast(h('span', h('b', codeOf(ref) || titleOf(ref)), ' lagd på whiteboarden'), { tone: 'ok', iconName: 'board', action: { label: 'Visa', fn: () => app.navigate('#/whiteboard') } });
}

// ------------------------------------------------------------------ filer
async function attachFiles(ref, files) {
  const list = [...files];
  if (!list.length) return;
  const ifcs = list.filter((f) => kindOfFile(f) === 'ifc');
  let n = 0;
  for (const file of list) {
    try {
      const f = await storeAttachment(file);
      const kind = kindOfFile(file);
      const doc = { id: uid('do'), kind, name: file.name, subject: file.name.replace(/\.[^.]+$/, ''), date: isoDate(today()), file: { ...f, type: file.type }, size: file.size, created: new Date().toISOString() };
      if (ref && ref.t === 'package') doc.packageId = ref.id;
      mutate(`${file.name} bifogad till ${ref ? labelOf(ref) : 'projektet'}`, (db) => {
        db.documents.unshift(doc);
        if (ref && ref.t !== 'package') db.relations.push({ id: uid('rel'), a: { t: 'document', id: doc.id }, b: ref, ts: new Date().toISOString() });
      }, { ref, kind: 'attach' });
      n++;
    } catch (e) { toast(`${file.name}: ${e.message}`, { tone: 'bad' }); }
  }
  if (n) {
    const kinds = list.map(kindOfFile);
    const what = n === 1 ? ({ pdf: 'PDF', photo: 'Bild', email: 'E-post', ifc: 'IFC-fil' }[kinds[0]] || 'Fil') + ` ”${list[0].name}”` : `${n} filer`;
    toast(h('span', `${what} bifogad till `, h('b', ref ? labelOf(ref) : 'projektet')), { tone: 'ok', iconName: 'paperclip', action: undoAction });
  }
  if (ifcs.length) toast('Tips: släpp IFC-filer på Modellkontroll för att skapa en ny modellversion.', { timeout: 6000, iconName: 'cube' });
}

async function readIfcHeader(file) {
  const text = await file.slice(0, 64 * 1024).text();
  const schema = (text.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i) || [])[1] || '';
  const fname = (text.match(/FILE_NAME\s*\(\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*\(\s*'([^']*)'/i) || []);
  const app = (text.match(/FILE_NAME\s*\([^;]*?'([^']*)'\s*,\s*'([^']*)'\s*,\s*'[^']*'\s*\)\s*;/i) || [])[1] || '';
  const valid = /ISO-10303-21/.test(text.slice(0, 200));
  return { valid, schema, originalName: fname[1] || '', created: fname[2] || '', author: fname[3] || '', application: app };
}

async function importIfc(file, preselect) {
  const head = await readIfcHeader(file);
  if (!head.valid && !/\.ifczip$/i.test(file.name)) {
    toast(`${file.name} ser inte ut som en IFC-fil (saknar ISO-10303-21-huvud)`, { tone: 'bad' });
    return;
  }
  const models = all('model');
  const guess = preselect || models.find((m) => norm(file.name).includes(norm(m.discipline).slice(0, 4)) || norm(file.name).includes(norm(m.name).split(' ')[0]));
  const v = await formDialog({
    title: 'Ny modellversion',
    subtitle: `${file.name} · ${head.schema || 'okänt schema'}${head.application ? ' · ' + head.application : ''}`,
    fields: [
      { key: 'model', label: 'Modell', type: 'select', options: [...models.map((m) => ({ value: m.id, label: `${m.name} (senast v${latestVersion(m)?.v ?? 0})` })), { value: '__new', label: '+ Ny modell…' }], value: guess?.id || models[0]?.id, full: true },
      { key: 'newName', label: 'Namn på ny modell', placeholder: 'Endast om ny modell', value: '' },
      { key: 'discipline', label: 'Disciplin (ny modell)', list: distinct('discipline'), value: '' },
      { key: 'note', label: 'Ändringsnotering', type: 'textarea', rows: 2, placeholder: 'Vad är nytt i versionen?' }
    ],
    okLabel: 'Skapa version'
  });
  if (!v) return;
  let modelRef;
  if (v.model === '__new') {
    if (!v.newName) { toast('Ange namn på den nya modellen', { tone: 'warn' }); return; }
    modelRef = create('model', { name: v.newName, discipline: v.discipline || 'Övrigt', versions: [] }, `Modell skapad: ${v.newName}`);
  } else modelRef = { t: 'model', id: v.model };
  const m = get(modelRef);
  const f = await storeAttachment(file);
  const nv = (latestVersion(m)?.v || 0) + 1;
  mutate(`${m.name} v${nv} importerad`, () => {
    m.versions.push({ v: nv, date: isoDate(today()), author: head.author || 'Jag', note: v.note || file.name, schema: head.schema, file: { ...f, name: file.name }, size: file.size, application: head.application });
  }, { ref: modelRef, kind: 'create' });
  toast(h('span', h('b', `${m.name} v${nv}`), ' skapad'), { tone: 'ok', iconName: 'cube', action: undoAction });
  app.select(modelRef);
}

async function openSource(ref) {
  const e = get(ref);
  let f = e?.file;
  if (ref.t === 'model') f = latestVersion(e)?.file;
  const url = await fileUrl(f);
  if (url) window.open(url, '_blank', 'noopener');
  else if (e?.source) window.open(e.source, '_blank', 'noopener');
  else toast('Ingen källfil kopplad ännu – dra en fil hit för att bifoga.', { iconName: 'info' });
}

// ------------------------------------------------------------------ skapa
async function createIssue(defaults = {}) {
  const pk = all('package');
  const v = await formDialog({
    title: 'Nytt ärende', subtitle: nextCode('issue', 'DI-'),
    fields: [
      { key: 'name', label: 'Rubrik', required: true, full: true },
      { key: 'packageId', label: 'Arbetspaket', type: 'select', options: [{ value: '', label: '—' }, ...pk.map((p) => ({ value: p.id, label: `${p.code} ${p.name}` }))], value: defaults.packageId || '' },
      { key: 'priority', label: 'Prioritet', type: 'select', options: Object.entries(PRIORITY).map(([k, p]) => ({ value: k, label: p.label })), value: 'medium' },
      { key: 'responsible', label: 'Ansvarig', list: people(), value: defaults.responsible || '' },
      { key: 'due', label: 'Förfallodatum', type: 'date', value: isoDate(addDays(today(), 7)) },
      { key: 'discipline', label: 'Disciplin', list: distinct('discipline'), value: defaults.discipline || '' },
      { key: 'description', label: 'Beskrivning', type: 'textarea' }
    ], okLabel: 'Skapa ärende'
  });
  if (!v) return null;
  const p = pk.find((x) => x.id === v.packageId);
  const ref = create('issue', { code: nextCode('issue', 'DI-'), status: 'open', ...v, packageId: v.packageId || null, areaId: p?.areaId || defaults.areaId || null, contractor: p?.contractor, discipline: v.discipline || p?.discipline });
  if (defaults.linkTo) link(ref, defaults.linkTo);
  toast(h('span', 'Ärende ', h('b', get(ref).code), ' skapat'), { tone: 'ok', action: undoAction });
  app.select(ref);
  return ref;
}
async function createAction(defaults = {}) {
  const pk = all('package');
  const v = await formDialog({
    title: 'Ny åtgärd', subtitle: nextCode('action', 'A-'),
    fields: [
      { key: 'name', label: 'Vad ska göras?', required: true, full: true, value: defaults.name || '' },
      { key: 'packageId', label: 'Arbetspaket', type: 'select', options: [{ value: '', label: '—' }, ...pk.map((p) => ({ value: p.id, label: `${p.code} ${p.name}` }))], value: defaults.packageId || '' },
      { key: 'responsible', label: 'Ansvarig', list: people(), value: defaults.responsible || '' },
      { key: 'due', label: 'Deadline', type: 'date', value: isoDate(addDays(today(), 5)) },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_SETS.action.map((s) => ({ value: s, label: STATUS[s].label })), value: defaults.status || 'open' }
    ], okLabel: 'Skapa åtgärd'
  });
  if (!v) return null;
  return quickAction(v.name, { ...defaults, ...v });
}
function quickAction(name, o = {}) {
  const p = o.packageId ? get({ t: 'package', id: o.packageId }) : null;
  const ref = create('action', { code: nextCode('action', 'A-'), name, status: o.status || 'open', responsible: o.responsible || '', due: o.due || isoDate(addDays(today(), 5)), packageId: o.packageId || null, areaId: p?.areaId || null, discipline: p?.discipline, contractor: p?.contractor });
  if (o.linkTo) link(ref, o.linkTo);
  toast(h('span', 'Åtgärd ', h('b', get(ref).code), ' skapad'), { tone: 'ok', action: undoAction });
  return ref;
}
async function createDecision(defaults = {}) {
  const v = await formDialog({
    title: 'Nytt beslut', subtitle: nextCode('decision', 'B-'),
    fields: [
      { key: 'name', label: 'Beslut', required: true, full: true },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_SETS.decision.map((s) => ({ value: s, label: STATUS[s].label })), value: 'proposed' },
      { key: 'date', label: 'Datum', type: 'date', value: isoDate(today()) },
      { key: 'responsible', label: 'Ansvarig', list: people() },
      { key: 'description', label: 'Beskrivning', type: 'textarea' }
    ]
  });
  if (!v) return null;
  const p = defaults.packageId ? get({ t: 'package', id: defaults.packageId }) : null;
  const ref = create('decision', { code: nextCode('decision', 'B-'), ...v, packageId: defaults.packageId || null, areaId: p?.areaId || null });
  if (defaults.linkTo) link(ref, defaults.linkTo);
  app.select(ref);
  return ref;
}
async function createMeeting(defaults = {}) {
  const v = await formDialog({
    title: 'Nytt möte',
    fields: [
      { key: 'name', label: 'Rubrik', required: true, full: true },
      { key: 'kind', label: 'Typ', list: ['Byggmöte', 'Projektering', 'Samordning', 'Arbetsberedning'], value: 'Samordning' },
      { key: 'date', label: 'Datum', type: 'date', value: isoDate(today()) },
      { key: 'notes', label: 'Anteckningar', type: 'textarea', rows: 4 }
    ]
  });
  if (!v) return null;
  const p = defaults.packageId ? get({ t: 'package', id: defaults.packageId }) : null;
  const ref = create('meeting', { ...v, packageId: defaults.packageId || null, areaId: p?.areaId || null });
  if (defaults.linkTo) link(ref, defaults.linkTo);
  app.select(ref);
  return ref;
}

async function editEntity(ref) {
  const e = get(ref);
  const common = [];
  if (e.name !== undefined || ['issue', 'action', 'package', 'activity', 'decision', 'meeting', 'drawing'].includes(ref.t)) common.push({ key: 'name', label: 'Namn', value: e.name, full: true, required: true });
  if ('responsible' in e || ['issue', 'action', 'package', 'activity', 'decision'].includes(ref.t)) common.push({ key: 'responsible', label: 'Ansvarig', list: people(), value: e.responsible || '' });
  if (ref.t === 'activity') common.push({ key: 'start', label: 'Start', type: 'date', value: e.start }, { key: 'end', label: 'Slut', type: 'date', value: e.end }, { key: 'progress', label: 'Framdrift %', type: 'number', min: 0, max: 100, value: e.progress });
  if (ref.t === 'issue' || ref.t === 'action') common.push({ key: 'due', label: 'Deadline', type: 'date', value: e.due });
  if (ref.t === 'issue') common.push({ key: 'priority', label: 'Prioritet', type: 'select', options: Object.entries(PRIORITY).map(([k, p]) => ({ value: k, label: p.label })), value: e.priority });
  if (ref.t === 'drawing') common.push({ key: 'number', label: 'Nummer', value: e.number }, { key: 'rev', label: 'Revision', value: e.rev }, { key: 'source', label: 'Källa (URL)', value: e.source || '', full: true });
  if ('discipline' in e) common.push({ key: 'discipline', label: 'Disciplin', list: distinct('discipline'), value: e.discipline || '' });
  if ('contractor' in e) common.push({ key: 'contractor', label: 'Entreprenör', list: distinct('contractor'), value: e.contractor || '' });
  if ('description' in e || ['issue', 'package', 'decision'].includes(ref.t)) common.push({ key: 'description', label: 'Beskrivning', type: 'textarea', value: e.description || '' });
  if (ref.t === 'meeting') common.push({ key: 'date', label: 'Datum', type: 'date', value: e.date }, { key: 'notes', label: 'Anteckningar', type: 'textarea', rows: 5, value: e.notes || '' });
  const v = await formDialog({ title: `Redigera ${TYPES[ref.t].label.toLowerCase()}`, subtitle: labelOf(ref), fields: common });
  if (!v) return;
  if (v.progress != null) v.progress = Math.max(0, Math.min(100, v.progress));
  update(ref, v);
  toast('Ändringarna sparades', { tone: 'ok', action: undoAction });
}

// ------------------------------------------------------------------ menyer
function entityMenu(ref, extra = []) {
  const e = get(ref); if (!e) return [];
  const t = ref.t;
  const statusSub = STATUS_SETS[t] && t !== 'activity' ? STATUS_SETS[t].map((s) => ({ label: STATUS[s].label, checked: e.status === s, action: () => setStatus(ref, s) })) : null;
  const assignSub = ['action', 'issue', 'package', 'activity', 'decision'].includes(t) ? people().map((p) => ({ label: p, checked: e.responsible === p, action: () => assign(ref, p) })) : null;
  const items = [
    { label: 'Öppna', icon: 'eye', kbd: '↵', action: () => app.open(ref) },
    { label: 'Öppna i flytande fönster', icon: 'window', kbd: '⇧ Klick', action: () => app.openFloat(ref) },
    (e.file || e.source || t === 'model' || t === 'drawing') && { label: 'Öppna källa', icon: 'external', action: () => openSource(ref) },
    { label: 'Kopiera länk', icon: 'link', action: () => copyLink(ref) },
    { label: isFav(ref) ? 'Ta bort från favoriter' : 'Lägg till i favoriter', icon: 'star', action: () => toggleFav(ref) },
    { divider: true },
    statusSub && { label: 'Ändra status', icon: 'target', submenu: statusSub },
    assignSub && { label: 'Tilldela', icon: 'user', submenu: assignSub },
    ['action', 'issue', 'activity'].includes(t) && { label: t === 'activity' ? 'Ändra slutdatum…' : 'Ändra deadline…', icon: 'calendar', action: () => changeDeadline(ref) },
    t !== 'activity' && t !== 'package' && t !== 'area' && { label: 'Koppla till aktivitet…', icon: 'calendar', action: () => linkPicker(ref, ['activity']) },
    t !== 'package' && t !== 'area' && { label: 'Koppla till arbetspaket…', icon: 'box', action: () => linkPicker(ref, ['package']) },
    { label: 'Koppla information…', icon: 'link', action: () => linkPicker(ref, ['drawing', 'model', 'issue', 'action', 'decision', 'meeting', 'document', 'activity', 'package'].filter((x) => x !== t)) },
    { label: 'Lägg på whiteboard', icon: 'board', action: () => addToWhiteboard(ref) },
    (t === 'drawing' || t === 'model') && { label: 'Visa revisionshistorik', icon: 'history', action: () => app.select(ref, { tab: 'history' }) },
    { label: 'Lägg till anteckning…', icon: 'note', action: () => addNote(ref) },
    ['issue', 'package', 'activity', 'drawing'].includes(t) && { label: 'Skapa åtgärd härifrån…', icon: 'check', action: () => createAction({ linkTo: ref, packageId: t === 'package' ? e.id : e.packageId }) },
    ...extra,
    { divider: true },
    t !== 'area' && { label: 'Redigera…', icon: 'note', kbd: 'E', action: () => editEntity(ref) },
    t !== 'area' && { label: 'Ta bort…', icon: 'trash', danger: true, action: () => deleteEntity(ref) }
  ];
  return items.filter(Boolean);
}

function showEntityMenu(e, ref, extra) {
  e.preventDefault(); e.stopPropagation();
  contextMenu(e.clientX, e.clientY, entityMenu(ref, extra));
}

/** Kopplar klick/dubbelklick/högerklick/drag på ett element till en entitet. */
function bindEntity(el, ref, { open = 'dbl', drop = true, drag = true } = {}) {
  el.dataset.ref = refKey(ref);
  el.addEventListener('click', (ev) => {
    if (ev.target.closest('button, a, input, select, .no-select')) return;
    if (ev.shiftKey) { app.openFloat(ref); return; }
    if (open === 'click') app.open(ref); else app.select(ref);
  });
  if (open === 'dbl') el.addEventListener('dblclick', (ev) => { if (!ev.target.closest('button, input')) app.open(ref); });
  el.addEventListener('contextmenu', (ev) => showEntityMenu(ev, ref));
  if (drag) makeDraggable(el, ref);
  if (drop) dropTarget(el, entityDropSpec(ref));
  if (sameRef(app.selection, ref)) el.classList.add('selected');
  return el;
}

/** Standardregler för att släppa saker på en entitet. */
function entityDropSpec(ref) {
  return {
    accept: (src) => (src.ref ? !sameRef(src.ref, ref) && src.ref.t !== 'tool' && ref.t !== 'area' : src.files && ref.t !== 'area'),
    label: (src) => src?.ref ? `Koppla till ${labelOf(ref)}` : `Bifoga till ${labelOf(ref)}`,
    onDrop: (src) => {
      if (src.ref) linkWithFeedback(src.ref, ref);
      else attachFiles(ref, src.files);
    }
  };
}

};

__defs["js/context.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "relRow": { get: () => relRow, enumerable: true },
  "renderContext": { get: () => renderContext, enumerable: true }
});
// Kontextpanel: detaljer, kopplingar och historik för valt objekt.
// Används både i högerpanelen och i flytande fönster.
const { store, TYPES, STATUS, STATUS_SETS, PRIORITY, get, all, codeOf, titleOf, labelOf, statusOf, areaOf, related, historyFor, latestVersion, packageProgress, refKey, sameRef, update, mutate, fileUrl, parseDate, daysBetween, today, unlink } = __r("js/store.js");
const { h, icon, typeIcon, badge, prioBadge, avatar, progressBar, fmtDate, relDays, ago, dueChip, contextMenu, emptyState, fmtSize, dropTarget, hueOf, docIcon, popover, selectList } = __r("js/ui.js");
const { bindEntity, entityMenu, showEntityMenu, setStatus, assign, linkPicker, addNote, addToWhiteboard, toggleFav, isFav, openSource, changeDeadline, attachFiles, linkWithFeedback, editEntity, createAction, importIfc } = __r("js/actions.js");
const { app } = __r("js/app.js");

const COLLAPSE_KEY = 'pch.ctx.collapsed';
const collapsed = new Set((() => { try { return JSON.parse(localStorage.getItem(COLLAPSE_KEY) || '[]'); } catch { return []; } })());
const saveCollapsed = () => { try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify([...collapsed])); } catch {} };

function section(id, title, count, body, { actions } = {}) {
  const isC = collapsed.has(id);
  const sec = h('section', { class: `ctx-sec ${isC ? 'collapsed' : ''}`, dataset: { sec: id } },
    h('header', { onclick: (e) => { if (e.target.closest('button')) return; sec.classList.toggle('collapsed'); sec.classList.contains('collapsed') ? collapsed.add(id) : collapsed.delete(id); saveCollapsed(); } },
      icon('chevD', 14, 'sec-chev'), h('span', title), count != null && h('em', count), h('span', { class: 'grow' }), actions),
    h('div', { class: 'ctx-sec-body' }, h('div', { class: 'ctx-sec-inner' }, body)));
  return sec;
}

function prop(label, value, opts = {}) {
  if (value == null || value === '') return null;
  return h('div', { class: `prop ${opts.click ? 'clickable' : ''}`, onclick: opts.click }, h('dt', label), h('dd', value));
}

function relRow(ref, relId, { compact = false } = {}) {
  const e = get(ref);
  const st = statusOf(ref, e);
  const row = h('div', { class: `relrow ${compact ? 'compact' : ''}` },
    h('span', { class: `relrow-ic ti-${ref.t}` }, typeIcon(ref.t, 13)),
    h('b', { class: 'mono' }, codeOf(ref, e)),
    h('span', { class: 'relrow-title' }, titleOf(ref, e).replace(codeOf(ref, e), '').trim() || titleOf(ref, e)),
    st && STATUS[st] && h('i', { class: `sdot tone-${STATUS[st].tone}`, title: STATUS[st].label }),
    relId ? h('button', { class: 'iconbtn xs unlink', title: 'Ta bort koppling', onclick: (ev) => { ev.stopPropagation(); unlink(relId); } }, icon('x', 12)) : h('span', { class: 'relrow-via', title: 'Strukturell koppling' }, icon('layers', 11)));
  bindEntity(row, ref, { drop: true });
  return row;
}

function statusControl(ref, e) {
  const set = STATUS_SETS[ref.t];
  const st = statusOf(ref, e);
  if (!set || ref.t === 'activity') return badge(st);
  const b = h('button', { class: 'status-btn', title: 'Ändra status' }, badge(st), icon('chevD', 12));
  b.onclick = () => {
    let pop;
    const sl = selectList({ options: set.map((s) => ({ value: s, label: STATUS[s].label })), selected: [e.status], multi: false, onCommit: (v) => { pop.close(); setStatus(ref, v); } });
    pop = popover(b, sl.el, { cls: 'pop-select' });
  };
  return b;
}

function personControl(ref, e) {
  const b = h('button', { class: 'person-btn', title: 'Tilldela' }, e.responsible ? [avatar(e.responsible, 18), e.responsible] : h('span', { class: 'muted' }, 'Ej tilldelad'));
  b.onclick = () => {
    let pop;
    const sl = selectList({ options: [...new Set([...(store.db.people || []), ...all('action').map((a) => a.responsible).filter(Boolean)])].map((p) => ({ value: p, label: p })), selected: [e.responsible], multi: false, onCommit: (v) => { pop.close(); assign(ref, v); } });
    pop = popover(b, sl.el, { cls: 'pop-select' });
  };
  return b;
}

function relationsBlock(ref) {
  const rels = related(ref);
  const order = ['area', 'package', 'activity', 'issue', 'action', 'drawing', 'model', 'decision', 'meeting', 'document'];
  const groups = order.map((t) => [t, rels.filter((r) => r.ref.t === t)]).filter(([, l]) => l.length);
  const body = h('div', { class: 'rel-groups' },
    groups.length ? groups.map(([t, l]) => h('div', { class: 'rel-group' },
      h('div', { class: 'rel-head' }, typeIcon(t, 12), TYPES[t].plural, h('em', l.length)),
      l.slice(0, 30).map((r) => relRow(r.ref, r.relId, { compact: true })),
      l.length > 30 && h('div', { class: 'muted small' }, `+ ${l.length - 30} till`)))
      : h('p', { class: 'muted small' }, 'Inga kopplingar ännu.'),
    h('div', { class: 'ctx-dropzone' }, icon('link', 14), 'Dra information eller filer hit för att koppla'));
  return section('rel', 'Kopplingar', rels.length, body, {
    actions: h('button', { class: 'iconbtn sm', title: 'Koppla information…', onclick: () => linkPicker(ref, ['drawing', 'model', 'issue', 'action', 'decision', 'meeting', 'document', 'activity', 'package'].filter((x) => x !== ref.t)) }, icon('plus', 14))
  });
}

function historyBlock(ref) {
  const list = historyFor(ref);
  const e = get(ref);
  const body = list.length || e.created ? h('ol', { class: 'timeline' },
    list.slice(0, 40).map((x) => h('li', h('i', { class: `tl-dot k-${x.kind}` }), h('div', h('span', x.text), h('small', ago(x.ts))))),
    e.created && !list.some((x) => x.kind === 'create') && h('li', h('i', { class: 'tl-dot k-create' }), h('div', h('span', 'Skapad'), h('small', ago(e.created)))))
    : h('p', { class: 'muted small' }, 'Ingen historik ännu.');
  return section('hist', 'Historik', list.length, body);
}

function notesBlock(ref, e) {
  const notes = e.notes || [];
  return section('notes', 'Anteckningar', notes.length,
    notes.length ? notes.map((n) => h('div', { class: 'note' }, h('p', n.text), h('small', ago(n.ts)))) : h('p', { class: 'muted small' }, 'Inga anteckningar.'),
    { actions: h('button', { class: 'iconbtn sm', title: 'Lägg till anteckning', onclick: () => addNote(ref) }, icon('plus', 14)) });
}

function specific(ref, e) {
  const out = [];
  if (ref.t === 'activity') {
    const range = h('input', { type: 'range', min: 0, max: 100, step: 5, value: e.progress, class: 'range', dataset: { fkey: 'ctx-progress' } });
    const val = h('b', `${e.progress}%`);
    range.addEventListener('input', () => { val.textContent = `${range.value}%`; range.style.setProperty('--v', range.value + '%'); });
    range.style.setProperty('--v', e.progress + '%');
    range.addEventListener('change', () => update(ref, { progress: +range.value }, `${e.code} framdrift ${range.value}%`));
    const dur = daysBetween(parseDate(e.start), parseDate(e.end)) + 1;
    out.push(h('div', { class: 'ctx-progress' }, h('div', { class: 'row-between' }, h('span', { class: 'muted small' }, 'Framdrift'), val), range,
      h('div', { class: 'row-between small muted' }, h('span', `${fmtDate(e.start)} → ${fmtDate(e.end)}`), h('span', `${dur} dagar`))));
  }
  if (ref.t === 'package') {
    const pct = packageProgress(e);
    out.push(h('div', { class: 'ctx-progress' }, h('div', { class: 'row-between' }, h('span', { class: 'muted small' }, 'Framdrift (vägd från aktiviteter)'), h('b', `${pct}%`)), progressBar(pct, 'lg')));
  }
  if (ref.t === 'model') {
    const vs = [...(e.versions || [])].sort((a, b) => b.v - a.v);
    out.push(section('versions', 'Versioner', vs.length, h('ol', { class: 'versions' }, vs.map((v, i) => h('li', { class: i === 0 ? 'latest' : '' },
      h('b', `v${v.v}`), h('div', h('span', v.note || '–'), h('small', `${fmtDate(v.date)} · ${v.author || ''} · ${v.schema || ''}${v.size ? ' · ' + fmtSize(v.size) : ''}`)),
      i === 0 && h('span', { class: 'badge tone-accent' }, 'Senaste'))))));
  }
  if (ref.t === 'drawing') {
    out.push(h('div', { class: 'drawing-preview' }, h('div', { class: 'dp-sheet' }, h('span', e.number), h('small', `Rev ${e.rev}`))));
  }
  if (ref.t === 'document') {
    const prev = h('div', { class: `doc-preview kind-${e.kind}`, style: { '--h': e.hue ?? hueOf(e.name) } }, icon(docIcon(e.kind), 28));
    if (e.kind === 'photo' && e.file) fileUrl(e.file).then((u) => { if (u) { prev.style.backgroundImage = `url("${u}")`; prev.classList.add('has-img'); prev.replaceChildren(); } });
    out.push(prev);
    if (e.kind === 'email') out.push(h('dl', { class: 'props' }, prop('Från', e.from), prop('Ämne', e.subject)));
  }
  if (ref.t === 'meeting' && e.notes) out.push(h('div', { class: 'ctx-desc pre' }, e.notes));
  return out;
}

/** Bygg kontextinnehåll för ref. */
function renderContext(ref, { float = false, focus } = {}) {
  const e = get(ref);
  if (!e) return emptyState('Objektet finns inte längre', 'Det kan ha tagits bort.');
  const area = areaOf(ref, e);
  const pkg = e.packageId ? get({ t: 'package', id: e.packageId }) : null;
  const code = codeOf(ref, e);

  const head = h('div', { class: 'ctx-head' },
    h('div', { class: 'ctx-kicker' },
      h('span', { class: `type-tag ti-${ref.t}` }, typeIcon(ref.t, 12), TYPES[ref.t].label),
      area && h('button', { class: 'crumb-chip', onclick: () => app.select({ t: 'area', id: area.id }) }, area.code),
      pkg && h('button', { class: 'crumb-chip', onclick: () => app.select({ t: 'package', id: pkg.id }) }, pkg.code),
      h('span', { class: 'grow' }),
      h('button', { class: `iconbtn sm ${isFav(ref) ? 'fav' : ''}`, title: 'Favorit', onclick: () => toggleFav(ref) }, icon('star', 14)),
      h('button', { class: 'iconbtn sm', title: 'Fler val', onclick: (ev) => { const r = ev.currentTarget.getBoundingClientRect(); contextMenu(r.left - 200, r.bottom + 4, entityMenu(ref)); } }, icon('dots', 16))),
    h('h2', { class: 'ctx-title' }, code && ref.t !== 'area' && h('span', { class: 'mono code' }, code), titleOf(ref, e).replace(code, '').trim() || titleOf(ref, e)),
    h('div', { class: 'ctx-badges' },
      statusControl(ref, e),
      e.priority && h('span', { class: 'chip' }, prioBadge(e.priority), PRIORITY[e.priority].label),
      e.due && dueChip(e.due, ['done', 'resolved', 'closed'].includes(e.status)),
      ref.t === 'drawing' && h('span', { class: 'chip mono' }, `Rev ${e.rev}`),
      ref.t === 'model' && h('span', { class: 'chip mono' }, `v${latestVersion(e)?.v ?? '–'}`)));

  const quick = h('div', { class: 'ctx-quick' },
    ref.t !== 'area' && h('button', { class: 'btn sm', onclick: () => app.open(ref) }, icon('eye', 14), 'Öppna'),
    !float && h('button', { class: 'btn sm ghost', title: 'Öppna i flytande fönster (Shift+klick)', onclick: () => app.openFloat(ref) }, icon('window', 14)),
    h('button', { class: 'btn sm ghost', title: 'Lägg på whiteboard', onclick: () => addToWhiteboard(ref) }, icon('board', 14)),
    h('button', { class: 'btn sm ghost', title: 'Koppla information', onclick: () => linkPicker(ref, ['drawing', 'model', 'issue', 'action', 'decision', 'document', 'activity', 'package'].filter((x) => x !== ref.t)) }, icon('link', 14)),
    (ref.t === 'drawing' || ref.t === 'model' || e.file) && h('button', { class: 'btn sm ghost', title: 'Öppna källa', onclick: () => openSource(ref) }, icon('external', 14)),
    ['issue', 'package', 'activity'].includes(ref.t) && h('button', { class: 'btn sm ghost', title: 'Skapa åtgärd', onclick: () => createAction({ linkTo: ref, packageId: ref.t === 'package' ? e.id : e.packageId }) }, icon('check', 14)),
    ref.t !== 'area' && h('button', { class: 'btn sm ghost', title: 'Redigera (E)', onclick: () => editEntity(ref) }, icon('note', 14)));

  const props = h('dl', { class: 'props' },
    prop('Ansvarig', ['issue', 'action', 'package', 'activity', 'decision'].includes(ref.t) ? personControl(ref, e) : e.responsible),
    prop('WBS', e.wbs && h('span', { class: 'mono' }, e.wbs)),
    prop('Disciplin', e.discipline),
    prop('Entreprenör', e.contractor),
    prop('Typ', e.kind && ref.t !== 'document' ? e.kind : null),
    ref.t === 'area' && prop('Arbetspaket', all('package').filter((p) => p.areaId === e.id).length),
    prop('Datum', (ref.t === 'drawing' || ref.t === 'decision' || ref.t === 'meeting' || ref.t === 'document') && e.date ? `${fmtDate(e.date, true)} · ${relDays(e.date)}` : null),
    prop('Deadline', e.due ? h('span', { class: 'clickable-text', onclick: () => changeDeadline(ref) }, fmtDate(e.due, true)) : null),
    prop('Skapad', e.created ? ago(e.created) : null),
    ref.t === 'document' && prop('Fil', e.file ? h('button', { class: 'linkbtn', onclick: () => openSource(ref) }, e.name, e.size ? ` · ${fmtSize(e.size)}` : '') : h('span', { class: 'muted' }, 'Ingen fil – exempeldata')));

  const body = h('div', { class: 'ctx-body', dataset: { skey: 'ctx-body' } },
    quick,
    ...specific(ref, e),
    e.description && h('div', { class: 'ctx-desc' }, e.description),
    section('props', 'Egenskaper', null, props),
    relationsBlock(ref),
    ref.t === 'model' && h('div', { class: 'ifc-drop', dataset: { ifc: '1' } }, icon('upload', 14), 'Släpp en IFC-fil här för ny version'),
    notesBlock(ref, e),
    historyBlock(ref));

  const root = h('div', { class: `ctx ${float ? 'is-float' : ''}`, dataset: { ref: refKey(ref) } }, head, body);
  dropTarget(body, {
    accept: (src) => (src.ref ? !sameRef(src.ref, ref) : !!src.files),
    label: (src) => src?.ref ? `Koppla till ${labelOf(ref)}` : ref.t === 'model' ? 'Skapa ny modellversion / bifoga' : `Bifoga till ${labelOf(ref)}`,
    onDrop: (src) => {
      if (src.ref) return linkWithFeedback(src.ref, ref);
      const ifc = src.files.filter((f) => /\.ifc(zip)?$/i.test(f.name));
      if (ref.t === 'model' && ifc.length) { importIfc(ifc[0], e); return; }
      attachFiles(ref, src.files);
    }
  });
  if (focus) requestAnimationFrame(() => {
    const sec = root.querySelector(`[data-sec="${focus === 'history' ? (ref.t === 'model' ? 'versions' : 'hist') : focus}"]`);
    if (sec) { sec.classList.remove('collapsed'); sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); sec.classList.add('flash'); }
  });
  return root;
}

};

__defs["js/filters.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "PERIODS": { get: () => PERIODS, enumerable: true },
  "filters": { get: () => filters, enumerable: true },
  "isActive": { get: () => isActive, enumerable: true },
  "activeCount": { get: () => activeCount, enumerable: true },
  "setFilter": { get: () => setFilter, enumerable: true },
  "clearFilters": { get: () => clearFilters, enumerable: true },
  "applyFilter": { get: () => applyFilter, enumerable: true },
  "matches": { get: () => matches, enumerable: true },
  "filtered": { get: () => filtered, enumerable: true },
  "describe": { get: () => describe, enumerable: true },
  "filterBar": { get: () => filterBar, enumerable: true },
  "saveCurrent": { get: () => saveCurrent, enumerable: true },
  "onFilters": { get: () => onFilters, enumerable: true }
});
// Globala filter som alla vyer delar. Ändras ett filter uppdateras hela den aktuella vyn direkt.
const { store, all, get, areaOf, statusOf, today, addDays, parseDate, distinct, people, STATUS, TYPES, uid, persist, emit, on } = __r("js/store.js");
const { h, icon, dropdown, popover, toast, formDialog, selectList } = __r("js/ui.js");

const PERIODS = [
  { value: 'all', label: 'Hela tiden' },
  { value: '2w', label: 'Nästa 2 veckor', days: 14 },
  { value: '4w', label: 'Nästa 4 veckor', days: 28 },
  { value: '3m', label: 'Nästa 3 månader', days: 91 },
  { value: 'overdue', label: 'Försenat / förfallet' }
];
const DIMS = ['area', 'discipline', 'contractor', 'responsible', 'status', 'types'];
const blank = () => ({ area: [], discipline: [], contractor: [], responsible: [], status: [], types: [], period: 'all' });

const filters = { cur: blank() };

const RECENT_KEY = 'pch.recentFilters';
function loadRecent() { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; } }
function saveRecent(list) { try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 6))); } catch {} }

try { const s = JSON.parse(sessionStorage.getItem('pch.filter') || 'null'); if (s) filters.cur = { ...blank(), ...s }; } catch {}

function isActive(f = filters.cur) { return DIMS.some((d) => f[d]?.length) || f.period !== 'all'; }
function activeCount(f = filters.cur) { return DIMS.reduce((n, d) => n + (f[d]?.length ? 1 : 0), 0) + (f.period !== 'all' ? 1 : 0); }

let recentTimer;
function setFilter(patch, { remember = true } = {}) {
  filters.cur = { ...filters.cur, ...patch };
  try { sessionStorage.setItem('pch.filter', JSON.stringify(filters.cur)); } catch {}
  emit('filters', filters.cur);
  if (remember) {
    clearTimeout(recentTimer);
    recentTimer = setTimeout(() => {
      if (!isActive()) return;
      const key = JSON.stringify(filters.cur);
      const list = loadRecent().filter((r) => JSON.stringify(r.filter) !== key);
      list.unshift({ filter: filters.cur, ts: Date.now() });
      saveRecent(list);
    }, 1500);
  }
}
function clearFilters() { setFilter(blank(), { remember: false }); }
function applyFilter(f) { setFilter({ ...blank(), ...f }); }

/** Har entiteten (ref,e) godkänts av aktuella filter? opts.ignore = ['period', ...] */
function matches(ref, e = get(ref), opts = {}) {
  const f = filters.cur, ig = new Set(opts.ignore || []);
  if (!e) return false;
  if (!ig.has('types') && f.types.length && !f.types.includes(ref.t)) return false;
  if (!ig.has('area') && f.area.length) {
    const a = areaOf(ref, e);
    if (a ? !f.area.includes(a.id) : ref.t !== 'meeting' && ref.t !== 'tool') return false;
  }
  for (const k of ['discipline', 'contractor', 'responsible']) {
    if (!ig.has(k) && f[k].length && e[k] !== undefined && !f[k].includes(e[k])) return false;
  }
  if (!ig.has('status') && f.status.length) {
    const s = statusOf(ref, e);
    if (s && !f.status.includes(s)) return false;
  }
  if (!ig.has('period') && f.period !== 'all') {
    const t = today();
    if (f.period === 'overdue') {
      if (ref.t === 'activity') return statusOf(ref, e) === 'late';
      if (ref.t === 'issue') return e.due && parseDate(e.due) < t && !['resolved', 'closed'].includes(e.status);
      if (ref.t === 'action') return e.due && parseDate(e.due) < t && e.status !== 'done';
      if (ref.t === 'package') return e.status === 'risk' || all('activity').some((a) => a.packageId === e.id && statusOf({ t: 'activity', id: a.id }, a) === 'late');
      return true;
    }
    const days = PERIODS.find((p) => p.value === f.period)?.days || 0;
    const end = addDays(t, days);
    if (ref.t === 'activity') return parseDate(e.start) <= end && parseDate(e.end) >= t;
    if (ref.t === 'issue' || ref.t === 'action') return e.due && parseDate(e.due) <= end && (parseDate(e.due) >= t || !['done', 'resolved', 'closed'].includes(e.status));
    if (ref.t === 'meeting') return parseDate(e.date) >= t && parseDate(e.date) <= end;
    if (ref.t === 'package') return all('activity').some((a) => a.packageId === e.id && parseDate(a.start) <= end && parseDate(a.end) >= t);
  }
  return true;
}
function filtered(t, opts) { return all(t).filter((e) => matches({ t, id: e.id }, e, opts)); }

// ------------------------------------------------------------------ UI
function optionsFor(dim) {
  switch (dim) {
    case 'area': return all('area').map((a) => ({ value: a.id, label: `${a.code} ${a.name}`, color: a.color }));
    case 'discipline': return distinct('discipline').map((v) => ({ value: v, label: v }));
    case 'contractor': return distinct('contractor').map((v) => ({ value: v, label: v }));
    case 'responsible': return people().map((v) => ({ value: v, label: v }));
    case 'status': return ['planned', 'active', 'late', 'risk', 'done', 'open', 'inprogress', 'doing', 'resolved', 'review', 'construction', 'proposed', 'decided']
      .map((k) => ({ value: k, label: STATUS[k].label, hint: hintFor(k) }));
    case 'types': return ['package', 'activity', 'drawing', 'model', 'issue', 'action', 'decision', 'meeting', 'document'].map((t) => ({ value: t, label: TYPES[t].plural, icon: TYPES[t].icon }));
  }
  return [];
}
function hintFor(k) {
  return { planned: 'paket, aktivitet', active: 'paket, aktivitet', late: 'aktivitet', risk: 'paket', done: 'paket, aktivitet, åtgärd', open: 'ärende, åtgärd', inprogress: 'ärende', doing: 'åtgärd', resolved: 'ärende', review: 'ritning', construction: 'ritning', proposed: 'beslut', decided: 'beslut' }[k];
}
const DIM_LABEL = { area: 'Område', discipline: 'Disciplin', contractor: 'Entreprenör', responsible: 'Ansvarig', status: 'Status', types: 'Informationstyp' };
const DIM_ICON = { area: 'map', discipline: 'layers', contractor: 'users', responsible: 'user', status: 'target', types: 'grid' };

function describe(f) {
  const parts = [];
  if (f.area?.length) parts.push(f.area.map((id) => get({ t: 'area', id })?.code || id).join(', '));
  for (const k of ['discipline', 'contractor', 'responsible']) if (f[k]?.length) parts.push(f[k].join(', '));
  if (f.status?.length) parts.push(f.status.map((s) => STATUS[s]?.label).join(', '));
  if (f.types?.length) parts.push(f.types.map((t) => TYPES[t].plural).join(', '));
  if (f.period && f.period !== 'all') parts.push(PERIODS.find((p) => p.value === f.period)?.label);
  return parts.join(' · ') || 'Inga filter';
}

/** Filterraden. dims = vilka dimensioner som är relevanta för vyn. */
function filterBar({ dims = ['area', 'discipline', 'contractor', 'responsible', 'status'], period = true } = {}) {
  const f = filters.cur;
  const bar = h('div', { class: 'filterbar' });
  for (const d of dims) {
    bar.append(dropdown({ label: DIM_LABEL[d], iconName: DIM_ICON[d], options: optionsFor(d), value: f[d], multi: true, cls: 'dd-filter', onChange: (v) => setFilter({ [d]: v }) }));
  }
  if (period) {
    bar.append(dropdown({ label: 'Period', iconName: 'calendar', options: PERIODS, value: f.period, cls: `dd-filter ${f.period !== 'all' ? 'has-value' : ''}`, onChange: (v) => setFilter({ period: v }) }));
  }
  if (isActive()) bar.append(h('button', { class: 'btn ghost sm clear-filters', onclick: clearFilters, title: 'Rensa alla filter' }, icon('x', 13), 'Rensa'));
  bar.append(h('span', { class: 'grow' }));
  const menuBtn = h('button', { class: 'btn ghost sm', title: 'Sparade och senaste filter' }, icon('star', 13), 'Filter', icon('chevD', 13));
  menuBtn.onclick = () => openFilterMenu(menuBtn);
  bar.append(menuBtn);
  return bar;
}

function openFilterMenu(anchor) {
  const saved = store.db.savedFilters;
  const recent = loadRecent();
  let pop;
  const row = (title, sub, onClick, extra) => h('div', { class: 'fm-row', onclick: () => { onClick(); pop.close(); } }, h('div', h('b', title), h('small', sub)), extra);
  const content = h('div', { class: 'filter-menu' },
    h('div', { class: 'fm-sec' }, h('div', { class: 'fm-head' }, 'Sparade filter'),
      saved.length ? [...saved].sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0)).map((s) => row(s.name, describe(s.filter), () => applyFilter(s.filter),
        h('span', { class: 'fm-actions' },
          h('button', { class: `iconbtn sm ${s.fav ? 'fav' : ''}`, title: s.fav ? 'Ta bort favorit' : 'Favorit', onclick: (e) => { e.stopPropagation(); s.fav = !s.fav; persist(); emit('filters'); pop.close(); openFilterMenu(anchor); } }, icon('star', 13)),
          h('button', { class: 'iconbtn sm', title: 'Ta bort', onclick: (e) => { e.stopPropagation(); store.db.savedFilters = saved.filter((x) => x !== s); persist(); pop.close(); toast(`Filtret ”${s.name}” togs bort`); } }, icon('trash', 13)))))
        : h('div', { class: 'fm-empty' }, 'Inga sparade filter än.')),
    recent.length ? h('div', { class: 'fm-sec' }, h('div', { class: 'fm-head' }, 'Senast använda'), recent.map((r) => row(describe(r.filter), '', () => applyFilter(r.filter)))) : null,
    h('div', { class: 'fm-foot' },
      h('button', { class: 'btn sm', disabled: !isActive(), onclick: async () => { pop.close(); await saveCurrent(); } }, icon('save', 13), 'Spara aktuellt filter…')));
  pop = popover(anchor, content, { align: 'end', cls: 'pop-filter' });
}

async function saveCurrent() {
  if (!isActive()) { toast('Välj några filter först'); return; }
  const v = await formDialog({ title: 'Spara filter', subtitle: describe(filters.cur), fields: [{ key: 'name', label: 'Namn', required: true, value: describe(filters.cur).slice(0, 40), full: true }], okLabel: 'Spara' });
  if (!v) return;
  store.db.savedFilters.push({ id: uid('sf'), name: v.name, fav: false, filter: { ...filters.cur } });
  persist();
  toast(`Filtret ”${v.name}” sparades`, { tone: 'ok' });
}

function onFilters(fn) { return on('filters', fn); }

};

__defs["js/views/tools.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "meta": { get: () => meta, enumerable: true },
  "toolUrl": { get: () => toolUrl, enumerable: true },
  "render": { get: () => render, enumerable: true },
  "openTool": { get: () => openTool, enumerable: true },
  "addToolDialog": { get: () => addToolDialog, enumerable: true },
  "editToolDialog": { get: () => editToolDialog, enumerable: true },
  "renderWorkspace": { get: () => renderWorkspace, enumerable: true },
  "updateWorkspace": { get: () => updateWorkspace, enumerable: true },
  "workspaceKeys": { get: () => workspaceKeys, enumerable: true }
});
// MY TOOLS – personlig launcher för egna HTML-appar.
// Metadata lagras i huvuddatabasen (db.tools); själva filerna ligger i user_tools/<id>/
// och körs från en separat origin (verktygsservern) i en sandlådad iframe.
const { store, TOOL_CATEGORIES, uid, persist, mutate, emit, fileToBase64, idbPut, idbGet, idbDel } = __r("js/store.js");
const { h, icon, toast, modal, confirmDialog, contextMenu, dropTarget, readDropped, fmtSize, ago, hueOf, norm, emptyState, $, $$, popover, selectList, dropdown } = __r("js/ui.js");
const { app } = __r("js/app.js");

const meta = { id: 'tools', title: 'My Tools', icon: 'tool' };

const st = { q: '', scope: 'all', cat: null, tags: [], sort: 'recent' };
const tools = () => store.db.tools;
const getTool = (id) => tools().find((t) => t.id === id);

// ------------------------------------------------------------------ körning
function toolUrl(t) {
  if (store.mode === 'server') return `${store.server.toolOrigin}/tools/${encodeURIComponent(t.id)}/${t.entry.split('/').map(encodeURIComponent).join('/')}`;
  if (t.builtin) return `examples/tools/${t.id}/${t.entry}`;
  return null; // srcdoc från IndexedDB
}
async function localSrc(t) {
  const blob = t.localKey ? await idbGet(t.localKey) : null;
  return blob ? await blob.text() : null;
}
function markUsed(t) {
  t.lastUsed = new Date().toISOString();
  t.useCount = (t.useCount || 0) + 1;
  persist();
}

// ------------------------------------------------------------------ biblioteket
function render(root) {
  const all = tools();
  const q = norm(st.q);
  let list = all.filter((t) =>
    (st.scope === 'all' || t.scope === st.scope) &&
    (!st.cat || t.category === st.cat) &&
    (!st.tags.length || st.tags.every((x) => (t.tags || []).includes(x))) &&
    (!q || norm(`${t.name} ${t.description} ${(t.tags || []).join(' ')} ${t.category}`).includes(q)));
  const sorters = {
    recent: (a, b) => (b.lastUsed || b.created || '').localeCompare(a.lastUsed || a.created || ''),
    name: (a, b) => a.name.localeCompare(b.name, 'sv'),
    newest: (a, b) => (b.created || '').localeCompare(a.created || '')
  };
  list = [...list].sort(sorters[st.sort]);
  const filtering = q || st.cat || st.tags.length || st.scope !== 'all';
  const favs = list.filter((t) => t.favourite);
  const recent = [...list].filter((t) => t.lastUsed).sort(sorters.recent).slice(0, 4);
  const cats = TOOL_CATEGORIES.map((c) => [c, all.filter((t) => t.category === c).length]);
  const allTags = [...new Set(all.flatMap((t) => t.tags || []))].sort();

  const grid = (items) => h('div', { class: 'tool-grid' }, items.map(toolCard));
  const sec = (title, iconName, items, extra) => items.length ? h('section', { class: 'tool-sec' }, h('div', { class: 'tool-sec-head' }, icon(iconName, 15), h('h3', title), h('em', items.length), extra), grid(items)) : null;

  const view = h('div', { class: 'view view-tools' },
    h('div', { class: 'view-head' },
      h('div', h('h1', 'My Tools'), h('p', { class: 'muted' }, 'Din verktygslåda: egna HTML-appar, kalkylatorer och visualiseringar som körs direkt i hubben.')),
      h('div', { class: 'head-actions' }, h('button', { class: 'btn primary', onclick: () => addToolDialog() }, icon('plus', 14), 'Lägg till verktyg'))),
    store.mode !== 'server' && h('div', { class: 'banner' }, icon('info', 16), h('div', h('b', 'Demoläge i webbläsaren. '), 'Enskilda HTML-filer kan läggas till och köras här. För verktyg i mappar (CSS, JS, bilder, JSON) behöver du starta den lokala servern med ', h('code', 'start.bat'), '. Då hamnar verktygen i ', h('code', 'user_tools/'), '.')),
    h('div', { class: 'toolbar tools-toolbar' },
      h('label', { class: 'search-inline wide' }, icon('search', 14), h('input', { placeholder: 'Sök verktyg, taggar, kategorier…', value: st.q, dataset: { fkey: 'tool-q' }, oninput: (e) => { st.q = e.target.value; app.render(); } })),
      h('div', { class: 'seg' }, [['all', 'Alla'], ['personal', 'Personliga'], ['project', 'Projekt']].map(([k, l]) => h('button', { class: st.scope === k ? 'on' : '', onclick: () => { st.scope = k; app.render(); } }, l))),
      allTags.length ? dropdown({ label: 'Taggar', iconName: 'filter', options: allTags.map((t) => ({ value: t, label: t })), value: st.tags, multi: true, cls: 'dd-filter', onChange: (v) => { st.tags = v; app.render(); } }) : null,
      dropdown({ label: 'Sortera', options: [{ value: 'recent', label: 'Senast använda' }, { value: 'name', label: 'Namn' }, { value: 'newest', label: 'Nyast tillagda' }], value: st.sort, cls: 'dd-filter', onChange: (v) => { st.sort = v; app.render(); } })),
    h('div', { class: 'cat-chips' },
      h('button', { class: `cat-chip ${!st.cat ? 'on' : ''}`, onclick: () => { st.cat = null; app.render(); } }, 'Alla', h('em', all.length)),
      cats.map(([c, n]) => h('button', { class: `cat-chip ${st.cat === c ? 'on' : ''} ${n ? '' : 'zero'}`, onclick: () => { st.cat = st.cat === c ? null : c; app.render(); } }, c, h('em', n)))),
    !all.length ? h('div', { class: 'tools-empty' }, addTile(true))
      : filtering ? (list.length ? grid(list) : emptyState('Inga verktyg matchar', 'Prova en annan sökning eller kategori.'))
        : [sec('Favoriter', 'star', favs), sec('Senast använda', 'clock', recent),
          h('section', { class: 'tool-sec' }, h('div', { class: 'tool-sec-head' }, icon('grid', 15), h('h3', 'Alla verktyg'), h('em', list.length)), h('div', { class: 'tool-grid' }, list.map(toolCard), addTile()))]);

  dropTarget(view, {
    accept: (src) => !!src.files,
    label: () => 'Lägg till som verktyg',
    onDrop: async (src) => addToolDialog(await readDropped(src))
  });
  root.replaceChildren(view);
}

function cover(t, big = false) {
  const hue = hueOf(t.id);
  const el = h('div', { class: `tool-cover ${big ? 'big' : ''}`, style: { '--h': hue } }, h('span', { class: 'tool-glyph' }, t.icon || t.name.slice(0, 1)));
  if (t.cover) { el.style.backgroundImage = `url("${t.cover}")`; el.classList.add('has-img'); }
  return el;
}

function toolCard(t) {
  const card = h('article', { class: 'tool-card', tabindex: '0', dataset: { nav: '1', tool: t.id } },
    cover(t),
    h('button', { class: `iconbtn sm tool-fav ${t.favourite ? 'fav' : ''}`, title: t.favourite ? 'Ta bort favorit' : 'Favorit', onclick: (e) => { e.stopPropagation(); toggleFavTool(t); } }, icon('star', 14)),
    h('div', { class: 'tool-info' },
      h('h4', t.name),
      h('p', t.description || h('span', { class: 'muted' }, 'Ingen beskrivning')),
      h('div', { class: 'tool-meta' },
        h('span', { class: 'chip' }, t.category || 'Övrigt'),
        h('span', { class: 'mono small muted' }, `v${t.version || '1.0'}`),
        h('span', { class: 'muted small', title: t.scope === 'project' ? 'Projektverktyg' : 'Personligt verktyg' }, icon(t.scope === 'project' ? 'box' : 'user', 12)),
        h('span', { class: 'grow' }),
        h('button', { class: 'btn sm primary tool-open', onclick: (e) => { e.stopPropagation(); openTool(t.id); } }, icon('play', 12), 'Öppna'))));
  card.addEventListener('click', () => openTool(t.id));
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openTool(t.id); });
  card.addEventListener('contextmenu', (e) => { e.preventDefault(); contextMenu(e.clientX, e.clientY, toolMenu(t)); });
  return card;
}

function addTile(hero = false) {
  const el = h('button', { class: `tool-add ${hero ? 'hero' : ''}`, onclick: () => addToolDialog() },
    h('span', { class: 'tool-add-ic' }, icon('plus', 22)), h('b', 'Lägg till verktyg'), h('small', 'Välj en HTML-fil, en mapp med index.html eller släpp filerna här'));
  return el;
}

function openTool(id) { app.navigate(`#/tool/${encodeURIComponent(id)}`); }

function toggleFavTool(t) { t.favourite = !t.favourite; persist(); emit('change', { type: 'tool' }); toast(t.favourite ? `${t.name} tillagd i favoriter` : `${t.name} borttagen från favoriter`, { iconName: 'star' }); }

function toolMenu(t) {
  return [
    { label: 'Öppna', icon: 'play', action: () => openTool(t.id) },
    { label: 'Öppna externt', icon: 'external', action: () => openExternal(t) },
    { label: t.favourite ? 'Ta bort från favoriter' : 'Lägg till i favoriter', icon: 'star', action: () => toggleFavTool(t) },
    { label: 'Redigera information…', icon: 'note', action: () => editToolDialog(t) },
    { divider: true },
    { label: 'Ta bort verktyg…', icon: 'trash', danger: true, action: () => deleteTool(t) }
  ];
}

async function openExternal(t) {
  const url = toolUrl(t);
  if (url) { window.open(url, '_blank', 'noopener'); return; }
  const src = await localSrc(t);
  if (src) window.open(URL.createObjectURL(new Blob([src], { type: 'text/html' })), '_blank', 'noopener');
}

async function deleteTool(t) {
  const ok = await confirmDialog({ title: `Ta bort ${t.name}?`, text: store.mode === 'server' ? `Verktyget avregistreras och kopian i ${t.folder || 'user_tools/' + t.id} raderas. Din originalfil påverkas inte.` : 'Verktyget tas bort från biblioteket. Din originalfil påverkas inte.', okLabel: 'Ta bort', danger: true });
  if (!ok) return;
  if (store.mode === 'server') {
    const r = await fetch(`api/tools/${encodeURIComponent(t.id)}`, { method: 'DELETE' });
    if (!r.ok) { toast('Kunde inte ta bort verktygsmappen', { tone: 'bad' }); return; }
  } else if (t.localKey) await idbDel(t.localKey);
  mutate(`Verktyg borttaget: ${t.name}`, (db) => { db.tools = db.tools.filter((x) => x.id !== t.id); }, { kind: 'delete' });
  toast(`${t.name} borttaget`, { iconName: 'trash' });
  if (app.route.view === 'tool') app.navigate('#/tools');
}

// ------------------------------------------------------------------ lägg till
/** Analysera en mängd filer: hitta gemensam rotmapp, startfil och metadata. */
async function analyze(entries) {
  const errors = [], warnings = [];
  let files = entries.filter((x) => !/(^|\/)(\.git|node_modules|\.DS_Store|Thumbs\.db)(\/|$)/.test(x.path));
  // ta bort gemensam toppmapp
  const firsts = new Set(files.map((x) => x.path.split('/')[0]));
  let folderName = null;
  if (firsts.size === 1 && files.every((x) => x.path.includes('/'))) {
    folderName = [...firsts][0];
    files = files.map((x) => ({ ...x, path: x.path.slice(folderName.length + 1) }));
  }
  const htmls = files.filter((x) => /\.html?$/i.test(x.path));
  let entry = files.find((x) => x.path.toLowerCase() === 'index.html')?.path;
  if (!entry && htmls.length === 1) entry = htmls[0].path;
  if (!htmls.length) errors.push('Ingen HTML-fil hittades. Ett verktyg behöver en startfil, t.ex. index.html.');
  else if (!entry) errors.push(`Ingen index.html i roten. Välj startfil bland ${htmls.length} HTML-filer nedan.`);
  const total = files.reduce((s, x) => s + x.file.size, 0);
  if (total > 150 * 1024 * 1024) errors.push(`Verktyget är för stort (${fmtSize(total)}). Maxstorlek är 150 MB.`);
  if (files.length > 1 && store.mode !== 'server') errors.push('Verktyg med flera filer kräver den lokala servern (start.bat). I demoläget går det bara att lägga till en enskild HTML-fil.');
  let title = '', description = '';
  const readMeta = async (p) => {
    const f = files.find((x) => x.path === p)?.file;
    if (!f) return;
    const text = await f.text();
    title = (text.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim() || '';
    description = (text.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1] || '';
    if (/src=["']file:\/\//i.test(text) || /href=["']file:\/\//i.test(text)) warnings.push('Startfilen refererar till file://-sökvägar. Använd relativa sökvägar så att resurserna hittas.');
    if (/src=["']\/(?!\/)/.test(text)) warnings.push('Startfilen använder rotrelativa sökvägar (src="/..."). Använd relativa sökvägar (src="app.js") så att verktyget fungerar i sin mapp.');
  };
  if (entry) await readMeta(entry);
  return { files, entry, htmls: htmls.map((x) => x.path), errors, warnings, total, folderName, title, description, readMeta };
}

const TEMPLATE = (name) => `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name}</title>
<meta name="description" content="Nytt verktyg skapat från mall">
<style>
  :root { color-scheme: light dark; font-family: system-ui, "Segoe UI", sans-serif; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0f1218; color: #e8eaf0; }
  @media (prefers-color-scheme: light) { body { background: #f5f6f8; color: #14171f; } }
  .card { padding: 32px 40px; border-radius: 14px; background: rgba(127,127,127,.08); border: 1px solid rgba(127,127,127,.2); text-align: center; }
  button { font: inherit; padding: 8px 16px; border-radius: 8px; border: 0; background: #4f8cff; color: #fff; cursor: pointer; }
</style>
</head>
<body>
  <div class="card">
    <h1>${name}</h1>
    <p>Redigera <code>index.html</code> i verktygsmappen för att bygga vidare.</p>
    <button id="b">Klicka</button> <span id="n">0</span>
  </div>
  <script>
    let n = 0; document.getElementById('b').onclick = () => { document.getElementById('n').textContent = ++n; };
  </script>
</body>
</html>
`;

async function addToolDialog(initial = null) {
  let analysis = null;
  const filesInput = h('input', { type: 'file', accept: '.html,.htm', hidden: true });
  const dirInput = h('input', { type: 'file', hidden: true, webkitdirectory: true, directory: true, multiple: true });
  const stage = h('div', { class: 'add-stage' });

  const pickStage = () => {
    const zone = h('div', { class: 'add-drop' }, icon('upload', 26), h('b', 'Släpp en HTML-fil eller en hel mapp här'), h('span', { class: 'muted' }, 'Originalet ändras inte. En kopia registreras i user_tools/.'));
    dropTarget(zone, { accept: (s) => !!s.files, label: () => 'Analysera', onDrop: async (s) => show(await readDropped(s)) });
    stage.replaceChildren(
      h('div', { class: 'add-options' },
        h('button', { class: 'add-opt', onclick: () => filesInput.click() }, icon('file', 22), h('b', 'Välj HTML-fil'), h('small', 'En fristående .html')),
        h('button', { class: 'add-opt', onclick: () => dirInput.click(), disabled: store.mode !== 'server', title: store.mode !== 'server' ? 'Kräver lokal server' : '' }, icon('folder', 22), h('b', 'Välj mapp'), h('small', 'Mapp med index.html, CSS, JS, assets')),
        h('button', { class: 'add-opt', onclick: () => fromTemplate() }, icon('sparkle', 22), h('b', 'Starta från mall'), h('small', 'Skapar ett nytt tomt verktyg'))),
      zone);
  };

  const show = async (entries) => {
    if (!entries?.length) return;
    stage.replaceChildren(h('div', { class: 'skeleton' }, h('i'), h('i'), h('i')));
    analysis = await analyze(entries);
    detailsStage();
  };

  const fromTemplate = () => {
    const name = 'Nytt verktyg';
    const file = new File([TEMPLATE(name)], 'index.html', { type: 'text/html' });
    show([{ file, path: 'index.html' }]);
  };

  const form = {};
  const detailsStage = () => {
    const a = analysis;
    const entrySel = a.htmls.length > 1 ? h('select', { class: 'input', onchange: async (e) => { a.entry = e.target.value; a.errors = a.errors.filter((x) => !x.startsWith('Ingen index.html')); a.warnings = []; await a.readMeta(a.entry); detailsStage(); } },
      h('option', { value: '', disabled: true, selected: !a.entry }, 'Välj startfil…'), a.htmls.map((p) => h('option', { value: p, selected: p === a.entry }, p))) : null;
    const field = (key, label, el) => { form[key] = el; return h('label', { class: `field ${['description', 'notes'].includes(key) ? 'full' : ''}` }, h('span', label), el); };
    const nameDefault = form.name?.value || a.title || (a.folderName || a.files[0]?.path || 'Verktyg').replace(/\.html?$/i, '').replace(/[-_]/g, ' ');
    stage.replaceChildren(
      h('div', { class: `validation ${a.errors.length ? 'bad' : 'ok'}` },
        h('div', { class: 'val-row' }, icon(a.entry ? 'checkCircle' : 'alert', 16), a.entry ? h('span', 'Startfil: ', h('code', a.entry)) : h('span', 'Startfil saknas')),
        h('div', { class: 'val-row muted' }, icon('folder', 16), `${a.files.length} filer · ${fmtSize(a.total)}${a.folderName ? ` · från mappen ${a.folderName}` : ''}`),
        a.errors.map((e) => h('div', { class: 'val-row err' }, icon('alert', 16), e)),
        a.warnings.map((w) => h('div', { class: 'val-row warn' }, icon('info', 16), w)),
        entrySel && h('label', { class: 'field' }, h('span', 'Startfil'), entrySel),
        a.files.length > 1 && h('details', { class: 'file-list' }, h('summary', 'Visa filer'), h('ul', a.files.slice(0, 200).map((x) => h('li', h('code', x.path), h('small', fmtSize(x.file.size)))))))
      ,
      h('div', { class: 'form-grid' },
        field('name', 'Namn', h('input', { class: 'input', value: nameDefault })),
        field('category', 'Kategori', h('select', { class: 'input' }, TOOL_CATEGORIES.map((c) => h('option', { value: c, selected: c === (form.category?.value || 'Övrigt') }, c)))),
        field('description', 'Beskrivning', h('input', { class: 'input', value: form.description?.value || a.description || '' })),
        field('scope', 'Typ', h('select', { class: 'input' }, h('option', { value: 'personal' }, 'Personligt verktyg'), h('option', { value: 'project', selected: form.scope?.value === 'project' }, 'Projektverktyg'))),
        field('version', 'Version', h('input', { class: 'input', value: form.version?.value || '1.0' })),
        field('icon', 'Ikon (tecken/emoji)', h('input', { class: 'input', value: form.icon?.value || '', maxlength: 4, placeholder: 'T.ex. ⚙ eller Σ' })),
        field('tags', 'Taggar (kommaseparerade)', h('input', { class: 'input', value: form.tags?.value || '', placeholder: 'betong, kalkyl' })),
        field('notes', 'Anteckningar', h('textarea', { class: 'input', rows: 2 }, form.notes?.value || ''))));
    const regBtn = $('.modal-foot .btn.primary', m.el);
    if (regBtn) regBtn.disabled = !!a.errors.length || !a.entry;
  };

  const register = async () => {
    const a = analysis;
    if (!a || a.errors.length || !a.entry) return false;
    const metaIn = {
      name: form.name.value.trim() || 'Verktyg', description: form.description.value.trim(), category: form.category.value, scope: form.scope.value,
      version: form.version.value.trim() || '1.0', icon: form.icon.value.trim(), tags: form.tags.value.split(',').map((x) => x.trim()).filter(Boolean), notes: form.notes.value.trim()
    };
    const btn = $('.modal-foot .btn.primary', m.el); btn.disabled = true; btn.textContent = 'Registrerar…';
    try {
      const now = new Date().toISOString();
      let id, folder, localKey = null;
      if (store.mode === 'server') {
        const payload = { name: metaIn.name, entry: a.entry, files: [] };
        for (const x of a.files) payload.files.push({ path: x.path, data: await fileToBase64(x.file) });
        const r = await fetch('api/tools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || 'Registreringen misslyckades');
        id = j.id; folder = j.folder;
      } else {
        id = uid('tool'); localKey = `tool-${id}`;
        await idbPut(localKey, a.files[0].file);
        folder = '(webbläsarens lagring)';
      }
      const tool = { id, ...metaIn, entry: a.entry, folder, localKey, favourite: false, created: now, modified: now, lastUsed: null, useCount: 0, fileCount: a.files.length, size: a.total };
      mutate(`Verktyg registrerat: ${tool.name}`, (db) => db.tools.unshift(tool), { kind: 'create' });
      toast(h('span', h('b', tool.name), ' registrerat'), { tone: 'ok', iconName: 'tool', action: { label: 'Öppna', fn: () => openTool(tool.id) } });
      return true;
    } catch (e) {
      toast(e.message, { tone: 'bad' });
      btn.disabled = false; btn.textContent = 'Registrera';
      return false;
    }
  };

  filesInput.onchange = () => show([...filesInput.files].map((f) => ({ file: f, path: f.name })));
  dirInput.onchange = () => show([...dirInput.files].map((f) => ({ file: f, path: f.webkitRelativePath || f.name })));

  const m = modal({
    title: 'Lägg till verktyg', subtitle: 'Registrera en egen HTML-app i My Tools', width: 640, cls: 'modal-add-tool',
    body: h('div', stage, filesInput, dirInput),
    actions: [{ label: 'Börja om', ghost: true, icon: 'refresh', onClick: () => { analysis = null; pickStage(); return false; } }, { spacer: true }, { label: 'Avbryt', ghost: true }, { label: 'Registrera', primary: true, disabled: true, onClick: register }]
  });
  if (initial?.length) show(initial); else pickStage();
}

function editToolDialog(t) {
  const f = {};
  const field = (key, label, el, full) => { f[key] = el; return h('label', { class: `field ${full ? 'full' : ''}` }, h('span', label), el); };
  let coverData = t.cover || null;
  const coverPrev = cover(t);
  const coverInput = h('input', { type: 'file', accept: 'image/*', hidden: true, onchange: async (e) => {
    const file = e.target.files[0]; if (!file) return;
    coverData = await downscale(file, 640);
    coverPrev.style.backgroundImage = `url("${coverData}")`; coverPrev.classList.add('has-img');
  } });
  modal({
    title: 'Verktygsinformation', subtitle: `${t.folder || ''} · startfil ${t.entry}`, width: 620,
    body: h('div', h('div', { class: 'cover-edit' }, coverPrev, h('div', h('button', { class: 'btn sm', onclick: () => coverInput.click() }, icon('image', 13), 'Välj omslagsbild'), ' ', h('button', { class: 'btn sm ghost', onclick: () => { coverData = null; coverPrev.style.backgroundImage = ''; coverPrev.classList.remove('has-img'); } }, 'Ta bort'), coverInput, h('p', { class: 'muted small' }, 'Kommande: automatisk skärmbild av verktyget som miniatyr.'))),
      h('div', { class: 'form-grid' },
        field('name', 'Namn', h('input', { class: 'input', value: t.name })),
        field('category', 'Kategori', h('select', { class: 'input' }, TOOL_CATEGORIES.map((c) => h('option', { value: c, selected: c === t.category }, c)))),
        field('description', 'Beskrivning', h('input', { class: 'input', value: t.description || '' }), true),
        field('scope', 'Typ', h('select', { class: 'input' }, h('option', { value: 'personal' }, 'Personligt verktyg'), h('option', { value: 'project', selected: t.scope === 'project' }, 'Projektverktyg'))),
        field('version', 'Version', h('input', { class: 'input', value: t.version || '' })),
        field('icon', 'Ikon', h('input', { class: 'input', value: t.icon || '', maxlength: 4 })),
        field('tags', 'Taggar', h('input', { class: 'input', value: (t.tags || []).join(', ') })),
        field('notes', 'Anteckningar', h('textarea', { class: 'input', rows: 3 }, t.notes || ''), true))),
    actions: [{ spacer: true }, { label: 'Avbryt', ghost: true }, { label: 'Spara', primary: true, onClick: () => {
      mutate(`Verktyg uppdaterat: ${f.name.value}`, () => Object.assign(t, {
        name: f.name.value.trim() || t.name, category: f.category.value, description: f.description.value.trim(), scope: f.scope.value,
        version: f.version.value.trim(), icon: f.icon.value.trim(), tags: f.tags.value.split(',').map((x) => x.trim()).filter(Boolean), notes: f.notes.value.trim(),
        cover: coverData, modified: new Date().toISOString()
      }), { kind: 'edit' });
      toast('Verktyget uppdaterades', { tone: 'ok' });
    } }]
  });
}

function downscale(file, max) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.82));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

// ------------------------------------------------------------------ verktygsarbetsyta
let current = null;
function renderWorkspace(root, id) {
  const t = getTool(id);
  if (!t) { root.replaceChildren(emptyState('Verktyget finns inte', 'Det kan ha tagits bort.', h('button', { class: 'btn', onclick: () => app.navigate('#/tools') }, 'Till My Tools'))); current = null; return; }
  markUsed(t);
  const sandbox = store.mode === 'server'
    ? 'allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-downloads allow-pointer-lock'
    : 'allow-scripts allow-forms allow-modals allow-popups allow-downloads';
  const frame = h('iframe', { class: 'tool-frame', sandbox, allow: 'fullscreen; clipboard-write', referrerpolicy: 'no-referrer', title: t.name });
  const loader = h('div', { class: 'tool-loading' }, h('div', { class: 'spinner' }), h('span', `Startar ${t.name}…`));
  const stageEl = h('div', { class: 'tool-stage' }, frame, loader);
  frame.addEventListener('load', () => loader.classList.add('done'));

  const load = async () => {
    loader.classList.remove('done');
    const url = toolUrl(t);
    if (url) { frame.removeAttribute('srcdoc'); frame.src = url + (url.includes('?') ? '&' : '?') + '_r=' + Date.now(); }
    else {
      const src = await localSrc(t);
      if (src == null) { loader.replaceChildren(icon('alert', 20), h('span', 'Verktygets fil hittades inte i webbläsarens lagring.')); return; }
      frame.srcdoc = src;
    }
  };

  const info = h('aside', { class: 'tool-info-panel' });
  const renderInfo = async () => {
    info.replaceChildren(
      h('div', { class: 'tip-head' }, cover(t, true), h('div', h('b', t.name), h('small', `${t.category} · v${t.version || '1.0'}`))),
      h('p', t.description || ''),
      h('dl', { class: 'props' },
        ...[['Verktygs-ID', h('code', t.id)], ['Startfil', h('code', t.entry)], ['Mapp', h('code', t.folder || '–')], ['Typ', t.scope === 'project' ? 'Projektverktyg' : 'Personligt'], ['Skapad', t.created ? ago(t.created) : '–'], ['Ändrad', t.modified ? ago(t.modified) : '–'], ['Använt', `${t.useCount || 0} gånger`], ['Taggar', (t.tags || []).join(', ') || '–']]
          .map(([k, v]) => h('div', { class: 'prop' }, h('dt', k), h('dd', v)))),
      t.notes && h('div', { class: 'ctx-desc pre' }, t.notes),
      h('div', { class: 'tip-sec' }, h('b', 'Säkerhet'), h('p', { class: 'muted small' }, store.mode === 'server'
        ? `Körs på en separat origin (${store.server.toolOrigin}) i en sandlådad iframe. Verktyget når inte hubbens data eller gränssnitt.`
        : 'Körs i en sandlådad iframe med egen, isolerad origin. Verktyget når inte hubbens data.')),
      h('div', { class: 'tip-sec' }, h('b', 'Project Control Hub API'), h('p', { class: 'muted small' }, store.server?.toolApi ? 'Påslaget, endast läsning: GET /api/project/activities m.fl. på verktygsservern.' : 'Avstängt. Kan slås på i config.json (endast läsning) så att dina verktyg kan hämta projektdata.'))
    );
    if (store.mode === 'server') {
      try {
        const r = await fetch(`api/tools/${encodeURIComponent(t.id)}/files`);
        if (r.ok) { const j = await r.json(); info.append(h('details', { class: 'file-list', open: j.files.length < 12 }, h('summary', `${j.files.length} filer`), h('ul', j.files.map((f) => h('li', h('code', f.path), h('small', fmtSize(f.size))))))); }
      } catch {}
    }
  };

  const infoOn = () => root.querySelector('.view-tool')?.classList.contains('info-open');
  const head = h('div', { class: 'tool-bar' },
    h('button', { class: 'btn sm ghost', title: 'Tillbaka (Alt+←)', onclick: () => (history.length > 1 ? history.back() : app.navigate('#/tools')) }, icon('back', 14), 'Tillbaka'),
    h('div', { class: 'tool-bar-title' }, h('span', { class: 'tool-glyph sm', style: { '--h': hueOf(t.id) } }, t.icon || t.name[0]), h('b', t.name), h('span', { class: 'mono small muted' }, `v${t.version || '1.0'}`), h('span', { class: 'chip' }, t.category)),
    h('span', { class: 'grow' }),
    h('button', { class: `iconbtn ${t.favourite ? 'fav' : ''}`, title: 'Favorit', onclick: (e) => { toggleFavTool(t); e.currentTarget.classList.toggle('fav', t.favourite); } }, icon('star', 16)),
    h('button', { class: 'iconbtn', title: 'Uppdatera (Ctrl+R stängs av här – använd R)', onclick: load }, icon('refresh', 16)),
    h('button', { class: 'iconbtn', title: 'Öppna externt', onclick: () => openExternal(t) }, icon('external', 16)),
    h('button', { class: 'iconbtn', title: 'Helskärm', onclick: () => stageEl.requestFullscreen?.() }, icon('maximize', 16)),
    h('button', { class: 'iconbtn', title: 'Verktygsinformation (I)', onclick: () => { root.querySelector('.view-tool').classList.toggle('info-open'); if (infoOn()) renderInfo(); } }, icon('info', 16)),
    h('button', { class: 'iconbtn', title: 'Fler val', onclick: (e) => { const r = e.currentTarget.getBoundingClientRect(); contextMenu(r.right - 220, r.bottom + 4, toolMenu(t)); } }, icon('dots', 16)));

  root.replaceChildren(h('div', { class: 'view view-tool' }, head, h('div', { class: 'tool-body' }, stageEl, info)));
  load();
  current = { id, load, renderInfo, root, toggleInfo: () => { root.querySelector('.view-tool').classList.toggle('info-open'); if (infoOn()) renderInfo(); } };
}

/** Kallas vid dataändringar – laddar inte om iframen. */
function updateWorkspace() {
  if (!current) return;
  const t = getTool(current.id);
  if (!t) app.navigate('#/tools');
}

function workspaceKeys(e) {
  if (!current) return false;
  if (e.key === 'r' || e.key === 'R') { current.load(); return true; }
  if (e.key === 'i' || e.key === 'I') { current.toggleInfo(); return true; }
  return false;
}

};

__defs["js/sync.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "DEFAULT_PATTERN": { get: () => DEFAULT_PATTERN, enumerable: true },
  "sync": { get: () => sync, enumerable: true },
  "loadSources": { get: () => loadSources, enumerable: true },
  "runSync": { get: () => runSync, enumerable: true },
  "showReport": { get: () => showReport, enumerable: true },
  "manageSources": { get: () => manageSources, enumerable: true },
  "scheduleAuto": { get: () => scheduleAuto, enumerable: true },
  "initSync": { get: () => initSync, enumerable: true },
  "syncButton": { get: () => syncButton, enumerable: true }
});
// "Hämta uppdateringar": läser in ändringar från datakällor (SharePoint via synkad mapp,
// mappar på datorn, Powerproject-tidplan, egna skript som NSV Binder) via den lokala servern.
const { store, all, get, mutate, uid, isoDate, today, latestVersion, labelOf, codeOf, emit, on, persist } = __r("js/store.js");
const { h, icon, toast, modal, confirmDialog, contextMenu, fmtDate, ago, fmtSize, norm, $ } = __r("js/ui.js");
const { app } = __r("js/app.js");

const DEFAULT_PATTERN = '^(?<number>[A-Z0-9]+(?:[-.][A-Z0-9]+)+)(?:[ _]+(?:rev[ _.]?)?(?<rev>[A-Z]{1,2}|\\d{1,2}))?(?:[ _]+(?<title>.+))?$';

const KINDS = {
  sharepoint: { label: 'SharePoint-bibliotek', icon: 'cloud', type: 'folder', hint: 'Synka biblioteket med OneDrive ("Synkronisera" i SharePoint) och klistra in mappens sökväg.' },
  folder: { label: 'Mapp på datorn', icon: 'folder', type: 'folder', hint: 'Valfri mapp, t.ex. där NSV Binder sparar PDF:er.' },
  powerproject: { label: 'Powerproject-tidplan', icon: 'gantt', type: 'schedule', hint: 'Exportera tidplanen som MS Project XML (eller CSV) till en fast plats. Appen läser in den när filen ändras.' },
  script: { label: 'Skript (t.ex. NSV Binder)', icon: 'bolt', type: 'script', hint: 'Kör ett skript som är definierat i config.json innan mapparna läses.' }
};

const sync = { sources: [], scripts: [], running: false, last: null };

function state() {
  store.db.sync = store.db.sync || { interval: 15, lastSync: null, state: {} };
  store.db.sync.state = store.db.sync.state || {};
  return store.db.sync;
}

// ------------------------------------------------------------------ server-API
async function api(path, opts = {}) {
  const r = await fetch(path, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Fel ${r.status}`);
  return j;
}
async function loadSources() {
  if (store.mode !== 'server') return;
  try { const j = await api('api/sources'); sync.sources = j.sources; sync.scripts = j.scripts; } catch (e) { console.warn(e); }
  emit('sync', sync);
}
async function saveSources() {
  const j = await api('api/sources', { method: 'PUT', body: JSON.stringify({ sources: sync.sources }) });
  sync.sources = j.sources;
  emit('sync', sync);
}

// ------------------------------------------------------------------ hämta
async function runSync({ ids, auto = false } = {}) {
  if (store.mode !== 'server') {
    toast('Hämta uppdateringar kräver den lokala servern (start.bat).', { tone: 'warn', iconName: 'server' });
    return;
  }
  if (sync.running) return;
  if (!sync.sources.length) await loadSources();
  if (!sync.sources.filter((s) => s.enabled).length) {
    if (!auto) manageSources();
    return;
  }
  // Utan uppkoppling: hoppa över skript (de hämtar ofta från nätet), läs mappar ändå.
  let run = ids || sync.sources.filter((s) => s.enabled && (!auto || s.auto)).map((s) => s.id);
  if (!navigator.onLine) run = run.filter((id) => sync.sources.find((s) => s.id === id)?.type !== 'script');
  if (!run.length) return;

  sync.running = true; emit('sync', sync);
  try {
    const res = await api('api/sync', { method: 'POST', body: JSON.stringify({ ids: run }) });
    const report = apply(res);
    sync.last = report;
    const n = report.changes.filter((c) => c.kind !== 'info').length;
    const errs = report.results.filter((r) => !r.ok).length;
    if (n || errs || !auto) {
      toast(n ? `${n} ${n === 1 ? 'uppdatering' : 'uppdateringar'} inlästa${errs ? ` · ${errs} källa med fel` : ''}` : errs ? `${errs} källa kunde inte läsas` : 'Allt är redan uppdaterat',
        { tone: errs ? 'warn' : n ? 'ok' : 'info', iconName: 'refresh', timeout: 6000, action: { label: 'Visa', fn: () => showReport(report) } });
    }
  } catch (e) {
    toast(`Kunde inte hämta uppdateringar: ${e.message}`, { tone: 'bad' });
  } finally {
    sync.running = false; emit('sync', sync);
  }
}

/** Tolka serverns resultat och lägg in ändringarna i databasen (en ångra-bar ändring). */
function apply(res) {
  const st = state();
  const changes = [];
  const add = (kind, text, ref, src) => changes.push({ kind, text, ref, src });
  const ops = [];

  for (const r of res.results) {
    const src = sync.sources.find((s) => s.id === r.id);
    if (!src) continue;
    const ss = st.state[src.id] || (st.state[src.id] = { seen: {} });
    ss.lastSync = res.ts; ss.ok = r.ok; ss.error = r.error || null; ss.log = r.log || null;
    if (!r.ok) { add('error', `${src.name}: ${r.error}`, null, src); continue; }
    if (src.type === 'script') { add('info', `${src.name}: kördes klart på ${Math.round((r.ms || 0) / 1000)} s`, null, src); continue; }
    if (src.type === 'schedule') { ops.push(() => applySchedule(src, r, ss, add)); continue; }
    if (src.type === 'folder') ops.push(() => applyFolder(src, r, ss, add));
  }
  const n = () => changes.filter((c) => !['info', 'error'].includes(c.kind)).length;
  mutate('Hämtade uppdateringar', () => { ops.forEach((f) => f()); st.lastSync = res.ts; }, { kind: 'sync', silent: true });
  if (n()) store.db.history.unshift({ id: uid('h'), ts: new Date().toISOString(), text: `Hämtade uppdateringar: ${summary(changes)}`, ref: null, kind: 'sync' });
  persist();
  return { ts: res.ts, changes, results: res.results };
}

function summary(changes) {
  const c = (k) => changes.filter((x) => x.kind === k).length;
  return [[c('new-drawing'), 'ny ritning', 'nya ritningar'], [c('rev'), 'ny revision', 'nya revisioner'], [c('model'), 'ny modellversion', 'nya modellversioner'], [c('doc'), 'nytt dokument', 'nya dokument'], [c('update'), 'uppdaterad fil', 'uppdaterade filer'], [c('activity'), 'aktivitet ändrad', 'aktiviteter ändrade'], [c('new-activity'), 'ny aktivitet', 'nya aktiviteter']]
    .filter(([n]) => n).map(([n, one, many]) => `${n} ${n === 1 ? one : many}`).join(', ') || 'inga ändringar';
}

// ------------------------------------------------------------------ mappar
function parseDrawing(name, pattern) {
  const base = name.replace(/\.[^.]+$/, '');
  let re;
  try { re = new RegExp(pattern || DEFAULT_PATTERN, 'i'); } catch { re = new RegExp(DEFAULT_PATTERN, 'i'); }
  const m = base.match(re);
  if (!m?.groups?.number) return null;
  return { number: m.groups.number.toUpperCase(), rev: (m.groups.rev || '').toUpperCase(), title: (m.groups.title || '').replace(/[_]+/g, ' ').trim() };
}
const kindOfExt = (ext) => ({ '.pdf': 'pdf', '.dwg': 'cad', '.dxf': 'cad', '.ifc': 'ifc', '.ifczip': 'ifc', '.eml': 'email', '.msg': 'email', '.png': 'photo', '.jpg': 'photo', '.jpeg': 'photo', '.gif': 'photo', '.webp': 'photo', '.heic': 'photo' }[ext] || 'file');

function guessPackage(text) {
  const t = text.toUpperCase();
  return all('package').find((p) => t.startsWith(p.code.toUpperCase() + '-') || t.startsWith(p.code.toUpperCase() + '.') || t.startsWith(p.code.toUpperCase() + '_'));
}

function applyFolder(src, r, ss, add) {
  const db = store.db;
  const seen = ss.seen || (ss.seen = {});
  const now = new Set();
  const fileRef = (f) => ({ store: 'source', sourceId: src.id, path: f.path, name: f.name, size: f.size });
  const link = (a, b) => { if (!db.relations.some((x) => (x.a.id === a.id && x.b.id === b.id) || (x.a.id === b.id && x.b.id === a.id))) db.relations.push({ id: uid('rel'), a, b, ts: new Date().toISOString() }); };

  for (const f of r.files) {
    now.add(f.path);
    const prev = seen[f.path];
    if (prev && prev.mtime === f.mtime && prev.size === f.size) continue;
    seen[f.path] = { mtime: f.mtime, size: f.size };
    const kind = kindOfExt(f.ext);
    const date = f.mtime.slice(0, 10);

    // Ritningar
    if ((kind === 'pdf' || kind === 'cad') && src.target !== 'documents') {
      const d = parseDrawing(f.name, src.pattern);
      if (d) {
        let dr = db.drawings.find((x) => x.number.toUpperCase() === d.number);
        if (dr) {
          const ref = { t: 'drawing', id: dr.id };
          if (d.rev && d.rev !== dr.rev && !(dr.revisions || []).some((x) => x.rev === d.rev)) {
            dr.revisions = [...(dr.revisions || []), { rev: dr.rev, date: dr.date, file: dr.file || null }];
            add('rev', `${dr.number} rev ${dr.rev || '–'} → ${d.rev}`, ref, src);
            Object.assign(dr, { rev: d.rev, date, file: fileRef(f), modified: new Date().toISOString() });
            db.history.unshift({ id: uid('h'), ts: new Date().toISOString(), text: `Ny revision ${dr.number} rev ${d.rev} från ${src.name}`, ref, kind: 'status' });
          } else if (prev || !dr.file) {
            Object.assign(dr, { file: fileRef(f), date });
            if (prev) add('update', `${dr.number}: ny fil (${f.name})`, ref, src);
          }
        } else {
          const pk = (src.packageId && db.packages.find((p) => p.id === src.packageId)) || guessPackage(d.number);
          dr = { id: uid('dr'), number: d.number, name: d.title || d.number, rev: d.rev || '–', discipline: '', areaId: src.areaId || pk?.areaId || null, status: 'prelim', date, source: '', file: fileRef(f), created: new Date().toISOString() };
          db.drawings.unshift(dr);
          if (pk) link({ t: 'drawing', id: dr.id }, { t: 'package', id: pk.id });
          add('new-drawing', `${dr.number} ${dr.name !== dr.number ? dr.name : ''} rev ${dr.rev}`, { t: 'drawing', id: dr.id }, src);
        }
        continue;
      }
    }

    // Modeller
    if (kind === 'ifc') {
      const base = norm(f.name.replace(/\.[^.]+$/, '').replace(/[_-]?v?\d+$/i, ''));
      let m = db.models.find((x) => base.includes(norm(x.name)) || norm(x.name).includes(base));
      if (!m) { m = { id: uid('md'), name: f.name.replace(/\.[^.]+$/, '').replace(/[_-]?v?\d+$/i, ''), discipline: 'Övrigt', areaId: src.areaId || null, versions: [], created: new Date().toISOString() }; db.models.unshift(m); }
      const v = (latestVersion(m)?.v || 0) + 1;
      m.versions.push({ v, date, author: src.name, note: f.name, schema: '', file: fileRef(f), size: f.size });
      add('model', `${m.name} v${v}`, { t: 'model', id: m.id }, src);
      continue;
    }

    // Övriga dokument
    const key = `${src.id}:${f.path}`;
    let doc = db.documents.find((x) => x.sourceKey === key);
    if (doc) { Object.assign(doc, { file: fileRef(f), size: f.size, date }); add('update', `${f.name} uppdaterad`, { t: 'document', id: doc.id }, src); }
    else {
      const pk = (src.packageId && db.packages.find((p) => p.id === src.packageId)) || guessPackage(f.name);
      doc = { id: uid('do'), kind, name: f.name, subject: f.name.replace(/\.[^.]+$/, ''), date, size: f.size, file: fileRef(f), sourceKey: key, packageId: pk?.id || null, created: new Date().toISOString() };
      db.documents.unshift(doc);
      add('doc', `${f.name}${pk ? ` → ${pk.code}` : ''}`, { t: 'document', id: doc.id }, src);
    }
  }
  const removed = Object.keys(seen).filter((p) => !now.has(p));
  removed.forEach((p) => delete seen[p]);
  if (removed.length && !r.truncated) add('info', `${src.name}: ${removed.length} filer finns inte längre i mappen (inget togs bort i appen)`, null, src);
  if (r.truncated) add('info', `${src.name}: mappen har fler än ${r.files.length} filer – resten lästes inte`, null, src);
}

// ------------------------------------------------------------------ tidplan
function parseScheduleText(text, ext) {
  if (ext === '.xml' || /^\s*<\?xml|<Project/i.test(text.slice(0, 500))) {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('XML-filen kunde inte tolkas');
    const val = (t, tag) => t.getElementsByTagName(tag)[0]?.textContent?.trim() || '';
    return [...doc.getElementsByTagName('Task')].map((t) => ({
      wbs: val(t, 'WBS') || val(t, 'OutlineNumber'), name: val(t, 'Name'),
      start: val(t, 'Start').slice(0, 10), end: val(t, 'Finish').slice(0, 10),
      progress: Math.round(+val(t, 'PercentComplete') || 0),
      summary: val(t, 'Summary') === '1', milestone: val(t, 'Milestone') === '1'
    })).filter((t) => t.name && t.start);
  }
  // CSV (; , eller tab)
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const delim = [';', '\t', ','].sort((a, b) => lines[0].split(b).length - lines[0].split(a).length)[0];
  const split = (l) => { const out = []; let cur = '', q = false; for (const c of l) { if (c === '"') q = !q; else if (c === delim && !q) { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out.map((x) => x.trim()); };
  const head = split(lines[0]).map((x) => norm(x));
  const col = (...names) => head.findIndex((x) => names.some((n) => x === n || x.includes(n)));
  const ci = { code: col('kod', 'code', 'wbs', 'id'), name: col('namn', 'name', 'aktivitet', 'activity', 'beskrivning', 'task'), start: col('start'), end: col('slut', 'finish', 'end'), pr: col('framdrift', 'progress', '%', 'complete', 'klart') };
  const date = (s) => {
    if (!s) return '';
    let m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/); if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
    m = s.match(/(\d{1,2})[./](\d{1,2})[./](\d{2,4})/); if (m) return `${m[3].length === 2 ? '20' + m[3] : m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    return '';
  };
  return lines.slice(1).map(split).map((c) => {
    const raw = ci.pr >= 0 ? c[ci.pr] : '';
    let p = parseFloat(String(raw).replace(',', '.').replace('%', '')) || 0;
    if (!raw.includes('%') && p > 0 && p <= 1 && /[.,]/.test(raw)) p *= 100;
    return { wbs: ci.code >= 0 ? c[ci.code] : '', name: ci.name >= 0 ? c[ci.name] : '', start: date(c[ci.start]), end: date(c[ci.end]), progress: Math.round(p), summary: false, milestone: false };
  }).filter((t) => t.name && t.start);
}

function applySchedule(src, r, ss, add) {
  if (ss.mtime === r.mtime && ss.size === r.size) { add('info', `${src.name}: tidplanen är oförändrad`, null, src); return; }
  ss.mtime = r.mtime; ss.size = r.size;
  let tasks;
  try { tasks = parseScheduleText(r.text, r.ext); } catch (e) { add('error', `${src.name}: ${e.message}`, null, src); return; }
  const db = store.db;
  let matched = 0, unmatched = 0;
  for (const t of tasks.filter((x) => !x.summary)) {
    const tok = (t.name.match(/^([A-Z0-9]+(?:\.[A-Z0-9]+)+)\s+/i) || [])[1];
    const codes = [t.wbs, tok].filter(Boolean).map((x) => x.toUpperCase());
    let a = db.activities.find((x) => codes.includes(String(x.code).toUpperCase())) || db.activities.find((x) => norm(x.name) === norm(tok ? t.name.slice(tok.length).trim() : t.name));
    const end = t.end || t.start;
    if (a) {
      matched++;
      const diff = [];
      if (t.start !== a.start) diff.push(`start ${fmtDate(a.start)}→${fmtDate(t.start)}`);
      if (end !== a.end) diff.push(`slut ${fmtDate(a.end)}→${fmtDate(end)}`);
      if (t.progress !== a.progress) diff.push(`${a.progress}%→${t.progress}%`);
      if (diff.length) {
        Object.assign(a, { start: t.start, end, progress: Math.max(0, Math.min(100, t.progress)), milestone: t.milestone || a.milestone, modified: new Date().toISOString() });
        add('activity', `${a.code} ${a.name}: ${diff.join(', ')}`, { t: 'activity', id: a.id }, src);
      }
    } else if (src.createNew) {
      // Koden i namnet (t.ex. "F12.06 Återfyllning") väger tyngst; WBS-siffror som "1.6" säger inget om paketet.
      const code = (tok || t.wbs || '').toUpperCase();
      const pk = guessPackage(code) || codes.map(guessPackage).find(Boolean);
      if (!pk) { unmatched++; continue; }
      a = { id: uid('ac'), code: code || `${pk.code}.${String(db.activities.filter((x) => x.packageId === pk.id).length + 1).padStart(2, '0')}`, name: tok ? t.name.slice(tok.length).trim() : t.name, packageId: pk.id, areaId: pk.areaId, discipline: pk.discipline, contractor: pk.contractor, responsible: pk.responsible, start: t.start, end, progress: t.progress, milestone: t.milestone, created: new Date().toISOString() };
      db.activities.push(a);
      add('new-activity', `${a.code} ${a.name}`, { t: 'activity', id: a.id }, src);
    } else unmatched++;
  }
  add('info', `${src.name}: ${tasks.length} aktiviteter lästa, ${matched} matchade${unmatched ? `, ${unmatched} utan motsvarighet` : ''}`, null, src);
}

// ------------------------------------------------------------------ rapport
function showReport(report = sync.last) {
  if (!report) { toast('Ingen hämtning har gjorts ännu'); return; }
  const groups = new Map();
  for (const c of report.changes) { const k = c.src?.id || '-'; if (!groups.has(k)) groups.set(k, { src: c.src, list: [] }); groups.get(k).list.push(c); }
  const ICON = { 'new-drawing': 'drawing', rev: 'drawing', model: 'cube', doc: 'paperclip', update: 'refresh', activity: 'gantt', 'new-activity': 'gantt', error: 'alert', info: 'info' };
  const m = modal({
    title: 'Uppdateringar', subtitle: `${fmtDate(report.ts.slice(0, 10))} ${report.ts.slice(11, 16)} · ${summary(report.changes)}`, width: 640,
    body: h('div', { class: 'sync-report' }, [...groups.values()].map(({ src, list }) => h('section', { class: 'sr-sec' },
      h('div', { class: 'sr-head' }, icon(KINDS[src?.kind]?.icon || 'folder', 15), h('b', src?.name || 'Källa'), h('em', list.filter((c) => !['info'].includes(c.kind)).length)),
      list.slice(0, 200).map((c) => h('div', { class: `sr-row k-${c.kind} ${c.ref ? 'clickable' : ''}`, onclick: () => { if (c.ref && get(c.ref)) { m.close(); app.select(c.ref, { reveal: true }); } } },
        icon(ICON[c.kind] || 'dots', 14), h('span', c.text), c.kind === 'new-drawing' || c.kind === 'doc' || c.kind === 'new-activity' ? h('span', { class: 'badge tone-ok' }, 'Ny') : c.kind === 'rev' ? h('span', { class: 'badge tone-accent' }, 'Revision') : null)),
      list.length > 200 && h('p', { class: 'muted small' }, `+ ${list.length - 200} till`),
      (() => { const r = report.results.find((x) => x.id === src?.id); return r?.log ? h('details', { class: 'file-list' }, h('summary', 'Skriptets utskrift'), h('pre', { class: 'sr-log' }, r.log)) : null; })()))),
    actions: [{ label: 'Hantera källor', ghost: true, icon: 'server', onClick: () => { setTimeout(manageSources, 50); } }, { spacer: true }, { label: 'Stäng', primary: true }]
  });
}

// ------------------------------------------------------------------ källhantering
async function manageSources() {
  if (store.mode !== 'server') {
    modal({ title: 'Datakällor', width: 520, body: h('div', { class: 'banner' }, icon('info', 16), h('div', h('b', 'Kräver den lokala servern. '), 'Starta appen med start.bat för att koppla mappar, SharePoint, Powerproject och skript.')), actions: [{ spacer: true }, { label: 'OK', primary: true }] });
    return;
  }
  await loadSources();
  const st = state();
  const body = h('div', { class: 'sources' });
  const render = () => {
    body.replaceChildren(
      sync.sources.length ? h('div', { class: 'src-list' }, sync.sources.map((s) => {
        const ss = st.state[s.id] || {};
        const k = KINDS[s.kind] || KINDS[s.type === 'schedule' ? 'powerproject' : s.type === 'script' ? 'script' : 'folder'];
        return h('div', { class: `src-row ${s.enabled ? '' : 'off'}` },
          h('span', { class: 'src-ic' }, icon(k.icon, 16)),
          h('div', { class: 'grow' },
            h('b', s.name),
            h('small', s.type === 'script' ? `Skript: ${sync.scripts.find((x) => x.id === s.script)?.label || s.script}` : s.path),
            h('small', { class: ss.error ? 'tone-text-bad' : 'muted' }, ss.error ? `Fel: ${ss.error}` : ss.lastSync ? `Senast hämtad ${ago(ss.lastSync)}` : 'Inte hämtad än')),
          h('label', { class: 'switch', title: 'Hämta automatiskt' }, h('input', { type: 'checkbox', checked: s.auto, onchange: async (e) => { s.auto = e.target.checked; await saveSources(); } }), h('i'), h('span', 'Auto')),
          h('button', { class: 'btn sm ghost', title: 'Hämta från den här källan nu', onclick: () => runSync({ ids: [s.id] }) }, icon('refresh', 13)),
          h('button', { class: 'iconbtn sm', title: 'Fler val', onclick: (e) => { const r = e.currentTarget.getBoundingClientRect(); contextMenu(r.left - 180, r.bottom + 4, [
            { label: 'Redigera…', icon: 'note', action: () => editSource(s, render) },
            { label: s.enabled ? 'Pausa källan' : 'Aktivera källan', icon: s.enabled ? 'minus' : 'check', action: async () => { s.enabled = !s.enabled; await saveSources(); render(); } },
            { label: 'Glöm vad som lästs (läs om allt)', icon: 'history', action: () => { delete st.state[s.id]; persist(); render(); toast('Nästa hämtning läser in hela källan igen'); } },
            { divider: true },
            { label: 'Ta bort källa…', icon: 'trash', danger: true, action: async () => { if (await confirmDialog({ title: `Ta bort ${s.name}?`, text: 'Källan kopplas bort. Information som redan lästs in ligger kvar, och inga filer på datorn påverkas.', okLabel: 'Ta bort', danger: true })) { sync.sources = sync.sources.filter((x) => x !== s); await saveSources(); render(); } } }
          ]); } }, icon('dots', 15)));
      })) : h('div', { class: 'empty' }, h('b', 'Inga källor kopplade än'), h('p', 'Lägg till SharePoint, en mapp, en Powerproject-tidplan eller ett skript nedan.')),
      h('div', { class: 'src-add' }, h('div', { class: 'fm-head' }, 'Lägg till källa'),
        h('div', { class: 'add-options four' }, Object.entries(KINDS).map(([k, v]) => h('button', { class: 'add-opt', onclick: () => editSource({ kind: k, type: v.type, name: v.label, enabled: true, auto: true, recursive: true, target: 'auto' }, render, true) }, icon(v.icon, 20), h('b', v.label), h('small', v.hint))))),
      h('div', { class: 'set-row' }, h('div', h('b', 'Automatisk hämtning'), h('small', 'Källor markerade med Auto hämtas när appen startar, när datorn får uppkoppling igen och med jämna mellanrum. Skript körs bara när datorn är uppkopplad.')),
        h('select', { class: 'input', style: { width: '160px' }, onchange: (e) => { st.interval = +e.target.value; persist(); scheduleAuto(); } },
          [[0, 'Bara vid start'], [5, 'Var 5:e minut'], [15, 'Var 15:e minut'], [30, 'Var 30:e minut'], [60, 'Varje timme']].map(([v, l]) => h('option', { value: v, selected: (st.interval ?? 15) === v }, l)))));
  };
  render();
  const unsub = on('sync', () => { if (body.isConnected) render(); });
  modal({ title: 'Datakällor', subtitle: 'Varifrån "Hämta uppdateringar" läser in nytt', width: 720, body, onClose: unsub,
    actions: [{ spacer: true }, { label: 'Stäng', ghost: true }, { label: 'Hämta nu', primary: true, icon: 'refresh', onClick: () => { runSync(); } }] });
}

function editSource(s, done, isNew = false) {
  const kind = KINDS[s.kind] || KINDS.folder;
  const f = {};
  const field = (key, label, el, full, help) => { f[key] = el; return h('label', { class: `field ${full ? 'full' : ''}` }, h('span', label), el, help && h('small', { class: 'muted' }, help)); };
  const preview = h('div', { class: 'src-preview' });
  const pk = all('package');
  const fields = [field('name', 'Namn', h('input', { class: 'input', value: s.name || '' }), true)];
  if (s.type === 'folder' || s.type === 'schedule') {
    fields.push(field('path', s.type === 'schedule' ? 'Sökväg till tidplansfilen' : 'Sökväg till mappen', h('input', { class: 'input mono', value: s.path || '', placeholder: s.type === 'schedule' ? 'C:\\NSV\\Tidplan\\NSV-tidplan.xml' : s.kind === 'sharepoint' ? 'C:\\Users\\namn\\NCC\\NSV - Dokument\\Ritningar' : 'C:\\NSV\\Binder\\PDF' }), true,
      'Tips: håll Shift och högerklicka på mappen/filen i Utforskaren → "Kopiera som sökväg", och klistra in här.'));
  }
  if (s.type === 'folder') {
    fields.push(
      field('target', 'Läs in som', h('select', { class: 'input' }, [['auto', 'Automatiskt (ritningar, modeller, dokument)'], ['drawings', 'Ritningar'], ['documents', 'Endast dokument']].map(([v, l]) => h('option', { value: v, selected: s.target === v }, l)))),
      field('packageId', 'Koppla till arbetspaket', h('select', { class: 'input' }, h('option', { value: '' }, 'Gissa från filnamn'), pk.map((p) => h('option', { value: p.id, selected: s.packageId === p.id }, `${p.code} ${p.name}`)))),
      field('recursive', 'Undermappar', h('select', { class: 'input' }, h('option', { value: '1' }, 'Ta med undermappar'), h('option', { value: '0', selected: s.recursive === false }, 'Bara översta mappen'))),
      field('auto', 'Automatisk hämtning', h('select', { class: 'input' }, h('option', { value: '1' }, 'Ja'), h('option', { value: '0', selected: !s.auto }, 'Nej, bara manuellt'))),
      field('pattern', 'Mönster för ritningsnummer (avancerat)', h('input', { class: 'input mono', value: s.pattern || '', placeholder: 'Standard: NUMMER_REV_Titel, t.ex. F12-123_C_Grundplatta.pdf' }), true,
        'Lämna tomt för standard. Reguljärt uttryck med grupperna number, rev och title.'));
  }
  if (s.type === 'schedule') {
    fields.push(
      field('createNew', 'Aktiviteter som saknas', h('select', { class: 'input' }, h('option', { value: '0' }, 'Uppdatera bara befintliga'), h('option', { value: '1', selected: s.createNew }, 'Skapa nya (kod börjar med paketkod, t.ex. F12.06)'))),
      field('auto', 'Automatisk hämtning', h('select', { class: 'input' }, h('option', { value: '1' }, 'Ja, när filen ändras'), h('option', { value: '0', selected: !s.auto }, 'Nej, bara manuellt'))));
    fields.push(h('p', { class: 'muted small full' }, 'Aktiviteter matchas på kod (WBS eller kod först i namnet, t.ex. "F12.03 Gjutning") och annars på namn. Start, slut och framdrift uppdateras.'));
  }
  if (s.type === 'script') {
    if (!sync.scripts.length) fields.push(h('div', { class: 'banner full' }, icon('info', 16), h('div', h('b', 'Inga skript är definierade. '), 'Av säkerhetsskäl kan skript bara läggas till i filen ', h('code', 'config.json'), ' bredvid start.bat. Kopiera ', h('code', 'config.example.json'), ' till config.json, ändra sökvägen till ditt skript och starta om appen.')));
    else fields.push(field('script', 'Skript', h('select', { class: 'input' }, sync.scripts.map((x) => h('option', { value: x.id, selected: s.script === x.id }, x.label)))),
      field('auto', 'Automatisk körning', h('select', { class: 'input' }, h('option', { value: '1' }, 'Ja, när datorn är uppkopplad'), h('option', { value: '0', selected: !s.auto }, 'Nej, bara manuellt'))),
      h('p', { class: 'muted small full' }, 'Skript körs före mapparna. Lägg till mappen som skriptet sparar i som en egen källa, så läses resultatet in direkt efteråt.'));
  }
  const collect = () => {
    const o = { ...s, name: f.name.value.trim() || kind.label };
    if (f.path) o.path = f.path.value.trim().replace(/^"(.*)"$/, '$1');
    if (f.target) o.target = f.target.value;
    if (f.packageId) o.packageId = f.packageId.value || null;
    if (f.recursive) o.recursive = f.recursive.value === '1';
    if (f.auto) o.auto = f.auto.value === '1';
    if (f.pattern) o.pattern = f.pattern.value.trim();
    if (f.createNew) o.createNew = f.createNew.value === '1';
    if (f.script) o.script = f.script.value;
    return o;
  };
  const test = async () => {
    preview.replaceChildren(h('div', { class: 'skeleton' }, h('i'), h('i')));
    try {
      const o = collect();
      const r = await api('api/sources/test', { method: 'POST', body: JSON.stringify({ source: o }) });
      if (!r.ok) { preview.replaceChildren(h('div', { class: 'val-row err' }, icon('alert', 15), r.error)); return; }
      if (o.type === 'folder') {
        const sample = r.files.slice(0, 12).map((x) => {
          const d = (kindOfExt(x.ext) === 'pdf' || kindOfExt(x.ext) === 'cad') && o.target !== 'documents' ? parseDrawing(x.name, o.pattern) : null;
          return h('li', h('code', x.path), h('small', d ? `ritning ${d.number}${d.rev ? ' rev ' + d.rev : ''}` : kindOfExt(x.ext) === 'ifc' ? 'modellversion' : 'dokument'));
        });
        preview.replaceChildren(h('div', { class: 'val-row' }, icon('checkCircle', 15), `${r.count}${r.truncated ? '+' : ''} filer hittades i ${r.root}`), h('ul', { class: 'src-sample' }, sample));
      } else if (o.type === 'schedule') {
        const tasks = parseScheduleText(r.text, r.ext);
        preview.replaceChildren(h('div', { class: 'val-row' }, icon('checkCircle', 15), `${tasks.length} aktiviteter i ${r.file} (ändrad ${ago(r.mtime)})`), h('ul', { class: 'src-sample' }, tasks.slice(0, 8).map((t) => h('li', h('code', t.wbs || '–'), h('span', t.name), h('small', `${t.start} → ${t.end} · ${t.progress}%`)))));
      } else preview.replaceChildren(h('div', { class: 'val-row' }, icon('checkCircle', 15), 'Skriptet finns: ', h('code', r.command)));
    } catch (e) { preview.replaceChildren(h('div', { class: 'val-row err' }, icon('alert', 15), e.message)); }
  };
  modal({
    title: isNew ? `Lägg till: ${kind.label}` : `Redigera ${s.name}`, subtitle: kind.hint, width: 640,
    body: h('div', h('div', { class: 'form-grid' }, fields), preview),
    actions: [{ label: 'Testa', icon: 'eye', onClick: () => { test(); return false; } }, { spacer: true }, { label: 'Avbryt', ghost: true }, { label: isNew ? 'Lägg till' : 'Spara', primary: true, onClick: async () => {
      const o = collect();
      if ((o.type === 'folder' || o.type === 'schedule') && !o.path) { f.path.classList.add('invalid'); f.path.focus(); return false; }
      if (o.type === 'script' && !o.script) return false;
      if (isNew) { o.id = `src-${Date.now().toString(36)}`; sync.sources.push(o); } else Object.assign(s, o);
      try { await saveSources(); } catch (e) { toast(e.message, { tone: 'bad' }); return false; }
      toast(`${o.name} ${isNew ? 'tillagd' : 'sparad'}`, { tone: 'ok', action: { label: 'Hämta nu', fn: () => runSync({ ids: [o.id] }) } });
      done?.();
    } }]
  });
}

// ------------------------------------------------------------------ automatik
let timer = null;
function scheduleAuto() {
  clearInterval(timer);
  if (store.mode !== 'server') return;
  const min = state().interval ?? 15;
  if (min > 0) timer = setInterval(() => runSync({ auto: true }), min * 60 * 1000);
}
async function initSync() {
  if (store.mode !== 'server') return;
  await loadSources();
  scheduleAuto();
  addEventListener('online', () => { toast('Uppkopplad igen – hämtar uppdateringar', { iconName: 'refresh' }); runSync({ auto: true }); });
  if (sync.sources.some((s) => s.enabled && s.auto)) setTimeout(() => runSync({ auto: true }), 2500);
}

/** Knappen i toppraden. */
function syncButton() {
  const btn = h('button', { class: 'syncbtn', title: 'Hämta uppdateringar från SharePoint, mappar, Powerproject och skript' });
  const caret = h('button', { class: 'syncbtn-caret', title: 'Datakällor och senaste hämtning' }, icon('chevD', 13));
  const paint = () => {
    const st = store.db?.sync;
    const n = sync.sources.filter((s) => s.enabled).length;
    btn.classList.toggle('running', sync.running);
    btn.replaceChildren(icon('refresh', 15, 'sync-ic'), h('span', { class: 'sync-label' }, sync.running ? 'Hämtar…' : 'Hämta uppdateringar'),
      h('i', { class: `sync-dot ${!navigator.onLine ? 'offline' : Object.values(st?.state || {}).some((x) => x.error) ? 'err' : n ? 'ok' : ''}` }));
    btn.title = `Hämta uppdateringar (U)\n${n ? `${n} källor` : 'Inga källor kopplade än'}${st?.lastSync ? ` · senast ${ago(st.lastSync)}` : ''}${navigator.onLine ? '' : '\nIngen uppkoppling – skript hoppas över'}`;
  };
  btn.onclick = () => runSync();
  caret.onclick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    contextMenu(r.right - 240, r.bottom + 6, [
      { header: store.db?.sync?.lastSync ? `Senast hämtad ${ago(store.db.sync.lastSync)}` : 'Ingen hämtning än' },
      { label: 'Hämta uppdateringar', icon: 'refresh', kbd: 'U', action: () => runSync() },
      { label: 'Visa senaste resultat', icon: 'eye', disabled: !sync.last, action: () => showReport() },
      { label: 'Datakällor…', icon: 'server', action: () => manageSources() }
    ]);
  };
  on('sync', paint); on('change', paint);
  addEventListener('online', paint); addEventListener('offline', paint);
  paint();
  return h('div', { class: 'syncgroup' }, btn, caret);
}

};

__defs["js/palette.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "pushRecent": { get: () => pushRecent, enumerable: true },
  "openPalette": { get: () => openPalette, enumerable: true }
});
// Kommandopalett (Ctrl+K): sök i all information och kör kommandon.
const { store, TYPES, all, get, codeOf, titleOf, statusOf, STATUS, latestVersion, refKey, areaOf } = __r("js/store.js");
const { h, icon, typeIcon, norm, pushOverlay, $, $$, kbd } = __r("js/ui.js");
const { app, layout } = __r("js/app.js");
const { createIssue, createAction, createDecision, createMeeting, addToWhiteboard, linkPicker, toggleFav } = __r("js/actions.js");
const { setFilter, clearFilters, saveCurrent, applyFilter } = __r("js/filters.js");

const RECENT_KEY = 'pch.recentItems';
function pushRecent(ref) {
  try {
    const l = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').filter((k) => k !== refKey(ref));
    l.unshift(refKey(ref));
    localStorage.setItem(RECENT_KEY, JSON.stringify(l.slice(0, 12)));
  } catch {}
}
function recentRefs() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').map((k) => { const i = k.indexOf(':'); return { t: k.slice(0, i), id: k.slice(i + 1) }; }).filter((r) => get(r)); } catch { return []; }
}

function commands() {
  const go = (hash) => () => app.navigate(hash);
  const sel = app.selection;
  const list = [
    { id: 'new-action', label: 'Skapa åtgärd', kw: 'new action ny åtgärd skapa task todo', icon: 'plus', kbd: 'N', run: () => createAction() },
    { id: 'new-issue', label: 'Skapa ärende', kw: 'new issue nytt ärende avvikelse kollision', icon: 'alert', kbd: 'I', run: () => createIssue() },
    { id: 'new-decision', label: 'Skapa beslut', kw: 'new decision nytt beslut', icon: 'gavel', run: () => createDecision() },
    { id: 'new-meeting', label: 'Skapa möte', kw: 'new meeting nytt möte', icon: 'users', run: () => createMeeting() },
    { id: 'add-tool', label: 'Lägg till verktyg i My Tools', kw: 'add tool html app verktyg importera', icon: 'tool', run: () => Promise.resolve().then(() => __r("js/views/tools.js")).then((m) => { app.navigate('#/tools'); m.addToolDialog(); }) },
    { id: 'go-overview', label: 'Gå till Översikt', kw: 'go overview dashboard översikt hem', icon: 'home', kbd: 'G O', run: go('#/overview') },
    { id: 'go-schedule', label: 'Gå till Tidplan', kw: 'go schedule gantt tidplan', icon: 'gantt', kbd: 'G S', run: go('#/schedule') },
    { id: 'go-packages', label: 'Gå till Arbetspaket', kw: 'go packages work arbetspaket objekt', icon: 'box', kbd: 'G P', run: go('#/packages') },
    { id: 'go-issues', label: 'Gå till Ärenden', kw: 'go issues ärenden', icon: 'alert', kbd: 'G I', run: go('#/issues') },
    { id: 'go-actions', label: 'Gå till Åtgärder', kw: 'go actions kanban åtgärder', icon: 'kanban', kbd: 'G A', run: go('#/actions') },
    { id: 'go-library', label: 'Gå till Ritningar & modeller', kw: 'go drawings models ritningar modeller bibliotek', icon: 'layers', kbd: 'G R', run: go('#/library') },
    { id: 'go-models', label: 'Gå till Modellkontroll', kw: 'model control ifc import modellkontroll', icon: 'cube', run: go('#/library/models') },
    { id: 'go-whiteboard', label: 'Gå till Whiteboard', kw: 'go whiteboard tavla', icon: 'board', kbd: 'G W', run: go('#/whiteboard') },
    { id: 'go-tools', label: 'Gå till My Tools', kw: 'go tools my tools verktyg launcher', icon: 'tool', kbd: 'G T', run: go('#/tools') },
    { id: 'theme', label: layout.theme === 'dark' ? 'Byt till ljust tema' : 'Byt till mörkt tema', kw: 'theme dark light tema mörkt ljust', icon: layout.theme === 'dark' ? 'sun' : 'moon', run: () => app.toggleTheme() },
    { id: 'nav', label: 'Visa/dölj navigering', kw: 'toggle sidebar navigation meny', icon: 'sidebar', kbd: '[', run: () => app.toggleNav() },
    { id: 'ctx', label: 'Visa/dölj kontextpanel', kw: 'toggle context panel högerpanel', icon: 'panelR', kbd: ']', run: () => app.toggleCtx() },
    { id: 'clear-filters', label: 'Rensa alla filter', kw: 'clear filters rensa filter', icon: 'x', run: () => clearFilters() },
    { id: 'save-filter', label: 'Spara aktuellt filter…', kw: 'save filter spara', icon: 'save', run: () => saveCurrent() },
    { id: 'p-2w', label: 'Period: nästa 2 veckor', kw: 'period next 2 weeks två veckor', icon: 'calendar', run: () => setFilter({ period: '2w' }) },
    { id: 'p-4w', label: 'Period: nästa 4 veckor', kw: 'period next 4 weeks fyra veckor', icon: 'calendar', run: () => setFilter({ period: '4w' }) },
    { id: 'p-overdue', label: 'Visa försenat och förfallet', kw: 'late overdue försenat förfallet', icon: 'clock', run: () => setFilter({ period: 'overdue' }) },
    { id: 'sync', label: 'Hämta uppdateringar', kw: 'sync update hämta uppdateringar sharepoint binder powerproject refresh', icon: 'refresh', kbd: 'U', run: () => Promise.resolve().then(() => __r("js/sync.js")).then((m) => m.runSync()) },
    { id: 'sources', label: 'Datakällor (SharePoint, mappar, Powerproject, skript)…', kw: 'sources datakällor sharepoint powerproject binder skript mapp', icon: 'server', run: () => Promise.resolve().then(() => __r("js/sync.js")).then((m) => m.manageSources()) },
    { id: 'shortcuts', label: 'Visa kortkommandon', kw: 'help shortcuts keyboard kortkommandon hjälp', icon: 'keyboard', kbd: '?', run: () => app.shortcuts() },
    { id: 'settings', label: 'Inställningar och data', kw: 'settings data export import backup inställningar', icon: 'server', run: () => app.settings() }
  ];
  // "open latest structural model" m.fl.
  for (const m of all('model')) {
    const v = latestVersion(m);
    list.push({ id: `latest-${m.id}`, label: `Öppna senaste ${m.name}`, sub: `${m.discipline} · v${v?.v ?? '–'}`, kw: `open latest model senaste modell ${m.discipline} ${m.discipline === 'Konstruktion' ? 'structural k' : ''} ${m.discipline === 'Arkitekt' ? 'architectural a' : ''} ${m.discipline === 'El' ? 'electrical e' : ''} ifc`, icon: 'cube', run: () => app.select({ t: 'model', id: m.id }) });
  }
  for (const s of store.db.savedFilters) list.push({ id: `sf-${s.id}`, label: `Filter: ${s.name}`, kw: `filter sparat ${s.name}`, icon: 'star', run: () => applyFilter(s.filter) });
  for (const t of store.db.tools) list.push({ id: `tool-${t.id}`, label: `Öppna verktyg: ${t.name}`, sub: t.category, kw: `tool verktyg open ${t.name} ${(t.tags || []).join(' ')}`, icon: 'tool', run: () => app.navigate(`#/tool/${encodeURIComponent(t.id)}`) });
  if (sel && get(sel)) {
    list.unshift(
      { id: 'sel-wb', label: `Lägg ${codeOf(sel) || titleOf(sel)} på whiteboard`, kw: 'whiteboard add selection markerad', icon: 'board', run: () => addToWhiteboard(sel), ctx: true },
      { id: 'sel-link', label: `Koppla information till ${codeOf(sel) || titleOf(sel)}…`, kw: 'link connect koppla markerad', icon: 'link', run: () => linkPicker(sel, ['drawing', 'model', 'issue', 'action', 'decision', 'document', 'activity', 'package'].filter((x) => x !== sel.t)), ctx: true },
      { id: 'sel-fav', label: `Favoritmarkera ${codeOf(sel) || titleOf(sel)}`, kw: 'favourite favorit star markerad', icon: 'star', run: () => toggleFav(sel), ctx: true }
    );
  }
  return list;
}

function entityItems() {
  const out = [];
  for (const t of ['area', 'package', 'activity', 'drawing', 'model', 'issue', 'action', 'decision', 'meeting', 'document']) {
    for (const e of all(t)) {
      const ref = { t, id: e.id };
      const code = codeOf(ref, e), title = titleOf(ref, e);
      const area = areaOf(ref, e);
      out.push({ ref, code, title, hay: norm(`${code} ${title} ${e.number || ''} ${e.discipline || ''} ${e.responsible || ''} ${area ? 'område ' + area.code : ''} ${TYPES[t].label}`), e });
    }
  }
  return out;
}

function score(hay, code, words) {
  let s = 0;
  for (const w of words) {
    const i = hay.indexOf(w);
    if (i < 0) return -1;
    s += i === 0 ? 30 : hay[i - 1] === ' ' || hay[i - 1] === '-' ? 18 : 6;
    if (norm(code) === w) s += 50; else if (norm(code).startsWith(w)) s += 25;
  }
  return s;
}

function openPalette(initial = '') {
  if ($('.palette-wrap')) return;
  const items = entityItems();
  const cmds = commands();
  let results = [], act = 0;

  const input = h('input', { class: 'palette-input', placeholder: 'Sök objekt, ritningar, ärenden – eller skriv ett kommando…', spellcheck: 'false', value: initial });
  const list = h('div', { class: 'palette-list', role: 'listbox' });
  const foot = h('div', { class: 'palette-foot' }, h('span', kbd('↑', '↓'), ' navigera'), h('span', kbd('↵'), ' öppna'), h('span', kbd('⇧', '↵'), ' flytande fönster'), h('span', kbd('Esc'), ' stäng'), h('span', { class: 'grow' }), h('span', { class: 'muted' }, '> endast kommandon'));

  const compute = () => {
    const raw = input.value.trim();
    const cmdOnly = raw.startsWith('>');
    const q = norm(cmdOnly ? raw.slice(1).trim() : raw);
    const words = q.split(/\s+/).filter(Boolean);
    const groups = [];
    if (!words.length && !cmdOnly) {
      const rec = recentRefs().slice(0, 6).map((ref) => ({ kind: 'ent', ref, code: codeOf(ref), title: titleOf(ref) }));
      if (rec.length) groups.push(['Senast öppnade', rec]);
      groups.push(['Kommandon', cmds.filter((c) => c.ctx || ['new-action', 'new-issue', 'go-schedule', 'go-tools', 'add-tool'].includes(c.id)).map((c) => ({ kind: 'cmd', ...c }))]);
    } else {
      const cr = cmds.map((c) => ({ c, s: score(norm(`${c.label} ${c.kw} ${c.sub || ''}`), '', words) })).filter((x) => x.s >= 0).sort((a, b) => b.s - a.s).slice(0, cmdOnly ? 20 : 6).map((x) => ({ kind: 'cmd', ...x.c }));
      if (!cmdOnly) {
        const er = items.map((x) => ({ x, s: score(x.hay, x.code, words) })).filter((x) => x.s >= 0).sort((a, b) => b.s - a.s);
        // Om frågan är en områdeskod: visa genvägar till områdets information
        const area = all('area').find((a) => words.length === 1 && a.code === words[0]);
        if (area) {
          const aRef = { t: 'area', id: area.id };
          groups.push([`Område ${area.code}`, [
            { kind: 'ent', ref: aRef, code: area.code, title: `Område ${area.code} · ${area.name}` },
            ...[['schedule', 'Aktiviteter', 'gantt'], ['library', 'Ritningar', 'drawing'], ['library/models', 'Modeller', 'cube'], ['issues', 'Ärenden', 'alert'], ['actions', 'Åtgärder', 'kanban'], ['packages', 'Arbetspaket', 'box']]
              .map(([v, l, ic]) => ({ kind: 'cmd', id: `area-${v}`, label: `${area.code} · ${l}`, icon: ic, sub: 'filtrerat på området', run: () => { applyFilter({ area: [area.id] }); app.navigate(`#/${v}`); } }))
          ]]);
        }
        const byType = new Map();
        for (const r of er.slice(0, 40)) {
          if (area && sameArea(r.x.ref, area)) continue;
          const k = TYPES[r.x.ref.t].plural;
          if (!byType.has(k)) byType.set(k, []);
          if (byType.get(k).length < 6) byType.get(k).push({ kind: 'ent', ref: r.x.ref, code: r.x.code, title: r.x.title });
        }
        // Bästa träff först
        const top = er[0];
        if (top && !area) groups.push(['Bästa träff', [{ kind: 'ent', ref: top.x.ref, code: top.x.code, title: top.x.title, best: true }]]);
        for (const [k, l] of byType) { const f = l.filter((x) => !(top && !area && refKey(x.ref) === refKey(top.x.ref))); if (f.length) groups.push([k, f]); }
      }
      if (cr.length) groups.push(['Kommandon', cr]);
    }
    results = groups.flatMap(([, l]) => l);
    act = Math.min(act, Math.max(0, results.length - 1));
    let i = 0;
    list.replaceChildren(...(results.length ? groups.map(([title, l]) => h('div', { class: 'pg' }, h('div', { class: 'pg-head' }, title), l.map((r) => row(r, i++)))) : [h('div', { class: 'palette-empty' }, icon('search', 18), h('span', `Inga träffar för ”${raw}”`))]));
  };
  const sameArea = (ref, area) => ref.t === 'area' && ref.id === area.id;

  const row = (r, i) => {
    const e = r.kind === 'ent' ? get(r.ref) : null;
    const st = e ? statusOf(r.ref, e) : null;
    const el = h('div', { class: `pr ${i === act ? 'act' : ''} ${r.best ? 'best' : ''}`, role: 'option', dataset: { i },
      onpointermove: () => { if (act !== i) { act = i; mark(); } },
      onclick: (ev) => run(r, ev.shiftKey) },
    r.kind === 'ent' ? h('span', { class: `pr-ic ti-${r.ref.t}` }, typeIcon(r.ref.t, 15)) : h('span', { class: 'pr-ic cmd' }, icon(r.icon || 'bolt', 15)),
    r.kind === 'ent' ? [r.code && h('b', { class: 'mono' }, r.code), h('span', { class: 'pr-title' }, r.title.replace(r.code, '').trim() || r.title)] : h('span', { class: 'pr-title' }, r.label, r.sub && h('small', r.sub)),
    h('span', { class: 'grow' }),
    st && STATUS[st] && h('span', { class: `pr-status tone-${STATUS[st].tone}` }, STATUS[st].label),
    r.kind === 'ent' && h('span', { class: 'pr-type' }, TYPES[r.ref.t].label),
    r.kbd && h('span', { class: 'mi-kbd' }, r.kbd));
    return el;
  };
  const mark = () => { $$('.pr', list).forEach((e) => e.classList.toggle('act', +e.dataset.i === act)); $('.pr.act', list)?.scrollIntoView({ block: 'nearest' }); };

  const run = (r, float) => {
    close();
    if (r.kind === 'cmd') { setTimeout(() => r.run(), 10); return; }
    if (float) app.openFloat(r.ref);
    else if (['package', 'tool'].includes(r.ref.t)) app.open(r.ref);
    else app.select(r.ref, { reveal: true });
  };

  input.addEventListener('input', () => { act = 0; compute(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { act = Math.min(results.length - 1, act + 1); mark(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { act = Math.max(0, act - 1); mark(); e.preventDefault(); }
    else if (e.key === 'Enter') { const r = results[act]; if (r) run(r, e.shiftKey); e.preventDefault(); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  });

  const box = h('div', { class: 'palette', role: 'dialog', 'aria-label': 'Kommandopalett' }, h('div', { class: 'palette-top' }, icon('search', 18), input, kbd('Esc')), list, foot);
  const wrap = h('div', { class: 'palette-wrap', onpointerdown: (e) => { if (e.target === wrap) close(); } }, box);
  $('#layer').append(wrap);
  requestAnimationFrame(() => wrap.classList.add('open'));
  const removeOverlay = pushOverlay(() => close(true));
  function close(fromStack) {
    if (!fromStack) removeOverlay();
    wrap.classList.remove('open'); wrap.classList.add('closing');
    setTimeout(() => wrap.remove(), 140);
  }
  compute();
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

};

__defs["js/views/overview.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "meta": { get: () => meta, enumerable: true },
  "render": { get: () => render, enumerable: true }
});
const { store, all, get, statusOf, packageProgress, areaProgress, parseDate, today, addDays, daysBetween, STATUS, PRIORITY, codeOf, titleOf, refKey } = __r("js/store.js");
const { h, icon, typeIcon, badge, prioBadge, avatar, progressBar, ring, fmtDate, relDays, ago, dueChip, dropTarget } = __r("js/ui.js");
const { filterBar, filtered, matches, filters, setFilter } = __r("js/filters.js");
const { bindEntity, createIssue, createAction, entityDropSpec } = __r("js/actions.js");
const { app } = __r("js/app.js");

const meta = { id: 'overview', title: 'Översikt', icon: 'home' };

function kpi({ label, value, sub, tone = '', iconName, onClick, spark }) {
  return h('button', { class: `kpi ${tone}`, onclick: onClick },
    h('div', { class: 'kpi-top' }, h('span', label), iconName && icon(iconName, 15)),
    h('div', { class: 'kpi-value' }, value),
    h('div', { class: 'kpi-sub' }, sub),
    spark);
}

function bars(values, max) {
  return h('div', { class: 'spark' }, values.map((v) => h('i', { style: { height: `${max ? Math.max(6, (v / max) * 100) : 6}%` } })));
}

function render(root) {
  const t = today();
  const acts = filtered('activity').map((e) => ({ ref: { t: 'activity', id: e.id }, e }));
  const issues = filtered('issue');
  const actions = filtered('action');
  const pkgs = filtered('package');
  const drawings = filtered('drawing');

  const late = acts.filter((x) => statusOf(x.ref, x.e) === 'late');
  const running = acts.filter((x) => statusOf(x.ref, x.e) === 'active');
  const openIssues = issues.filter((i) => !['resolved', 'closed'].includes(i.status));
  const highIssues = openIssues.filter((i) => i.priority === 'high');
  const overdueActions = actions.filter((a) => a.status !== 'done' && parseDate(a.due) < t);
  const openActions = actions.filter((a) => a.status !== 'done');
  const review = drawings.filter((d) => d.status === 'review');
  const totalPct = pkgs.length ? Math.round(pkgs.reduce((s, p) => s + packageProgress(p), 0) / pkgs.length) : 0;

  // Veckobelastning: antal aktiva aktiviteter per vecka, 8 veckor framåt
  const weekly = Array.from({ length: 8 }, (_, w) => {
    const s = addDays(t, w * 7), e = addDays(s, 6);
    return acts.filter((x) => parseDate(x.e.start) <= e && parseDate(x.e.end) >= s).length;
  });

  const attention = [
    ...late.map((x) => ({ ref: x.ref, why: `Försenad ${-daysBetween(t, parseDate(x.e.end))} d`, tone: 'bad', sort: 0 })),
    ...highIssues.map((i) => ({ ref: { t: 'issue', id: i.id }, why: `Hög prioritet · ${relDays(i.due)}`, tone: 'bad', sort: 1 })),
    ...overdueActions.map((a) => ({ ref: { t: 'action', id: a.id }, why: `Förfallen ${relDays(a.due)}`, tone: 'warn', sort: 2 })),
    ...pkgs.filter((p) => p.status === 'risk').map((p) => ({ ref: { t: 'package', id: p.id }, why: 'Markerad som risk', tone: 'warn', sort: 3 })),
    ...review.filter((d) => daysBetween(parseDate(d.date), t) <= 7).map((d) => ({ ref: { t: 'drawing', id: d.id }, why: `Granskning sedan ${fmtDate(d.date)}`, tone: 'info', sort: 4 }))
  ].sort((a, b) => a.sort - b.sort);

  const upcoming = acts.filter((x) => parseDate(x.e.start) >= t && parseDate(x.e.start) <= addDays(t, 28)).sort((a, b) => a.e.start.localeCompare(b.e.start));
  const milestones = acts.filter((x) => x.e.milestone && parseDate(x.e.end) >= t).sort((a, b) => a.e.end.localeCompare(b.e.end));

  const row = (ref, right, sub) => {
    const el = h('div', { class: 'list-row', tabindex: '0', dataset: { nav: '1' } },
      h('span', { class: `relrow-ic ti-${ref.t}` }, typeIcon(ref.t, 13)),
      h('b', { class: 'mono' }, codeOf(ref)),
      h('span', { class: 'lr-title' }, titleOf(ref).replace(codeOf(ref), '').trim(), sub && h('small', sub)),
      right);
    return bindEntity(el, ref);
  };

  const p = store.db.project;
  root.replaceChildren(h('div', { class: 'view view-overview' },
    h('div', { class: 'view-head' },
      h('div', h('h1', p.fullName || p.name), h('p', { class: 'muted' }, `${p.phase || ''} · ${all('area').length} områden · ${all('package').length} arbetspaket · uppdaterad ${ago(p.updated)}`)),
      h('div', { class: 'head-actions' },
        h('button', { class: 'btn', onclick: () => createIssue() }, icon('alert', 14), 'Nytt ärende'),
        h('button', { class: 'btn primary', onclick: () => createAction() }, icon('plus', 14), 'Ny åtgärd'))),
    filterBar({ dims: ['area', 'discipline', 'contractor', 'responsible', 'types'] }),
    h('div', { class: 'kpis' },
      kpi({ label: 'Total framdrift', value: h('span', `${totalPct}`, h('small', '%')), sub: `${pkgs.filter((x) => x.status === 'done').length} av ${pkgs.length} paket klara`, iconName: 'target', spark: progressBar(totalPct, 'lg'), onClick: () => app.navigate('#/packages') }),
      kpi({ label: 'Aktiviteter pågår', value: running.length, sub: late.length ? h('span', { class: 'tone-text-bad' }, `${late.length} försenade`) : 'Inga försenade', tone: late.length ? 'k-bad' : '', iconName: 'gantt', spark: bars(weekly, Math.max(...weekly)), onClick: () => app.navigate('#/schedule') }),
      kpi({ label: 'Öppna ärenden', value: openIssues.length, sub: highIssues.length ? h('span', { class: 'tone-text-bad' }, `${highIssues.length} hög prioritet`) : 'Inga med hög prioritet', tone: highIssues.length ? 'k-warn' : '', iconName: 'alert', onClick: () => app.navigate('#/issues') }),
      kpi({ label: 'Åtgärder', value: openActions.length, sub: overdueActions.length ? h('span', { class: 'tone-text-warn' }, `${overdueActions.length} förfallna`) : 'Alla i tid', tone: overdueActions.length ? 'k-warn' : '', iconName: 'kanban', onClick: () => app.navigate('#/actions') }),
      kpi({ label: 'Ritningar i granskning', value: review.length, sub: `${drawings.filter((d) => d.status === 'construction').length} bygghandlingar`, iconName: 'drawing', onClick: () => app.navigate('#/library') })),
    h('div', { class: 'ov-grid' },
      h('div', { class: 'card span-2' },
        h('div', { class: 'card-head' }, h('h3', icon('flag', 15), 'Kräver uppmärksamhet'), h('em', attention.length)),
        h('div', { class: 'card-body list', dataset: { skey: 'att' } }, attention.length ? attention.slice(0, 12).map((a) => row(a.ref, h('span', { class: `why tone-${a.tone}` }, a.why))) : h('p', { class: 'muted pad' }, 'Inget kritiskt just nu. Snyggt.'))),
      h('div', { class: 'card' },
        h('div', { class: 'card-head' }, h('h3', icon('map', 15), 'Områden')),
        h('div', { class: 'card-body areas' }, all('area').map((a) => {
          const pct = areaProgress(a);
          const on = filters.cur.area.includes(a.id);
          const n = all('issue').filter((i) => i.areaId === a.id && !['resolved', 'closed'].includes(i.status)).length;
          const el = h('div', { class: `area-row ${on ? 'on' : ''}`, title: 'Klicka för att välja · Alt+klick filtrerar' },
            h('i', { class: 'area-sw', style: { background: a.color } }),
            h('div', { class: 'grow' }, h('div', { class: 'row-between' }, h('b', a.code, ' ', h('span', { class: 'muted' }, a.name)), h('span', { class: 'mono small' }, `${pct}%`)), progressBar(pct)),
            n ? h('span', { class: 'count-pill tone-warn', title: 'Öppna ärenden' }, n) : null);
          el.addEventListener('click', (ev) => { if (ev.altKey) { setFilter({ area: on ? [] : [a.id] }); ev.stopImmediatePropagation(); } }, true);
          return bindEntity(el, { t: 'area', id: a.id }, { drag: true, drop: false });
        }))),
      h('div', { class: 'card span-2' },
        h('div', { class: 'card-head' }, h('h3', icon('calendar', 15), 'Startar inom 4 veckor'), h('em', upcoming.length), h('span', { class: 'grow' }), h('button', { class: 'btn ghost sm', onclick: () => app.navigate('#/schedule') }, 'Tidplan', icon('chevR', 13))),
        h('div', { class: 'card-body list' }, upcoming.length ? upcoming.slice(0, 8).map((x) => row(x.ref, h('span', { class: 'when' }, fmtDate(x.e.start), h('small', relDays(x.e.start))), x.e.contractor)) : h('p', { class: 'muted pad' }, 'Inga aktiviteter startar under perioden.'))),
      h('div', { class: 'card' },
        h('div', { class: 'card-head' }, h('h3', icon('flag', 15), 'Milstolpar')),
        h('div', { class: 'card-body list' }, milestones.length ? milestones.map((x) => row(x.ref, h('span', { class: 'when' }, fmtDate(x.e.end), h('small', relDays(x.e.end))))) : h('p', { class: 'muted pad' }, 'Inga kommande milstolpar.'))),
      h('div', { class: 'card span-2' },
        h('div', { class: 'card-head' }, h('h3', icon('box', 15), 'Arbetspaket')),
        h('div', { class: 'card-body pk-mini' }, pkgs.map((pk) => {
          const ref = { t: 'package', id: pk.id };
          const pct = packageProgress(pk);
          const ni = all('issue').filter((i) => i.packageId === pk.id && !['resolved', 'closed'].includes(i.status)).length;
          const el = h('div', { class: 'pk-mini-row', tabindex: '0', dataset: { nav: '1' } },
            ring(pct, 30), h('div', { class: 'grow' }, h('b', pk.name), h('small', `${pk.contractor} · ${pk.responsible}`)),
            ni ? h('span', { class: 'count-pill tone-warn', title: 'Öppna ärenden' }, icon('alert', 11), ni) : null, badge(pk.status));
          return bindEntity(el, ref);
        }))),
      h('div', { class: 'card' },
        h('div', { class: 'card-head' }, h('h3', icon('history', 15), 'Senaste händelser')),
        h('div', { class: 'card-body' }, h('ol', { class: 'timeline' }, store.db.history.slice(0, 9).map((x) => h('li', {
          class: x.ref ? 'clickable' : '', onclick: () => x.ref && get(x.ref) && app.select(x.ref)
        }, h('i', { class: `tl-dot k-${x.kind}` }), h('div', h('span', x.text), h('small', ago(x.ts)))))))))));
}

};

__defs["js/views/schedule.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "meta": { get: () => meta, enumerable: true },
  "render": { get: () => render, enumerable: true },
  "keys": { get: () => keys, enumerable: true }
});
const { all, get, statusOf, packageProgress, parseDate, today, addDays, daysBetween, isoDate, STATUS, update, refKey } = __r("js/store.js");
const { h, icon, badge, avatar, fmtDate, relDays, progressBar } = __r("js/ui.js");
const { filterBar, filtered } = __r("js/filters.js");
const { bindEntity } = __r("js/actions.js");
const { app } = __r("js/app.js");

const meta = { id: 'schedule', title: 'Tidplan', icon: 'gantt' };

const ZOOMS = [{ v: 14, l: '2 v' }, { v: 28, l: '4 v' }, { v: 91, l: '3 mån' }, { v: 182, l: '6 mån' }];
const S_KEY = 'pch.schedule';
const st = (() => { try { return { days: 28, offset: -7, collapsed: [], ...JSON.parse(sessionStorage.getItem(S_KEY) || '{}') }; } catch { return { days: 28, offset: -7, collapsed: [] }; } })();
const save = () => { try { sessionStorage.setItem(S_KEY, JSON.stringify(st)); } catch {} };

const MON = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const WD = ['S', 'M', 'T', 'O', 'T', 'F', 'L'];
function weekNo(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  return Math.ceil(((t - new Date(Date.UTC(t.getUTCFullYear(), 0, 1))) / 864e5 + 1) / 7);
}

let refs = null;

function render(root, { scope } = {}) {
  const start = () => addDays(today(), st.offset);
  const rangeStart = start();
  let acts = filtered('activity');
  let pkgs = filtered('package', { ignore: ['period', 'status'] });
  if (scope) { acts = acts.filter((a) => a.packageId === scope); pkgs = pkgs.filter((p) => p.id === scope); }
  const groups = pkgs.map((p) => ({ p, acts: acts.filter((a) => a.packageId === p.id).sort((a, b) => a.start.localeCompare(b.start)) })).filter((g) => g.acts.length);

  const timeline = h('div', { class: 'gt-time' });
  const headEl = h('div', { class: 'gt-head' });
  const gridEl = h('div', { class: 'gt-grid' });
  const todayEl = h('div', { class: 'gt-today' }, h('span', 'Idag'));
  const bars = [];

  const pos = (s, e) => {
    const S = start(), d = st.days;
    const l = daysBetween(S, parseDate(s)) / d * 100;
    const w = (daysBetween(parseDate(s), parseDate(e)) + 1) / d * 100;
    return { l, w };
  };

  const rows = [];
  for (const g of groups) {
    const pref = { t: 'package', id: g.p.id };
    const isC = st.collapsed.includes(g.p.id);
    const gs = g.acts.reduce((m, a) => (a.start < m ? a.start : m), g.acts[0].start);
    const ge = g.acts.reduce((m, a) => (a.end > m ? a.end : m), g.acts[0].end);
    const pct = packageProgress(g.p);
    const label = h('div', { class: `gt-row gt-group ${isC ? 'collapsed' : ''}` },
      h('button', { class: 'iconbtn xs', title: isC ? 'Visa' : 'Dölj', onclick: () => { const i = st.collapsed.indexOf(g.p.id); i >= 0 ? st.collapsed.splice(i, 1) : st.collapsed.push(g.p.id); save(); app.render(); } }, icon(isC ? 'chevR' : 'chevD', 13)),
      h('b', { class: 'mono' }, g.p.code), h('span', { class: 'gt-name' }, g.p.name), h('span', { class: 'mono small muted' }, `${pct}%`));
    bindEntity(label, pref);
    const sumBar = h('div', { class: 'gt-bar gt-sum', title: `${g.p.name}: ${fmtDate(gs)} – ${fmtDate(ge)}` }, h('i', { style: { width: pct + '%' } }));
    bars.push({ el: sumBar, s: gs, e: ge });
    const lane = h('div', { class: 'gt-lane gt-lane-group' }, sumBar);
    bindEntity(lane, pref, { drag: false });
    rows.push([label, lane]);
    if (isC) continue;
    for (const a of g.acts) {
      const ref = { t: 'activity', id: a.id };
      const s = statusOf(ref, a);
      const label = h('div', { class: 'gt-row', tabindex: '0', dataset: { nav: '1' } },
        h('i', { class: `sdot tone-${STATUS[s].tone}`, title: STATUS[s].label }),
        h('span', { class: 'mono small muted' }, a.code),
        h('span', { class: 'gt-name' }, a.name),
        a.responsible && avatar(a.responsible, 18));
      bindEntity(label, ref);
      const bar = h('div', { class: `gt-bar st-${s} ${a.milestone ? 'milestone' : ''}`, title: `${a.code} ${a.name}\n${fmtDate(a.start)} – ${fmtDate(a.end)} · ${a.progress}%` },
        !a.milestone && h('i', { style: { width: a.progress + '%' } }),
        h('span', { class: 'gt-bar-label' }, a.milestone ? a.name : `${a.name}`));
      bindEntity(bar, ref);
      bars.push({ el: bar, s: a.start, e: a.end, ms: a.milestone });
      const lane = h('div', { class: 'gt-lane' }, bar);
      rows.push([label, lane]);
    }
  }

  const left = h('div', { class: 'gt-left', dataset: { skey: 'gt-left' } }, h('div', { class: 'gt-left-head' }, 'Aktivitet'), rows.map((r) => r[0]));
  const lanes = h('div', { class: 'gt-lanes' }, gridEl, todayEl, rows.map((r) => r[1]));
  timeline.append(headEl, lanes);

  const applyRange = () => {
    const S = start(), d = st.days;
    for (const b of bars) {
      const p = pos(b.s, b.e);
      b.el.style.left = p.l + '%';
      b.el.style.width = b.ms ? '' : Math.max(p.w, 0.4) + '%';
      const vis = p.w + Math.min(0, p.l);            // synlig bredd i %
      b.el.classList.toggle('narrow', vis < 9);
      const lab = b.el.querySelector('.gt-bar-label');
      if (lab && !b.ms) lab.style.marginLeft = p.l < 0 && vis >= 9 ? `${(-p.l / p.w) * 100}%` : '';
      b.el.classList.toggle('off', p.l + p.w < 0 || p.l > 100);
    }
    const tl = daysBetween(S, today()) / d * 100;
    todayEl.style.left = tl + '%';
    todayEl.style.display = tl < 0 || tl > 100 ? 'none' : '';
    // rubriker
    const top = [], bottom = [], grid = [];
    const unit = d <= 31 ? 'day' : d <= 120 ? 'week' : 'month';
    let cur = new Date(S), lastMonth = -1;
    for (let i = 0; i < d; i++) {
      const x = addDays(S, i);
      const left = i / d * 100;
      if (x.getMonth() !== lastMonth) { top.push(h('span', { class: 'gt-m', style: { left: left + '%' } }, `${MON[x.getMonth()]} ${x.getFullYear()}`)); lastMonth = x.getMonth(); }
      if (unit === 'day') {
        bottom.push(h('span', { class: `gt-d ${[0, 6].includes(x.getDay()) ? 'we' : ''} ${isoDate(x) === isoDate(today()) ? 'now' : ''}`, style: { left: left + '%', width: 100 / d + '%' } }, h('b', x.getDate()), h('small', WD[x.getDay()])));
        if ([0, 6].includes(x.getDay())) grid.push(h('i', { class: 'gt-we', style: { left: left + '%', width: 100 / d + '%' } }));
      } else if (unit === 'week' && x.getDay() === 1) {
        bottom.push(h('span', { class: 'gt-w', style: { left: left + '%', width: 700 / d + '%' } }, `v${weekNo(x)}`));
        grid.push(h('i', { class: 'gt-line', style: { left: left + '%' } }));
      } else if (unit === 'month' && x.getDate() === 1) {
        grid.push(h('i', { class: 'gt-line', style: { left: left + '%' } }));
      }
      if (unit === 'month' && x.getDay() === 1 && weekNo(x) % 2 === 0) bottom.push(h('span', { class: 'gt-w', style: { left: left + '%' } }, `v${weekNo(x)}`));
    }
    headEl.replaceChildren(h('div', { class: 'gt-head-top' }, top), h('div', { class: 'gt-head-bottom' }, bottom));
    gridEl.replaceChildren(...grid);
    rangeLabel.textContent = `${fmtDate(S)} – ${fmtDate(addDays(S, d - 1), true)}`;
    save();
  };

  const rangeLabel = h('span', { class: 'range-label' });
  const zoomSeg = h('div', { class: 'seg' }, ZOOMS.map((z) => h('button', { class: st.days === z.v ? 'on' : '', onclick: (e) => {
    const center = st.offset + st.days / 2;
    st.days = z.v; st.offset = Math.round(center - z.v / 2);
    if (z.v <= 28) st.offset = Math.min(st.offset, -2);
    zoomSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === e.currentTarget));
    applyRange();
  } }, z.l)));
  const step = (dir) => { st.offset += Math.round(st.days / (st.days <= 28 ? 2 : 3)) * dir; applyRange(); };

  const tools = h('div', { class: 'toolbar' },
    zoomSeg,
    h('div', { class: 'btn-group' },
      h('button', { class: 'btn sm ghost', onclick: () => step(-1), title: 'Tidigare (←)' }, icon('chevL', 14)),
      h('button', { class: 'btn sm ghost', onclick: () => { st.offset = st.days <= 28 ? -3 : -7; applyRange(); }, title: 'Gå till idag (T)' }, 'Idag'),
      h('button', { class: 'btn sm ghost', onclick: () => step(1), title: 'Senare (→)' }, icon('chevR', 14))),
    rangeLabel,
    h('span', { class: 'grow' }),
    h('div', { class: 'legend' }, ['planned', 'active', 'late', 'done'].map((s) => h('span', h('i', { class: `lg st-${s}` }), STATUS[s].label)), h('span', h('i', { class: 'lg ms' }), 'Milstolpe')),
    h('button', { class: 'btn sm ghost', title: 'Fäll ihop/ut alla', onclick: () => { st.collapsed = st.collapsed.length ? [] : groups.map((g) => g.p.id); save(); app.render(); } }, icon('layers', 14)));

  const body = groups.length ? h('div', { class: `gantt ${scope ? 'embedded' : ''}`, dataset: { skey: 'gantt' } }, left, timeline)
    : h('div', { class: 'empty' }, h('b', 'Inga aktiviteter matchar filtren'), h('p', 'Ändra eller rensa filter för att se fler.'));

  // synka vertikal scroll mellan vänster lista och tidslinje (de ligger i samma scrollcontainer)
  const view = h('div', { class: `view view-schedule ${scope ? 'scoped' : ''}` },
    !scope && h('div', { class: 'view-head' }, h('div', h('h1', 'Tidplan'), h('p', { class: 'muted' }, `${acts.length} aktiviteter i ${groups.length} arbetspaket`))),
    !scope && filterBar({ dims: ['area', 'discipline', 'contractor', 'responsible', 'status'] }),
    tools, body);
  root.replaceChildren(view);
  // Första gången: placera utan animation
  view.classList.add('no-anim');
  applyRange();
  requestAnimationFrame(() => requestAnimationFrame(() => view.classList.remove('no-anim')));

  refs = { step, applyRange, today: () => { st.offset = st.days <= 28 ? -3 : -7; applyRange(); } };
}

function keys(e) {
  if (!refs) return false;
  if (e.key === 'ArrowLeft') { refs.step(-1); return true; }
  if (e.key === 'ArrowRight') { refs.step(1); return true; }
  if (e.key === 't' || e.key === 'T') { refs.today(); return true; }
  return false;
}

};

__defs["js/views/packages.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "meta": { get: () => meta, enumerable: true },
  "render": { get: () => render, enumerable: true },
  "renderPackage": { get: () => renderPackage, enumerable: true },
  "switchTab": { get: () => switchTab, enumerable: true },
  "photoTile": { get: () => photoTile, enumerable: true },
  "modelCard": { get: () => modelCard, enumerable: true }
});
const { store, all, get, related, relatedOfType, statusOf, packageProgress, codeOf, titleOf, latestVersion, STATUS, PRIORITY, historyFor, refKey, fileUrl, unlink } = __r("js/store.js");
const { h, icon, typeIcon, badge, prioBadge, avatar, progressBar, ring, fmtDate, relDays, ago, dueChip, emptyState, dropTarget, docIcon, hueOf, fmtSize } = __r("js/ui.js");
const { filterBar, filtered } = __r("js/filters.js");
const { bindEntity, entityDropSpec, attachFiles, linkWithFeedback, linkPicker, createIssue, createAction, createDecision, createMeeting, editEntity, importIfc } = __r("js/actions.js");
const { renderContext } = __r("js/context.js");
const schedule = __r("js/views/schedule.js");
const { app } = __r("js/app.js");

const meta = { id: 'packages', title: 'Arbetspaket', icon: 'box' };

const counters = (p) => {
  const ref = { t: 'package', id: p.id };
  return {
    issues: all('issue').filter((i) => i.packageId === p.id && !['resolved', 'closed'].includes(i.status)).length,
    actions: all('action').filter((a) => a.packageId === p.id && a.status !== 'done').length,
    drawings: relatedOfType(ref, 'drawing').length,
    docs: all('document').filter((d) => d.packageId === p.id).length + relatedOfType(ref, 'document').length
  };
};

function render(root) {
  const pkgs = filtered('package');
  const byArea = all('area').map((a) => ({ a, list: pkgs.filter((p) => p.areaId === a.id) })).filter((g) => g.list.length);
  root.replaceChildren(h('div', { class: 'view view-packages' },
    h('div', { class: 'view-head' }, h('div', h('h1', 'Arbetspaket'), h('p', { class: 'muted' }, `${pkgs.length} paket · klicka för att visa i kontextpanelen, dubbelklicka för att öppna · dra filer eller information på ett kort för att koppla`))),
    filterBar({ dims: ['area', 'discipline', 'contractor', 'responsible', 'status'] }),
    byArea.length ? byArea.map(({ a, list }) => h('section', { class: 'pk-area' },
      h('div', { class: 'pk-area-head' }, h('i', { class: 'area-sw', style: { background: a.color } }), h('h3', `Område ${a.code}`), h('span', { class: 'muted' }, a.name), h('em', list.length)),
      h('div', { class: 'pk-grid' }, list.map((p) => {
        const ref = { t: 'package', id: p.id };
        const pct = packageProgress(p);
        const c = counters(p);
        const card = h('article', { class: `pk-card st-${p.status}`, tabindex: '0', dataset: { nav: '1' } },
          h('div', { class: 'pk-card-top' }, h('span', { class: 'mono pk-code' }, p.code), h('span', { class: 'muted small' }, p.kind), h('span', { class: 'grow' }), badge(p.status)),
          h('h4', p.name),
          h('p', { class: 'pk-desc' }, p.description),
          h('div', { class: 'pk-prog' }, progressBar(pct), h('span', { class: 'mono small' }, `${pct}%`)),
          h('div', { class: 'pk-meta' },
            h('span', { class: 'pk-person' }, avatar(p.responsible, 18), p.responsible),
            h('span', { class: 'grow' }),
            c.issues ? h('span', { class: 'count-pill tone-warn', title: 'Öppna ärenden' }, icon('alert', 11), c.issues) : null,
            c.actions ? h('span', { class: 'count-pill', title: 'Öppna åtgärder' }, icon('check', 11), c.actions) : null,
            h('span', { class: 'count-pill', title: 'Ritningar' }, icon('drawing', 11), c.drawings),
            c.docs ? h('span', { class: 'count-pill', title: 'Dokument' }, icon('paperclip', 11), c.docs) : null),
          h('button', { class: 'pk-open', onclick: () => app.open(ref), title: 'Öppna arbetsyta' }, 'Öppna', icon('chevR', 13)));
        return bindEntity(card, ref);
      })))) : emptyState('Inga arbetspaket matchar filtren', 'Ändra filter eller rensa dem.')));
}

// ------------------------------------------------------------------ arbetsyta för ett paket
const TABS = [
  { id: 'overview', label: 'Översikt', icon: 'home' },
  { id: 'schedule', label: 'Tidplan', icon: 'gantt' },
  { id: 'drawings', label: 'Ritningar', icon: 'drawing' },
  { id: 'models', label: 'Modeller', icon: 'cube' },
  { id: 'issues', label: 'Ärenden', icon: 'alert' },
  { id: 'actions', label: 'Åtgärder', icon: 'check' },
  { id: 'decisions', label: 'Beslut', icon: 'gavel' },
  { id: 'meetings', label: 'Möten', icon: 'users' },
  { id: 'emails', label: 'E-post', icon: 'mail' },
  { id: 'photos', label: 'Foton', icon: 'image' },
  { id: 'documents', label: 'Dokument', icon: 'paperclip' },
  { id: 'history', label: 'Historik', icon: 'history' }
];

function collect(p) {
  const ref = { t: 'package', id: p.id };
  const rel = related(ref);
  const of = (t) => rel.filter((r) => r.ref.t === t).map((r) => ({ ...r, e: get(r.ref) }));
  const docs = [
    ...all('document').filter((d) => d.packageId === p.id).map((d) => ({ ref: { t: 'document', id: d.id }, relId: null, e: d })),
    ...of('document').filter((x) => x.e.packageId !== p.id)
  ];
  // dokument kopplade till paketets ärenden/aktiviteter räknas också
  const indirect = new Map();
  for (const x of [...of('issue'), ...of('activity'), ...of('decision')]) {
    for (const r of relatedOfType(x.ref, 'document')) if (!docs.some((d) => d.ref.id === r.ref.id)) indirect.set(r.ref.id, { ref: r.ref, relId: null, e: get(r.ref), via: x.ref });
  }
  const allDocs = [...docs, ...indirect.values()];
  return {
    activities: of('activity').sort((a, b) => a.e.start.localeCompare(b.e.start)),
    drawings: of('drawing'), models: of('model'),
    issues: of('issue'), actions: of('action'), decisions: of('decision'),
    meetings: [...of('meeting'), ...all('meeting').filter((m) => m.packageId === p.id && !of('meeting').some((x) => x.e.id === m.id)).map((m) => ({ ref: { t: 'meeting', id: m.id }, relId: null, e: m }))],
    emails: allDocs.filter((d) => d.e.kind === 'email'),
    photos: allDocs.filter((d) => d.e.kind === 'photo'),
    documents: allDocs.filter((d) => !['email', 'photo'].includes(d.e.kind)),
    history: store.db.history.filter((x) => x.ref && (x.ref.id === p.id || rel.some((r) => r.ref.id === x.ref.id)))
  };
}

function table(cols, items, opts = {}) {
  if (!items.length) return emptyState(opts.emptyTitle || 'Inget här än', opts.emptyText || 'Dra information hit eller använd knappen ovan.', opts.emptyAction);
  return h('div', { class: 'tbl', role: 'table' },
    h('div', { class: 'tbl-head', role: 'row', style: { gridTemplateColumns: cols.map((c) => c.w || '1fr').join(' ') } }, cols.map((c) => h('span', c.label))),
    items.map((x) => {
      const row = h('div', { class: 'tbl-row', role: 'row', tabindex: '0', dataset: { nav: '1' }, style: { gridTemplateColumns: cols.map((c) => c.w || '1fr').join(' ') } }, cols.map((c) => h('span', { class: c.cls || '' }, c.get(x))));
      bindEntity(row, x.ref);
      if (x.relId) row.append(h('button', { class: 'iconbtn xs row-unlink', title: 'Ta bort koppling', onclick: (e) => { e.stopPropagation(); unlink(x.relId); } }, icon('x', 12)));
      return row;
    }));
}

function renderPackage(root, id, tab = 'overview') {
  const p = get({ t: 'package', id });
  if (!p) { root.replaceChildren(emptyState('Arbetspaketet finns inte', 'Det kan ha tagits bort.', h('button', { class: 'btn', onclick: () => app.navigate('#/packages') }, 'Till arbetspaket'))); return; }
  const ref = { t: 'package', id };
  const area = get({ t: 'area', id: p.areaId });
  const c = collect(p);
  const pct = packageProgress(p);
  if (!TABS.some((t) => t.id === tab)) tab = 'overview';
  const counts = { schedule: c.activities.length, drawings: c.drawings.length, models: c.models.length, issues: c.issues.filter((x) => !['resolved', 'closed'].includes(x.e.status)).length, actions: c.actions.filter((x) => x.e.status !== 'done').length, decisions: c.decisions.length, meetings: c.meetings.length, emails: c.emails.length, photos: c.photos.length, documents: c.documents.length };

  const tabBar = h('nav', { class: 'tabs', role: 'tablist' },
    TABS.map((t, i) => h('a', { class: `tab ${t.id === tab ? 'on' : ''}`, href: `#/package/${id}/${t.id}`, role: 'tab', title: i < 9 ? `${t.label} (${i + 1})` : t.label, dataset: { tab: t.id } },
      icon(t.icon, 14), t.label, counts[t.id] ? h('em', { class: t.id === 'issues' && counts.issues ? 'warn' : '' }, counts[t.id]) : null)),
    h('i', { class: 'tab-ink' }));

  const content = h('div', { class: 'tab-content' }, tabContent(tab, p, ref, c));

  const header = h('div', { class: 'pkg-head' },
    h('div', { class: 'pkg-title' },
      ring(pct, 54),
      h('div', h('div', { class: 'pkg-kicker' }, h('span', { class: 'mono' }, p.code), h('span', p.kind), h('span', { class: 'mono' }, p.wbs), badge(p.status)),
        h('h1', p.name),
        h('p', { class: 'muted' }, p.description))),
    h('div', { class: 'pkg-facts' },
      fact('Ansvarig', h('span', { class: 'pk-person' }, avatar(p.responsible, 18), p.responsible)),
      fact('Entreprenör', p.contractor), fact('Disciplin', p.discipline),
      fact('Område', area ? `${area.code} ${area.name}` : '–'),
      fact('Öppna ärenden', h('b', { class: counts.issues ? 'tone-text-warn' : '' }, counts.issues))),
    h('div', { class: 'head-actions' },
      h('button', { class: 'btn ghost', onclick: () => editEntity(ref) }, icon('note', 14), 'Redigera'),
      h('button', { class: 'btn ghost', onclick: () => app.select(ref) }, icon('panelR', 14), 'Kontext'),
      h('button', { class: 'btn primary', onclick: () => createAction({ packageId: id }) }, icon('plus', 14), 'Åtgärd')));

  const view = h('div', { class: 'view view-package' }, header, tabBar, content);
  dropTarget(view, {
    accept: (src) => (src.ref ? src.ref.t !== 'package' && src.ref.t !== 'tool' && src.ref.t !== 'area' : !!src.files),
    label: (src) => src?.ref ? `Koppla till ${p.name}` : `Bifoga till ${p.name}`,
    onDrop: (src) => src.ref ? linkWithFeedback(src.ref, ref) : attachFiles(ref, src.files)
  });
  root.replaceChildren(view);
  requestAnimationFrame(() => moveInk(tabBar, false));
}

function moveInk(bar, animate = true) {
  const on = bar.querySelector('.tab.on'), ink = bar.querySelector('.tab-ink');
  if (!on || !ink) return;
  if (!animate) ink.style.transition = 'none';
  ink.style.width = on.offsetWidth + 'px';
  ink.style.transform = `translateX(${on.offsetLeft}px)`;
  if (!animate) requestAnimationFrame(() => (ink.style.transition = ''));
  on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

/** Byter flik utan att rendera om headern – snabbt och behåller kontext. */
function switchTab(root, id, tab) {
  const bar = root.querySelector('.tabs'), content = root.querySelector('.tab-content');
  const p = get({ t: 'package', id });
  if (!bar || !content || !p) return renderPackage(root, id, tab);
  bar.querySelectorAll('.tab').forEach((t) => t.classList.toggle('on', t.dataset.tab === tab));
  moveInk(bar);
  const next = h('div', { class: 'tab-content entering' }, tabContent(tab, p, { t: 'package', id }, collect(p)));
  content.replaceWith(next);
  requestAnimationFrame(() => next.classList.remove('entering'));
}

const fact = (l, v) => h('div', { class: 'fact' }, h('small', l), h('span', v));

function sectionHead(title, ...actions) { return h('div', { class: 'tab-head' }, h('h3', title), h('span', { class: 'grow' }), actions); }

function tabContent(tab, p, ref, c) {
  const linkBtn = (types, label = 'Koppla') => h('button', { class: 'btn sm ghost', onclick: () => linkPicker(ref, types) }, icon('link', 13), label);
  switch (tab) {
    case 'overview': {
      const next = c.activities.filter((x) => statusOf(x.ref, x.e) !== 'done').slice(0, 5);
      return h('div', { class: 'pkg-overview' },
        h('div', { class: 'card' }, h('div', { class: 'card-head' }, h('h3', icon('gantt', 15), 'Aktiviteter')), h('div', { class: 'card-body list' }, next.length ? next.map((x) => miniRow(x, h('span', { class: 'when' }, fmtDate(x.e.start), h('small', `${x.e.progress}%`)))) : h('p', { class: 'muted pad' }, 'Alla aktiviteter klara.'))),
        h('div', { class: 'card' }, h('div', { class: 'card-head' }, h('h3', icon('alert', 15), 'Öppna ärenden')), h('div', { class: 'card-body list' }, c.issues.filter((x) => !['resolved', 'closed'].includes(x.e.status)).map((x) => miniRow(x, h('span', prioBadge(x.e.priority), dueChip(x.e.due)))), !c.issues.length && h('p', { class: 'muted pad' }, 'Inga ärenden.'))),
        h('div', { class: 'card' }, h('div', { class: 'card-head' }, h('h3', icon('check', 15), 'Åtgärder')), h('div', { class: 'card-body list' }, c.actions.filter((x) => x.e.status !== 'done').map((x) => miniRow(x, h('span', badge(x.e.status), dueChip(x.e.due)))), !c.actions.length && h('p', { class: 'muted pad' }, 'Inga åtgärder.'))),
        h('div', { class: 'card' }, h('div', { class: 'card-head' }, h('h3', icon('drawing', 15), 'Ritningar & modeller')), h('div', { class: 'card-body list' }, [...c.drawings, ...c.models].map((x) => miniRow(x, x.ref.t === 'drawing' ? h('span', h('span', { class: 'mono small muted' }, `Rev ${x.e.rev}`), ' ', badge(x.e.status)) : h('span', h('span', { class: 'muted small' }, x.e.discipline), ' ', h('span', { class: 'chip mono' }, `v${latestVersion(x.e)?.v}`)))))),
        h('div', { class: 'card span-2 drop-card' }, h('div', { class: 'big-drop' }, icon('upload', 22), h('b', 'Släpp filer här'), h('span', 'PDF, foton, e-post (.eml) eller ritningar bifogas till ', h('b', p.name), '. Dra en ritning, ett ärende eller ett mejl hit för att koppla det.'))));
    }
    case 'schedule': {
      const el = h('div', { class: 'embedded-schedule' });
      schedule.render(el, { scope: p.id });
      return el;
    }
    case 'drawings':
      return [sectionHead('Ritningar', linkBtn(['drawing'], 'Koppla ritning')),
        table([
          { label: 'Nummer', w: '110px', get: (x) => h('b', { class: 'mono' }, x.e.number) },
          { label: 'Titel', w: '2fr', get: (x) => x.e.name },
          { label: 'Rev', w: '60px', get: (x) => h('span', { class: 'mono' }, x.e.rev) },
          { label: 'Status', w: '130px', get: (x) => badge(x.e.status) },
          { label: 'Datum', w: '90px', get: (x) => fmtDate(x.e.date) },
          { label: 'Kopplad till', w: '1fr', get: (x) => relatedOfType(x.ref, 'activity').map((r) => h('span', { class: 'mono small chip' }, get(r.ref).code)) }
        ], c.drawings, { emptyText: 'Dra en ritning från biblioteket eller kontextpanelen hit.' })];
    case 'models':
      return [sectionHead('Modeller', linkBtn(['model'], 'Koppla modell')),
        h('div', { class: 'model-cards' }, c.models.map((x) => modelCard(x)), !c.models.length && emptyState('Inga modeller kopplade', 'Koppla en modell eller släpp en IFC-fil i Modellkontroll.'))];
    case 'issues':
      return [sectionHead('Ärenden', linkBtn(['issue']), h('button', { class: 'btn sm', onclick: () => createIssue({ packageId: p.id }) }, icon('plus', 13), 'Nytt ärende')),
        table([
          { label: 'ID', w: '80px', get: (x) => h('b', { class: 'mono' }, x.e.code) },
          { label: '', w: '28px', get: (x) => prioBadge(x.e.priority) },
          { label: 'Rubrik', w: '2fr', get: (x) => x.e.name },
          { label: 'Status', w: '130px', get: (x) => badge(x.e.status) },
          { label: 'Ansvarig', w: '140px', get: (x) => x.e.responsible && h('span', { class: 'pk-person' }, avatar(x.e.responsible, 18), x.e.responsible) },
          { label: 'Deadline', w: '90px', get: (x) => dueChip(x.e.due, ['resolved', 'closed'].includes(x.e.status)) }
        ], c.issues)];
    case 'actions':
      return [sectionHead('Åtgärder', h('button', { class: 'btn sm', onclick: () => createAction({ packageId: p.id }) }, icon('plus', 13), 'Ny åtgärd')),
        table([
          { label: 'ID', w: '80px', get: (x) => h('b', { class: 'mono' }, x.e.code) },
          { label: 'Åtgärd', w: '2fr', get: (x) => x.e.name },
          { label: 'Status', w: '110px', get: (x) => badge(x.e.status) },
          { label: 'Ansvarig', w: '140px', get: (x) => x.e.responsible && h('span', { class: 'pk-person' }, avatar(x.e.responsible, 18), x.e.responsible) },
          { label: 'Deadline', w: '90px', get: (x) => dueChip(x.e.due, x.e.status === 'done') }
        ], c.actions)];
    case 'decisions':
      return [sectionHead('Beslut', linkBtn(['decision']), h('button', { class: 'btn sm', onclick: () => createDecision({ packageId: p.id, linkTo: ref }) }, icon('plus', 13), 'Nytt beslut')),
        table([
          { label: 'ID', w: '80px', get: (x) => h('b', { class: 'mono' }, x.e.code) },
          { label: 'Beslut', w: '2fr', get: (x) => x.e.name },
          { label: 'Status', w: '110px', get: (x) => badge(x.e.status) },
          { label: 'Datum', w: '90px', get: (x) => fmtDate(x.e.date) },
          { label: 'Källor', w: '80px', get: (x) => h('span', { class: 'count-pill' }, icon('paperclip', 11), relatedOfType(x.ref, 'document').length) }
        ], c.decisions, { emptyText: 'Dra ett mejl eller dokument på ett beslut för att lägga till det som källa.' })];
    case 'meetings':
      return [sectionHead('Möten', linkBtn(['meeting']), h('button', { class: 'btn sm', onclick: () => createMeeting({ packageId: p.id, linkTo: ref }) }, icon('plus', 13), 'Nytt möte')),
        table([
          { label: 'Datum', w: '90px', get: (x) => h('b', fmtDate(x.e.date)) },
          { label: 'Möte', w: '1.4fr', get: (x) => x.e.name },
          { label: 'Typ', w: '120px', get: (x) => x.e.kind },
          { label: 'Anteckningar', w: '2fr', cls: 'ellipsis muted', get: (x) => x.e.notes }
        ], c.meetings)];
    case 'emails':
      return [sectionHead('E-post', h('span', { class: 'muted small' }, 'Dra .eml-filer hit')),
        table([
          { label: 'Datum', w: '80px', get: (x) => fmtDate(x.e.date) },
          { label: 'Ämne', w: '2fr', get: (x) => h('b', x.e.subject) },
          { label: 'Från', w: '1fr', cls: 'muted', get: (x) => x.e.from || '' },
          { label: 'Via', w: '110px', get: (x) => x.via ? h('span', { class: 'mono small chip' }, get(x.via)?.code) : '' }
        ], c.emails, { emptyTitle: 'Ingen e-post kopplad', emptyText: 'Dra ett mejl (.eml) från datorn hit.' })];
    case 'photos':
      return [sectionHead('Foton', h('span', { class: 'muted small' }, 'Dra bilder hit')),
        c.photos.length ? h('div', { class: 'photo-grid' }, c.photos.map((x) => photoTile(x))) : emptyState('Inga foton', 'Dra bilder från datorn hit för att bifoga dem.')];
    case 'documents':
      return [sectionHead('Dokument', h('span', { class: 'muted small' }, 'Dra PDF:er och andra filer hit')),
        table([
          { label: '', w: '28px', get: (x) => icon(docIcon(x.e.kind), 14) },
          { label: 'Namn', w: '2fr', get: (x) => h('b', x.e.name) },
          { label: 'Typ', w: '70px', get: (x) => h('span', { class: 'mono small' }, (x.e.kind || '').toUpperCase()) },
          { label: 'Storlek', w: '80px', cls: 'muted', get: (x) => fmtSize(x.e.size) },
          { label: 'Datum', w: '90px', get: (x) => fmtDate(x.e.date) }
        ], c.documents, { emptyTitle: 'Inga dokument', emptyText: 'Dra en PDF från datorn hit.' })];
    case 'history':
      return h('div', { class: 'card' }, h('div', { class: 'card-body' }, c.history.length ? h('ol', { class: 'timeline big' }, c.history.map((x) => h('li', { class: 'clickable', onclick: () => x.ref && get(x.ref) && app.select(x.ref) }, h('i', { class: `tl-dot k-${x.kind}` }), h('div', h('span', x.text), h('small', `${fmtDate(x.ts.slice(0, 10))} · ${ago(x.ts)}`))))) : h('p', { class: 'muted pad' }, 'Ingen historik.')));
  }
  return null;
}

function miniRow(x, right) {
  const el = h('div', { class: 'list-row', tabindex: '0', dataset: { nav: '1' } }, h('b', { class: 'mono' }, codeOf(x.ref, x.e)), h('span', { class: 'lr-title' }, titleOf(x.ref, x.e).replace(codeOf(x.ref, x.e), '').trim()), right);
  return bindEntity(el, x.ref);
}

function photoTile(x) {
  const tile = h('figure', { class: 'photo', style: { '--h': x.e.hue ?? hueOf(x.e.name) }, tabindex: '0' },
    h('div', { class: 'photo-img' }, icon('image', 22)), h('figcaption', h('b', x.e.subject || x.e.name), h('small', fmtDate(x.e.date))));
  if (x.e.file) fileUrl(x.e.file).then((u) => { if (u) { const img = tile.querySelector('.photo-img'); img.style.backgroundImage = `url("${u}")`; img.classList.add('has-img'); img.replaceChildren(); } });
  return bindEntity(tile, x.ref);
}

function modelCard(x) {
  const v = latestVersion(x.e);
  const card = h('article', { class: 'model-card', tabindex: '0' },
    h('div', { class: 'mc-icon' }, icon('cube', 22)),
    h('div', { class: 'grow' }, h('b', x.e.name), h('small', `${x.e.discipline} · ${x.e.versions.length} versioner`)),
    h('div', { class: 'mc-ver' }, h('span', { class: 'mono' }, `v${v?.v ?? '–'}`), h('small', v ? fmtDate(v.date) : '')));
  return bindEntity(card, x.ref);
}

};

__defs["js/views/issues.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "meta": { get: () => meta, enumerable: true },
  "render": { get: () => render, enumerable: true }
});
const { all, get, STATUS, PRIORITY, parseDate, today } = __r("js/store.js");
const { h, icon, badge, prioBadge, avatar, fmtDate, dueChip, emptyState } = __r("js/ui.js");
const { filterBar, filtered, filters } = __r("js/filters.js");
const { bindEntity, createIssue } = __r("js/actions.js");
const { app } = __r("js/app.js");

const meta = { id: 'issues', title: 'Ärenden', icon: 'alert' };

const st = { sort: 'priority', dir: 1, quick: 'open', q: '' };
const PRI = { high: 0, medium: 1, low: 2 };

const COLS = [
  { id: 'code', label: 'ID', w: '84px', get: (e) => h('b', { class: 'mono' }, e.code), sort: (e) => e.code },
  { id: 'priority', label: 'Prio', w: '44px', get: (e) => prioBadge(e.priority), sort: (e) => PRI[e.priority] ?? 9 },
  { id: 'name', label: 'Rubrik', w: 'minmax(140px,2.4fr)', get: (e) => h('span', { class: 'ellipsis' }, e.name), sort: (e) => e.name },
  { id: 'status', label: 'Status', w: '120px', get: (e) => badge(e.status), sort: (e) => ['open', 'inprogress', 'resolved', 'closed'].indexOf(e.status) },
  { id: 'package', label: 'Paket', w: '64px', get: (e) => e.packageId && h('span', { class: 'mono chip' }, get({ t: 'package', id: e.packageId })?.code), sort: (e) => get({ t: 'package', id: e.packageId })?.code || '' },
  { id: 'discipline', label: 'Disciplin', w: 'minmax(70px,100px)', get: (e) => h('span', { class: 'muted' }, e.discipline || ''), sort: (e) => e.discipline || '' },
  { id: 'responsible', label: 'Ansvarig', w: 'minmax(100px,140px)', get: (e) => e.responsible && h('span', { class: 'pk-person' }, avatar(e.responsible, 18), e.responsible), sort: (e) => e.responsible || '' },
  { id: 'due', label: 'Deadline', w: '88px', get: (e) => dueChip(e.due, ['resolved', 'closed'].includes(e.status)), sort: (e) => e.due || '9' }
];

function render(root) {
  let list = filtered('issue');
  const counts = { open: list.filter((e) => ['open', 'inprogress'].includes(e.status)).length, all: list.length, mine: 0, overdue: list.filter((e) => e.due && parseDate(e.due) < today() && !['resolved', 'closed'].includes(e.status)).length };
  if (st.quick === 'open') list = list.filter((e) => ['open', 'inprogress'].includes(e.status));
  if (st.quick === 'overdue') list = list.filter((e) => e.due && parseDate(e.due) < today() && !['resolved', 'closed'].includes(e.status));
  if (st.q) { const q = st.q.toLowerCase(); list = list.filter((e) => `${e.code} ${e.name} ${e.description || ''}`.toLowerCase().includes(q)); }
  const col = COLS.find((c) => c.id === st.sort);
  list.sort((a, b) => { const x = col.sort(a), y = col.sort(b); return (x > y ? 1 : x < y ? -1 : 0) * st.dir || (PRI[a.priority] - PRI[b.priority]); });

  const grid = COLS.map((c) => c.w).join(' ');
  root.replaceChildren(h('div', { class: 'view view-issues' },
    h('div', { class: 'view-head' }, h('div', h('h1', 'Ärenden'), h('p', { class: 'muted' }, 'Avvikelser, kollisioner och frågor. Klicka för kontext, högerklicka för snabbval.')),
      h('div', { class: 'head-actions' }, h('button', { class: 'btn primary', onclick: () => createIssue() }, icon('plus', 14), 'Nytt ärende', h('kbd', 'I')))),
    filterBar({ dims: ['area', 'discipline', 'contractor', 'responsible'] }),
    h('div', { class: 'toolbar' },
      h('div', { class: 'seg' }, [['open', 'Öppna', counts.open], ['overdue', 'Förfallna', counts.overdue], ['all', 'Alla', counts.all]].map(([k, l, n]) => h('button', { class: st.quick === k ? 'on' : '', onclick: () => { st.quick = k; app.render(); } }, l, h('em', n)))),
      h('label', { class: 'search-inline' }, icon('search', 14), h('input', { placeholder: 'Sök i ärenden…', value: st.q, dataset: { fkey: 'issue-q' }, oninput: (e) => { st.q = e.target.value; app.render(); } }))),
    list.length ? h('div', { class: 'tbl big', dataset: { skey: 'issues' } },
      h('div', { class: 'tbl-head', style: { gridTemplateColumns: grid } }, COLS.map((c) => h('button', { class: `th ${st.sort === c.id ? 'on' : ''}`, onclick: () => { st.dir = st.sort === c.id ? -st.dir : 1; st.sort = c.id; app.render(); } }, c.label, st.sort === c.id && icon(st.dir > 0 ? 'chevD' : 'chevU', 12)))),
      list.map((e) => {
        const row = h('div', { class: `tbl-row pri-${e.priority}`, tabindex: '0', dataset: { nav: '1' }, style: { gridTemplateColumns: grid } }, COLS.map((c) => h('span', c.get(e))));
        return bindEntity(row, { t: 'issue', id: e.id });
      })) : emptyState('Inga ärenden här', st.quick === 'open' ? 'Inga öppna ärenden matchar filtren.' : 'Inget matchar filtren.')));
}

};

__defs["js/views/actions.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "meta": { get: () => meta, enumerable: true },
  "render": { get: () => render, enumerable: true }
});
const { all, get, STATUS, parseDate, today, relatedOfType, codeOf } = __r("js/store.js");
const { h, icon, avatar, dueChip, dropTarget } = __r("js/ui.js");
const { filterBar, filtered } = __r("js/filters.js");
const { bindEntity, setStatus, quickAction, createAction, linkWithFeedback, attachFiles } = __r("js/actions.js");
const { app } = __r("js/app.js");

const meta = { id: 'actions', title: 'Åtgärder', icon: 'kanban' };

const COLS = [
  { id: 'open', label: 'Öppen', hint: 'Att göra' },
  { id: 'doing', label: 'Pågår', hint: 'Någon arbetar med den' },
  { id: 'done', label: 'Klar', hint: 'Avslutad' }
];

function render(root) {
  const list = filtered('action', { ignore: ['status'] });
  const t = today();
  root.replaceChildren(h('div', { class: 'view view-actions' },
    h('div', { class: 'view-head' }, h('div', h('h1', 'Åtgärder'), h('p', { class: 'muted' }, 'Dra kort mellan kolumnerna för att ändra status. Dra ett kort på ett ärende eller paket för att koppla.')),
      h('div', { class: 'head-actions' }, h('button', { class: 'btn primary', onclick: () => createAction() }, icon('plus', 14), 'Ny åtgärd', h('kbd', 'N')))),
    filterBar({ dims: ['area', 'discipline', 'contractor', 'responsible'] }),
    h('div', { class: 'kanban' }, COLS.map((col) => {
      const items = list.filter((a) => a.status === col.id).sort((a, b) => (a.due || '').localeCompare(b.due || ''));
      const quick = col.id === 'open' ? h('form', { class: 'quick-add', onsubmit: (e) => { e.preventDefault(); const v = e.target.q.value.trim(); if (v) { quickAction(v); e.target.q.value = ''; } } },
        icon('plus', 14), h('input', { name: 'q', placeholder: 'Snabbt: skriv och tryck Enter…', dataset: { fkey: 'kb-quick' } })) : null;
      const body = h('div', { class: 'kb-body', dataset: { skey: `kb-${col.id}` } }, quick, items.map((a) => card(a, t)), !items.length && h('div', { class: 'kb-empty' }, 'Släpp ett kort här'));
      const colEl = h('section', { class: `kb-col kb-${col.id}` },
        h('header', h('i', { class: `sdot tone-${STATUS[col.id].tone}` }), h('b', col.label), h('em', items.length), h('span', { class: 'grow' }), h('small', { class: 'muted' }, col.hint)),
        body);
      dropTarget(colEl, {
        accept: (src) => src.ref?.t === 'action' && get(src.ref)?.status !== col.id,
        label: () => `Flytta till ${col.label}`,
        onDrop: (src) => setStatus(src.ref, col.id)
      });
      return colEl;
    }))));
}

function card(a, t) {
  const ref = { t: 'action', id: a.id };
  const overdue = a.status !== 'done' && a.due && parseDate(a.due) < t;
  const pkg = a.packageId ? get({ t: 'package', id: a.packageId }) : null;
  const links = [...relatedOfType(ref, 'issue'), ...relatedOfType(ref, 'drawing')].slice(0, 3);
  const el = h('article', { class: `kb-card ${overdue ? 'overdue' : ''}`, tabindex: '0', dataset: { nav: '1' } },
    h('div', { class: 'kb-card-top' }, h('span', { class: 'mono small' }, a.code), pkg && h('span', { class: 'mono chip' }, pkg.code), h('span', { class: 'grow' }), dueChip(a.due, a.status === 'done')),
    h('p', a.name),
    h('div', { class: 'kb-card-foot' },
      a.responsible ? h('span', { class: 'pk-person' }, avatar(a.responsible, 18), a.responsible) : h('span', { class: 'muted small' }, 'Ej tilldelad'),
      h('span', { class: 'grow' }),
      links.map((r) => h('span', { class: 'mono chip tiny', title: 'Kopplad' }, codeOf(r.ref)))));
  bindEntity(el, ref, { drop: false });
  // Ett åtgärdskort som släpps på ett annat kort flyttas till den kolumnen;
  // annan information (ritningar, ärenden, filer) kopplas till åtgärden.
  dropTarget(el, {
    accept: (src) => src.files ? true : src.ref && src.ref.id !== a.id && (src.ref.t !== 'action' || get(src.ref)?.status !== a.status) && src.ref.t !== 'tool',
    label: (src) => src?.ref?.t === 'action' ? `Flytta till ${STATUS[a.status].label}` : src?.ref ? `Koppla till ${a.code}` : `Bifoga till ${a.code}`,
    onDrop: (src) => {
      if (src.files) return attachFiles(ref, src.files);
      if (src.ref.t === 'action') return setStatus(src.ref, a.status);
      linkWithFeedback(src.ref, ref);
    }
  });
  return el;
}

};

__defs["js/views/library.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "meta": { get: () => meta, enumerable: true },
  "render": { get: () => render, enumerable: true }
});
const { all, get, relatedOfType, latestVersion, STATUS, codeOf } = __r("js/store.js");
const { h, icon, badge, avatar, fmtDate, relDays, emptyState, dropTarget, fmtSize } = __r("js/ui.js");
const { filterBar, filtered } = __r("js/filters.js");
const { bindEntity, importIfc, attachFiles } = __r("js/actions.js");
const { app } = __r("js/app.js");

const meta = { id: 'library', title: 'Ritningar & modeller', icon: 'layers' };

const st = { tab: 'drawings', sort: 'number', q: '' };

function render(root, { tab } = {}) {
  if (tab) st.tab = tab;
  const view = h('div', { class: 'view view-library' },
    h('div', { class: 'view-head' }, h('div', h('h1', 'Ritningar & modeller'), h('p', { class: 'muted' }, 'Dra en ritning till en aktivitet eller ett paket för att skapa en koppling. Släpp IFC-filer i Modellkontroll.'))),
    filterBar({ dims: ['area', 'discipline', 'status'], period: false }),
    h('nav', { class: 'tabs small' },
      h('a', { class: `tab ${st.tab === 'drawings' ? 'on' : ''}`, href: '#/library/drawings' }, icon('drawing', 14), 'Ritningar', h('em', filtered('drawing').length)),
      h('a', { class: `tab ${st.tab === 'models' ? 'on' : ''}`, href: '#/library/models' }, icon('cube', 14), 'Modellkontroll', h('em', filtered('model').length))),
    st.tab === 'models' ? models() : drawings());
  root.replaceChildren(view);
}

function drawings() {
  let list = filtered('drawing');
  if (st.q) { const q = st.q.toLowerCase(); list = list.filter((d) => `${d.number} ${d.name}`.toLowerCase().includes(q)); }
  list.sort((a, b) => a.number.localeCompare(b.number, 'sv', { numeric: true }));
  const grid = '120px minmax(220px,2fr) 56px 130px 110px 90px 1.2fr';
  return h('div', { class: 'tab-content' },
    h('div', { class: 'toolbar' }, h('label', { class: 'search-inline' }, icon('search', 14), h('input', { placeholder: 'Sök ritningsnummer eller titel…', value: st.q, dataset: { fkey: 'dr-q' }, oninput: (e) => { st.q = e.target.value; app.render(); } }))),
    list.length ? h('div', { class: 'tbl big' },
      h('div', { class: 'tbl-head', style: { gridTemplateColumns: grid } }, ['Nummer', 'Titel', 'Rev', 'Status', 'Disciplin', 'Datum', 'Kopplingar'].map((l) => h('span', l))),
      list.map((d) => {
        const ref = { t: 'drawing', id: d.id };
        const links = [...relatedOfType(ref, 'activity'), ...relatedOfType(ref, 'package'), ...relatedOfType(ref, 'issue')];
        const row = h('div', { class: 'tbl-row', tabindex: '0', dataset: { nav: '1' }, style: { gridTemplateColumns: grid } },
          h('span', h('b', { class: 'mono' }, d.number)), h('span', { class: 'ellipsis' }, d.name), h('span', { class: 'mono' }, d.rev), h('span', badge(d.status)),
          h('span', { class: 'muted' }, d.discipline), h('span', fmtDate(d.date)),
          h('span', { class: 'chips' }, links.slice(0, 4).map((r) => h('span', { class: `mono chip ti-${r.ref.t}` }, codeOf(r.ref))), links.length > 4 && h('span', { class: 'muted small' }, `+${links.length - 4}`)));
        return bindEntity(row, ref);
      })) : emptyState('Inga ritningar matchar', 'Ändra filter eller sökning.'));
}

function models() {
  const list = filtered('model');
  const zone = h('div', { class: 'ifc-zone' },
    h('div', { class: 'ifc-zone-art' }, icon('cube', 28)),
    h('div', h('b', 'Släpp en IFC-fil här'), h('p', 'Filhuvudet läses (schema, program, författare) och en ny version skapas på vald modell. Originalfilen ändras inte.')),
    h('label', { class: 'btn' }, icon('upload', 14), 'Välj fil…', h('input', { type: 'file', accept: '.ifc,.ifczip', hidden: true, onchange: (e) => { const f = e.target.files[0]; if (f) importIfc(f); e.target.value = ''; } })));
  dropTarget(zone, {
    accept: (src) => !!src.files,
    label: () => 'Skapa ny modellversion',
    onDrop: (src) => {
      const f = src.files.find((x) => /\.ifc(zip)?$/i.test(x.name));
      if (f) importIfc(f); else Promise.resolve().then(() => __r("js/ui.js")).then((m) => m.toast('Endast .ifc- eller .ifczip-filer kan importeras här', { tone: 'warn' }));
    }
  });
  return h('div', { class: 'tab-content' }, zone,
    h('div', { class: 'model-grid' }, list.map((m) => {
      const ref = { t: 'model', id: m.id };
      const vs = [...m.versions].sort((a, b) => b.v - a.v);
      const v = vs[0];
      const card = h('article', { class: 'model-tile', tabindex: '0', dataset: { nav: '1' } },
        h('div', { class: 'mt-top' }, h('div', { class: 'mc-icon' }, icon('cube', 20)), h('div', { class: 'grow' }, h('b', m.name), h('small', m.discipline)), h('div', { class: 'mc-ver' }, h('span', { class: 'mono' }, `v${v?.v ?? '–'}`), h('small', v ? relDays(v.date) : ''))),
        h('ol', { class: 'mt-versions' }, vs.slice(0, 4).map((x, i) => h('li', { class: i === 0 ? 'latest' : '' }, h('span', { class: 'mono' }, `v${x.v}`), h('span', { class: 'ellipsis' }, x.note), h('small', fmtDate(x.date))))),
        h('div', { class: 'mt-foot' }, m.responsible && h('span', { class: 'pk-person' }, avatar(m.responsible, 18), m.responsible), h('span', { class: 'grow' }), h('span', { class: 'muted small' }, `${relatedOfType(ref, 'package').length} paket · ${relatedOfType(ref, 'issue').length} ärenden`)));
      bindEntity(card, ref, { drop: false });
      dropTarget(card, {
        accept: (src) => src.files || (src.ref && src.ref.t !== 'model'),
        label: (src) => src?.ref ? `Koppla till ${m.name}` : `Ny version av ${m.name}`,
        onDrop: (src) => {
          if (src.ref) return Promise.resolve().then(() => __r("js/actions.js")).then((a) => a.linkWithFeedback(src.ref, ref));
          const f = src.files.find((x) => /\.ifc(zip)?$/i.test(x.name));
          if (f) importIfc(f, m); else attachFiles(ref, src.files);
        }
      });
      return card;
    })));
}

};

__defs["js/views/whiteboard.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  "meta": { get: () => meta, enumerable: true },
  "render": { get: () => render, enumerable: true },
  "keys": { get: () => keys, enumerable: true }
});
const { store, get, codeOf, titleOf, statusOf, STATUS, TYPES, related, sameRef, persist, mutate, uid, labelOf, latestVersion, emit } = __r("js/store.js");
const { h, icon, typeIcon, badge, avatar, dueChip, dropTarget, contextMenu, toast, confirmDialog } = __r("js/ui.js");
const { entityMenu, addToWhiteboard } = __r("js/actions.js");
const { app } = __r("js/app.js");

const meta = { id: 'whiteboard', title: 'Whiteboard', icon: 'board' };

const COLORS = ['amber', 'blue', 'green', 'pink', 'violet'];
let saveT;
const saveView = () => { clearTimeout(saveT); saveT = setTimeout(() => persist(), 400); };

function render(root) {
  const wb = store.db.whiteboard;
  const v = wb.view;
  const world = h('div', { class: 'wb-world' });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'wb-links');
  world.append(svg);
  const canvas = h('div', { class: 'wb-canvas', tabindex: '0' }, h('div', { class: 'wb-grid' }), world);
  const zoomLabel = h('span', { class: 'mono small' });

  const apply = () => {
    world.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.z})`;
    canvas.style.setProperty('--gx', `${v.x}px`); canvas.style.setProperty('--gy', `${v.y}px`); canvas.style.setProperty('--gs', `${24 * v.z}px`);
    zoomLabel.textContent = `${Math.round(v.z * 100)}%`;
  };
  const toWorld = (cx, cy) => { const r = canvas.getBoundingClientRect(); return { x: (cx - r.left - v.x) / v.z, y: (cy - r.top - v.y) / v.z }; };

  const cardEls = new Map();
  for (const c of wb.cards) {
    const el = c.ref ? refCard(c) : noteCard(c);
    if (!el) continue;
    el.style.transform = `translate(${c.x}px, ${c.y}px)`;
    cardEls.set(c.id, el);
    world.append(el);
    // flytta kort
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button, textarea, [contenteditable="true"]')) return;
      e.stopPropagation();
      const start = { x: e.clientX, y: e.clientY, cx: c.x, cy: c.y };
      let moved = false;
      el.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const dx = (ev.clientX - start.x) / v.z, dy = (ev.clientY - start.y) / v.z;
        if (!moved && Math.hypot(dx, dy) < 3) return;
        moved = true; el.classList.add('moving');
        c.x = Math.round(start.cx + dx); c.y = Math.round(start.cy + dy);
        el.style.transform = `translate(${c.x}px, ${c.y}px)`;
        drawLinks();
      };
      const up = () => {
        el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up);
        el.classList.remove('moving');
        if (moved) { persist(); el._justMoved = true; setTimeout(() => (el._justMoved = false), 50); }
      };
      el.addEventListener('pointermove', move); el.addEventListener('pointerup', up);
    });
  }

  function drawLinks() {
    svg.replaceChildren();
    const refCards = wb.cards.filter((c) => c.ref && cardEls.has(c.id));
    const seen = new Set();
    for (const a of refCards) {
      const rel = related(a.ref);
      for (const b of refCards) {
        if (a === b) continue;
        const key = [a.id, b.id].sort().join('|');
        if (seen.has(key)) continue;
        const r = rel.find((x) => sameRef(x.ref, b.ref));
        if (!r) continue;
        seen.add(key);
        const ea = cardEls.get(a.id), eb = cardEls.get(b.id);
        const ax = a.x + ea.offsetWidth / 2, ay = a.y + ea.offsetHeight / 2, bx = b.x + eb.offsetWidth / 2, by = b.y + eb.offsetHeight / 2;
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const mx = (ax + bx) / 2;
        p.setAttribute('d', `M${ax},${ay} C${mx},${ay} ${mx},${by} ${bx},${by}`);
        p.setAttribute('class', r.relId ? 'rel' : 'rel structural');
        svg.append(p);
      }
    }
  }

  // panorera
  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.button !== 1) return;
    if (e.target.closest('.wb-card')) return;
    const s = { x: e.clientX, y: e.clientY, vx: v.x, vy: v.y };
    canvas.setPointerCapture(e.pointerId); canvas.classList.add('panning');
    const move = (ev) => { v.x = s.vx + ev.clientX - s.x; v.y = s.vy + ev.clientY - s.y; apply(); };
    const up = () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.classList.remove('panning'); saveView(); };
    canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up);
  });
  const zoomAt = (factor, cx, cy) => {
    const r = canvas.getBoundingClientRect();
    const px = cx ?? r.left + r.width / 2, py = cy ?? r.top + r.height / 2;
    const w = toWorld(px, py);
    v.z = Math.max(0.3, Math.min(2.2, v.z * factor));
    v.x = px - r.left - w.x * v.z; v.y = py - r.top - w.y * v.z;
    apply(); saveView();
  };
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) zoomAt(Math.exp(-e.deltaY * 0.0025), e.clientX, e.clientY);
    else { v.x -= e.deltaX; v.y -= e.deltaY; apply(); saveView(); }
  }, { passive: false });
  canvas.addEventListener('dblclick', (e) => {
    if (e.target.closest('.wb-card')) return;
    const p = toWorld(e.clientX, e.clientY);
    addNote(p.x - 110, p.y - 40);
  });
  canvas.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.wb-card')) return;
    e.preventDefault();
    const p = toWorld(e.clientX, e.clientY);
    contextMenu(e.clientX, e.clientY, [
      { label: 'Ny anteckning här', icon: 'note', action: () => addNote(p.x, p.y) },
      { label: 'Centrera innehåll', icon: 'target', action: fit },
      { label: 'Återställ zoom', icon: 'zoomOut', action: () => { v.z = 1; apply(); saveView(); } }
    ]);
  });

  dropTarget(canvas, {
    accept: (src) => !!src.ref && src.ref.t !== 'tool' && !wb.cards.some((c) => sameRef(c.ref, src.ref)),
    label: (src) => `Skapa referenskort för ${labelOf(src.ref)}`,
    onDrop: (src, e) => { const p = toWorld(e.clientX, e.clientY); addToWhiteboard(src.ref, { x: p.x - 120, y: p.y - 30 }); }
  });

  function addNote(x, y) {
    mutate('Anteckning på whiteboard', () => wb.cards.push({ id: uid('wb'), note: '', x: Math.round(x), y: Math.round(y), color: COLORS[wb.cards.length % COLORS.length], fresh: true }), { kind: 'whiteboard', silent: true });
  }

  function fit() {
    if (!wb.cards.length) return;
    const r = canvas.getBoundingClientRect();
    const xs = wb.cards.map((c) => c.x), ys = wb.cards.map((c) => c.y);
    const minX = Math.min(...xs), minY = Math.min(...ys), maxX = Math.max(...xs) + 260, maxY = Math.max(...ys) + 160;
    v.z = Math.max(0.3, Math.min(1.2, Math.min(r.width / (maxX - minX + 80), r.height / (maxY - minY + 80))));
    v.x = (r.width - (maxX - minX) * v.z) / 2 - minX * v.z; v.y = (r.height - (maxY - minY) * v.z) / 2 - minY * v.z;
    world.classList.add('animating'); apply(); setTimeout(() => world.classList.remove('animating'), 260); saveView();
  }

  const toolbar = h('div', { class: 'wb-toolbar' },
    h('button', { class: 'btn sm', onclick: () => { const r = canvas.getBoundingClientRect(); const p = toWorld(r.left + r.width / 2, r.top + r.height / 2); addNote(p.x - 110, p.y - 40); } }, icon('note', 14), 'Anteckning'),
    h('span', { class: 'sep' }),
    h('button', { class: 'iconbtn', title: 'Zooma ut', onclick: () => zoomAt(1 / 1.2) }, icon('zoomOut', 15)), zoomLabel,
    h('button', { class: 'iconbtn', title: 'Zooma in', onclick: () => zoomAt(1.2) }, icon('zoomIn', 15)),
    h('button', { class: 'iconbtn', title: 'Anpassa till innehåll (F)', onclick: fit }, icon('maximize', 15)),
    h('span', { class: 'sep' }),
    h('button', { class: 'iconbtn', title: 'Rensa whiteboarden', onclick: async () => {
      if (!wb.cards.length) return;
      if (await confirmDialog({ title: 'Rensa whiteboarden?', text: `Alla ${wb.cards.length} kort tas bort från whiteboarden. Själva informationen ligger kvar.`, okLabel: 'Rensa', danger: true })) {
        mutate('Whiteboard rensad', () => { wb.cards = []; }, { kind: 'whiteboard' });
        toast('Whiteboarden rensades', { action: { label: 'Ångra', fn: () => Promise.resolve().then(() => __r("js/store.js")).then((m) => m.undo()) } });
      }
    } }, icon('trash', 15)));

  root.replaceChildren(h('div', { class: 'view view-whiteboard' },
    h('div', { class: 'view-head compact' }, h('div', h('h1', 'Whiteboard'), h('p', { class: 'muted' }, 'Dra information hit från listor eller kontextpanelen. Dubbelklicka för en anteckning, dra i bakgrunden för att panorera, Ctrl + scroll för att zooma. Linjer visar kopplingar.')), toolbar),
    canvas,
    !wb.cards.length && h('div', { class: 'wb-empty' }, icon('board', 26), h('b', 'Tom whiteboard'), h('span', 'Dra ett arbetspaket, ett ärende eller en ritning hit.'))));
  apply();
  requestAnimationFrame(() => {
    drawLinks();
    const fresh = wb.cards.find((c) => c.fresh);
    if (fresh) { delete fresh.fresh; cardEls.get(fresh.id)?.querySelector('textarea')?.focus(); }
  });
  canvas._fit = fit;
}

function refCard(c) {
  const e = get(c.ref);
  if (!e) return null;
  const st = statusOf(c.ref, e);
  const el = h('div', { class: `wb-card ref ti-${c.ref.t}`, dataset: { ref: `${c.ref.t}:${c.ref.id}` } },
    h('div', { class: 'wb-card-top' }, h('span', { class: `type-tag ti-${c.ref.t}` }, typeIcon(c.ref.t, 12), TYPES[c.ref.t].label), h('span', { class: 'grow' }),
      h('button', { class: 'iconbtn xs', title: 'Ta bort från whiteboard', onclick: () => removeCard(c) }, icon('x', 12))),
    h('div', { class: 'wb-title' }, h('b', { class: 'mono' }, codeOf(c.ref, e)), ' ', titleOf(c.ref, e).replace(codeOf(c.ref, e), '').trim()),
    h('div', { class: 'wb-meta' }, st && badge(st), e.due && dueChip(e.due, ['done', 'resolved', 'closed'].includes(e.status)), c.ref.t === 'model' && h('span', { class: 'mono chip' }, `v${latestVersion(e)?.v}`), h('span', { class: 'grow' }), e.responsible && avatar(e.responsible, 18)));
  el.addEventListener('click', (ev) => { if (el._justMoved || ev.target.closest('button')) return; ev.shiftKey ? app.openFloat(c.ref) : app.select(c.ref); });
  el.addEventListener('dblclick', () => app.open(c.ref));
  el.addEventListener('contextmenu', (ev) => { ev.preventDefault(); contextMenu(ev.clientX, ev.clientY, [...entityMenu(c.ref).filter((x) => x.label !== 'Lägg på whiteboard'), { divider: true }, { label: 'Ta bort från whiteboard', icon: 'x', action: () => removeCard(c) }]); });
  if (sameRef(app.selection, c.ref)) el.classList.add('selected');
  return el;
}

function noteCard(c) {
  const ta = h('textarea', { class: 'wb-note-text', placeholder: 'Skriv…', rows: 3 });
  ta.value = c.note || '';
  const fit = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; };
  ta.addEventListener('input', () => { c.note = ta.value; fit(); persist(); });
  requestAnimationFrame(fit);
  const el = h('div', { class: `wb-card note c-${c.color || 'amber'}` },
    h('div', { class: 'wb-card-top' }, icon('grip', 14, 'grip'), h('span', { class: 'grow' }),
      h('button', { class: 'iconbtn xs', title: 'Byt färg', onclick: () => { c.color = COLORS[(COLORS.indexOf(c.color) + 1) % COLORS.length]; persist(); emit('change', { type: 'whiteboard' }); } }, h('i', { class: 'color-dot' })),
      h('button', { class: 'iconbtn xs', title: 'Ta bort', onclick: () => removeCard(c) }, icon('x', 12))),
    ta);
  return el;
}

function removeCard(c) {
  const wb = store.db.whiteboard;
  mutate('Kort borttaget från whiteboard', () => { wb.cards = wb.cards.filter((x) => x.id !== c.id); }, { kind: 'whiteboard', silent: true });
  toast('Kortet togs bort', { action: { label: 'Ångra', fn: () => Promise.resolve().then(() => __r("js/store.js")).then((m) => m.undo()) } });
}

function keys(e, root) {
  if (e.key === 'f' || e.key === 'F') { root.querySelector('.wb-canvas')?._fit?.(); return true; }
  return false;
}

};

__defs["js/main.js"] = function (exports, __r) {
Object.defineProperties(exports, {
  
});
const { store, init, on, get, all, TYPES, labelOf, codeOf, titleOf, refKey, parseKey, sameRef, undo, canUndo, resetToSeed, clearAll, persist, emit, parseDate, today, statusOf } = __r("js/store.js");
const { h, icon, typeIcon, toast, preserve, closeTopOverlay, hasOverlay, contextMenu, modal, confirmDialog, dropTarget, readDropped, kbd, $, $$, popover, skeleton } = __r("js/ui.js");
const { app, layout, saveLayout } = __r("js/app.js");
const { renderContext } = __r("js/context.js");
const { openPalette, pushRecent } = __r("js/palette.js");
const { onFilters, filters, activeCount, applyFilter, describe } = __r("js/filters.js");
const { createIssue, createAction, createDecision, createMeeting, editEntity, deleteEntity, addToWhiteboard, isFav, toggleFav, entityMenu } = __r("js/actions.js");
const overview = __r("js/views/overview.js");
const schedule = __r("js/views/schedule.js");
const packages = __r("js/views/packages.js");
const issues = __r("js/views/issues.js");
const actionsView = __r("js/views/actions.js");
const library = __r("js/views/library.js");
const whiteboard = __r("js/views/whiteboard.js");
const tools = __r("js/views/tools.js");
const { syncButton, initSync, runSync, manageSources } = __r("js/sync.js");

const VIEWS = { overview, schedule, packages, issues, actions: actionsView, library, whiteboard, tools };
const NAV = [
  { id: 'overview', label: 'Översikt', icon: 'home', key: 'o' },
  { id: 'schedule', label: 'Tidplan', icon: 'gantt', key: 's' },
  { id: 'packages', label: 'Arbetspaket', icon: 'box', key: 'p' },
  { id: 'issues', label: 'Ärenden', icon: 'alert', key: 'i', count: () => all('issue').filter((i) => ['open', 'inprogress'].includes(i.status)).length },
  { id: 'actions', label: 'Åtgärder', icon: 'kanban', key: 'a', count: () => all('action').filter((a) => a.status !== 'done').length, warn: () => all('action').some((a) => a.status !== 'done' && parseDate(a.due) < today()) },
  { id: 'library', label: 'Ritningar & modeller', icon: 'layers', key: 'r' },
  { id: 'whiteboard', label: 'Whiteboard', icon: 'board', key: 'w' }
];

const shell = {};

// ------------------------------------------------------------------ skal
function buildShell() {
  document.documentElement.dataset.theme = layout.theme;
  const root = $('#app');
  shell.nav = h('nav', { class: 'nav', 'aria-label': 'Huvudnavigering' });
  shell.view = h('main', { class: 'main', id: 'view', tabindex: '-1' });
  shell.ctx = h('aside', { class: 'ctxpanel', 'aria-label': 'Kontextpanel' });
  shell.crumbs = h('div', { class: 'crumbs' });
  shell.save = h('span', { class: 'savestate' });
  shell.floats = h('div', { class: 'floats' });
  const navResizer = h('div', { class: 'resizer r-nav', title: 'Dra för att ändra bredd' });
  const ctxResizer = h('div', { class: 'resizer r-ctx', title: 'Dra för att ändra bredd · dubbelklick återställer' });

  const top = h('header', { class: 'topbar' },
    h('button', { class: 'iconbtn', title: 'Visa/dölj navigering ([)', onclick: () => app.toggleNav() }, icon('sidebar', 17)),
    h('a', { class: 'brand', href: '#/overview' }, h('span', { class: 'brand-mark' }, h('i'), h('i'), h('i')), h('span', { class: 'brand-name' }, 'Project Control Hub')),
    shell.crumbs,
    h('span', { class: 'grow' }),
    h('button', { class: 'searchbtn', onclick: () => openPalette(), title: 'Sök och kommandon (Ctrl+K)' }, icon('search', 15), h('span', 'Sök eller kör kommando…'), kbd('Ctrl', 'K')),
    syncButton(),
    h('button', { class: 'btn sm primary create-btn', title: 'Skapa ny', onclick: (e) => createMenu(e.currentTarget) }, icon('plus', 14), 'Ny'),
    shell.save,
    h('button', { class: 'iconbtn', title: 'Tema', onclick: () => app.toggleTheme() }, icon(layout.theme === 'dark' ? 'sun' : 'moon', 17)),
    h('button', { class: 'iconbtn', title: 'Visa/dölj kontextpanel (])', onclick: () => app.toggleCtx() }, icon('panelR', 17)));

  root.replaceChildren(top, h('div', { class: 'workspace' }, shell.nav, navResizer, shell.view, ctxResizer, shell.ctx), shell.floats);
  applyLayout();
  resizer(navResizer, (dx, w0) => { layout.navW = Math.max(180, Math.min(360, w0 + dx)); applyLayout(); }, () => layout.navW, () => { layout.navW = 232; applyLayout(); });
  resizer(ctxResizer, (dx, w0) => { layout.ctxW = Math.max(300, Math.min(720, w0 - dx)); applyLayout(); }, () => layout.ctxW, () => { layout.ctxW = 380; applyLayout(); });
}

function resizer(el, onMove, getW, reset) {
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const x0 = e.clientX, w0 = getW();
    el.setPointerCapture(e.pointerId);
    document.body.classList.add('resizing');
    const move = (ev) => onMove(ev.clientX - x0, w0);
    const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); document.body.classList.remove('resizing'); saveLayout(); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', up);
  });
  el.addEventListener('dblclick', () => { reset(); saveLayout(); });
}

function applyLayout() {
  const ws = $('.workspace');
  ws.style.setProperty('--nav-w', (layout.nav ? layout.navW : 60) + 'px');
  ws.style.setProperty('--ctx-w', layout.ctxW + 'px');
  ws.classList.toggle('nav-rail', !layout.nav);
  ws.classList.toggle('ctx-hidden', !layout.ctx);
}

app.toggleNav = () => { layout.nav = !layout.nav; applyLayout(); saveLayout(); renderNav(); };
app.toggleCtx = () => { layout.ctx = !layout.ctx; applyLayout(); saveLayout(); };
app.toggleTheme = () => {
  layout.theme = layout.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = layout.theme;
  saveLayout(); buildTopIcons();
};
function buildTopIcons() { const b = $('.topbar .iconbtn[title="Tema"]'); if (b) b.replaceChildren(icon(layout.theme === 'dark' ? 'sun' : 'moon', 17)); }

function createMenu(anchor) {
  const r = anchor.getBoundingClientRect();
  const sel = app.selection && get(app.selection) ? app.selection : null;
  const pkgId = sel?.t === 'package' ? sel.id : get(sel || {})?.packageId;
  contextMenu(r.left, r.bottom + 6, [
    { header: sel ? `Kopplat till ${codeOf(sel) || titleOf(sel)}` : 'Skapa' },
    { label: 'Åtgärd', icon: 'check', kbd: 'N', action: () => createAction({ packageId: pkgId, linkTo: sel && sel.t !== 'package' ? sel : null }) },
    { label: 'Ärende', icon: 'alert', kbd: 'I', action: () => createIssue({ packageId: pkgId, linkTo: sel && sel.t !== 'package' ? sel : null }) },
    { label: 'Beslut', icon: 'gavel', action: () => createDecision({ packageId: pkgId, linkTo: sel }) },
    { label: 'Möte', icon: 'users', action: () => createMeeting({ packageId: pkgId, linkTo: sel }) },
    { divider: true },
    { label: 'Verktyg i My Tools', icon: 'tool', action: () => { app.navigate('#/tools'); tools.addToolDialog(); } }
  ]);
}

// ------------------------------------------------------------------ navigering
function renderNav() {
  const cur = app.route.view === 'package' ? 'packages' : app.route.view === 'tool' ? 'tools' : app.route.view;
  const item = (n) => {
    const c = n.count?.();
    const a = h('a', { class: `nav-item ${cur === n.id ? 'on' : ''}`, href: `#/${n.id}`, title: `${n.label}${n.key ? ` (G ${n.key.toUpperCase()})` : ''}` },
      icon(n.icon, 17), h('span', { class: 'nav-label' }, n.label), c ? h('em', { class: n.warn?.() ? 'warn' : '' }, c) : null);
    if (n.id === 'whiteboard') dropTarget(a, { accept: (s) => s.ref && s.ref.t !== 'tool', label: (s) => `Lägg ${codeOf(s.ref) || titleOf(s.ref)} på whiteboard`, onDrop: (s) => addToWhiteboard(s.ref) });
    return a;
  };
  const favs = (store.db.favourites || []).map(parseKey).filter((r) => get(r)).slice(0, 8);
  const favTools = store.db.tools.filter((t) => t.favourite).slice(0, 6);
  const saved = store.db.savedFilters.filter((s) => s.fav);
  const toolsItem = h('a', { class: `nav-item ${cur === 'tools' ? 'on' : ''}`, href: '#/tools', title: 'My Tools (G T)' }, icon('tool', 17), h('span', { class: 'nav-label' }, 'My Tools'), h('em', store.db.tools.length));
  dropTarget(toolsItem, { accept: (s) => !!s.files, label: () => 'Lägg till som verktyg', onDrop: async (s) => { const f = await readDropped(s); app.navigate('#/tools'); tools.addToolDialog(f); } });

  const p = store.db.project;
  preserve(shell.nav, () => shell.nav.replaceChildren(
    h('div', { class: 'nav-project' }, h('span', { class: 'proj-badge' }, p.name.slice(0, 3)), h('div', { class: 'nav-label' }, h('b', p.name), h('small', store.db.demo ? 'Exempeldata' : p.phase || ''))),
    h('div', { class: 'nav-sec', dataset: { skey: 'nav' } },
      h('div', { class: 'nav-head' }, 'Projekt'), NAV.map(item),
      h('div', { class: 'nav-head' }, 'Verktyg'), toolsItem,
      favTools.map((t) => h('a', { class: `nav-item sub ${app.route.view === 'tool' && app.route.params[0] === t.id ? 'on' : ''}`, href: `#/tool/${encodeURIComponent(t.id)}`, title: t.name }, h('span', { class: 'nav-glyph' }, t.icon || t.name[0]), h('span', { class: 'nav-label' }, t.name))),
      favs.length ? [h('div', { class: 'nav-head' }, 'Favoriter'), favs.map((r) => {
        const a = h('a', { class: `nav-item sub ${sameRef(app.selection, r) ? 'on' : ''}`, href: '#', title: labelOf(r), onclick: (e) => { e.preventDefault(); r.t === 'package' ? app.open(r) : app.select(r, { reveal: true }); } },
          typeIcon(r.t, 14), h('span', { class: 'nav-label' }, h('b', { class: 'mono' }, codeOf(r)), ' ', titleOf(r).replace(codeOf(r), '').trim()));
        a.addEventListener('contextmenu', (e) => { e.preventDefault(); contextMenu(e.clientX, e.clientY, entityMenu(r)); });
        return a;
      })] : null,
      saved.length ? [h('div', { class: 'nav-head' }, 'Sparade filter'), saved.map((s) => h('a', { class: 'nav-item sub', href: '#', title: describe(s.filter), onclick: (e) => { e.preventDefault(); applyFilter(s.filter); toast(`Filter: ${s.name}`, { iconName: 'filter' }); } }, icon('filter', 14), h('span', { class: 'nav-label' }, s.name)))] : null),
    h('div', { class: 'nav-foot' },
      h('button', { class: `mode-pill ${store.mode}`, onclick: () => app.settings(), title: 'Inställningar och data' },
        h('i'), h('span', { class: 'nav-label' }, store.mode === 'server' ? 'Lokal server' : 'Demoläge'), icon('server', 14)),
      h('button', { class: 'iconbtn', title: 'Kortkommandon (?)', onclick: () => app.shortcuts() }, icon('keyboard', 16)))));
}

// ------------------------------------------------------------------ routing
function parseRoute() {
  const parts = (location.hash.replace(/^#\/?/, '') || 'overview').split('/').map(decodeURIComponent);
  return { view: parts[0], params: parts.slice(1) };
}

let lastView = null;
function onRoute() {
  const r = parseRoute();
  if (r.view === 'item') {
    const ref = { t: r.params[0], id: r.params[1] };
    history.replaceState(null, '', '#/overview');
    app.route = { view: 'overview', params: [] };
    render();
    if (get(ref)) app.open(ref);
    return;
  }
  const prev = app.route;
  app.route = r;
  // Byte av flik inom samma arbetspaket: rendera bara flikinnehållet
  if (prev.view === 'package' && r.view === 'package' && prev.params[0] === r.params[0] && lastView === 'package') {
    packages.switchTab(shell.view, r.params[0], r.params[1] || 'overview');
    renderCrumbs();
    return;
  }
  render({ animate: true });
}

let renderQueued = false;
app.render = () => {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => { renderQueued = false; render(); });
};

function render({ animate = false } = {}) {
  const r = app.route;
  const el = shell.view;
  const key = `${r.view}/${r.params.join('/')}`;
  const changedView = lastView !== key;
  preserve(el, () => {
    if (r.view === 'package') packages.renderPackage(el, r.params[0], r.params[1] || 'overview');
    else if (r.view === 'tool') {
      if (changedView) tools.renderWorkspace(el, r.params[0]); else tools.updateWorkspace();
    } else if (r.view === 'library') library.render(el, { tab: r.params[0] });
    else (VIEWS[r.view] || overview).render(el);
  });
  if (animate && changedView) { el.classList.remove('view-enter'); void el.offsetWidth; el.classList.add('view-enter'); el.scrollTop = 0; }
  lastView = key;
  document.body.dataset.view = r.view;
  renderNav();
  renderCrumbs();
  markSelection();
}

function renderCrumbs() {
  const r = app.route;
  const p = store.db.project;
  const c = [h('a', { href: '#/overview' }, p.name)];
  const sep = () => h('span', { class: 'sep' }, icon('chevR', 12));
  if (r.view === 'package') {
    const pk = get({ t: 'package', id: r.params[0] });
    const ar = pk && get({ t: 'area', id: pk.areaId });
    c.push(sep(), h('a', { href: '#/packages' }, 'Arbetspaket'));
    if (ar) c.push(sep(), h('a', { href: '#', onclick: (e) => { e.preventDefault(); applyFilter({ area: [ar.id] }); app.navigate('#/packages'); } }, `Område ${ar.code}`));
    if (pk) c.push(sep(), h('b', pk.name));
  } else if (r.view === 'tool') {
    const t = store.db.tools.find((x) => x.id === r.params[0]);
    c.push(sep(), h('a', { href: '#/tools' }, 'My Tools'), sep(), h('b', t?.name || 'Verktyg'));
  } else {
    const v = NAV.find((n) => n.id === r.view) || (r.view === 'tools' ? { label: 'My Tools' } : NAV[0]);
    c.push(sep(), h('b', v.label));
  }
  const n = activeCount();
  if (n && !['tool', 'tools', 'whiteboard'].includes(r.view)) c.push(h('button', { class: 'crumb-filter', title: describe(filters.cur), onclick: () => Promise.resolve().then(() => __r("js/filters.js")).then((m) => m.clearFilters()) }, icon('filter', 12), `${n} filter`, icon('x', 11)));
  shell.crumbs.replaceChildren(...c);
}

// ------------------------------------------------------------------ urval & kontext
app.select = (ref, opts = {}) => {
  if (ref && layout.pinned && !sameRef(ref, parseKey(layout.pinned)) && !opts.force) { app.openFloat(ref); return; }
  app.selection = ref;
  if (ref) pushRecent(ref);
  if (ref && (opts.reveal || !layout.ctx) && innerWidth > 900) { if (!layout.ctx) { layout.ctx = true; applyLayout(); saveLayout(); } }
  renderCtx(opts);
  markSelection();
  if (ref && innerWidth <= 900) shell.ctx.classList.add('mobile-open');
};

app.open = (ref) => {
  const e = get(ref);
  if (!e) return;
  pushRecent(ref);
  const pk = e.packageId;
  const go = (hash) => { if (location.hash !== hash) app.navigate(hash); };
  switch (ref.t) {
    case 'package': go(`#/package/${ref.id}/overview`); app.select(ref, { force: true }); return;
    case 'tool': go(`#/tool/${encodeURIComponent(ref.id)}`); return;
    case 'area': applyFilter({ area: [ref.id] }); go('#/packages'); app.select(ref, { force: true }); return;
    case 'activity': go(pk ? `#/package/${pk}/schedule` : '#/schedule'); break;
    case 'issue': go(pk ? `#/package/${pk}/issues` : '#/issues'); break;
    case 'action': go(pk ? `#/package/${pk}/actions` : '#/actions'); break;
    case 'decision': if (pk) go(`#/package/${pk}/decisions`); break;
    case 'meeting': if (pk) go(`#/package/${pk}/meetings`); break;
    case 'document': if (pk) go(`#/package/${pk}/${e.kind === 'email' ? 'emails' : e.kind === 'photo' ? 'photos' : 'documents'}`); break;
    case 'drawing': go('#/library/drawings'); break;
    case 'model': go('#/library/models'); break;
  }
  app.select(ref, { reveal: true, force: true });
};

function markSelection() {
  const k = app.selection ? refKey(app.selection) : null;
  $$('.selected[data-ref]').forEach((e) => { if (e.dataset.ref !== k) e.classList.remove('selected'); });
  if (k) $$(`[data-ref="${CSS.escape(k)}"]`).forEach((e) => { if (!e.closest('.ctxpanel, .float')) e.classList.add('selected'); });
}

function renderCtx(opts = {}) {
  const ref = layout.pinned ? parseKey(layout.pinned) : app.selection;
  const pinned = !!layout.pinned;
  const head = h('div', { class: 'ctxpanel-head' },
    h('span', { class: 'ctxpanel-title' }, pinned ? h('span', { class: 'pin-ind' }, icon('pin', 12), 'Fäst') : 'Kontext'),
    h('span', { class: 'grow' }),
    ref && h('button', { class: `iconbtn sm ${pinned ? 'on' : ''}`, title: pinned ? 'Lossa – nya val visas här igen' : 'Fäst – nya val öppnas i flytande fönster', onclick: () => { layout.pinned = pinned ? null : refKey(ref); saveLayout(); renderCtx(); toast(pinned ? 'Kontextpanelen lossad' : 'Kontextpanelen fäst. Nya val öppnas i flytande fönster.', { iconName: 'pin' }); } }, icon('pin', 14)),
    ref && h('button', { class: 'iconbtn sm', title: 'Öppna i flytande fönster', onclick: () => app.openFloat(ref) }, icon('window', 14)),
    h('button', { class: 'iconbtn sm', title: 'Stäng panelen (])', onclick: () => { if (innerWidth <= 900) shell.ctx.classList.remove('mobile-open'); else app.toggleCtx(); } }, icon('x', 14)));
  const content = ref && get(ref) ? renderContext(ref, { focus: opts.tab }) : ctxEmpty();
  preserve(shell.ctx, () => shell.ctx.replaceChildren(head, content));
  if (opts.tab || opts.animate !== false) { content.classList?.add('ctx-enter'); }
}

function ctxEmpty() {
  return h('div', { class: 'ctx-empty' },
    h('div', { class: 'ctx-empty-art' }, icon('target', 26)),
    h('b', 'Inget valt'),
    h('p', 'Klicka på ett paket, en aktivitet, en ritning eller ett ärende för att se detaljer och kopplingar här.'),
    h('ul', { class: 'tips' },
      h('li', kbd('Ctrl', 'K'), ' sök överallt'),
      h('li', kbd('⇧', 'Klick'), ' öppna i flytande fönster'),
      h('li', kbd('Högerklick'), ' snabbval'),
      h('li', kbd('J'), kbd('K'), ' bläddra i listor'),
      h('li', 'Dra information mellan listor för att koppla')));
}

// ------------------------------------------------------------------ flytande fönster
app.openFloat = (ref) => {
  const k = refKey(ref);
  const existing = layout.floats.find((f) => f.key === k);
  if (existing) { existing.min = false; existing.z = Date.now(); }
  else {
    const n = layout.floats.length;
    layout.floats.push({ key: k, x: Math.max(80, innerWidth - layout.ctxW - 420 - n * 28), y: Math.max(70, innerHeight - 520 + n * 28), w: 400, h: 460, z: Date.now() });
    if (layout.floats.length > 5) layout.floats.shift();
  }
  saveLayout(); renderFloats(k);
};

function renderFloats(focusKey) {
  layout.floats = layout.floats.filter((f) => get(parseKey(f.key)));
  const els = layout.floats.map((f) => {
    const ref = parseKey(f.key);
    const el = h('div', { class: `float ${f.min ? 'min' : ''} ${f.key === focusKey ? 'float-enter' : ''}`, style: { left: f.x + 'px', top: f.y + 'px', width: f.w + 'px', height: f.min ? '' : f.h + 'px', zIndex: 40 + (layout.floats.indexOf(f)) }, dataset: { fkey: 'float-' + f.key } },
      h('div', { class: 'float-head' },
        typeIcon(ref.t, 13), h('b', { class: 'mono' }, codeOf(ref)), h('span', { class: 'float-title' }, titleOf(ref).replace(codeOf(ref), '').trim()),
        h('span', { class: 'grow' }),
        h('button', { class: 'iconbtn xs', title: 'Visa i kontextpanelen', onclick: () => { closeFloat(f); layout.pinned = null; app.select(ref, { reveal: true, force: true }); } }, icon('panelR', 13)),
        h('button', { class: 'iconbtn xs', title: f.min ? 'Expandera' : 'Minimera', onclick: () => { f.min = !f.min; saveLayout(); renderFloats(); } }, icon(f.min ? 'chevU' : 'minus', 13)),
        h('button', { class: 'iconbtn xs', title: 'Stäng', onclick: () => closeFloat(f) }, icon('x', 13))),
      !f.min && h('div', { class: 'float-body' }, renderContext(ref, { float: true })));
    // flytta
    const head = el.querySelector('.float-head');
    head.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      const s = { x: e.clientX, y: e.clientY, fx: f.x, fy: f.y };
      head.setPointerCapture(e.pointerId);
      layout.floats.push(layout.floats.splice(layout.floats.indexOf(f), 1)[0]);
      $$('.float', shell.floats).forEach((x, i) => (x.style.zIndex = 40 + i));
      el.style.zIndex = 60;
      const move = (ev) => { f.x = Math.max(0, Math.min(innerWidth - 120, s.fx + ev.clientX - s.x)); f.y = Math.max(48, Math.min(innerHeight - 40, s.fy + ev.clientY - s.y)); el.style.left = f.x + 'px'; el.style.top = f.y + 'px'; };
      const up = () => { head.removeEventListener('pointermove', move); head.removeEventListener('pointerup', up); saveLayout(); };
      head.addEventListener('pointermove', move); head.addEventListener('pointerup', up);
    });
    head.addEventListener('dblclick', () => { f.min = !f.min; saveLayout(); renderFloats(); });
    // storlek (CSS resize) – spara
    new ResizeObserver(() => { if (!f.min && el.offsetWidth > 100) { f.w = el.offsetWidth; f.h = el.offsetHeight; saveLayoutSoon(); } }).observe(el);
    return el;
  });
  preserve(shell.floats, () => shell.floats.replaceChildren(...els));
}
let slT; const saveLayoutSoon = () => { clearTimeout(slT); slT = setTimeout(saveLayout, 300); };
function closeFloat(f) { layout.floats = layout.floats.filter((x) => x !== f); saveLayout(); renderFloats(); }

// ------------------------------------------------------------------ tangentbord
let gPending = 0;
function typing(e) { const t = e.target; return t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName); }

function onKey(e) {
  const mod = e.ctrlKey || e.metaKey;
  if (mod && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); openPalette(); return; }
  if (mod && e.key === 'z' && !typing(e)) { e.preventDefault(); const l = undo(); if (l) toast(`Ångrade: ${l}`); return; }
  if (e.key === 'Escape') {
    if (closeTopOverlay()) { e.preventDefault(); return; }
    if (typing(e)) { e.target.blur(); return; }
    if (shell.ctx.classList.contains('mobile-open')) { shell.ctx.classList.remove('mobile-open'); return; }
    if (app.selection) { app.selection = null; renderCtx(); markSelection(); }
    return;
  }
  if (typing(e) || hasOverlay() || mod || e.altKey && e.key !== 'ArrowLeft') {
    if (e.altKey && e.key === 'ArrowLeft' && !typing(e)) { history.back(); e.preventDefault(); }
    return;
  }
  const k = e.key;
  if (Date.now() - gPending < 900) {
    gPending = 0;
    const map = { o: 'overview', s: 'schedule', p: 'packages', i: 'issues', a: 'actions', r: 'library', w: 'whiteboard', t: 'tools' };
    if (map[k.toLowerCase()]) { app.navigate(`#/${map[k.toLowerCase()]}`); e.preventDefault(); }
    return;
  }
  // vy-specifika tangenter först
  const v = app.route.view;
  if (v === 'schedule' && schedule.keys(e)) { e.preventDefault(); return; }
  if (v === 'whiteboard' && whiteboard.keys(e, shell.view)) { e.preventDefault(); return; }
  if (v === 'tool' && tools.workspaceKeys(e)) { e.preventDefault(); return; }
  if (v === 'package' && /^[1-9]$/.test(k)) {
    const tabs = $$('.tabs .tab', shell.view); const t = tabs[+k - 1];
    if (t) { location.hash = t.getAttribute('href'); e.preventDefault(); }
    return;
  }
  switch (k) {
    case 'g': case 'G': gPending = Date.now(); break;
    case '/': e.preventDefault(); openPalette(); break;
    case '?': app.shortcuts(); break;
    case 'u': case 'U': e.preventDefault(); runSync(); break;
    case '[': app.toggleNav(); break;
    case ']': app.toggleCtx(); break;
    case 'n': case 'N': e.preventDefault(); createAction(selDefaults()); break;
    case 'i': case 'I': e.preventDefault(); createIssue(selDefaults()); break;
    case 'e': case 'E': if (app.selection) { e.preventDefault(); editEntity(app.selection); } break;
    case 'w': case 'W': if (app.selection) addToWhiteboard(app.selection); break;
    case 's': case 'S': if (app.selection) toggleFav(app.selection); break;
    case 'Delete': case 'Backspace': if (app.selection) { e.preventDefault(); deleteEntity(app.selection); } break;
    case 'Enter': if (app.selection) { const f = document.activeElement; if (!f?.closest('button, a')) { e.preventDefault(); app.open(app.selection); } } break;
    case 'j': case 'ArrowDown': moveSel(1, e); break;
    case 'k': case 'ArrowUp': moveSel(-1, e); break;
  }
}
function selDefaults() {
  const s = app.selection; const e = s && get(s);
  if (!e) return { packageId: app.route.view === 'package' ? app.route.params[0] : undefined };
  return { packageId: s.t === 'package' ? e.id : e.packageId, linkTo: s.t !== 'package' ? s : null };
}
function moveSel(dir, e) {
  const rows = $$('[data-nav][data-ref]', shell.view).filter((r) => r.offsetParent);
  if (!rows.length) return;
  e.preventDefault();
  const k = app.selection ? refKey(app.selection) : null;
  let i = rows.findIndex((r) => r.dataset.ref === k);
  i = i < 0 ? (dir > 0 ? 0 : rows.length - 1) : Math.max(0, Math.min(rows.length - 1, i + dir));
  const row = rows[i];
  row.focus({ preventScroll: true });
  row.scrollIntoView({ block: 'nearest' });
  app.select(parseKey(row.dataset.ref));
}

app.shortcuts = () => {
  const g = (title, rows) => h('div', { class: 'sc-group' }, h('h4', title), rows.map(([keys, label]) => h('div', { class: 'sc-row' }, h('span', label), kbd(...keys))));
  modal({
    title: 'Kortkommandon', width: 720, cls: 'modal-shortcuts',
    body: h('div', { class: 'sc-grid' },
      g('Allmänt', [[['Ctrl', 'K'], 'Sök och kommandon'], [['/'], 'Sök'], [['?'], 'Den här listan'], [['Esc'], 'Stäng / avmarkera'], [['Ctrl', 'Z'], 'Ångra senaste'], [['U'], 'Hämta uppdateringar'], [['['], 'Navigering'], [[']'], 'Kontextpanel'], [['Alt', '←'], 'Tillbaka']]),
      g('Gå till', [[['G', 'O'], 'Översikt'], [['G', 'S'], 'Tidplan'], [['G', 'P'], 'Arbetspaket'], [['G', 'I'], 'Ärenden'], [['G', 'A'], 'Åtgärder'], [['G', 'R'], 'Ritningar & modeller'], [['G', 'W'], 'Whiteboard'], [['G', 'T'], 'My Tools']]),
      g('Markerat objekt', [[['J'], 'Nästa i listan'], [['K'], 'Föregående'], [['↵'], 'Öppna'], [['E'], 'Redigera'], [['S'], 'Favorit'], [['W'], 'Till whiteboard'], [['Del'], 'Ta bort'], [['⇧', 'Klick'], 'Flytande fönster']]),
      g('Skapa & vyer', [[['N'], 'Ny åtgärd'], [['I'], 'Nytt ärende'], [['1–9'], 'Flikar i arbetspaket'], [['←', '→'], 'Tidplan: bläddra'], [['T'], 'Tidplan: idag'], [['F'], 'Whiteboard: anpassa'], [['R'], 'Verktyg: ladda om'], [['I'], 'Verktyg: info']]))
  });
};

app.settings = () => {
  const s = store.server;
  const fileIn = h('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const db = JSON.parse(await f.text());
      if (!db.version) throw new Error('Filen ser inte ut som en Project Control Hub-export');
      if (!(await confirmDialog({ title: 'Importera data?', text: `All nuvarande data ersätts med innehållet i ${f.name}. Du kan ångra direkt efteråt.`, okLabel: 'Importera', danger: true }))) return;
      Promise.resolve().then(() => __r("js/store.js")).then((m) => m.mutate('Data importerad', () => { m.store.db = db; }, { kind: 'reset' }));
      toast('Data importerad', { tone: 'ok' });
    } catch (err) { toast(err.message, { tone: 'bad' }); }
  } });
  const m = modal({
    title: 'Inställningar och data', width: 600,
    body: h('div', { class: 'settings' },
      h('div', { class: `mode-card ${store.mode}` }, icon('server', 20), h('div',
        h('b', store.mode === 'server' ? 'Lokal server körs' : 'Demoläge i webbläsaren'),
        h('p', { class: 'muted small' }, store.mode === 'server'
          ? `Data sparas i ${s.paths.data}/db.json. Verktyg ligger i ${s.paths.tools}/ och körs från ${s.toolOrigin}. Tool API: ${s.toolApi ? 'på (läsning)' : 'av'}.`
          : 'Data sparas bara i den här webbläsaren. Starta start.bat för riktig databas, bilagor på disk och verktyg i mappar.'))),
      h('div', { class: 'set-row' }, h('div', h('b', 'Datakällor'), h('small', 'SharePoint (synkad mapp), mappar, Powerproject-tidplan och skript som NSV Binder.')),
        h('button', { class: 'btn sm', onclick: () => { m.close(); manageSources(); } }, icon('server', 13), 'Hantera…')),
      h('div', { class: 'set-row' }, h('div', h('b', 'Tema'), h('small', 'Mörkt passar kontrollrumskänslan, ljust för utskrift och dagsljus.')),
        h('div', { class: 'seg' }, ['dark', 'light'].map((t) => h('button', { class: layout.theme === t ? 'on' : '', onclick: (e) => { if (layout.theme !== t) app.toggleTheme(); e.currentTarget.parentNode.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === e.currentTarget)); } }, t === 'dark' ? 'Mörkt' : 'Ljust')))),
      h('div', { class: 'set-row' }, h('div', h('b', 'Arbetsyta'), h('small', 'Panelbredder, flytande fönster och fästning sparas lokalt.')),
        h('button', { class: 'btn sm', onclick: () => { localStorage.removeItem('pch.layout.v1'); location.reload(); } }, 'Återställ layout')),
      h('div', { class: 'set-row' }, h('div', h('b', 'Exportera'), h('small', 'Hela databasen som JSON (utan bilagornas filer).')),
        h('button', { class: 'btn sm', onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(store.db, null, 2)], { type: 'application/json' })), download: `project-control-hub-${new Date().toISOString().slice(0, 10)}.json` }); a.click(); } }, icon('save', 13), 'Exportera')),
      h('div', { class: 'set-row' }, h('div', h('b', 'Importera'), h('small', 'Ersätt data med en tidigare export.')), h('button', { class: 'btn sm', onclick: () => fileIn.click() }, icon('upload', 13), 'Importera…'), fileIn),
      h('div', { class: 'set-row' }, h('div', h('b', 'Exempeldata'), h('small', store.db.demo ? 'Du tittar på exempeldata för NSV.' : 'Läs in exempelprojektet igen.')),
        h('button', { class: 'btn sm', onclick: async () => { if (await confirmDialog({ title: 'Återställ exempeldata?', text: 'All projektdata ersätts med exempeldatan.', okLabel: 'Återställ', danger: true })) { resetToSeed(); m.close(); toast('Exempeldata återställd', { action: { label: 'Ångra', fn: () => undo() } }); } } }, 'Återställ')),
      h('div', { class: 'set-row danger' }, h('div', h('b', 'Börja från noll'), h('small', 'Tömmer all projektdata. Dina verktyg i My Tools behålls.')),
        h('button', { class: 'btn sm danger', onclick: async () => { if (await confirmDialog({ title: 'Töm all projektdata?', text: 'Alla områden, paket, aktiviteter, ritningar, ärenden m.m. tas bort. Du kan ångra direkt efteråt.', okLabel: 'Töm', danger: true })) { clearAll(); store.db.demo = false; persist(); m.close(); toast('All projektdata tömd', { action: { label: 'Ångra', fn: () => undo() } }); } } }, 'Töm data')))
  });
};

function renderSave(state) {
  shell.save.className = `savestate s-${state}`;
  shell.save.title = { saved: store.mode === 'server' ? 'Sparat i data/db.json' : 'Sparat i webbläsaren', saving: 'Sparar…', error: 'Kunde inte spara!' }[state];
  shell.save.replaceChildren(h('i'), h('span', { saved: 'Sparat', saving: 'Sparar…', error: 'Fel vid sparning' }[state]));
}

// ------------------------------------------------------------------ start
async function start() {
  $('#app').replaceChildren(h('div', { class: 'boot' }, h('span', { class: 'brand-mark big' }, h('i'), h('i'), h('i')), skeleton(4)));
  const { fresh } = await init();
  buildShell();
  renderSave(store.saveState);
  on('save', renderSave);
  on('change', () => { app.render(); renderCtxSoon(); renderFloatsSoon(); });
  onFilters(() => app.render());
  addEventListener('hashchange', onRoute);
  addEventListener('keydown', onKey);
  // stäng popovers vid scroll i huvudytan
  shell.view.addEventListener('scroll', () => { if ($('.popover.open:not(.pop-menu)')) {} }, { passive: true });
  onRoute();
  initSync();
  renderCtx();
  renderFloats();
  if (fresh) setTimeout(() => toast(store.mode === 'server' ? 'Välkommen! Exempeldata för NSV är inläst. Ctrl+K för att söka.' : 'Demoläge: data sparas i webbläsaren. Starta start.bat för full funktion.', { timeout: 7000, iconName: 'sparkle' }), 400);
}
let cT, fT;
function renderCtxSoon() { cancelAnimationFrame(cT); cT = requestAnimationFrame(() => renderCtx({ animate: false })); }
function renderFloatsSoon() { cancelAnimationFrame(fT); fT = requestAnimationFrame(() => renderFloats()); }

start().catch((e) => {
  console.error(e);
  $('#app').replaceChildren(h('div', { class: 'boot-error' }, h('b', 'Appen kunde inte starta'), h('pre', String(e.stack || e))));
});

};
__r("js/main.js");
})();
