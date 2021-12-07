// Aqui iremos criar um código que permitirá fazer:
// - Enviar chaves de apis criptografadas para o banco de dados
// - Receber as chaves de APIS e descriptografalas
import CryptoJS from 'crypto-js'

export const encrypt = (originalKey: string) => {
  if (originalKey) {
    const ciphertext = CryptoJS.AES.encrypt(originalKey, process.env.AES_SECRET_KEY).toString()
    return ciphertext
  }
}

export const decrypt = (cipherKey: string) => {
  if (cipherKey) {
    const bytes = CryptoJS.AES.decrypt(cipherKey, process.env.AES_SECRET_KEY)
    const originalKey = bytes.toString(CryptoJS.enc.Utf8)
    return originalKey
  }
}
