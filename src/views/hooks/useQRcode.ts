import { nextTick, ref } from 'vue'
import QRCode from 'qrcode'
export const useQRcode = () => {
  const ssid = ref('') // wifi name
  const password = ref('') // wifi password
  const size = ref(0) // QR code size
  const wifiType = ref('WPA') // wifi type
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const qrCodeGenerated = ref(false)

  // Function to generate the QR code
  const generateQRcode = () => {
    // Construct Wi-Fi connection string based on selected Wi-Fi type
    let wifiStr = `WIFI:T:${wifiType.value};S:${ssid.value};`

    if (wifiType.value !== 'noPass') {
      wifiStr += `P:${password.value};;`
    } else {
      wifiStr += `;;`
    }

    // console.log('Wi-Fi QR Code String:', wifiStr) // Log to check if Wi-Fi string is correct
    if (canvasRef.value) {
      size.value = 300
      qrCodeGenerated.value = true
      nextTick(() => {
        QRCode.toCanvas(
          canvasRef.value,
          wifiStr,
          {
            errorCorrectionLevel: 'L', // Error correction level
            version: 6, // QR version
          },
          (err: unknown) => {
            if (err) {
              size.value = 0
              qrCodeGenerated.value = false // Set flag when QR is successfully generated
              console.error('Error generating QR code:', err)
            }
          },
        )
      })
    } else {
      console.error('Canvas element is not available!')
    }
  }


  return {
    ssid,
    password,
    size,
    wifiType,
    canvasRef,
    qrCodeGenerated,
    generateQRcode
  }
}
