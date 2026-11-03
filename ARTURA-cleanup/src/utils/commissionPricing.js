import {
  styleOptions, bodyOptions, digitalFinishOptions, traditionalFinishOptions,
  personOptions, poseOptions, backgroundOptions, paperOptions, ratioOptions, orientationOptions,
} from '../data/commissionOptions.js'
import { defaultPricing } from '../data/defaults.js'
import { getRatioError } from './commissionValidation.js'

export function getCommissionQuote(options, pricing = defaultPricing) {
  const { mediaType, artStyle, bodyCoverage, renderType, personCount, poseType, backgroundType, paperSize, orientation, ratio } = options
  const basePrice = Number(pricing.basePrices?.[mediaType]?.[artStyle])
  const style = styleOptions.find((item) => item.value === artStyle)
  if (!Number.isFinite(basePrice) || !style) return { total: null, items: [], error: 'Select an available medium and style.' }

  const finishOptions = mediaType === 'digital' ? digitalFinishOptions : traditionalFinishOptions
  const choiceFields = [
    ['body', bodyOptions, bodyCoverage, pricing.modifiers?.body?.[bodyCoverage]],
    ['finish', finishOptions, renderType, pricing.modifiers?.finish?.[renderType]],
    ['persons', personOptions, personCount, pricing.modifiers?.persons?.[personCount]],
    ['pose', poseOptions, poseType, pricing.modifiers?.pose?.[poseType]],
    ['background', backgroundOptions, backgroundType, pricing.modifiers?.background?.[backgroundType]],
  ]

  if (mediaType === 'traditional') {
    choiceFields.push(['paper', paperOptions, paperSize, pricing.modifiers?.paper?.[paperSize]])
    if (!orientationOptions.some((item) => item.value === orientation)) return { total: null, items: [], error: 'Select a paper orientation.' }
  } else {
    if (!ratioOptions.some((item) => item.value === ratio)) return { total: null, items: [], error: 'Select an available ratio.' }
    const ratioError = getRatioError(options)
    if (ratioError) return { total: null, items: [], error: ratioError }
  }

  const items = [{ key: 'base', label: `${mediaType === 'digital' ? 'Digital' : 'Traditional'} · ${style.label}`, amount: basePrice }]
  for (const [key, choices, value, configuredCost] of choiceFields) {
    const choice = choices.find((item) => String(item.value) === String(value))
    const amount = Number(configuredCost)
    if (!choice || !Number.isFinite(amount)) return { total: null, items: [], error: 'Complete the available customization options.' }
    items.push({ key, label: choice.label, amount })
  }
  return { items, total: items.reduce((total, item) => total + item.amount, 0), error: '' }
}
