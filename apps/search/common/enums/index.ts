export enum TypeSendCode {
    SMS = "sms",
    CALL = "call"
}

export enum TypeCollection {
    UsersSessions = "userssessions",
    Achievements = "achievements",
    Categories = "categories",
    Complaints = "complaints",
    AgeLimits = "agelimits",
    Comments = "comments",
    Tickets = "tickets",
    Events = "events",
    Users = "users",
    News = "news",
    Tags = "tags"
}

export enum ComplaintTargetCollections {
    Events = TypeCollection.Events,
    Users = TypeCollection.Users,
    News = TypeCollection.News
}

export enum AuthorNewsCollections {
    Events = TypeCollection.Events,
    Users = TypeCollection.Users
}

export enum TypeCollectionWithMainImage {
    Users = TypeCollection.Users,
    Events = TypeCollection.Events,
    Achievements = TypeCollection.Achievements
}

export enum TypeCollectionWithImages {
    News = TypeCollection.News,
    Users = TypeCollection.Users,
    Events = TypeCollection.Events
}

export enum TokenType {
    ACCESS_TOKEN,
    REFRESH_TOKEN
}

export enum TypeAction {
    ADD = "add",
    DELETE = "delete"
}