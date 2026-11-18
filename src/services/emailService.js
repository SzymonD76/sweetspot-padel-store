import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

// Sends the order confirmation e-mail through EmailJS.
// blockHeadless and limitRate add basic client-side protection against automated abuse.
export const sendOrderConfirmation = (order) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return Promise.reject(new Error('EmailJS is not configured. Check your .env file.'));
  }

  const templateParams = {
    to_email: order.email,
    order_id: order.id,
    customer_name: order.customerName,
    delivery_address: order.deliveryAddress,
    order_total: order.total.toFixed(2),
    order_items: order.items.map(item => ({
      name: item.name,
      price: item.price,
      units: item.quantity,
      image: item.image_url,
    })),
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
    publicKey: PUBLIC_KEY,
    blockHeadless: true,
    limitRate: { id: 'checkout', throttle: 10000 },
  });
};
