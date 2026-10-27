import { prisma } from "@/lib/prisma";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório e deve ter pelo menos 2 caracteres."),
  email: z.string().email("Endereço de e-mail inválido."),
  phone: z.string().min(6, "Número de telefone válido é obrigatório."),
  contactPreference: z.enum(["TELEFONE", "EMAIL"]),
  isWhatsapp: z.boolean().default(false),
  subject: z.string().min(1, "Selecione o assunto do orçamento."),
  preferredDate: z.string().optional().nullable(),
  preferredTime: z.string().optional().nullable(),
  message: z.string().min(10, "A descrição do projeto deve ter no mínimo 10 caracteres."),
});

export type LeadInput = z.infer<typeof leadSchema>;

export async function submitLeadAction(data: LeadInput) {
  try {
    const validatedData = leadSchema.parse(data);

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

    return {
      success: true,
      data: lead,
      message: "Pedido de orçamento enviado com sucesso! Nossa equipa entrará em contacto brevemente.",
    };
  } catch (error: any) {
    console.error("Erro ao submeter lead:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Dados inválidos fornecidos no formulário.",
      };
    }
    return {
      success: false,
      error: "Ocorreu um erro ao registar o seu pedido. Por favor, tente novamente ou contacte-nos por telefone.",
    };
  }
}
