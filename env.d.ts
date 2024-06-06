declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string;
        MONGODB_URI: string;
        SMS_API_KEY: string;
        BASE_FILES_URL: string;
        GCLOUD_START_URL: string;
        GCLOUD_PROJECT_ID: string;
        GCLOUD_APPLICATION_CREDENTIALS: string;
        GCLOUD_STORAGE_BUCKET_URL: string;

        VERIFICATION_CODE: string;
        ACCESS_TOKEN_SECRET: string;
    }
}