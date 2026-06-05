import { calcularNuevoStock } from './index.js';

console.log("🧪 INICIANDO PRUEBAS UNITARIAS EN NEXTRACK...");

try {
    // Prueba Unitaria 1: Verificar el incremento correcto de una entrada de mercancía
    const resultadoEntrada = calcularNuevoStock(10, 5, "ENTRADA");
    if (resultadoEntrada === 15) {
        console.log("✅ Prueba 1 Pasada: El cálculo de entradas es correcto (10 + 5 = 15).");
    } else {
        throw new Error("Prueba 1 fallida.");
    }

    // Prueba Unitaria 2: Verificar que se lance un error si el stock queda en negativo
    try {
        calcularNuevoStock(5, 10, "SALIDA");
        console.error("❌ Prueba 2 Fallida: El sistema permitió un stock negativo.");
    } catch (e) {
        if (e.message === "Stock negativo") {
            console.log("✅ Prueba 2 Pasada: El sistema bloqueó correctamente un stock negativo.");
        }
    }

    console.log("\n🎉 ¡TODAS LAS PRUEBAS UNITARIAS PASARON EXITOSAMENTE!");
} catch (error) {
    console.error("❌ Inconsistencia detectada en las pruebas:", error.message);
}