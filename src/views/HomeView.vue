<template>
  <div class="container">
    <h1>Wi-Fi QR Code Generator</h1>
    <form @submit.prevent="generateQRcode" class="form">
      <div class="form-group">
        <label for="ssid">Wi-Fi 名称:</label>
        <input v-model="ssid" type="text" id="ssid" placeholder="请输入Wi-Fi名称" required />
      </div>
      <div class="form-group">
        <label for="password">Wi-Fi 密码:</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="请输入密码"
          v-if="wifiType !== 'noPass'"
        />
      </div>
      <div class="form-group">
        <label for="wifi-type">Wi-Fi 类型:</label>
        <select v-model="wifiType" id="wifi-type">
          <option value="WPA">WPA</option>
          <option value="WPA2">WPA2</option>
          <option value="WEP">WEP</option>
          <option value="noPass">无密码</option>
        </select>
      </div>
      <button type="submit">生成二维码</button>
    </form>

    <!-- Canvas always rendered but empty before QR code generation -->
    <div class="qr-code">
      <h3 v-if="qrCodeGenerated">QR Code:</h3>
      <canvas ref="canvasRef" :width="size" :height="size"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import QRCode from 'qrcode'

const ssid = ref('')
const password = ref('')
const size = ref(0) // QR code size
const wifiType = ref('WPA')
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
</script>

<style scoped>
.container {
  font-family: 'Arial', sans-serif;
  width: 90%;
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}
h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

input,
select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  margin-top: 5px;
}

input:focus,
select:focus {
  border-color: #007bff;
  outline: none;
}

/* Button styling */
button {
  margin-top: 20px;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

/* QR Code display */
.qr-code {
  margin-top: 20px;
}

.qr-code h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

/* Responsive Design */
@media (max-width: 600px) {
  .container {
    width: 100%;
    padding: 15px;
  }

  h1 {
    font-size: 20px;
  }

  button {
    font-size: 14px;
  }
}
</style>
