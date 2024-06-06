export enum TypeSendCode {
    SMS = "sms",
    CALL = "call"
}

export enum TypeCollection {
    EventRequests = "eventRequests",
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

export enum TypeCollectionWithImages {
    Achievements = TypeCollection.Achievements,
    Events = TypeCollection.Events,
    Users = TypeCollection.Users
}

export enum TokenType {
    ACCESS_TOKEN,
    REFRESH_TOKEN
}

export enum TypeAction {
    ADD = "add",
    DELETE = "delete"
}