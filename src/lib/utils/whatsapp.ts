import { Order } from '@/lib/supabase/types';
import { formatPrice } from './formatters';

export const buildWhatsAppOrderMessage = (order: Order): string => {
  const itemsText = order.items && order.items.length > 0
    ? order.items
        .map(
          (item, idx) =>
            `${idx + 1}. *${item.product_name}*\n   • Color: ${item.variant_color}\n   • Size: ${item.size}\n   • Qty: ${item.quantity}\n   • Price: ${formatPrice(item.total_price)}`
        )
        .join('\n\n')
    : 'No items';

  const notesText = order.notes ? `\n\n*Order Notes:* ${order.notes}` : '';

  return (
    `🛍️ *NEW ORDER FROM MEOW FOOTWEAR*\n` +
    `*Order Ref:* ${order.order_ref}\n` +
    `--------------------------------------\n` +
    `*Customer Details:*\n` +
    `• Name: ${order.customer_name}\n` +
    `• Phone: ${order.customer_phone}\n` +
    (order.customer_email ? `• Email: ${order.customer_email}\n` : '') +
    `• Delivery Address:\n` +
    `  ${order.address}, ${order.city},\n` +
    `  ${order.state} - ${order.postal_code}, ${order.country}` +
    notesText +
    `\n\n--------------------------------------\n` +
    `*Ordered Items:*\n\n` +
    itemsText +
    `\n\n--------------------------------------\n` +
    `*Subtotal:* ${formatPrice(order.subtotal)}\n` +
    `*Shipping:* ${order.shipping_amount === 0 ? 'FREE' : formatPrice(order.shipping_amount)}\n` +
    `*Grand Total:* ${formatPrice(order.total_amount)}\n` +
    `--------------------------------------\n\n` +
    `Hello MEOW Team! I have placed this order on your website. Please confirm availability and dispatch timeline.`
  );
};

export const getWhatsAppRedirectUrl = (order: Order, businessNumber?: string): string => {
  const number = (
    businessNumber ||
    process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER ||
    '919876543210'
  ).replace(/\D/g, '');

  const message = buildWhatsAppOrderMessage(order);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
