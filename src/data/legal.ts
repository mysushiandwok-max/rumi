// Contenido de las páginas legales de la tienda (marco colombiano).
// Los datos entre [corchetes] de LEGAL_ENTITY deben completarse antes de publicar.

export const LEGAL_ENTITY = {
  brand: "Rumí",
  legalName: "[Razón social o nombre del titular]",
  nit: "[NIT o cédula con dígito de verificación]",
  address: "[Dirección física], Bogotá D.C., Colombia",
  email: "hola@rumiskincare.com",
  phone: "+57 300 123 4567",
  hours: "lunes a viernes de 8:00 a. m. a 6:00 p. m. y sábados de 9:00 a. m. a 1:00 p. m.",
};

export const LEGAL_UPDATED = "24 de septiembre de 2026";

// Un bloque es un párrafo (string) o una lista de viñetas (string[]).
export type LegalBlock = string | string[];
export type LegalSection = { title: string; blocks: LegalBlock[] };
export type LegalPage = { slug: string; title: string; summary: string; sections: LegalSection[] };

const E = LEGAL_ENTITY;
const CONTACT = `el correo ${E.email}, el teléfono/WhatsApp ${E.phone} o la dirección ${E.address}`;

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: "terminos-y-condiciones",
    title: "Términos y condiciones",
    summary: "Las reglas que aplican cuando navegas y compras en Rumí.",
    sections: [
      {
        title: "1. Quiénes somos",
        blocks: [
          `Este sitio web es operado por ${E.legalName}, identificado con NIT ${E.nit}, con domicilio en ${E.address} (en adelante, “${E.brand}”). Puedes contactarnos a través de ${CONTACT}, en horario de ${E.hours}.`,
          `Al navegar o comprar en este sitio aceptas estos términos y condiciones, que se rigen por la ley colombiana, en especial la Ley 1480 de 2011 (Estatuto del Consumidor), la Ley 527 de 1999 (comercio electrónico) y el Decreto 1074 de 2015.`,
        ],
      },
      {
        title: "2. Capacidad para comprar",
        blocks: [
          "Para comprar debes ser mayor de edad y tener capacidad legal para contratar. Si eres menor de edad, la compra debe realizarla tu padre, madre o representante legal.",
        ],
      },
      {
        title: "3. Productos e información",
        blocks: [
          "Comercializamos productos cosméticos y de cuidado de la piel importados. Procuramos que las fotografías, descripciones, ingredientes, modos de uso y tamaños publicados correspondan fielmente al producto; los colores pueden variar ligeramente según la pantalla.",
          "Los productos cosméticos que se comercializan en Colombia deben contar con Notificación Sanitaria Obligatoria (NSO) conforme a la Decisión 833 de 2018 de la Comunidad Andina y la regulación del INVIMA. Las etiquetas incluyen la información exigida en español.",
          "La información sobre rutinas, tipos de piel y beneficios es orientativa y no reemplaza la consulta con un dermatólogo. Te recomendamos hacer una prueba de parche antes de usar un producto nuevo, sobre todo si tienes piel sensible o alergias.",
        ],
      },
      {
        title: "4. Precios y disponibilidad",
        blocks: [
          "Todos los precios están expresados en pesos colombianos (COP) e incluyen el IVA cuando aplica. El costo del envío se muestra por separado antes de pagar.",
          "El precio que pagas es el publicado al momento de confirmar tu pedido. Las promociones tienen la vigencia y condiciones indicadas en cada una y aplican hasta agotar existencias, informando siempre las unidades disponibles cuando sean limitadas.",
          "Si por un error evidente de digitación un producto se publica con un precio notoriamente distinto al real, te lo informaremos antes del despacho para que decidas si continúas con la compra al precio correcto o si prefieres el reembolso total.",
          "Si después de tu pago un producto se agota, te contactaremos para ofrecerte un producto equivalente o el reembolso total de lo pagado por él.",
        ],
      },
      {
        title: "5. Proceso de compra",
        blocks: [
          [
            "Agregas los productos al carrito y revisas el resumen del pedido.",
            "Ingresas tus datos de contacto y la dirección de entrega; ahí verás el costo y el tiempo estimado de envío.",
            "Aceptas estos términos y la Política de tratamiento de datos personales, y realizas el pago.",
            "Te enviamos una confirmación con el número y el detalle de tu pedido. Consérvala como soporte de tu compra.",
          ],
          "El contrato de compraventa se entiende celebrado cuando confirmamos tu pedido y se aprueba el pago. Guardamos el registro de la transacción según lo exige la ley.",
        ],
      },
      {
        title: "6. Medios de pago",
        blocks: [
          "Los pagos se procesan a través de Bold, pasarela de pagos colombiana, que acepta tarjetas de crédito y débito (Visa, Mastercard, American Express y Diners Club), PSE, Nequi y Botón Bancolombia. Rumí no almacena los datos completos de tus tarjetas. Cuando uses tarjetas débito, crédito o PSE, tienes derecho a la reversión del pago en los casos previstos por la ley (consulta la Política de reversión del pago).",
        ],
      },
      {
        title: "7. Envíos, cambios y devoluciones",
        blocks: [
          "Las condiciones de despacho, derecho de retracto, garantías, cambios y devoluciones se explican en la Política de envíos y en la Política de cambios, devoluciones y garantías, que hacen parte de estos términos.",
        ],
      },
      {
        title: "8. Cuentas de usuario",
        blocks: [
          "Si creas una cuenta, eres responsable de mantener la confidencialidad de tu contraseña y de la información que registres. Avísanos de inmediato si detectas un uso no autorizado.",
        ],
      },
      {
        title: "9. Reseñas y contenido de usuarios",
        blocks: [
          "Las reseñas, fotos y videos que publiques deben ser reales, basados en tu experiencia y respetuosos. Podemos moderar o no publicar contenido ofensivo, engañoso o que infrinja derechos de terceros. Al publicarlo nos autorizas a mostrarlo en el sitio y en nuestras redes sociales, citando tu nombre de usuario.",
        ],
      },
      {
        title: "10. Propiedad intelectual",
        blocks: [
          "Los textos, diseños, ilustraciones, logotipos y demás contenido propio del sitio pertenecen a Rumí o se usan con autorización. Las marcas de los productos pertenecen a sus respectivos titulares. No está permitido copiarlos o usarlos con fines comerciales sin autorización previa y escrita.",
        ],
      },
      {
        title: "11. Peticiones, quejas y reclamos (PQR)",
        blocks: [
          `Puedes presentar cualquier petición, queja o reclamo a través de ${CONTACT}. Te daremos respuesta en un máximo de quince (15) días hábiles.`,
          "Si no quedas conforme con la respuesta, puedes acudir a la Superintendencia de Industria y Comercio (www.sic.gov.co), autoridad de protección al consumidor en Colombia.",
        ],
      },
      {
        title: "12. Cambios a estos términos",
        blocks: [
          "Podemos actualizar estos términos. La versión vigente es la publicada en esta página con su fecha de actualización; a cada compra le aplican los términos vigentes al momento de realizarla.",
        ],
      },
    ],
  },
  {
    slug: "politica-de-privacidad",
    title: "Política de tratamiento de datos personales",
    summary: "Cómo recolectamos, usamos y protegemos tus datos (Ley 1581 de 2012).",
    sections: [
      {
        title: "1. Responsable del tratamiento",
        blocks: [
          `${E.legalName}, NIT ${E.nit}, con domicilio en ${E.address}, correo ${E.email} y teléfono ${E.phone}, es responsable del tratamiento de los datos personales recolectados a través de este sitio web y de nuestros canales de atención.`,
          "Esta política se expide en cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y demás normas que las modifiquen o complementen.",
        ],
      },
      {
        title: "2. Datos que recolectamos",
        blocks: [
          [
            "Identificación y contacto: nombre, correo electrónico y teléfono.",
            "Entrega: departamento, municipio, dirección y notas de entrega.",
            "Compra: productos adquiridos, valores, fechas y estado del pedido.",
            "Cuenta y comunidad: datos de registro, lista de deseos, reseñas, fotos o videos que decidas compartir.",
            "Navegación: información técnica básica necesaria para el funcionamiento del sitio (ver Política de cookies).",
          ],
          "No solicitamos datos sensibles. Los datos de tarjetas los recibe directamente la pasarela de pago; Rumí no los almacena.",
        ],
      },
      {
        title: "3. Finalidades",
        blocks: [
          [
            "Procesar, facturar, despachar y hacer seguimiento a tus pedidos.",
            "Atender peticiones, quejas, reclamos, solicitudes de garantía, retracto y reversión del pago.",
            "Gestionar tu cuenta, tu carrito y tu lista de deseos.",
            "Publicar las reseñas que envíes voluntariamente.",
            "Cumplir obligaciones legales, contables, tributarias y requerimientos de autoridades.",
            "Previa autorización, enviarte novedades, recomendaciones de rutina, promociones y encuestas de satisfacción.",
            "Prevenir fraudes y proteger la seguridad del sitio.",
          ],
        ],
      },
      {
        title: "4. Autorización",
        blocks: [
          "Tratamos tus datos con tu autorización previa, expresa e informada, que otorgas al marcar la casilla correspondiente al comprar, registrarte o suscribirte. Conservamos prueba de dicha autorización.",
          "Puedes dejar de recibir comunicaciones comerciales en cualquier momento, usando el enlace de cancelación de cada correo o escribiéndonos. Las comunicaciones de mercadeo por teléfono o mensajería se harán solo por los canales que autorices y en los horarios permitidos por la Ley 2300 de 2023.",
        ],
      },
      {
        title: "5. Tus derechos como titular",
        blocks: [
          [
            "Conocer, actualizar y rectificar tus datos personales.",
            "Solicitar prueba de la autorización otorgada.",
            "Ser informado sobre el uso que se ha dado a tus datos.",
            "Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.",
            "Revocar la autorización y/o solicitar la supresión de tus datos, cuando no exista un deber legal o contractual de conservarlos.",
            "Acceder gratuitamente a tus datos personales.",
          ],
        ],
      },
      {
        title: "6. Cómo ejercer tus derechos",
        blocks: [
          `Envía tu solicitud a ${E.email} indicando tu nombre, documento de identidad, datos de contacto, la descripción de lo que solicitas y los documentos que quieras hacer valer.`,
          [
            "Consultas: las responderemos en máximo diez (10) días hábiles, prorrogables por cinco (5) días hábiles más, informándote el motivo.",
            "Reclamos (corrección, actualización, supresión o revocatoria): los responderemos en máximo quince (15) días hábiles, prorrogables por ocho (8) días hábiles más, informándote el motivo.",
          ],
          "Solo podrás acudir a la Superintendencia de Industria y Comercio después de haber agotado este trámite ante nosotros.",
        ],
      },
      {
        title: "7. Con quién compartimos tus datos",
        blocks: [
          "Compartimos únicamente la información necesaria con encargados que nos ayudan a operar: pasarelas de pago, empresas transportadoras, proveedores de alojamiento web, correo electrónico y facturación electrónica. Ellos deben tratar tus datos con las mismas garantías de esta política. Algunos de estos proveedores pueden estar ubicados fuera de Colombia, en cuyo caso aplicamos las garantías que exige la ley para la transmisión internacional.",
          "No vendemos ni alquilamos tus datos personales.",
        ],
      },
      {
        title: "8. Seguridad y conservación",
        blocks: [
          "Aplicamos medidas técnicas, humanas y administrativas razonables para proteger tus datos contra pérdida, consulta, uso o acceso no autorizado. Los conservamos mientras sean necesarios para las finalidades descritas y durante los plazos que exigen las normas contables, tributarias y de protección al consumidor.",
        ],
      },
      {
        title: "9. Menores de edad",
        blocks: [
          "Nuestro sitio está dirigido a personas mayores de edad. No recolectamos intencionalmente datos de niños, niñas o adolescentes.",
        ],
      },
      {
        title: "10. Vigencia",
        blocks: [
          "Esta política rige desde su publicación. Te informaremos por este sitio cualquier cambio sustancial antes de aplicarlo.",
        ],
      },
    ],
  },
  {
    slug: "politica-de-cookies",
    title: "Política de cookies",
    summary: "Qué guardamos en tu navegador y para qué.",
    sections: [
      {
        title: "1. Qué son",
        blocks: [
          "Las cookies y el almacenamiento local son pequeños archivos o registros que el sitio guarda en tu navegador para recordar información entre visitas.",
        ],
      },
      {
        title: "2. Qué usamos",
        blocks: [
          [
            "Carrito de compras: recuerda los productos que agregaste.",
            "Lista de deseos: guarda los productos que marcaste como favoritos.",
            "Sesión y seguridad: mantienen tu sesión iniciada y protegen el sitio.",
          ],
          "Son estrictamente necesarias para que la tienda funcione. Hoy no usamos cookies de publicidad ni de seguimiento de terceros; si en el futuro las incorporamos, actualizaremos esta política y te pediremos autorización cuando corresponda.",
        ],
      },
      {
        title: "3. Cómo controlarlas",
        blocks: [
          "Puedes borrar o bloquear las cookies desde la configuración de tu navegador. Si lo haces, es posible que el carrito o la lista de deseos no funcionen correctamente.",
        ],
      },
    ],
  },
  {
    slug: "envios",
    title: "Política de envíos",
    summary: "Tiempos, costos y cobertura de nuestros despachos.",
    sections: [
      {
        title: "1. Cobertura",
        blocks: [
          "Despachamos desde Bogotá a todo el territorio colombiano a través de empresas transportadoras aliadas. Algunos municipios de difícil acceso pueden tener tiempos mayores.",
        ],
      },
      {
        title: "2. Costos",
        blocks: [
          "El costo del envío depende del municipio de destino y se muestra en el checkout antes de pagar. {freeShipping}",
        ],
      },
      {
        title: "3. Tiempos de entrega",
        blocks: [
          "Preparamos tu pedido en un plazo de uno (1) a dos (2) días hábiles después de aprobado el pago. El tiempo de entrega estimado depende de tu ciudad y se muestra al elegir el municipio. Si no se indica un plazo, la entrega se hará en máximo treinta (30) días calendario, como lo establece el Estatuto del Consumidor.",
          "Si no podemos entregar dentro del plazo informado, te avisaremos, y si el retraso es por causa nuestra podrás pedir la resolución del contrato y la devolución total de tu dinero.",
        ],
      },
      {
        title: "4. Seguimiento y recepción",
        blocks: [
          "Cuando tu pedido sea despachado te enviaremos el número de guía para que hagas seguimiento.",
          "Al recibir, revisa que el empaque esté en buen estado. Si llega abierto, golpeado o con señales de manipulación, déjalo anotado en la guía de la transportadora, tómale fotos y escríbenos dentro de las 48 horas siguientes para ayudarte.",
        ],
      },
      {
        title: "5. Dirección y reintentos",
        blocks: [
          "Verifica que la dirección y el teléfono sean correctos. Si el pedido es devuelto por datos errados o porque no hubo quien lo recibiera después de los intentos de la transportadora, te contactaremos para reprogramar el envío, cuyo nuevo costo correrá por tu cuenta.",
        ],
      },
    ],
  },
  {
    slug: "cambios-y-devoluciones",
    title: "Cambios, devoluciones y garantías",
    summary: "Derecho de retracto, garantía legal y cómo solicitar un cambio.",
    sections: [
      {
        title: "1. Derecho de retracto",
        blocks: [
          "Por ser una compra a distancia, tienes derecho a retractarte dentro de los cinco (5) días hábiles siguientes a la entrega del producto, según el artículo 47 de la Ley 1480 de 2011.",
          [
            "El producto debe devolverse sin abrir, con sus sellos de seguridad y empaque original intactos, y en las mismas condiciones en que lo recibiste.",
            "Los costos de transporte de la devolución corren por tu cuenta.",
            "Te reembolsaremos la totalidad del dinero pagado, sin descuentos ni retenciones, en un plazo máximo de treinta (30) días calendario desde que ejerzas el derecho.",
          ],
          "La ley exceptúa del retracto los bienes de uso personal. Por eso, por razones de higiene y seguridad sanitaria, no aceptamos el retracto de cosméticos abiertos, usados o con el sello roto.",
        ],
      },
      {
        title: "2. Garantía legal",
        blocks: [
          "Todos nuestros productos tienen la garantía legal de calidad, idoneidad y seguridad prevista en la Ley 1480 de 2011, que cubre el producto hasta su fecha de vencimiento. Aplica, entre otros, si recibes:",
          [
            "Un producto defectuoso, en mal estado o con el empaque dañado.",
            "Un producto vencido o próximo a vencer sin que se te haya informado.",
            "Un producto diferente al que compraste.",
            "Un producto que no corresponde a la información publicada.",
          ],
          "En estos casos, a tu elección, te entregamos un producto nuevo igual o equivalente, o te devolvemos el dinero. Los costos de envío asociados a la garantía corren por cuenta de Rumí. Daremos respuesta a tu solicitud en máximo quince (15) días hábiles.",
          "La garantía no cubre reacciones individuales como alergias o sensibilidad a un ingrediente declarado en la etiqueta, ni daños causados por uso inadecuado o almacenamiento en condiciones distintas a las indicadas. Si tienes una reacción, suspende el uso y consulta a un profesional de la salud; escríbenos igualmente para acompañarte.",
        ],
      },
      {
        title: "3. Cambios por gusto",
        blocks: [
          "Si el producto está sellado y sin usar, puedes solicitar el cambio por otro producto dentro de los treinta (30) días calendario siguientes a la entrega. Si el nuevo producto tiene un valor mayor pagas la diferencia; si es menor te la dejamos como saldo a favor. Los costos de envío del cambio corren por tu cuenta.",
          "Los productos adquiridos en promociones, kits o como obsequio solo se cambian por garantía.",
        ],
      },
      {
        title: "4. Cómo solicitarlo",
        blocks: [
          [
            `Escríbenos a ${E.email} o al WhatsApp ${E.phone} con tu número de pedido.`,
            "Cuéntanos el motivo y adjunta fotos del producto, el empaque y, si aplica, el lote y la fecha de vencimiento.",
            "Te confirmaremos si procede y cómo enviar el producto.",
            "Al recibirlo y revisarlo, hacemos el cambio o el reembolso por el mismo medio de pago o por transferencia a la cuenta que nos indiques.",
          ],
        ],
      },
    ],
  },
  {
    slug: "reversion-del-pago",
    title: "Reversión del pago",
    summary: "Cuándo y cómo pedir que se reverse un pago electrónico.",
    sections: [
      {
        title: "1. En qué casos procede",
        blocks: [
          "Si pagaste con tarjeta de crédito, débito o cualquier instrumento de pago electrónico (como PSE), puedes solicitar la reversión del pago según el artículo 51 de la Ley 1480 de 2011 y el Decreto 587 de 2016 cuando:",
          [
            "Fuiste objeto de fraude.",
            "Se trata de una operación no solicitada.",
            "El producto adquirido no fue recibido.",
            "El producto entregado no corresponde a lo solicitado o es defectuoso.",
          ],
        ],
      },
      {
        title: "2. Cómo solicitarla",
        blocks: [
          [
            `Dentro de los cinco (5) días hábiles siguientes a la fecha en que tuviste noticia de la situación, presenta tu solicitud a Rumí a través de ${E.email}, indicando la causal, tu número de pedido y el valor a reversar.`,
            "En el mismo plazo, informa de la solicitud al emisor del instrumento de pago (tu banco o entidad financiera).",
            "Si la causal es que el producto no corresponde o es defectuoso, debes devolverlo en las mismas condiciones en que lo recibiste, y los costos de transporte corren por cuenta de Rumí.",
          ],
          "Una vez recibida la solicitud completa, las entidades participantes del proceso de pago harán la reversión en los plazos previstos por la ley. Si hubiera controversia, se resolverá según lo establecido por la Superintendencia de Industria y Comercio.",
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string) {
  return LEGAL_PAGES.find((p) => p.slug === slug);
}
