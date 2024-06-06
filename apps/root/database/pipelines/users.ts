import {PipelineStage} from "mongoose";
import {TypeCollection} from "../../common";

export const pipelineForFullUser: PipelineStage[] = [
    {
        $sort: {
            name: 1
        }
    },
    {
        $lookup: {
            from: TypeCollection.Events,
            let: {events: '$events'},
            pipeline: [
                {
                    $match: {
                        $expr: {$in: ['$_id', '$$events']}
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "name": 1,
                        "date": 1,
                        "place": 1,
                        "price": 1,
                        "mainImage": 1
                    }
                }
            ],
            as: 'events'
        }
    },
    {
        $lookup: {
            from: TypeCollection.Events,
            let: {ownEvents: '$ownEvents'},
            pipeline: [
                {
                    $match: {
                        $expr: {$in: ['$_id', '$$ownEvents']}
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "name": 1,
                        "date": 1,
                        "place": 1,
                        "price": 1,
                        "mainImage": 1
                    }
                }
            ],
            as: 'ownEvents'
        }
    },
    {
        $lookup: {
            from: TypeCollection.Events,
            let: {favourites: '$favourites'},
            pipeline: [
                {
                    $match: {
                        $expr: {$in: ['$_id', '$$favourites']}
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "name": 1,
                        "date": 1,
                        "place": 1,
                        "price": 1,
                        "mainImage": 1
                    }
                }
            ],
            as: 'favourites'
        }
    },
    {
        $lookup: {
            from: TypeCollection.Categories,
            let: {categories: '$categories'},
            pipeline: [
                {$match: {$expr: {$in: ['$_id', '$$categories']}}}
            ],
            as: 'categories'
        }
    },
    // {
    //     $lookup: {
    //         from: TypeCollection.News,
    //         let: {news: '$news'},
    //         pipeline: [
    //             {
    //                 $match: {
    //                     $expr: {$in: ['$_id', '$$news']}
    //                 }
    //             }
    //         ],
    //         as: 'news'
    //     }
    // },
    {
        $lookup: {
            from: TypeCollection.Achievements,
            let: {achievements: '$achievements'},
            pipeline: [
                {$match: {$expr: {$in: ['$_id', '$$achievements']}}}
            ],
            as: 'achievements'
        }
    },
    {
        $project: {
            name: 1,
            login: 1,
            email: 1,
            phone: 1,
            mainImage: 1,
            city: 1,
            age: 1,
            description: 1,
            gender: 1,
            role: 1,
            favourites: 1,
            tickets: 1,
            complaints: 1,
            news: 1,
            subscribers: 1,
            subscriptions: 1,
            "tags._id": 1,
            "tags.name": 1,
            "tags.code": 1,
            "categories._id": 1,
            "categories.name": 1,
            "categories.code": 1,
            events: 1,
            ownEvents: 1,
            achievements: 1,
            active: 1,
            registerAt: 1,
            lastSeen: 1
        }
    }
];

export const pipelineForShortUser: PipelineStage[] = [
    {
        $lookup: {
            from: TypeCollection.Categories,
            let: {categories: '$categories'},
            pipeline: [
                {$match: {$expr: {$in: ['$_id', '$$categories']}}}
            ],
            as: 'categories'
        }
    },
    {$sort: {name: 1}},
    {
        $project: {
            name: 1,
            login: 1,
            mainImage: 1,
            city: 1,
            age: 1,
            gender: 1,
            "tags._id": 1,
            "tags.name": 1,
            "tags.code": 1,
            "categories._id": 1,
            "categories.name": 1,
            "categories.code": 1
        }
    }
];