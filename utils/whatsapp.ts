import { Order, Product } from "@/types";
import { Linking } from "react-native";

export const sendWhatsAppMessage = (order: Order, businessPhone: string) => {
    const { location, items, totalPrice, paymentMethod, customer,paymentBill } = order;

    const formattedItems = items.map((item: Product) => {
    // Customizaciones formateadas, indentadas y sin emoji
    const customizations = Object.entries(item.customizations || {}).map(([name, value]) => {        
        return `    - *${name}:* ${value}`;
    }).join("\n");
    // Producto en negrita y cantidad, customizaciones debajo
    return `• *${item.name}* (x${item.quantity})${customizations ? `\n${customizations}` : ''}`;
}).join("\n\n");


    const message = `Hola,

Quisiera hacer un pedido con los siguientes detalles:

──────────
*UBICACIÓN:*  
${location}
──────────

*CLIENTE:*  
- ${customer}

──────────
*PRODUCTOS SOLICITADOS:*  
${formattedItems}
──────────

*PRECIO TOTAL:* S/. ${totalPrice}  
*MÉTODO DE PAGO:* ${paymentMethod}  
${paymentBill ? `*BILLETE:* ${paymentBill}` : ''}
  
Espero la confirmación. Gracias.`;
  
    const url = `https://wa.me/+51${businessPhone}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url)
        .catch(err => console.error("Error al abrir WhatsApp:", err));
};
