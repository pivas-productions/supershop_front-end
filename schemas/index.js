import validator from "validator";
import * as z from "zod";

export const NewPasswordSchema = z
    .object({
        password: z.string().min(6, {
            message: "Please enter a new password containing at least 6 characters",
        }),
        password_confirm: z.string().min(6, {
            message: "Please confirm your password using at least 6 characters.",
        }),
    })
    .refine((data) => data.password === data.password_confirm, {
        message: "Password mismatch.",
        path: ["password_confirm"],
    });

export const ChangePasswordSchema = z
    .object({
        old_password: z.string().min(6, {
            message: "Please enter a new password containing at least 6 characters",
        }),
        password: z.string().min(6, {
            message: "Please enter a new password containing at least 6 characters",
        }),
        passwordConfirmation: z.string().min(6, {
            message: "Please confirm your password using at least 6 characters.",
        }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Password mismatch.",
        path: ["passwordConfirmation"],
    });
export const ResetSchema = z.object({
    telNo: z.string().refine((data) => validator.isMobilePhone(data), {
        message: "Invalid Phone number"
    }),
    code: z.optional(z.string()),
});


export const LoginSchema = z.object({
    telNo: z.string().refine((data) => validator.isMobilePhone(data), {
        message: "Invalid Phone number"
    }),
    password: z.string().min(6, {
        message: "Please enter a password consisting of at least 6 characters.",
    }),
    code: z.optional(z.string()),
});


export const RegisterSchema = z
    .object({
        name: z.string().min(2, {
            message: "The name should not consist of less than 2 letters.",
        }),
        telNo: z.string().refine((data) => validator.isMobilePhone(data), {
            message: "Invalid Phone number"
        }),
        password: z.string().min(6, {
            message: "Please enter a password consisting of at least 6 characters.",
        }),
        passwordConfirmation: z.string().min(6, {
            message: "Please confirm your password.",
        }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Password mismatch.",
        path: ["passwordConfirmation"],
    });


export const ReviewSchema = z
    .object({
        grade: z.number().min(1, {
            message: "The grade cannot be below 1.",
        }),
        advantages: z.optional(z.string()),
        disadvantages: z.optional(z.string()),
        comments: z.optional(z.string()),
        // images: z.optional(z.array()),
    })
