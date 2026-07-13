import { z } from "zod";

export const createPostSchema = z.object({

    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(255, "Title cannot exceed 255 characters"),

    markdownBody: z
        .string()
        .trim()
        .min(10, "Markdown body must be at least 10 characters")

});