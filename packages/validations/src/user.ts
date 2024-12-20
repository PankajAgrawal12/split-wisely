import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2)
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    password: z.string().min(8).optional()
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>; 