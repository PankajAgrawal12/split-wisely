import { z } from "zod";

export const createSubscriptionSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    amount: z.number().positive(),
    splitType: z.enum(["EQUAL", "PERCENTAGE", "CUSTOM"]).default("EQUAL"),
    billingCycle: z.enum(["MONTHLY", "YEARLY", "ONE_TIME"]).default("MONTHLY"),
    currency: z.string().default("USD"),
    reminderEnabled: z.boolean().default(true)
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export const inviteParticipantSchema = z.object({
    emails: z.array(z.string().email()),
    shareAmount: z.number().optional() // Required for CUSTOM split type
});

export const respondToInviteSchema = z.object({
    response: z.enum(["ACCEPTED", "REJECTED"])
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type InviteParticipantInput = z.infer<typeof inviteParticipantSchema>;
export type RespondToInviteInput = z.infer<typeof respondToInviteSchema>; 