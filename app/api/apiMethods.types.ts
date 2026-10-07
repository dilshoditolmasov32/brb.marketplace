// Auto-generated from ./dummyjson.openapi.json
// Do not edit by hand — run `npm run api-gen` to regenerate.

export interface paths {
    "/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["products_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/products/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["products_search"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/products/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["products_categories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/products/category/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["products_by_category"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/products/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["products_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/posts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["posts_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/posts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["posts_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/carts/user/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["carts_by_user"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["auth_login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["auth_me"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["auth_refresh"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ApiErrorBody: {
            message: string;
        };
        Category: {
            slug: string;
            name: string;
            url: string;
        };
        Review: {
            rating: number;
            comment: string;
            /** Format: date-time */
            date: string;
            reviewerName: string;
            reviewerEmail: string;
        };
        Product: {
            id: number;
            title: string;
            description: string;
            category: string;
            price: number;
            discountPercentage: number;
            rating: number;
            stock: number;
            tags: string[];
            brand?: string;
            sku: string;
            weight?: number;
            dimensions?: {
                width: number;
                height: number;
                depth: number;
            };
            warrantyInformation?: string;
            shippingInformation?: string;
            availabilityStatus: string;
            reviews: components["schemas"]["Review"][];
            returnPolicy?: string;
            minimumOrderQuantity?: number;
            meta?: {
                /** Format: date-time */
                createdAt?: string;
                /** Format: date-time */
                updatedAt?: string;
                barcode?: string;
                qrCode?: string;
            };
            images: string[];
            thumbnail: string;
        };
        ProductList: {
            products: components["schemas"]["Product"][];
            total: number;
            skip: number;
            limit: number;
        };
        Post: {
            id: number;
            title: string;
            body: string;
            tags: string[];
            reactions: {
                likes: number;
                dislikes: number;
            };
            views: number;
            userId: number;
        };
        PostList: {
            posts: components["schemas"]["Post"][];
            total: number;
            skip: number;
            limit: number;
        };
        CartProduct: {
            id: number;
            title: string;
            price: number;
            quantity: number;
            total: number;
            discountPercentage: number;
            discountedTotal: number;
            thumbnail: string;
        };
        Cart: {
            id: number;
            products: components["schemas"]["CartProduct"][];
            total: number;
            discountedTotal: number;
            userId: number;
            totalProducts: number;
            totalQuantity: number;
        };
        CartList: {
            carts: components["schemas"]["Cart"][];
            total: number;
            skip: number;
            limit: number;
        };
        LoginRequest: {
            username: string;
            password: string;
            expiresInMins?: number;
        };
        RefreshRequest: {
            refreshToken?: string;
            expiresInMins?: number;
        };
        Tokens: {
            accessToken: string;
            refreshToken: string;
        };
        User: {
            id: number;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            gender?: string;
            image?: string;
        };
        LoginResponse: components["schemas"]["User"] & components["schemas"]["Tokens"];
    };
    responses: {
        /** @description Paginated products */
        ProductList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ProductList"];
            };
        };
        /** @description Error */
        Error: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ApiErrorBody"];
            };
        };
    };
    parameters: {
        /** @description Page size. 0 returns everything. */
        limit: number;
        skip: number;
        /** @description Comma-separated list of fields to return */
        select: string;
        sortBy: string;
        order: "asc" | "desc";
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    products_list: {
        parameters: {
            query?: {
                /** @description Page size. 0 returns everything. */
                limit?: components["parameters"]["limit"];
                skip?: components["parameters"]["skip"];
                /** @description Comma-separated list of fields to return */
                select?: components["parameters"]["select"];
                sortBy?: components["parameters"]["sortBy"];
                order?: components["parameters"]["order"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ProductList"];
        };
    };
    products_search: {
        parameters: {
            query: {
                q: string;
                /** @description Page size. 0 returns everything. */
                limit?: components["parameters"]["limit"];
                skip?: components["parameters"]["skip"];
                /** @description Comma-separated list of fields to return */
                select?: components["parameters"]["select"];
                sortBy?: components["parameters"]["sortBy"];
                order?: components["parameters"]["order"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ProductList"];
        };
    };
    products_categories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All product categories */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Category"][];
                };
            };
        };
    };
    products_by_category: {
        parameters: {
            query?: {
                /** @description Page size. 0 returns everything. */
                limit?: components["parameters"]["limit"];
                skip?: components["parameters"]["skip"];
                /** @description Comma-separated list of fields to return */
                select?: components["parameters"]["select"];
                sortBy?: components["parameters"]["sortBy"];
                order?: components["parameters"]["order"];
            };
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ProductList"];
        };
    };
    products_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Single product */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Product"];
                };
            };
            404: components["responses"]["Error"];
        };
    };
    posts_list: {
        parameters: {
            query?: {
                /** @description Page size. 0 returns everything. */
                limit?: components["parameters"]["limit"];
                skip?: components["parameters"]["skip"];
                /** @description Comma-separated list of fields to return */
                select?: components["parameters"]["select"];
                sortBy?: components["parameters"]["sortBy"];
                order?: components["parameters"]["order"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated posts */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PostList"];
                };
            };
        };
    };
    posts_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Single post */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Post"];
                };
            };
            404: components["responses"]["Error"];
        };
    };
    carts_by_user: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Carts of a user */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CartList"];
                };
            };
        };
    };
    auth_login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            /** @description Authenticated user with tokens */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
            400: components["responses"]["Error"];
        };
    };
    auth_me: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Current user */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
            401: components["responses"]["Error"];
        };
    };
    auth_refresh: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefreshRequest"];
            };
        };
        responses: {
            /** @description New token pair */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Tokens"];
                };
            };
            401: components["responses"]["Error"];
        };
    };
}
