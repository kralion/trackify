import { Linking } from "react-native";

export const sendWhatsAppMessage = (order: any, businessPhone: string) => {
    const { location, items, totalPrice, paymentMethod, customer } = order;

    const formattedItems = items.map((item: any) => `- ${item.name} (x${item.quantity})`).join("\n");

    const message = `Hola,

Quisiera hacer un pedido con los siguientes detalles:

──────────
*UBICACIÓN:*  
${location}
──────────

*CLIENTE:*  
- ${customer}

*PRODUCTOS SOLICITADOS:*  
${formattedItems}

*PRECIO TOTAL:* S/. ${totalPrice}  
*MÉTODO DE PAGO:* ${paymentMethod}  

Espero la confirmación. Gracias.`;

    const url = `https://wa.me/+51${businessPhone}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url)
        .catch(err => console.error("Error al abrir WhatsApp:", err));
};
