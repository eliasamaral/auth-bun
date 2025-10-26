import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import * as z from "zod";
import { betterAuthPlugin, OpenAPI } from "./http/plugins/better-auth";

import { cors } from "@elysiajs/cors";

const app = new Elysia()
    .use(
        cors({
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        }),
    )
    .use(
        openapi({
            mapJsonSchema: { zod: z.toJSONSchema },
            documentation: {
                components: await OpenAPI.components,
                paths: await OpenAPI.getPaths(),
            },
        }),
    )
    .use(betterAuthPlugin)
    .get("/", () => {
        return "Hello World";
    })
    .get(
        "/users/:id",
        ({ params, user }) => {
            const userId = params.id;

            const authenticateUserName = user.name;
            console.log(authenticateUserName);

            return { id: "1", name: "Elias Amaral" };
        },
        {
            auth: true,
            detail: {
                summary: "Busca um usuário pelo id",
                tags: ["users"],
            },
            params: z.object({
                id: z.string(),
            }),
            response: {
                200: z.object({
                    id: z.string(),
                    name: z.string(),
                }),
            },
        },
    )
    .listen(3333);
console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
