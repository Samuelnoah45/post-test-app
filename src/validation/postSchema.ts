import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string({ required_error: "This field is required" })
    .min(1, "This field is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  body: z
    .string({ required_error: "This field is required" })
    .min(1, "This field is required")
    .min(10, "Body must be at least 10 characters")
    .max(500, "Body must not exceed 500 characters"),
});

export type PostFormData = z.infer<typeof postSchema>;
