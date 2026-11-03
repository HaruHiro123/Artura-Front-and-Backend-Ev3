export function getAvailablePaymentMethods(paymentSettings) {
  return [
    paymentSettings?.bank?.active && {
      value: 'bank',
      label: 'Bank Transfer',
      detail: paymentSettings.bank.bankName || 'Bank Transfer',
    },
    paymentSettings?.ewallet?.active && {
      value: 'ewallet',
      label: 'E-Wallet',
      detail: paymentSettings.ewallet.provider || 'E-Wallet',
    },
    paymentSettings?.qris?.active && paymentSettings?.qris?.image && {
      value: 'qris',
      label: 'QRIS',
      detail: 'Scan QRIS',
    },
  ].filter(Boolean)
}

export function paymentMethodLabel(value, paymentSettings) {
  return getAvailablePaymentMethods(paymentSettings).find((item) => item.value === value)?.label || value || 'Not selected'
}
