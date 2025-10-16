import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  clientName: string;
  clientEmail: string;
  service: string;
  phone: string;
  preferredDateTime: string | null;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientName, clientEmail, service, phone, preferredDateTime, message }: BookingEmailRequest = await req.json();

    console.log('Sending booking emails for:', { clientName, clientEmail, service });

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "DizItUp <noreply@dizitup.com>",
      to: [clientEmail],
      subject: "Booking Request Received - DizItUp",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a; color: #ffffff;">
          <h1 style="color: #dc2626; text-align: center; margin-bottom: 30px;">DizItUp</h1>
          
          <h2 style="color: #ffffff; margin-bottom: 20px;">Thank you for your interest, ${clientName}!</h2>
          
          <p style="color: #cccccc; line-height: 1.6; margin-bottom: 20px;">
            We have received your booking request for <strong style="color: #dc2626;">${service}</strong> and will get back to you ASAP.
          </p>
          
          <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">Booking Details:</h3>
            <p style="color: #cccccc; margin: 10px 0;"><strong>Service:</strong> ${service}</p>
            <p style="color: #cccccc; margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>
            ${preferredDateTime ? `<p style="color: #cccccc; margin: 10px 0;"><strong>Preferred Date/Time:</strong> ${preferredDateTime}</p>` : ''}
            ${message ? `<p style="color: #cccccc; margin: 10px 0;"><strong>Message:</strong> ${message}</p>` : ''}
          </div>
          
          <p style="color: #cccccc; line-height: 1.6; margin-bottom: 20px;">
            You will receive an email confirmation once your meeting is successfully scheduled.
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #888; font-size: 14px;">
              Best regards,<br>
              <strong style="color: #dc2626;">The DizItUp Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Client email sent:", clientEmailResponse);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "DizItUp Bookings <bookings@dizitup.com>",
      to: ["admin@dizitup.com"], // Replace with actual admin email
      subject: `New Booking Request: ${service} - ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <h1 style="color: #dc2626; text-align: center; margin-bottom: 30px;">DizItUp - New Booking Request</h1>
          
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">New booking request received</h2>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">Client Information:</h3>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${clientName}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${clientEmail}</p>
              <p style="margin: 8px 0;"><strong>Phone/WhatsApp:</strong> ${phone}</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">Service Details:</h3>
              <p style="margin: 8px 0;"><strong>Service Requested:</strong> ${service}</p>
              ${preferredDateTime ? `<p style="margin: 8px 0;"><strong>Preferred Date/Time:</strong> ${preferredDateTime}</p>` : ''}
              ${message ? `<p style="margin: 8px 0;"><strong>Message:</strong><br>${message}</p>` : ''}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://your-admin-dashboard-url.com/admin" 
                 style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Admin Dashboard
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666; font-size: 14px;">
              This is an automated notification from DizItUp booking system.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        clientEmail: clientEmailResponse,
        adminEmail: adminEmailResponse
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);