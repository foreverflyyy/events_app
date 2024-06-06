declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string;
        PATH_TO_ENV: string;
        MONGODB_URI: string;
        SMS_API_KEY: string;
        GCLOUD_START_URL: string;
        GCLOUD_PROJECT_ID: string;
        GCLOUD_APPLICATION_CREDENTIALS: string;
        GCLOUD_STORAGE_BUCKET_URL: string;

        VERIFICATION_CODE: string;
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
    }
}