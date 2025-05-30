
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MERCADOPAGO-PREFERENCE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const mercadoPagoToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!mercadoPagoToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN is not set");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    const { plan, months } = await req.json();
    logStep("Request data", { plan, months, userEmail: user.email });

    // Configurar precios según el plan
    const planPrices = {
      basic: { amount: 199, title: "Plan Básico" },
      premium: { amount: 399, title: "Plan Premium" },
      vip: { amount: 799, title: "Plan VIP" }
    };

    const selectedPlan = planPrices[plan as keyof typeof planPrices];
    if (!selectedPlan) {
      throw new Error("Invalid plan selected");
    }

    const totalAmount = selectedPlan.amount * (months || 1);
    const externalReference = `sub_${user.id}_${Date.now()}`;

    // Crear preferencia en MercadoPago
    const preferenceData = {
      items: [
        {
          title: `${selectedPlan.title} - ${months || 1} mes(es)`,
          quantity: 1,
          unit_price: totalAmount,
          currency_id: "MXN"
        }
      ],
      payer: {
        email: user.email
      },
      external_reference: externalReference,
      notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook`,
      back_urls: {
        success: `${req.headers.get("origin")}/subscription?success=true`,
        failure: `${req.headers.get("origin")}/subscription?success=false`,
        pending: `${req.headers.get("origin")}/subscription?pending=true`
      },
      auto_return: "approved"
    };

    logStep("Creating MercadoPago preference", preferenceData);

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${mercadoPagoToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preferenceData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MercadoPago API error: ${response.status} - ${errorText}`);
    }

    const preference = await response.json();
    logStep("MercadoPago preference created", { id: preference.id });

    // Guardar transacción en base de datos
    const { error: dbError } = await supabaseClient
      .from("mercadopago_transactions")
      .insert({
        user_id: user.id,
        preference_id: preference.id,
        external_reference: externalReference,
        amount: totalAmount,
        subscription_type: plan,
        subscription_months: months || 1,
        status: "pending"
      });

    if (dbError) {
      logStep("Database error", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    logStep("Transaction saved to database");

    return new Response(JSON.stringify({
      preference_id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
