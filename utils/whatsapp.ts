import { Linking } from "react-native";

export const sendWhatsAppMessage = (order: any, customer: any, businessPhone: string) => {
    const { location, items, totalPrice, quantity, paymentMethod, extras } = order;
    const { name, phone } = customer;

    const formattedItems = items.map((item: any) => `- ${item.name} (x${item.quantity})`).join("\n");
    const formattedExtras = extras ? `\nAdicionales: ${extras}` : "";

    const message = `Hola,

Quisiera hacer un pedido con los siguientes detalles:

Ubicación: ${location}

Datos del cliente:
- Nombre: ${name}
- Teléfono: ${phone}

Productos solicitados:
${formattedItems}

Precio total: S/. ${totalPrice}
Cantidad: ${quantity}
Método de pago: ${paymentMethod}${formattedExtras}

Quedo atento a la confirmación. Gracias.`;

    const url = `https://wa.me/${businessPhone}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url)
        .then(() => console.log("Mensaje enviado a WhatsApp:", url))
        .catch(err => console.error("Error al abrir WhatsApp:", err));
};
