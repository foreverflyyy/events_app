import {PipelineStage} from "mongoose";
import {TypeCollection} from "../../common";

export const pipelineForFullEvent: PipelineStage[] = [
    {
        $lookup: {
            from: TypeCollection.Users,
            let: {participants: '$participants'},
            pipeline: [
                {
                    $match: {
                        $expr: {$in: ['$_id', '$$participants']}
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        login: 1,
                        mainImage: 1
                    }
                }
            ],
            as: 'participants'
        }
    },
    {
        $lookup: {
            from: TypeCollection.Users,
            let: {organizers: '$organizers'},
            pipeline: [
                {
                    $match: {
                        $expr: {$in: ['$_id', '$$organizers']}
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        login: 1,
                        mainImage: 1
                    }
                }
            ],
            as: 'organizers'
        }
    },
    {
        $lookup: {
            from: TypeCollection.Categories,
            let: {categories: '$categories'},
            pipeline: [
                {
                    $match: {
                        $expr: {$in: ['$_id', '$$categories']}
                    }
                }
            ],
            as: 'categories'
        }
    },
    {
        $lookup: {
            from: TypeCollection.Tags,
            let: {tags: '$tags'},
            pipeline: [
                {
                    $match: {
                        $expr: {$in: ['$_id', '$$tags']}
                    }
                }
            ],
            as: 'tags'
        }
    },
    {
        $lookup: {
            from: TypeCollection.News,
            let: {news: '$news'},
            pipeline: [
                {
                    $match: {
                        $expr: {$in: ['$_id', '$$news']}
                    }
                }
            ],
            as: 'news'
        }
    },
    {
        $lookup: {
            from: TypeCollection.AgeLimits,
            localField: 'ageLimit',
            foreignField: '_id',
            as: 'ageLimit'
        }
    },
    {
        $addFields: {
            'ageLimit': {'$arrayElemAt': ['$ageLimit', 0]}
        }
    },
    {
        $project: {
            name: 1,
            description: 1,
            date: 1,
            city: 1,
            place: 1,
            address: 1,
            mainImage: 1,
            images: 1,
            ageLimit: 1,
            price: 1,
            allTickets: 1,
            purchasedTickets: 1,
            complaints: 1,
            tags: 1,
            categories: 1,
            news: 1,
            participants: 1,
            organizers: 1,
            active: 1,
            status: 1
        }
    }
];

export const pipelineForShortEvent: PipelineStage[] = [
    {
        $lookup: {
            from: TypeCollection.Categories,
            let: {categories: '$categories'},
            pipeline: [
                {
                    $match: {
                        $expr: {$in: ['$_id', '$$categories']}
                    }
                }
            ],
            as: 'categories'
        }
    },
    {
        $lookup: {
            from: TypeCollection.Tags,
            let: {tags: '$tags'},
            pipeline: [
                {
                    $match: {
                        $expr: {$in: ['$_id', '$$tags']}
                    }
                }
            ],
            as: 'tags'
        }
    },
    {
        $lookup: {
            from: TypeCollection.AgeLimits,
            localField: 'ageLimit',
            foreignField: '_id',
            as: 'ageLimit'
        }
    },
    {
        $addFields: {
            'ageLimit': {'$arrayElemAt': ['$ageLimit', 0]}
        }
    },
    {$sort: {name: 1}},
    {
        $project: {
            _id: 1,
            name: 1,
            date: 1,
            city: 1,
            place: 1,
            address: 1,
            mainImage: 1,
            ageLimit: 1,
            price: 1,
            allTickets: 1,
            purchasedTickets: 1,
            "tags._id": 1,
            "tags.name": 1,
            "tags.code": 1,
            "categories._id": 1,
            "categories.name": 1,
            "categories.code": 1,
            active: 1,
            status: 1
        }
    }
];