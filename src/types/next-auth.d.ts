export * from "@auth0/nextjs-auth0";

declare module "@auth0/nextjs-auth0" {
  export interface Claims {
    email: string;
  }
}
