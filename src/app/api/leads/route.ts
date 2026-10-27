import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(6, "Telefone inválido"),
  contactPreference: z.enum(["TELEFONE", "EMAIL"]),
  isWhatsapp: z.boolean().default(false),
  subject: z.string().min(1, "Assunto é obrigatório"),
  preferredDate: z.string().optional().nullable(),
  preferredTime: z.string().optional().nullable(),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = leadSchema.parse(body);

    const lead = await prisma.lead.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        contactPreference: validatedData.contactPreference,
        isWhatsapp: Boolean(validatedData.isWhatsapp),
        subject: validatedData.subject,
        preferredDate: validatedData.preferredDate || null,
        preferredTime: validatedData.preferredTime || null,
        message: validatedData.message,
        status: "PENDENTE",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: lead,
        message: "Orçamento registado com sucesso!",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API /api/leads error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Erro interno ao processar orçamento." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao buscar orçamentos." },
      { status: 500 }
    );
  }
}
