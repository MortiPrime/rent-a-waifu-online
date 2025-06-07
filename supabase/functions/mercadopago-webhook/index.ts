
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MERCADOPAGO-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    // Token de prueba - cambiar por token de producción cuando esté listo
    const mercadoPagoToken = "TEST-1195552363186700-060621-190210f5b2c446adaf06cd9e1700adc8-301957132";
    // const mercadoPagoToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN"); // Para producción
    
    if (!mercadoPagoToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN is not set");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.json();
    logStep("Webhook payload", body);

    // Verificar si es una notificación de pago
    if (body.type === "payment") {
      const paymentId = body.data.id;
      logStep("Processing payment", { paymentId });

      // Obtener detalles del pago desde MercadoPago
      // API de MercadoPago - usar para producción y pruebas
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          "Authorization": `Bearer ${mercadoPagoToken}`
        }
      });

      if (!paymentResponse.ok) {
        throw new Error(`Failed to fetch payment details: ${paymentResponse.status}`);
      }

      const paymentData = await paymentResponse.json();
      logStep("Payment data from MercadoPago", paymentData);

      // Procesar el pago usando la función de base de datos
      const { data: result, error } = await supabaseClient.rpc(
        'process_mercadopago_webhook',
        { payment_data: paymentData }
      );

      if (error) {
        logStep("Database function error", error);
        throw error;
      }

      logStep("Payment processed successfully", result);

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Webhook type not handled", { type: body.type });
    return new Response(JSON.stringify({ message: "Webhook received but not processed" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
