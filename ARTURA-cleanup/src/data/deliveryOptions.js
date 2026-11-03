export const courierOptions = [
  { value: 'jnt', label: 'J&T Express' },
  { value: 'jne', label: 'JNE' },
  { value: 'sicepat', label: 'SiCepat' },
  { value: 'anteraja', label: 'AnterAja' },
]

export function courierLabel(value) {
  return courierOptions.find((item) => item.value === value)?.label || value || '-'
}
