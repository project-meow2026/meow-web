import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/storage/db';
import { generateOrderRef } from '@/lib/utils/formatters';
import { buildWhatsAppOrderMessage, getWhatsAppRedirectUrl } from '@/lib/utils/whatsapp';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get('ref');
    const phone = searchParams.get('phone');

    const orders = await dbService.getOrders();

    if (ref) {
      const found = orders.find(
        (o) => o.order_ref.toLowerCase() === ref.trim().toLowerCase()
      );
      return NextResponse.json({ order: found || null });
    }

    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const matched = orders.filter((o) => {
        const oPhone = (o.customer_phone || '').replace(/\D/g, '').slice(-10);
        const oWa = (o.customer_whatsapp || '').replace(/\D/g, '').slice(-10);
        return (cleanPhone && (oPhone === cleanPhone || oWa === cleanPhone));
      });
      return NextResponse.json({ orders: matched });
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerWhatsapp,
      customerEmail,
      address,
      city,
      state,
      postalCode,
      country,
      notes,
      items,
    } = body;

    // Validate required fields
    if (!customerName || !customerPhone || !address || !city || !state || !postalCode) {
      return NextResponse.json(
        { error: 'Missing required delivery information' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty. Please select products to order.' },
        { status: 400 }
      );
    }

    // Calculate subtotal and total server-side
    const subtotal = items.reduce((sum: number, item: any) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }, 0);

    const shippingAmount = 0; // Free shipping rule
    const totalAmount = subtotal + shippingAmount;
    const orderRef = generateOrderRef();

    // Map order items
    const orderItems = items.map((item: any) => ({
      product_id: item.productId,
      product_name: item.productName,
      variant_id: item.variantId,
      variant_color: item.colorName,
      miniature_image_url: item.miniatureImageUrl || item.primaryImageUrl,
      size: item.size,
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.price) || 0,
      total_price: (Number(item.price) || 0) * (Number(item.quantity) || 1),
    }));

    // Create persistent order record
    const createdOrder = await dbService.createOrder({
      order_ref: orderRef,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_whatsapp: customerWhatsapp?.trim() || customerPhone.trim(),
      customer_email: customerEmail?.trim() || null,
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      postal_code: postalCode.trim(),
      country: country?.trim() || 'India',
      notes: notes?.trim() || null,
      subtotal,
      shipping_amount: shippingAmount,
      total_amount: totalAmount,
      status: 'pending_whatsapp',
      is_whatsapp_confirmed: false,
      items: orderItems,
    });

    // Generate WhatsApp redirect URL using dynamic admin contact settings
    const contactInfo = await dbService.getContactInfo().catch(() => null);
    const origin = new URL(req.url).origin;
    const whatsappUrl = getWhatsAppRedirectUrl(createdOrder, contactInfo?.whatsapp, origin);

    return NextResponse.json({
      success: true,
      order: createdOrder,
      orderRef,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process order' },
      { status: 500 }
    );
  }
}
