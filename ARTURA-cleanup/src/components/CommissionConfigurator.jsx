import { useLanguage } from '../i18n/useLanguage.js'
import { useState } from 'react'
import {
  mediaOptions, styleOptions, bodyOptions, digitalFinishOptions, traditionalFinishOptions,
  personOptions, poseOptions, backgroundOptions, ratioOptions, paperOptions, orientationOptions,
} from '../data/commissionOptions.js'
import { courierOptions } from '../data/deliveryOptions.js'
import { getRatioError } from '../utils/commissionValidation.js'
import { getCommissionQuote } from '../utils/commissionPricing.js'
import { readImageFile } from '../utils/filePreview.js'
import formatRupiah from '../utils/formatRupiah.js'
import useArturaData from '../hooks/useArturaData.js'
import Button from './Button.jsx'
import UploadImageField from './UploadImageField.jsx'

function ChoiceField({ id, label, value, onChange, options }) {
  const { t } = useLanguage()

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-stone-800">{t(label)}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm transition focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{t(option.label)}</option>)}
      </select>
    </div>
  )
}

function labelOf(options, value) {
  return options.find((item) => String(item.value) === String(value))?.label || '-'
}

export default function CommissionConfigurator({ service }) {
  const { t } = useLanguage()

  const { pricing, artist, createCommission } = useArturaData()
  const [mediaType, setMediaType] = useState(service.preset.mediaType)
  const [artStyle, setArtStyle] = useState(service.preset.artStyle)
  const [bodyCoverage, setBodyCoverage] = useState(service.preset.bodyCoverage)
  const [renderType, setRenderType] = useState(service.preset.renderType)
  const [personCount, setPersonCount] = useState(service.preset.personCount)
  const [poseType, setPoseType] = useState(service.preset.poseType)
  const [backgroundType, setBackgroundType] = useState(service.preset.backgroundType)
  const [ratio, setRatio] = useState('4:5')
  const [customWidth, setCustomWidth] = useState('5')
  const [customHeight, setCustomHeight] = useState('7')
  const [paperSize, setPaperSize] = useState('A5')
  const [orientation, setOrientation] = useState('portrait')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [notes, setNotes] = useState('')
  const [mainReference, setMainReference] = useState(null)
  const [poseReference, setPoseReference] = useState(null)
  const [courier, setCourier] = useState('jnt')
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [uploadCount, setUploadCount] = useState(0)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(null)

  const ratioError = getRatioError({ mediaType, ratio, customWidth, customHeight })
  const quote = getCommissionQuote({ mediaType, artStyle, bodyCoverage, renderType, personCount, poseType, backgroundType, ratio, customWidth, customHeight, paperSize, orientation }, pricing)
  const finishOptions = mediaType === 'digital' ? digitalFinishOptions : traditionalFinishOptions
  const summary = {
    medium: labelOf(mediaOptions, mediaType),
    style: labelOf(styleOptions, artStyle),
    body: labelOf(bodyOptions, bodyCoverage),
    finish: labelOf(finishOptions, renderType),
    persons: labelOf(personOptions, personCount),
    pose: labelOf(poseOptions, poseType),
    background: labelOf(backgroundOptions, backgroundType),
    ratio: mediaType === 'digital' ? (ratio === 'custom' ? `${customWidth}:${customHeight}` : ratio) : null,
    paper: mediaType === 'traditional' ? paperSize : null,
    orientation: mediaType === 'traditional' ? labelOf(orientationOptions, orientation) : null,
  }


  function resetForm() {
    setMediaType(service.preset.mediaType)
    setArtStyle(service.preset.artStyle)
    setBodyCoverage(service.preset.bodyCoverage)
    setRenderType(service.preset.renderType)
    setPersonCount(service.preset.personCount)
    setPoseType(service.preset.poseType)
    setBackgroundType(service.preset.backgroundType)
    setRatio('4:5')
    setCustomWidth('5')
    setCustomHeight('7')
    setPaperSize('A5')
    setOrientation('portrait')
    setName('')
    setContact('')
    setNotes('')
    setMainReference(null)
    setPoseReference(null)
    setCourier('jnt')
    setRecipientName('')
    setRecipientPhone('')
    setAddress('')
    setCity('')
    setProvince('')
    setPostalCode('')
    setError('')
    setSubmitted(null)
  }

  function changeMedium(next) {
    setMediaType(next)
    setRenderType((current) => current === 'color' ? 'color' : next === 'digital' ? 'grayscale' : 'pencil')
    setError('')
  }

  async function chooseReference(file, setter) {
    try {
      setter(await readImageFile(file, 5))
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  function submit(event) {
    event.preventDefault()
    if (uploadCount) return setError('Please wait for the image to finish uploading.')
    if (!artist.commissionOpen) return setError('Commission is currently closed.')
    if (!name.trim()) return setError('Please enter your name.')
    if (!contact.trim()) return setError('Please enter your contact.')
    if (ratioError) return setError(ratioError)
    if (quote.error) return setError(quote.error)

    if (mediaType === 'traditional') {
      if (!recipientName.trim()) return setError('Enter the recipient name for artwork delivery.')
      if (!recipientPhone.trim()) return setError('Enter the recipient WhatsApp number.')
      if (!address.trim()) return setError('Enter the artwork delivery address.')
      if (!city.trim() || !province.trim() || !postalCode.trim()) return setError('Complete the delivery city, province, and postal code.')
      if (!courier) return setError('Select a delivery courier.')
    }

    const request = createCommission({
      client: { name: name.trim(), contact: contact.trim() },
      serviceId: service.id,
      mediaType,
      artStyle,
      bodyCoverage,
      renderType,
      personCount,
      poseType,
      backgroundType,
      ratio: summary.ratio,
      paperSize: summary.paper,
      orientation: summary.orientation,
      specialRequest: notes.trim(),
      estimatedPrice: quote.total,
      mainReference,
      poseReference,
      delivery: mediaType === 'traditional'
        ? {
            type: 'courier',
            courier,
            recipientName: recipientName.trim(),
            phone: recipientPhone.trim(),
            address: address.trim(),
            city: city.trim(),
            province: province.trim(),
            postalCode: postalCode.trim(),
            trackingNumber: '',
          }
        : {
            type: 'digital',
            destination: contact.trim(),
            trackingNumber: '',
          },
    })
    if (!request) {
      setError('The commission request could not be saved. Check the browser storage notification and try again.')
      return
    }
    setSubmitted(request)
    setError('')
  }

  if (submitted) {
    return (
      <section className="artura-reveal rounded-[2rem] border border-emerald-200 bg-emerald-50/80 p-7 text-center shadow-sm backdrop-blur sm:p-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950 text-white shadow-lg shadow-emerald-950/15">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.5L10 17L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-5 font-serif text-3xl text-emerald-950">{t("Commission Request Submitted")}</h3>
        <p className="mt-4 text-stone-600">{t("Request ID: ")}<strong>{t(submitted.id)}</strong></p>
        <p className="mt-2 text-stone-600">{t("Estimated Price: ")}<strong>{t(formatRupiah(submitted.estimatedPrice))}</strong></p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600">{t("The request will be reviewed first. Once accepted, the progress page will show payment, work progress, and delivery when the artwork is physical.")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button to={`/commission/status/${submitted.id}`}>{t("View Progress")}</Button>
          <Button onClick={resetForm} variant="secondary">{t("Create Another Request")}</Button>
        </div>
      </section>
    )
  }

  if (!artist.commissionOpen) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
        <h3 className="font-serif text-3xl text-amber-950">{t("Commission is currently closed.")}</h3>
        <p className="mt-4 text-sm leading-7 text-amber-900">{t("Please come back when commissions are open.")}</p>
      </section>
    )
  }

  const fieldClass = 'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 transition focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100'

  return (
    <form onSubmit={submit} className="grid items-start gap-8 lg:grid-cols-3">
      <div className="space-y-8 rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl sm:p-8 lg:col-span-2">
        <section>
          <h3 className="font-serif text-2xl">{t("Your Information")}</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label>
              <span className="text-sm font-semibold">{t("Name")}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
            </label>
            <label>
              <span className="text-sm font-semibold">{t("Contact")}</span>
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t("Instagram / WhatsApp / Email")} className={fieldClass} />
            </label>
          </div>
        </section>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold">{t("Medium")}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {mediaOptions.map((medium) => (
              <label key={medium.value} className="cursor-pointer">
                <input type="radio" name="medium" checked={mediaType === medium.value} onChange={() => changeMedium(medium.value)} className="peer sr-only" />
                <span className="block rounded-2xl border border-stone-300 bg-white px-5 py-4 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:shadow-sm peer-checked:border-emerald-700 peer-checked:bg-emerald-50 peer-checked:ring-4 peer-checked:ring-emerald-100/70">
                  {t(medium.label)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <ChoiceField id="style" label={t("Art Style")} value={artStyle} onChange={setArtStyle} options={styleOptions} />
          <ChoiceField id="body" label={t("Body Coverage")} value={bodyCoverage} onChange={setBodyCoverage} options={bodyOptions} />
          <ChoiceField id="finish" label={mediaType === 'digital' ? 'Rendering' : 'Finish'} value={renderType} onChange={setRenderType} options={finishOptions} />
          <ChoiceField id="persons" label={t("Number of Person")} value={personCount} onChange={(value) => setPersonCount(Number(value))} options={personOptions} />
          <ChoiceField id="pose" label={t("Pose")} value={poseType} onChange={setPoseType} options={poseOptions} />
          <ChoiceField id="background" label={t("Background")} value={backgroundType} onChange={setBackgroundType} options={backgroundOptions} />
        </div>

        <section className="rounded-2xl bg-stone-50/80 p-5">
          {mediaType === 'digital' ? (
            <div className="space-y-4">
              <ChoiceField id="ratio" label={t("Canvas Ratio")} value={ratio} onChange={setRatio} options={ratioOptions} />
              {ratio === 'custom' && (
                <div className="grid grid-cols-2 gap-4 artura-reveal">
                  <label><span className="text-sm font-medium">{t("Width")}</span><input type="number" min="1" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} className={fieldClass} /></label>
                  <label><span className="text-sm font-medium">{t("Height")}</span><input type="number" min="1" value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} className={fieldClass} /></label>
                </div>
              )}
              {ratioError && <p className="text-sm text-red-700">{t(ratioError)}</p>}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 artura-reveal">
              <ChoiceField id="paper" label={t("Paper Size")} value={paperSize} onChange={setPaperSize} options={paperOptions} />
              <ChoiceField id="orientation" label={t("Orientation")} value={orientation} onChange={setOrientation} options={orientationOptions} />
            </div>
          )}
        </section>

        <section>
          <h3 className="font-serif text-2xl">{t("Reference Image")}</h3>
          <p className="mt-2 text-sm leading-7 text-stone-600">{t("Use clear photos so the pose, face, and request details are easier to understand.")}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <UploadImageField onBusyChange={(busy) => setUploadCount((count) => count + (busy ? 1 : -1))} id="main-ref" label={t("Main Reference Photo")} image={mainReference} onChoose={(file) => chooseReference(file, setMainReference)} onRemove={() => setMainReference(null)} />
            <UploadImageField onBusyChange={(busy) => setUploadCount((count) => count + (busy ? 1 : -1))} id="pose-ref" label={t("Pose Reference")} optional image={poseReference} onChoose={(file) => chooseReference(file, setPoseReference)} onRemove={() => setPoseReference(null)} />
          </div>
        </section>

        {mediaType === 'traditional' && (
          <section className="artura-reveal rounded-[1.5rem] border border-emerald-900/10 bg-emerald-50/55 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-white">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M3 7h11v10H3V7Zm11 3h4l3 3v4h-7v-7Z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" />
                </svg>
              </span>
              <div>
                <h3 className="font-serif text-2xl text-emerald-950">{t("Physical Artwork Delivery")}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">{t("Traditional artwork is shipped after completion. Choose your preferred courier; the tracking number will appear on the progress page after the admin ships the artwork.")}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <ChoiceField id="commission-courier" label={t("Preferred Courier")} value={courier} onChange={setCourier} options={courierOptions} />
              <label><span className="text-sm font-semibold">{t("Recipient Name")}</span><input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className={fieldClass} /></label>
              <label><span className="text-sm font-semibold">{t("WhatsApp Recipient")}</span><input value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} className={fieldClass} /></label>
              <label><span className="text-sm font-semibold">{t("Postal Code")}</span><input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={fieldClass} /></label>
              <label className="sm:col-span-2"><span className="text-sm font-semibold">{t("Full Address")}</span><textarea rows="3" value={address} onChange={(e) => setAddress(e.target.value)} className={fieldClass} /></label>
              <label><span className="text-sm font-semibold">{t("City")}</span><input value={city} onChange={(e) => setCity(e.target.value)} className={fieldClass} /></label>
              <label><span className="text-sm font-semibold">{t("Province")}</span><input value={province} onChange={(e) => setProvince(e.target.value)} className={fieldClass} /></label>
            </div>
          </section>
        )}

        {mediaType === 'digital' && (
          <section className="artura-reveal rounded-2xl border border-sky-100 bg-sky-50/70 p-5 text-sm leading-7 text-sky-950">
            <strong>{t("Digital delivery:")}</strong>{t(" the final file will be sent through the contact you provided. Progress can still be tracked from the Commission Status page.")}</section>
        )}

        <div>
          <label htmlFor="notes" className="text-sm font-semibold">{t("Special Request")}</label>
          <textarea id="notes" rows="4" value={notes} onChange={(e) => setNotes(e.target.value)} className={fieldClass} placeholder={t("Describe your idea, outfit, pose, expression, or other details...")} />
        </div>

        {error && <p className="artura-reveal rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{t(error)}</p>}
        <Button type="submit" disabled={uploadCount > 0}>{t("Submit Commission Request")}</Button>
      </div>

      <aside className="rounded-[2rem] bg-emerald-950 p-7 text-white shadow-xl shadow-emerald-950/10 lg:sticky lg:top-32">
        <p className="text-xs uppercase tracking-widest text-emerald-200">{t("Your commission")}</p>
        <h3 className="mt-3 font-serif text-2xl">{t("Live Summary")}</h3>
        {quote.error ? <p className="mt-5 rounded-xl bg-white/10 p-4 text-sm">{t(quote.error)}</p> : <p className="mt-5 text-3xl font-semibold transition-all">{t(formatRupiah(quote.total))}</p>}
        <dl className="mt-6 space-y-3 border-t border-white/20 pt-5 text-sm">
          {Object.entries(summary).filter(([, value]) => value).map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4">
              <dt className="capitalize text-emerald-100">{t(key)}</dt>
              <dd className="text-right font-medium">{t(value)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4">
            <dt className="text-emerald-100">{t("Delivery")}</dt>
            <dd className="text-right font-medium">{t(mediaType === 'traditional' ? labelOf(courierOptions, courier) : 'Digital Delivery')}</dd>
          </div>
        </dl>
        {!quote.error && (
          <ul className="mt-6 space-y-2 border-t border-white/20 pt-5 text-xs">
            {quote.items.map((item) => <li key={item.key} className="flex justify-between gap-3"><span className="text-emerald-100">{t(item.label)}</span><span>{t(formatRupiah(item.amount))}</span></li>)}
          </ul>
        )}
      </aside>
    </form>
  )
}
