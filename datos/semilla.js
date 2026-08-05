/* Datos migrados desde MANNA_Calculadora_Eventos_v23.xlsx — editables desde la app */
window.MANNA_SEMILLA = {
 "meta": {
  "origen": "MANNA_Calculadora_Eventos_v16.xlsx",
  "version": "3.6",
  "moneda": "USD",
  "semillaRev": 10
 },
 "parametros": {
  "merma": 0.1,
  "colchonInventario": 0.15,
  "aumentoInterno": 0.25,
  "margenObjetivo": 0.35,
  "redondeo": "Proximo $5",
  "incluirDuenos": true,
  "mostrarRentabilidad": true,
  "comisionPago": 0,
  "salesTax": 0.06,
  "minimoEvento": 650,
  "aplicarMinimo": true,
  "reservaEmpaques": 0,
  "hieloComprado": true,
  "servicioCrepes": "Food boat (estandar)",
  "aplicarSalesTax": true
 },
 "evento": {
  "cliente": "Ejemplo: evento de muestra",
  "fecha": "",
  "lugar": "",
  "notas": "",
  "invitados": 150,
  "horas": 4,
  "millas": 40,
  "porPersona": {
   "cafe": 2,
   "matcha": 0,
   "sparkling": 0,
   "crepes": 2
  },
  "mezclaLeche": {
   "LECHE_ENTERA": 1,
   "LECHE_DESLAC": 0,
   "LECHE_AVENA": 0,
   "LECHE_ALMEND": 0
  },
  "aguaPrimo": 1,
  "otrosGastos": {
   "transporte": 95,
   "gasolina": 40,
   "estacionamiento": 0,
   "rentaEquipo": 0,
   "permisos": 0,
   "gasPropano": 18,
   "entrega": 0,
   "contingencia": 0,
   "otroPersonalizado": 0
  },
  "signature": {
   "ofrecer": false,
   "id": "SIG_CARAMEL",
   "modo": "cantidad",
   "cantidad": 0,
   "pct": 0,
   "usarCostoManual": false,
   "nombre": "",
   "costoUnitario": 0,
   "nota": "",
   "activo": false
  },
  "otroGastoNota": "",
  "customDesign": {
   "activo": false,
   "cantidad": 0,
   "nota": ""
  },
  "hielo": {
   "coolerGrande": 3,
   "reservaColeman": 2
  },
  "syrups": {
   "JAR_VAINILLA": 2,
   "JAR_CARAMELO": 2,
   "JAR_AVELLANA": 2
  },
  "vasoFrio12": "VASO_FRIO_12",
  "aumentoInsumos": 0.25,
  "aplicarSalesTax": true,
  "salesTaxPct": 0.06,
  "motivoSinTax": ""
 },
 "ingredientes": [
  {
   "id": "LECHE_ENTERA",
   "nombre": "Leche entera  (PREDETERMINADA)",
   "precioCompra": 3.69,
   "cantPresentacion": 1,
   "unidadPresentacion": "gal",
   "factorBase": 3898.9723,
   "unidadBase": "g",
   "densidad": 1.03,
   "proveedor": "Walmart",
   "notas": "Unidad base GRAMOS. El precio se sigue comprando por galon. 1 gal = 3,785.41 ml. CONFIRMADA 1.03 g/ml. Default para TODAS las recetas, incluida la masa.",
   "derivado": false
  },
  {
   "id": "LECHE_DESLAC",
   "nombre": "Leche deslactosada",
   "precioCompra": 3.08,
   "cantPresentacion": 64,
   "unidadPresentacion": "oz",
   "factorBase": 30.460705,
   "unidadBase": "g",
   "densidad": 1.03,
   "proveedor": "Walmart",
   "notas": "Unidad base GRAMOS. El precio se sigue comprando por envase de 64 oz. 1 oz liq = 29.5735 ml. Densidad por verificar.",
   "derivado": false
  },
  {
   "id": "LECHE_AVENA",
   "nombre": "Leche de avena",
   "precioCompra": 4.99,
   "cantPresentacion": 64,
   "unidadPresentacion": "oz",
   "factorBase": 30.460705,
   "unidadBase": "g",
   "densidad": 1.03,
   "proveedor": "Walmart",
   "notas": "Unidad base GRAMOS. El precio se sigue comprando por envase de 64 oz. 1 oz liq = 29.5735 ml. Densidad por verificar.",
   "derivado": false
  },
  {
   "id": "LECHE_ALMEND",
   "nombre": "Leche de almendras",
   "precioCompra": 4.99,
   "cantPresentacion": 96,
   "unidadPresentacion": "oz",
   "factorBase": 30.460705,
   "unidadBase": "g",
   "densidad": 1.03,
   "proveedor": "Walmart",
   "notas": "Unidad base GRAMOS. El precio se sigue comprando por envase de 64 oz. 1 oz liq = 29.5735 ml. Densidad por verificar.",
   "derivado": false
  },
  {
   "id": "LECHE",
   "nombre": "Leche ACTIVA (mezcla del evento)",
   "precioCompra": null,
   "cantPresentacion": null,
   "unidadPresentacion": null,
   "factorBase": null,
   "unidadBase": "g",
   "densidad": 1.03,
   "proveedor": "—",
   "notas": "CALCULADA: promedio ponderado ($/g) segun la mezcla de leche de la Cotizacion.",
   "derivado": true
  },
  {
   "id": "CAFE",
   "nombre": "Cafe Artesano",
   "precioCompra": 19,
   "cantPresentacion": 2,
   "unidadPresentacion": "lb",
   "factorBase": 453.592,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "Proveedor de cafe",
   "notas": "2 lb = 907.18 g",
   "derivado": false
  },
  {
   "id": "MATCHA",
   "nombre": "Matcha ACTIVO (segun selector)",
   "precioCompra": null,
   "cantPresentacion": null,
   "unidadPresentacion": null,
   "factorBase": null,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CALCULADO: sigue el selector de matcha (hoja Mezclas). Culinario por defecto.",
   "derivado": true
  },
  {
   "id": "AGUA_GAS",
   "nombre": "Agua mineral con gas",
   "precioCompra": null,
   "cantPresentacion": null,
   "unidadPresentacion": "botella",
   "factorBase": 1,
   "unidadBase": "botella",
   "densidad": null,
   "proveedor": null,
   "notas": "PENDIENTE: precio y botellas por paquete",
   "derivado": false
  },
  {
   "id": "PULPA",
   "nombre": "Pulpa ACTIVA (mezcla de sabores)",
   "precioCompra": null,
   "cantPresentacion": null,
   "unidadPresentacion": null,
   "factorBase": null,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "Mercado latino",
   "notas": "CALCULADO: promedio ponderado segun el reparto de sabores (hoja Mezclas).",
   "derivado": true
  },
  {
   "id": "JAR_VAINILLA",
   "nombre": "Monin French Vanilla Syrup",
   "precioCompra": 55,
   "cantPresentacion": 4,
   "unidadPresentacion": "L",
   "factorBase": 33.814,
   "unidadBase": "oz",
   "densidad": 1.31,
   "proveedor": null,
   "notas": "Precio y presentacion vienen del SELECTOR DE PROVEEDOR. Predeterminado WebstaurantStore; Amazon queda como alternativa.",
   "derivado": false,
   "proveedorSyrup": "WebstaurantStore",
   "densidadNota": "Referencia tecnica PROVISIONAL: especificacion de Monin Vanilla regular 1.309 +/- 0.005 g/mL. NO es la sugar-free. 1 L = 1,310 g; 4 L = 5,240 g."
  },
  {
   "id": "JAR_CARAMELO",
   "nombre": "Monin Caramel Syrup",
   "precioCompra": 58.06,
   "cantPresentacion": 4,
   "unidadPresentacion": "L",
   "factorBase": 33.814,
   "unidadBase": "oz",
   "densidad": 1.29,
   "proveedor": null,
   "notas": "Precio y presentacion vienen del SELECTOR DE PROVEEDOR. Predeterminado WebstaurantStore; Amazon queda como alternativa.",
   "derivado": false,
   "proveedorSyrup": "WebstaurantStore",
   "densidadNota": "Ficha tecnica documentada. 1 L = 1,290 g; 4 L = 5,160 g."
  },
  {
   "id": "JAR_AVELLANA",
   "nombre": "Monin Hazelnut Syrup",
   "precioCompra": 61.99,
   "cantPresentacion": 4,
   "unidadPresentacion": "L",
   "factorBase": 33.814,
   "unidadBase": "oz",
   "densidad": 1.29,
   "proveedor": null,
   "notas": "Precio y presentacion vienen del SELECTOR DE PROVEEDOR. Predeterminado WebstaurantStore; Amazon queda como alternativa.",
   "derivado": false,
   "proveedorSyrup": "WebstaurantStore",
   "densidadNota": "Ficha tecnica documentada 1.290 +/- 0.005 g/mL. 1 L = 1,290 g; 4 L = 5,160 g."
  },
  {
   "id": "HARINA",
   "nombre": "Harina",
   "precioCompra": 2.38,
   "cantPresentacion": 5,
   "unidadPresentacion": "lb",
   "factorBase": 453.592,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "Confirmado $2.38 / 5 lb",
   "derivado": false
  },
  {
   "id": "HUEVO",
   "nombre": "Huevos",
   "precioCompra": 7.13,
   "cantPresentacion": 60,
   "unidadPresentacion": "u",
   "factorBase": 1,
   "unidadBase": "u",
   "densidad": null,
   "proveedor": null,
   "notas": "Confirmado $7.13 / 60 u",
   "derivado": false
  },
  {
   "id": "LECHE_COND",
   "nombre": "Leche condensada",
   "precioCompra": 2.99,
   "cantPresentacion": 14,
   "unidadPresentacion": "oz",
   "factorBase": 28.3495,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "Confirmado $2.99 / 14 oz. Unidad base en GRAMOS (1 oz = 28.3495 g).",
   "derivado": false
  },
  {
   "id": "FRESA_A",
   "nombre": "Fresas — Proveedor A (default)",
   "precioCompra": 5.12,
   "cantPresentacion": 2,
   "unidadPresentacion": "lb",
   "factorBase": 453.5925,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "Proveedor A",
   "notas": "Default para no subcotizar",
   "derivado": false
  },
  {
   "id": "FRESA_B",
   "nombre": "Fresas — Proveedor B",
   "precioCompra": 3.99,
   "cantPresentacion": 2,
   "unidadPresentacion": "lb",
   "factorBase": 453.5925,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "Proveedor B",
   "notas": "Opcion mas barata",
   "derivado": false
  },
  {
   "id": "FRESA",
   "nombre": "Fresas ACTIVAS",
   "precioCompra": null,
   "cantPresentacion": null,
   "unidadPresentacion": null,
   "factorBase": null,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "—",
   "notas": "CALCULADA: sigue el selector de proveedor en la Cotizacion",
   "derivado": true
  },
  {
   "id": "NUTELLA",
   "nombre": "Nutella",
   "precioCompra": 60.02,
   "cantPresentacion": 6,
   "unidadPresentacion": "kg",
   "factorBase": 1000,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "6 kg",
   "derivado": false
  },
  {
   "id": "AREQUIPE",
   "nombre": "Arequipe (dulce de leche)",
   "precioCompra": 45,
   "cantPresentacion": 24,
   "unidadPresentacion": "lb",
   "factorBase": 453.592,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "24 lb = 10,886 g",
   "derivado": false
  },
  {
   "id": "BANANO",
   "nombre": "Bananos  (peso neto ESTIMADO)",
   "precioCompra": 1.74,
   "cantPresentacion": 6,
   "unidadPresentacion": "u por bunch",
   "factorBase": 120,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "Mercado local",
   "notas": "ESTIMADO, NO CONFIRMADO: 120 g netos por banana (celda naranja). Pesa una real y corrige. Cant. presentacion = bananas por bunch (6; rango real 5-7). Precio = $ por bunch.",
   "derivado": false
  },
  {
   "id": "QUESO",
   "nombre": "Queso costeno",
   "precioCompra": 8,
   "cantPresentacion": 1,
   "unidadPresentacion": "lb",
   "factorBase": 453.592,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "Mercado latino",
   "notas": "CONFIRMADO $8.00 / 1 lb = 453.592 g. Lo usan Crepe Arequipe y Queso y Crepe Oblea.",
   "derivado": false
  },
  {
   "id": "PANELA",
   "nombre": "Panela",
   "precioCompra": 3.0,
   "cantPresentacion": 400,
   "unidadPresentacion": "g",
   "factorBase": 1,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "Proveedor por confirmar",
   "notas": "CONFIRMADO $3.00 / 400 g = $0.0075/g. Proveedor por confirmar. Shipping y purchase tax editables en 0.",
   "derivado": false,
   "shipping": 0,
   "taxCompra": 0
  },
  {
   "id": "CACAO",
   "nombre": "Cacao organico",
   "precioCompra": 18.99,
   "cantPresentacion": 16,
   "unidadPresentacion": "oz",
   "factorBase": 28.3495,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "Cargado, sin uso en recetas",
   "derivado": false
  },
  {
   "id": "BLUEBERRY",
   "nombre": "Blueberries",
   "precioCompra": 8.87,
   "cantPresentacion": 18,
   "unidadPresentacion": "oz",
   "factorBase": 28.3495,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "Cargado, sin uso en recetas",
   "derivado": false
  },
  {
   "id": "KIWI",
   "nombre": "Kiwi fresco",
   "precioCompra": 4.62,
   "cantPresentacion": 2,
   "unidadPresentacion": "lb",
   "factorBase": 453.592,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "Cargado, sin uso en recetas",
   "derivado": false
  },
  {
   "id": "KIWI_SG",
   "nombre": "Kiwi Zespri Sungold",
   "precioCompra": 8.98,
   "cantPresentacion": 2,
   "unidadPresentacion": "lb",
   "factorBase": 453.592,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "Cargado, sin uso en recetas",
   "derivado": false
  },
  {
   "id": "AGUA_PRIMO",
   "nombre": "Agua Primo (garrafon 5 gal)",
   "precioCompra": 3,
   "cantPresentacion": 1,
   "unidadPresentacion": "garrafon",
   "factorBase": 1,
   "unidadBase": "garrafon",
   "densidad": null,
   "proveedor": null,
   "notas": "Consumible de la maquina. NO es ingrediente de bebida",
   "derivado": false
  },
  {
   "id": "AZUCAR",
   "nombre": "Azucar",
   "precioCompra": 12.89,
   "cantPresentacion": 10,
   "unidadPresentacion": "lb",
   "factorBase": 453.592,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "Precio y presentacion vienen del SELECTOR DE AZUCAR (Mezclas, bloque F). Conversion editable: 1 lb = 453.592 g.",
   "derivado": false
  },
  {
   "id": "SAL",
   "nombre": "Sal",
   "precioCompra": 1.86,
   "cantPresentacion": 26,
   "unidadPresentacion": "oz",
   "factorBase": 28.3495,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "Tienda local",
   "notas": "CONFIRMADO $1.86 / 26 oz de peso = 737.09 g. Conversion editable: 1 oz de peso = 28.3495 g.",
   "derivado": false
  },
  {
   "id": "ACEITE",
   "nombre": "Aceite",
   "precioCompra": 9.64,
   "cantPresentacion": 1,
   "unidadPresentacion": "gal",
   "factorBase": 128,
   "unidadBase": "oz",
   "densidad": null,
   "proveedor": "Tienda local",
   "notas": "CONFIRMADO $9.64 / 1 galon = 128 oz liquidas. Conversion editable: 1 gal = 128 oz liq.",
   "derivado": false
  },
  {
   "id": "VAINILLA_EXT",
   "nombre": "Extracto de vainilla",
   "precioCompra": 2.84,
   "cantPresentacion": 8.3,
   "unidadPresentacion": "oz",
   "factorBase": 29.5735,
   "unidadBase": "ml",
   "densidad": null,
   "proveedor": "Tienda local",
   "notas": "CONFIRMADO $2.84 / 8.3 oz liq = 245.46 ml. Conversion editable: 1 oz liq = 29.5735 ml. NO es el jarabe Monin.",
   "derivado": false
  },
  {
   "id": "MERMELADA",
   "nombre": "Mermelada",
   "precioCompra": null,
   "cantPresentacion": null,
   "unidadPresentacion": "oz",
   "factorBase": 28.3495,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "PENDIENTE: precio y presentacion. Bloquea SOLO si Crepe Oblea esta activo.",
   "derivado": false
  },
  {
   "id": "HIELO",
   "nombre": "Hielo",
   "precioCompra": 2.5,
   "cantPresentacion": 16,
   "unidadPresentacion": "lb",
   "factorBase": 453.592,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "Tienda local",
   "notas": "CONFIRMADO $2.50 / bolsa de 16 lb = 7,257.47 g. Recibe el aumento interno de 25% como cualquier insumo. Se cobra solo si \"Hielo comprado para este evento\" = Si (Cotizacion C69).",
   "derivado": false
  },
  {
   "id": "MATCHA_CUL",
   "nombre": "Matcha Organic culinario",
   "precioCompra": 29,
   "cantPresentacion": 340,
   "unidadPresentacion": "g",
   "factorBase": 1,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CONFIRMADO $29.00 / 340 g. Opcion PREDETERMINADA del selector.",
   "derivado": false
  },
  {
   "id": "MATCHA_CER",
   "nombre": "Matcha Naoki ceremonial",
   "precioCompra": 39.99,
   "cantPresentacion": 100,
   "unidadPresentacion": "g",
   "factorBase": 1,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CONFIRMADO $39.99 / 100 g.",
   "derivado": false
  },
  {
   "id": "PULPA_FRESA",
   "nombre": "Pulpa de fresa",
   "precioCompra": 15.84,
   "cantPresentacion": 64,
   "unidadPresentacion": "oz",
   "factorBase": 28.35,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CONFIRMADO $15.84 / envase 64 oz = 1,814.4 g.",
   "derivado": false
  },
  {
   "id": "PULPA_JAMAICA",
   "nombre": "Pulpa de flor de Jamaica",
   "precioCompra": 15.84,
   "cantPresentacion": 64,
   "unidadPresentacion": "oz",
   "factorBase": 28.35,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CONFIRMADO $15.84 / envase 64 oz = 1,814.4 g.",
   "derivado": false
  },
  {
   "id": "PULPA_LULO",
   "nombre": "Pulpa de lulo",
   "precioCompra": 15.84,
   "cantPresentacion": 64,
   "unidadPresentacion": "oz",
   "factorBase": 28.35,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CONFIRMADO $15.84 / envase 64 oz = 1,814.4 g.",
   "derivado": false
  },
  {
   "id": "PULPA_PINA",
   "nombre": "Pulpa de pina",
   "precioCompra": 15.84,
   "cantPresentacion": 64,
   "unidadPresentacion": "oz",
   "factorBase": 28.35,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CONFIRMADO $15.84 / envase 64 oz = 1,814.4 g.",
   "derivado": false
  },
  {
   "id": "PULPA_GUAYABA",
   "nombre": "Pulpa de guayaba",
   "precioCompra": 15.84,
   "cantPresentacion": 64,
   "unidadPresentacion": "oz",
   "factorBase": 28.35,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CONFIRMADO $15.84 / envase 64 oz = 1,814.4 g.",
   "derivado": false
  },
  {
   "id": "PULPA_MANGO",
   "nombre": "Pulpa de mango",
   "precioCompra": 15.84,
   "cantPresentacion": 64,
   "unidadPresentacion": "oz",
   "factorBase": 28.35,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CONFIRMADO $15.84 / envase 64 oz = 1,814.4 g.",
   "derivado": false
  },
  {
   "id": "PULPA_MORA",
   "nombre": "Pulpa de mora",
   "precioCompra": 15.84,
   "cantPresentacion": 64,
   "unidadPresentacion": "oz",
   "factorBase": 28.35,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CONFIRMADO $15.84 / envase 64 oz = 1,814.4 g.",
   "derivado": false
  },
  {
   "id": "PULPA_GUANABANA",
   "nombre": "Pulpa de guanabana",
   "precioCompra": 17.81,
   "cantPresentacion": 64,
   "unidadPresentacion": "oz",
   "factorBase": 28.35,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CONFIRMADO $17.81 / envase 64 oz = 1,814.4 g.",
   "derivado": false
  },
  {
   "id": "PULPA_MARACUYA",
   "nombre": "Pulpa de maracuya",
   "precioCompra": 17.81,
   "cantPresentacion": 64,
   "unidadPresentacion": "oz",
   "factorBase": 28.35,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CONFIRMADO $17.81 / envase 64 oz = 1,814.4 g.",
   "derivado": false
  },
  {
   "precioCompra": 4.83,
   "cantPresentacion": 32,
   "unidadPresentacion": "oz",
   "factorBase": null,
   "unidadBase": "g",
   "densidad": 0.994,
   "proveedor": "Walmart",
   "notas": "PENDIENTE la densidad g/ml. 32 oz liquidas NO son 907.184 g. Sin densidad no se puede costear: bloquea solo si hay una Signature activa que la use. Factor a gramos = densidad x 29.5735.",
   "derivado": false,
   "id": "CREMA",
   "nombre": "Heavy Whipping Cream (Great Value)",
   "densidadNota": "Aproximacion documentada para crema liquida, fria y sin batir. Mostrar 0.99 (~1.00). 32 fl oz = 946.35 mL = ~940.68 g. El aire cambia el volumen, no la masa."
  },
  {
   "precioCompra": 6.22,
   "cantPresentacion": 16,
   "unidadPresentacion": "oz netos",
   "factorBase": 28.3495,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "Walmart",
   "notas": "CONFIRMADO $6.22 / 16 oz netos = 453.592 g. Peso neto, no volumen: no necesita densidad.",
   "derivado": false,
   "id": "SAUCE_CARAMELO",
   "nombre": "Ghirardelli Caramel Sauce"
  },
  {
   "precioCompra": 8.48,
   "cantPresentacion": 16,
   "unidadPresentacion": "oz netos",
   "factorBase": 28.3495,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "Walmart",
   "notas": "CONFIRMADO $8.48 / 16 oz netos = 453.592 g.",
   "derivado": false,
   "id": "SAUCE_CHOCOLATE",
   "nombre": "Ghirardelli Chocolate Flavored Sauce"
  },
  {
   "precioCompra": 59.99,
   "cantPresentacion": 2.2,
   "unidadPresentacion": "lb",
   "factorBase": 453.592,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": null,
   "notas": "CONFIRMADO $59.99 / 2.2 lb = 997.9024 g = ~$0.060116/g. 5 g por Dubai Chocolate Cloud Latte.",
   "derivado": false,
   "id": "PISTACHIO_CRUMBLE",
   "nombre": "Pistachio Crumbles"
  },
  {
   "precioCompra": 6.46,
   "cantPresentacion": 7.12,
   "unidadPresentacion": "oz",
   "factorBase": 28.3495,
   "unidadBase": "g",
   "densidad": null,
   "proveedor": "Amazon",
   "notas": "CONFIRMADO $6.46 / 7.12 oz de peso = 201.848 g = ~$0.0320/g. Sin tax de compra confirmado.",
   "derivado": false,
   "id": "CANELA",
   "nombre": "McCormick Ground Cinnamon",
   "shipping": 0,
   "taxCompra": 0
  },
  {
   "precioCompra": 55.0,
   "cantPresentacion": 4,
   "unidadPresentacion": "L",
   "factorBase": null,
   "unidadBase": "g",
   "densidad": 1.31,
   "proveedor": null,
   "notas": "Precio y presentacion vienen del SELECTOR DE PROVEEDOR. Densidad g/ml PENDIENTE: sin ella no se puede convertir gramos a costo. Predeterminado WebstaurantStore; Amazon queda como alternativa.",
   "derivado": false,
   "id": "SYRUP_VAINILLA",
   "nombre": "Monin French Vanilla (para cloud, en gramos)",
   "proveedorSyrup": "WebstaurantStore",
   "densidadNota": "Referencia tecnica PROVISIONAL: Monin Vanilla regular 1.309 +/- 0.005 g/mL. NO es la sugar-free."
  },
  {
   "precioCompra": 58.06,
   "cantPresentacion": 4,
   "unidadPresentacion": "L",
   "factorBase": null,
   "unidadBase": "g",
   "densidad": 1.285,
   "proveedor": null,
   "notas": "Precio y presentacion vienen del SELECTOR DE PROVEEDOR. Densidad g/ml PENDIENTE: sin ella no se puede convertir gramos a costo. Pistachio conserva Amazon: no venia en el carrito confirmado de WebstaurantStore.",
   "derivado": false,
   "id": "SYRUP_PISTACHIO",
   "nombre": "Monin Pistachio Syrup (para cloud, en gramos)",
   "proveedorSyrup": "Amazon",
   "densidadNota": "Aproximacion documentada: peso neto del producto estadounidense, ~11.33 lb por 4 L. Mostrar 1.29. 1 L = 1,285 g; 4 L = 5,140 g."
  }
 ],
 "empaques": [
  {
   "id": "VASO_PAPEL",
   "nombre": "Vaso de papel",
   "precioPaquete": 64.99,
   "unidadesPorPaquete": 1000,
   "notas": "Bebidas calientes"
  },
  {
   "id": "TAPA_CAL",
   "nombre": "Tapa caliente",
   "precioPaquete": 53.99,
   "unidadesPorPaquete": 1000,
   "notas": "Bebidas calientes"
  },
  {
   "id": "SLEEVE",
   "nombre": "Funda / sleeve",
   "precioPaquete": 44.95,
   "unidadesPorPaquete": 1000,
   "notas": "Bebidas calientes"
  },
  {
   "id": "VASO_PLAS",
   "nombre": "Vaso plastico 16 oz",
   "precioPaquete": 20,
   "unidadesPorPaquete": 1000,
   "notas": "REFERENCIA (venta regular). Conjunto frio 16 oz = $0.04 por bebida: $0.02 vaso + $0.02 tapa. No se usa en eventos de 12 oz."
  },
  {
   "id": "TAPA_FRIA",
   "nombre": "Tapa fria",
   "precioPaquete": 20,
   "unidadesPorPaquete": 1000,
   "notas": "REFERENCIA (venta regular). Mitad del conjunto frio de 16 oz: $0.02 por tapa. No se usa en eventos de 12 oz."
  },
  {
   "id": "SERVILLETA",
   "nombre": "Servilleta",
   "precioPaquete": 39.99,
   "unidadesPorPaquete": 1000,
   "notas": "OPCIONAL por evento — no se asume"
  },
  {
   "id": "TENEDOR",
   "nombre": "Tenedor",
   "precioPaquete": 37.99,
   "unidadesPorPaquete": 1000,
   "notas": "OPCIONAL por evento — no se asume"
  },
  {
   "id": "CUCHILLO",
   "nombre": "Cuchillo",
   "precioPaquete": 21.99,
   "unidadesPorPaquete": 1000,
   "notas": "OPCIONAL por evento — no se asume"
  },
  {
   "id": "FOOD_BOAT",
   "nombre": "Food boat para crepes",
   "precioPaquete": 29.99,
   "unidadesPorPaquete": 200,
   "notas": "1 por crepe por defecto; cambialo a 0 si no se necesita"
  },
  {
   "id": "PITILLO",
   "nombre": "Pitillo",
   "precioPaquete": null,
   "unidadesPorPaquete": null,
   "notas": "PENDIENTE PRECIO. Opcional: bloquea SOLO si lo asignas a un producto activo."
  },
  {
   "id": "MEZCLADOR",
   "nombre": "Mezclador",
   "precioPaquete": 35.99,
   "unidadesPorPaquete": 4000,
   "notas": "$35.99 / 4,000 u = $0.0090 unitario ($0.01125 con el 25%). En 0 por defecto: no bloquea si no se usa."
  },
  {
   "id": "VASO_FRIO_12",
   "nombre": "Vaso frio 12 oz",
   "precioPaquete": 45,
   "unidadesPorPaquete": 1000,
   "notas": "CONFIRMADO. Conjunto frio 12 oz = $0.09 por bebida: $0.045 vaso + $0.045 tapa. $45.00 / 1,000 u."
  },
  {
   "id": "TAPA_FRIA_12",
   "nombre": "Tapa fria 12 oz",
   "precioPaquete": 45,
   "unidadesPorPaquete": 1000,
   "notas": "CONFIRMADO. Mitad del conjunto frio de 12 oz: $0.045 por tapa. $45.00 / 1,000 u."
  },
  {
   "id": "VASO_USHAPE",
   "nombre": "U-Shape Plastic Cup 12 oz",
   "precioPaquete": 92.99,
   "unidadesPorPaquete": 1000,
   "proveedor": "",
   "shipping": 0,
   "taxCompra": 0,
   "notas": "Solo el vaso, sin tapa. Compatible con la tapa fria de 98 mm existente. $92.99 / 1,000 = $0.09299 por unidad."
  }
 ],
 "productos": [
  {
   "id": "P01",
   "categoria": "Cafe",
   "nombre": "Latte 12 oz",
   "archivado": false,
   "receta": {
    "LECHE": 245,
    "CAFE": 18,
    "MATCHA": 0,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 0,
    "NUTELLA": 0,
    "AREQUIPE": 0,
    "BANANO": 0,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 0
   },
   "empaques": {
    "VASO_PAPEL": 1,
    "TAPA_CAL": 1,
    "SLEEVE": 1,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 0,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 0,
    "TAPA_FRIA_12": 0
   },
   "pctPerfil": 0.4
  },
  {
   "id": "P02",
   "categoria": "Cafe",
   "nombre": "Latte 16 oz — ARCHIVADO",
   "archivado": true,
   "receta": {
    "LECHE": 395.99,
    "CAFE": 18,
    "MATCHA": 0,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 0,
    "NUTELLA": 0,
    "AREQUIPE": 0,
    "BANANO": 0,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 0
   },
   "empaques": {
    "VASO_PAPEL": 0,
    "TAPA_CAL": 0,
    "SLEEVE": 0,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 0,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 0,
    "TAPA_FRIA_12": 0
   },
   "pctPerfil": 0
  },
  {
   "id": "P03",
   "categoria": "Cafe",
   "nombre": "Cappuccino 12 oz",
   "archivado": false,
   "receta": {
    "LECHE": 182.76,
    "CAFE": 18,
    "MATCHA": 0,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 0,
    "NUTELLA": 0,
    "AREQUIPE": 0,
    "BANANO": 0,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 0
   },
   "empaques": {
    "VASO_PAPEL": 1,
    "TAPA_CAL": 1,
    "SLEEVE": 1,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 0,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 0,
    "TAPA_FRIA_12": 0
   },
   "pctPerfil": 0.1
  },
  {
   "id": "P04",
   "categoria": "Cafe",
   "nombre": "Americano 12 oz",
   "archivado": false,
   "receta": {
    "LECHE": 0,
    "CAFE": 18,
    "MATCHA": 0,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 0,
    "NUTELLA": 0,
    "AREQUIPE": 0,
    "BANANO": 0,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 0
   },
   "empaques": {
    "VASO_PAPEL": 1,
    "TAPA_CAL": 1,
    "SLEEVE": 1,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 0,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 0,
    "TAPA_FRIA_12": 0
   },
   "pctPerfil": 0.1
  },
  {
   "id": "P05",
   "categoria": "Cafe",
   "nombre": "Iced Latte 12 oz",
   "archivado": false,
   "receta": {
    "LECHE": 176,
    "CAFE": 18,
    "MATCHA": 0,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 0,
    "NUTELLA": 0,
    "AREQUIPE": 0,
    "BANANO": 0,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 110
   },
   "empaques": {
    "VASO_PAPEL": 0,
    "TAPA_CAL": 0,
    "SLEEVE": 0,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 0,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 1,
    "TAPA_FRIA_12": 1
   },
   "pctPerfil": 0.4
  },
  {
   "id": "P06",
   "categoria": "Cafe",
   "nombre": "Signature drink 12 oz",
   "archivado": false,
   "receta": {
    "LECHE": 365.53,
    "CAFE": 18,
    "MATCHA": 0,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 1,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 0,
    "NUTELLA": 0,
    "AREQUIPE": 0,
    "BANANO": 0,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 0
   },
   "empaques": {
    "VASO_PAPEL": 1,
    "TAPA_CAL": 1,
    "SLEEVE": 1,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 0,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 0,
    "TAPA_FRIA_12": 0
   },
   "pctPerfil": 0
  },
  {
   "id": "P07",
   "categoria": "Matcha",
   "nombre": "Matcha Latte 12 oz",
   "archivado": false,
   "receta": {
    "LECHE": 190,
    "CAFE": 0,
    "MATCHA": 2,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 0,
    "NUTELLA": 0,
    "AREQUIPE": 0,
    "BANANO": 0,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 110
   },
   "empaques": {
    "VASO_PAPEL": 0,
    "TAPA_CAL": 0,
    "SLEEVE": 0,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 0,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 1,
    "TAPA_FRIA_12": 1
   },
   "pctPerfil": 0.4
  },
  {
   "id": "P08",
   "categoria": "Matcha",
   "nombre": "Matcha con pulpa 12 oz",
   "archivado": false,
   "receta": {
    "LECHE": 150,
    "CAFE": 0,
    "MATCHA": 2,
    "AGUA_GAS": 0,
    "PULPA": 60,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 0,
    "NUTELLA": 0,
    "AREQUIPE": 0,
    "BANANO": 0,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 110
   },
   "empaques": {
    "VASO_PAPEL": 0,
    "TAPA_CAL": 0,
    "SLEEVE": 0,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 0,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 1,
    "TAPA_FRIA_12": 1
   },
   "pctPerfil": 0.6
  },
  {
   "id": "P09",
   "categoria": "Sparkling",
   "nombre": "Sparkling de Fruta 12 oz",
   "archivado": false,
   "receta": {
    "LECHE": 0,
    "CAFE": 0,
    "MATCHA": 0,
    "AGUA_GAS": 1,
    "PULPA": null,
    "JAR_VAINILLA": 0.5,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 0,
    "NUTELLA": 0,
    "AREQUIPE": 0,
    "BANANO": 0,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 0
   },
   "empaques": {
    "VASO_PAPEL": 0,
    "TAPA_CAL": 0,
    "SLEEVE": 0,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 0,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 1,
    "TAPA_FRIA_12": 1
   },
   "pctPerfil": 1
  },
  {
   "id": "P10",
   "categoria": "Crepes",
   "nombre": "Crepe Nutella y Banano",
   "archivado": false,
   "receta": {
    "LECHE": 0,
    "CAFE": 0,
    "MATCHA": 0,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 0,
    "NUTELLA": 40,
    "AREQUIPE": 0,
    "BANANO": 90,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 0
   },
   "empaques": {
    "VASO_PAPEL": 0,
    "TAPA_CAL": 0,
    "SLEEVE": 0,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 1,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 0,
    "TAPA_FRIA_12": 0
   },
   "pctPerfil": 0.3
  },
  {
   "id": "P11",
   "categoria": "Crepes",
   "nombre": "Crepe Nutella y Fresa",
   "archivado": false,
   "receta": {
    "LECHE": 0,
    "CAFE": 0,
    "MATCHA": 0,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 90,
    "NUTELLA": 40,
    "AREQUIPE": 0,
    "BANANO": 0,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 0
   },
   "empaques": {
    "VASO_PAPEL": 0,
    "TAPA_CAL": 0,
    "SLEEVE": 0,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 1,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 0,
    "TAPA_FRIA_12": 0
   },
   "pctPerfil": 0.3
  },
  {
   "id": "P12",
   "categoria": "Crepes",
   "nombre": "Crepe Fresas y Crema",
   "archivado": false,
   "receta": {
    "LECHE": 0,
    "CAFE": 0,
    "MATCHA": 0,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 28.3495,
    "FRESA": 90,
    "NUTELLA": 0,
    "AREQUIPE": 0,
    "BANANO": 0,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 0
   },
   "empaques": {
    "VASO_PAPEL": 0,
    "TAPA_CAL": 0,
    "SLEEVE": 0,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 1,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 0,
    "TAPA_FRIA_12": 0
   },
   "pctPerfil": 0.25
  },
  {
   "id": "P13",
   "categoria": "Crepes",
   "nombre": "Crepe Arequipe y Banano",
   "archivado": false,
   "receta": {
    "LECHE": 0,
    "CAFE": 0,
    "MATCHA": 0,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 0,
    "NUTELLA": 0,
    "AREQUIPE": 35,
    "BANANO": 90,
    "QUESO": 0,
    "MERMELADA": 0,
    "HIELO": 0
   },
   "empaques": {
    "VASO_PAPEL": 0,
    "TAPA_CAL": 0,
    "SLEEVE": 0,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 1,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 0,
    "TAPA_FRIA_12": 0
   },
   "pctPerfil": 0.15
  },
  {
   "id": "P14",
   "categoria": "Crepes",
   "nombre": "Crepe Arequipe y Queso",
   "archivado": false,
   "receta": {
    "LECHE": 0,
    "CAFE": 0,
    "MATCHA": 0,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 0,
    "FRESA": 0,
    "NUTELLA": 0,
    "AREQUIPE": 35,
    "BANANO": 0,
    "QUESO": 25,
    "MERMELADA": 0,
    "HIELO": 0
   },
   "empaques": {
    "VASO_PAPEL": 0,
    "TAPA_CAL": 0,
    "SLEEVE": 0,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 1,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 0,
    "TAPA_FRIA_12": 0
   },
   "pctPerfil": 0
  },
  {
   "id": "P15",
   "categoria": "Crepes",
   "nombre": "Crepe Oblea",
   "archivado": false,
   "receta": {
    "LECHE": 0,
    "CAFE": 0,
    "MATCHA": 0,
    "AGUA_GAS": 0,
    "PULPA": 0,
    "JAR_VAINILLA": 0,
    "HARINA": 0,
    "HUEVO": 0,
    "LECHE_COND": 10,
    "FRESA": 0,
    "NUTELLA": 0,
    "AREQUIPE": 25,
    "BANANO": 0,
    "QUESO": 20,
    "MERMELADA": 10,
    "HIELO": 0
   },
   "empaques": {
    "VASO_PAPEL": 0,
    "TAPA_CAL": 0,
    "SLEEVE": 0,
    "VASO_PLAS": 0,
    "TAPA_FRIA": 0,
    "SERVILLETA": 0,
    "TENEDOR": 0,
    "CUCHILLO": 0,
    "FOOD_BOAT": 1,
    "PITILLO": 0,
    "MEZCLADOR": 0,
    "VASO_FRIO_12": 0,
    "TAPA_FRIA_12": 0
   },
   "pctPerfil": 0
  }
 ],
 "masaCrepes": {
  "crepesPorMezcla": 6,
  "conversiones": {
   "gPorTazaHarina": 120,
   "gPorCdaAzucar": 12.5,
   "gPorCdtaSal": 6,
   "mlPorOz": 29.5735
  },
  "componentes": {
   "Leche": {
    "porMezcla": 244,
    "unidadReceta": "g",
    "unidadBase": "g"
   },
   "Agua": {
    "porMezcla": 8,
    "unidadReceta": "oz",
    "unidadBase": "oz"
   },
   "Harina": {
    "porMezcla": 1.5,
    "unidadReceta": "tazas",
    "unidadBase": "g"
   },
   "Huevos": {
    "porMezcla": 3,
    "unidadReceta": "u",
    "unidadBase": "u"
   },
   "Azucar": {
    "porMezcla": 3,
    "unidadReceta": "cda",
    "unidadBase": "g"
   },
   "Sal": {
    "porMezcla": 1,
    "unidadReceta": "cdta",
    "unidadBase": "g"
   },
   "Extracto de vainilla": {
    "porMezcla": 10,
    "unidadReceta": "ml",
    "unidadBase": "ml"
   },
   "Aceite": {
    "porMezcla": 1.5,
    "unidadReceta": "oz",
    "unidadBase": "oz"
   }
  },
  "mapaIngrediente": {
   "Leche": "LECHE",
   "Harina": "HARINA",
   "Huevos": "HUEVO",
   "Azucar": "AZUCAR",
   "Sal": "SAL",
   "Extracto de vainilla": "VAINILLA_EXT",
   "Aceite": "ACEITE",
   "Agua": null
  }
 },
 "selectores": {
  "matcha": {
   "activo": "Organic culinario",
   "opciones": {
    "Organic culinario": "MATCHA_CUL",
    "Naoki ceremonial": "MATCHA_CER"
   }
  },
  "fresa": {
   "activo": "Proveedor A",
   "opciones": {
    "Proveedor A": "FRESA_A",
    "Proveedor B": "FRESA_B"
   }
  },
  "azucar": {
   "activo": "Opcion 1 — 10 lb",
   "opciones": [
    {
     "nombre": "Opcion 1 — 10 lb",
     "precio": 12.89,
     "cantidad": 10,
     "unidad": "lb"
    },
    {
     "nombre": "Opcion 2 — 4 lb",
     "precio": 3.27,
     "cantidad": 4,
     "unidad": "lb"
    }
   ]
  },
  "pulpa": {
   "Fresa": {
    "id": "PULPA_FRESA",
    "pct": 1
   },
   "Flor de Jamaica": {
    "id": "PULPA_JAMAICA",
    "pct": 0
   },
   "Lulo": {
    "id": "PULPA_LULO",
    "pct": 0
   },
   "Pina": {
    "id": "PULPA_PINA",
    "pct": 0
   },
   "Guayaba": {
    "id": "PULPA_GUAYABA",
    "pct": 0
   },
   "Mango": {
    "id": "PULPA_MANGO",
    "pct": 0
   },
   "Mora": {
    "id": "PULPA_MORA",
    "pct": 0
   },
   "Guanabana": {
    "id": "PULPA_GUANABANA",
    "pct": 0
   },
   "Maracuya": {
    "id": "PULPA_MARACUYA",
    "pct": 0
   }
  }
 },
 "labor": {
  "empleados": [
   {
    "nombre": "Empleado 1",
    "rol": "Barista",
    "tarifa": 0,
    "horas": {
     "consulta": 0,
     "compras": 0,
     "preparacion": 0,
     "montaje": 0,
     "servicio": 0,
     "limpieza": 0,
     "administracion": 0
    },
    "presenteServicio": false
   },
   {
    "nombre": "Empleado 2",
    "rol": "Ayudante de barista",
    "tarifa": 20,
    "horas": {
     "consulta": 0,
     "compras": 0,
     "preparacion": 0,
     "montaje": 1.5,
     "servicio": 4,
     "limpieza": 1.5,
     "administracion": 0
    },
    "presenteServicio": true
   },
   {
    "nombre": "Empleado 3",
    "rol": "Ayudante de reposicion",
    "tarifa": 18,
    "horas": {
     "consulta": 0,
     "compras": 0,
     "preparacion": 3,
     "montaje": 1.5,
     "servicio": 4,
     "limpieza": 1.5,
     "administracion": 0
    },
    "presenteServicio": true
   },
   {
    "nombre": "Empleado 4",
    "rol": null,
    "tarifa": null,
    "horas": {
     "consulta": 0,
     "compras": 0,
     "preparacion": 0,
     "montaje": 0,
     "servicio": 0,
     "limpieza": 0,
     "administracion": 0
    },
    "presenteServicio": false
   },
   {
    "nombre": "Empleado 5",
    "rol": null,
    "tarifa": null,
    "horas": {
     "consulta": 0,
     "compras": 0,
     "preparacion": 0,
     "montaje": 0,
     "servicio": 0,
     "limpieza": 0,
     "administracion": 0
    },
    "presenteServicio": false
   }
  ],
  "duenos": [
   {
    "nombre": "Dueno 1",
    "rol": "Dueno / operacion",
    "tarifa": 30,
    "horas": {
     "consulta": 0,
     "compras": 0,
     "preparacion": 3,
     "montaje": 1.5,
     "servicio": 4,
     "limpieza": 1.5,
     "administracion": 0
    },
    "presenteServicio": true
   },
   {
    "nombre": "Dueno 2",
    "rol": "Dueno / operacion",
    "tarifa": 30,
    "horas": {
     "consulta": 0,
     "compras": 0,
     "preparacion": 3,
     "montaje": 1.5,
     "servicio": 4,
     "limpieza": 1.5,
     "administracion": 0
    },
    "presenteServicio": true
   },
   {
    "nombre": "Dueno 3",
    "rol": null,
    "tarifa": null,
    "horas": {
     "consulta": 0,
     "compras": 0,
     "preparacion": 0,
     "montaje": 0,
     "servicio": 0,
     "limpieza": 0,
     "administracion": 0
    },
    "presenteServicio": false
   }
  ]
 },
 "inventario": {
  "LECHE_ENTERA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "LECHE_DESLAC": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "LECHE_AVENA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "LECHE_ALMEND": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "CAFE": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "MATCHA_CUL": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "AGUA_GAS": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "PULPA_FRESA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "JAR_VAINILLA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "HARINA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "HUEVO": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "LECHE_COND": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "FRESA_A": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "FRESA_B": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "NUTELLA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "AREQUIPE": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "BANANO": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "QUESO": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "VASO_PAPEL": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "TAPA_CAL": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "SLEEVE": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "VASO_PLAS": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "TAPA_FRIA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "SERVILLETA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "TENEDOR": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "CUCHILLO": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "FOOD_BOAT": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "PITILLO": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "MEZCLADOR": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "AGUA_PRIMO": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Consumible"
  },
  "AZUCAR": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "SAL": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "ACEITE": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "VAINILLA_EXT": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "MERMELADA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "VASO_FRIO_12": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "TAPA_FRIA_12": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Empaque"
  },
  "HIELO": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "MATCHA_CER": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "PULPA_JAMAICA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "PULPA_LULO": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "PULPA_PINA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "PULPA_GUAYABA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "PULPA_MANGO": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "PULPA_MORA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "PULPA_GUANABANA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  },
  "PULPA_MARACUYA": {
   "existencias": 0,
   "cargarPaqueteCompleto": false,
   "tipo": "Ingrediente"
  }
 },
 "unidadesPracticas": {
  "LECHE_ENTERA": [
   "galones",
   null
  ],
  "LECHE_DESLAC": [
   "galones",
   null
  ],
  "LECHE_AVENA": [
   "galones",
   null
  ],
  "LECHE_ALMEND": [
   "galones",
   null
  ],
  "CAFE": [
   "lb",
   453.592
  ],
  "HARINA": [
   "lb",
   453.592
  ],
  "FRESA_A": [
   "lb",
   453.592
  ],
  "FRESA_B": [
   "lb",
   453.592
  ],
  "AREQUIPE": [
   "lb",
   453.592
  ],
  "QUESO": [
   "lb",
   453.592
  ],
  "HIELO": [
   "lb",
   453.592
  ],
  "LECHE_COND": [
   "oz",
   28.3495
  ],
  "SAL": [
   "oz",
   28.3495
  ],
  "MERMELADA": [
   "oz",
   28.3495
  ],
  "NUTELLA": [
   "kg",
   1000
  ],
  "BANANO": [
   "bunches",
   null
  ],
  "PULPA_FRESA": [
   "envases 64 oz",
   1814.4
  ],
  "PULPA_JAMAICA": [
   "envases 64 oz",
   1814.4
  ],
  "PULPA_LULO": [
   "envases 64 oz",
   1814.4
  ],
  "PULPA_PINA": [
   "envases 64 oz",
   1814.4
  ],
  "PULPA_GUAYABA": [
   "envases 64 oz",
   1814.4
  ],
  "PULPA_MANGO": [
   "envases 64 oz",
   1814.4
  ],
  "PULPA_MORA": [
   "envases 64 oz",
   1814.4
  ],
  "PULPA_GUANABANA": [
   "envases 64 oz",
   1814.4
  ],
  "PULPA_MARACUYA": [
   "envases 64 oz",
   1814.4
  ]
 },
 "signatures": {
  "costoManual": {
   "activo": false,
   "nombre": "Signature sin receta",
   "costoUnitario": 0,
   "nota": ""
  },
  "recetas": [
   {
    "id": "SIG_CARAMEL",
    "nombre": "Caramel Cloud Latte",
    "activa": false,
    "cloudSyrup": "SAUCE_CARAMELO",
    "receta": {
     "HIELO": 110,
     "CAFE": 18,
     "LECHE": 145,
     "SAUCE_CARAMELO": 25
    },
    "nota": "Caramel sauce: 18 g en el cafe + 7 g de drizzle = 25 g; el cloud aporta 17.25 g mas = 42.25 g por bebida."
   },
   {
    "id": "SIG_MANNA",
    "nombre": "Manna Cloud Latte",
    "activa": false,
    "cloudSyrup": "SYRUP_VAINILLA",
    "receta": {
     "HIELO": 110,
     "CAFE": 18,
     "LECHE": 145,
     "PANELA": 15,
     "CANELA": 0.25
    },
    "nota": "Canela 0.25 g provisional. El cloud aporta 17.25 g de vainilla."
   },
   {
    "id": "SIG_DUBAI",
    "nombre": "Dubai Chocolate Cloud Latte",
    "activa": false,
    "cloudSyrup": "SYRUP_PISTACHIO",
    "receta": {
     "HIELO": 110,
     "CAFE": 18,
     "LECHE": 145,
     "SYRUP_PISTACHIO": 22,
     "SAUCE_CHOCOLATE": 9,
     "PISTACHIO_CRUMBLE": 5
    },
    "nota": "Chocolate 9 g incluye color y drizzle. Pistachio: 22 g en el cafe + 17.25 g del cloud = 39.25 g. Crumbles PENDIENTES."
   },
   {
    "id": "SIG_CACAO",
    "nombre": "Cacao Cloud Latte",
    "activa": false,
    "cloudSyrup": "SYRUP_VAINILLA",
    "receta": {
     "HIELO": 110,
     "CAFE": 18,
     "LECHE": 145,
     "SYRUP_VAINILLA": 22,
     "CACAO": 9,
     "PANELA": 15
    },
    "nota": "Vainilla: 22 g en el cafe + 17.25 g del cloud = 39.25 g. Leche 145 g provisional hasta la prueba fisica."
   }
  ],
  "empaques": {
   "VASO_FRIO_12": 1,
   "TAPA_FRIA_12": 1
  },
  "cloudReceta": {
   "base16oz": {
    "crema": 35,
    "syrup": 23,
    "total": 58
   },
   "factor12oz": 0.75,
   "crema": 26.25,
   "syrup": 17.25,
   "total": 43.5,
   "nota": "Receta confirmada por peso. 16 oz: 35 g de crema + 23 g de syrup = 58 g. Para 12 oz se aplica 0.75: 26.25 + 17.25 = 43.5 g por bebida. El aire cambia el volumen, no el peso que se costea."
  }
 },
 "customDesign": {
  "pack100": 19.79,
  "pack200": 25.79,
  "delivery": 2.99,
  "taxCompra": 0
 },
 "proveedoresSyrup": {
  "WebstaurantStore": {
   "nombre": "WebstaurantStore",
   "casesPedido": 3,
   "litrosPorCase": 4,
   "botellasPorCase": 4,
   "precioProductos": 119.97,
   "shippingTotal": 20.98,
   "taxCompra": 1.51,
   "nota": "Costo entregado calculado a partir de un pedido conjunto de tres cases. Revisar shipping y tax si cambia la composicion del pedido."
  },
  "Amazon": {
   "nombre": "Amazon",
   "casesPedido": 1,
   "litrosPorCase": 4,
   "botellasPorCase": 4,
   "precioProductos": 58.06,
   "shippingTotal": 0,
   "taxCompra": 0,
   "nota": "Precio confirmado por case de 4 L, sin shipping ni tax separados."
  }
 },
 "syrups": {
  "modo": "manual",
  "botellasPorCase": 4,
  "litrosPorBotella": 1,
  "sabores": [
   {
    "id": "JAR_VAINILLA",
    "nombre": "Monin French Vanilla"
   },
   {
    "id": "JAR_CARAMELO",
    "nombre": "Monin Caramel"
   },
   {
    "id": "JAR_AVELLANA",
    "nombre": "Monin Hazelnut"
   }
  ],
  "nota": "MODO MANUAL POR BOTELLAS: se cobran botellas completas, sin merma ni densidad. El MODO CALCULADO por consumo (gramos, 75%, densidad g/ml) queda PENDIENTE hasta medir las densidades. Los campos de ese modo se conservan.",
  "inventarioBotellas": {
   "JAR_VAINILLA": 0,
   "JAR_CARAMELO": 0,
   "JAR_AVELLANA": 0
  },
  "cargarCaseCompleto": false
 },
 "vasosFrios12": {
  "opciones": [
   {
    "id": "VASO_FRIO_12",
    "nombre": "Vaso frio estandar 12 oz"
   },
   {
    "id": "VASO_USHAPE",
    "nombre": "U-Shape Plastic Cup 12 oz"
   }
  ],
  "tapa": "TAPA_FRIA_12",
  "nota": "Solo se cobra UN vaso base por bebida. La tapa de 98 mm se suma aparte y no se duplica."
 }
};
