import axios from "axios";

export const sendWhatsAppMessage = async (phoneNumber, message) => {
  if (!phoneNumber) return;

  const formattedNumber = phoneNumber.startsWith('91') ? phoneNumber : `91${phoneNumber}`;
  const apiKey = process.env.WHATSAPP_API_KEY;

  if (!apiKey) {
    console.error("WhatsApp API Key not configured");
    return;
  }

  try {
    await axios.post('https://wasenderapi.com/api/send', {
      apiKey,
      number: formattedNumber,
      message
    });
    console.log(`WhatsApp message sent to ${formattedNumber}`);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.response?.data || error.message);
  }
};

