import z from "zod";

import { ProfileAction } from "@/enums/profileAction.enum";

export const actionSchema = z.object({
  action: z.enum(ProfileAction),
  // action: z.enum(Object.values(ProfileAction) as [string, ...string[]]),
  //   action: z.enum(
  //     Object.values(ProfileAction) as [ProfileAction, ...ProfileAction[]]
  //   ),
});

export type ActionQueryType = z.infer<typeof actionSchema>;
