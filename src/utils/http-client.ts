import { config } from "./config.js";

const API_KEY =
    config.apiKey || process.env.API_KEY;

export const BASE_URL = "https://platform-flyonui-nextjs-staging.vercel.app/staging/api/mcp";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface HttpClient {
    get<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<{ status: number; data: T }>;
    post<T>(
        endpoint: string,
        data?: unknown,
        options?: RequestInit
    ): Promise<{ status: number; data: T }>;
    put<T>(
        endpoint: string,
        data?: unknown,
        options?: RequestInit
    ): Promise<{ status: number; data: T }>;
    delete<T>(
        endpoint: string,
        data?: unknown,
        options?: RequestInit
    ): Promise<{ status: number; data: T }>;
    patch<T>(
        endpoint: string,
        data?: unknown,
        options?: RequestInit
    ): Promise<{ status: number; data: T }>;
}

const createMethod = (method: HttpMethod) => {
    return async <T>(
        endpoint: string,
        data?: unknown,
        options: RequestInit = {}
    ) => {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(API_KEY ? { "x-license-key": API_KEY } : {}),
            ...options.headers,
        };

        console.log("BASE_URL", BASE_URL);

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            method,
            headers,
            ...(data ? { body: JSON.stringify(data) } : {}),
        });

        console.log("response", response);
        return { status: response.status, data: (await response.json()) as T };
    };
};

export const apiClient: HttpClient = {
    get: createMethod("GET"),
    post: createMethod("POST"),
    put: createMethod("PUT"),
    delete: createMethod("DELETE"),
    patch: createMethod("PATCH"),
};