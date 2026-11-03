import { translationPairs } from './translations.js'
const english = new Map(translationPairs)
const reverse = new Map()
for (const [en,id] of translationPairs) if (!reverse.has(id)) reverse.set(id,en)
const aliases = {
  digital:'Digital', traditional:'Traditional', realistic:'Realistic', 'semi-realistic':'Semi Realistic', anime:'Anime', headshot:'Headshot', bust:'Bust Up', half:'Half Body', full:'Full Body', grayscale:'Digital Grayscale', pencil:'Pencil Shading', color:'Full Color', artist:'Artist Choice', reference:'Reference Pose', custom:'Custom Pose', none:'No Background', simple:'Simple Background', detailed:'Detailed Background', portrait:'Portrait', landscape:'Landscape', body:'Body Coverage', finish:'Finish', persons:'Persons', pose:'Pose', background:'Background', paper:'Paper Size', orientation:'Orientation', medium:'Medium', style:'Style', ratio:'Canvas Ratio', available:'Available', sold:'Sold', portfolio:'Portfolio', shop:'Shop', all:'All', bank:'Bank Transfer', ewallet:'E-Wallet', qris:'QRIS',
  'waiting-approval':'Waiting for Approval', 'waiting-payment':'Waiting for Payment', 'waiting-verification':'Waiting for Verification', paid:'Paid', processing:'Processing', 'ready-to-deliver':'Ready to Deliver', 'ready-to-ship':'Ready to Ship', shipped:'Shipped', delivered:'Delivered', completed:'Completed', cancelled:'Cancelled', rejected:'Rejected', new:'New', accepted:'Accepted', 'in-progress':'In Progress',
  '1 orang':'1 Person','2 orang':'2 Persons','3 orang':'3 Persons','1 person':'1 Person','2 persons':'2 Persons','3 persons':'3 Persons', 'semi realistic':'Semi Realistic',
}
export function translate(value,language='en') {
  if (typeof value !== 'string' || !value.trim()) return value
  const source=value.trim()
  const canonical=aliases[source] || (english.has(source)?source:reverse.get(source))
  let result
  if(canonical) result=language==='id'?(english.get(canonical)||canonical):canonical
  else if(/^Maximum image size is \d+ MB\.$/.test(source)) result=language==='id'?source.replace(/^Maximum image size is /,'Ukuran gambar maksimal '):source
  else if(/^Preview /.test(source)) result=`${language==='id'?'Pratinjau':'Preview'} ${translate(source.slice(8),language)}`
  else if(source.endsWith('.') && (english.has(source.slice(0,-1)) || aliases[source.slice(0,-1)])) result=translate(source.slice(0,-1),language)+'.'
  else if(source.includes(' · ')) result=source.split(' · ').map(part=>translate(part,language)).join(' · ')
  else result=source
  return value.slice(0,value.indexOf(source))+result+value.slice(value.indexOf(source)+source.length)
}
