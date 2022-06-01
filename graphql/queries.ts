import { gql } from "@apollo/client"

export const GET_SUBREDDIT_BY_TOPIC = gql`
    query MyQuery($topic: String!) {
        getSubredditListByTopic(topic: $topic) {
            id
            created_at
            topic
        }
    }
`

export const GET_SUBREDDITS_WITH_LIMIT = gql `
    query MyQuery($limit: Int!) {
        getSubredditListLimit(limit: $limit) {
            created_at
            id
            topic
        }
    }
`

export const GET_ALL_VOTES_BY_POST_ID = gql`
    query MyQuery($id: ID!) {
        getVotesByPostId(id: $id) {
            created_at
            id
            post_id
            upvote
            username
        }
    }
`

export const GET_ALL_POSTS = gql`
    query myQuery {
        getPostList {
            body
            created_at
            id
            image
            title
            subreddit_id
            username
            comments {
                created_at
                id
                post_id
                text
                username
            }
            subreddit {
                created_at
                id
                topic
            }
            votes {
                created_at
                id
                post_id
                upvote
                username
            }
        }
    }
`

export const GET_ALL_POSTS_BY_TOPIC = gql`
    query myQuery($topic: String!) {
        getPostListByTopic(topic: $topic) {
            body
            created_at
            id
            image
            title
            subreddit_id
            username
            comments {
                created_at
                id
                post_id
                text
                username
            }
            subreddit {
                created_at
                id
                topic
            }
            votes {
                created_at
                id
                post_id
                upvote
                username
            }
        }
    }
`

export const GET_POST_BY_POST_ID = gql`
    query myQuery($post_id: ID!) {
        getPostListByPostId(post_id: $post_id) {
            body
            created_at
            id
            image
            title
            subreddit_id
            username
            comments {
                created_at
                id
                post_id
                text
                username
            }
            votes {
                created_at
                id
                post_id
                upvote
                username
            }
            subreddit {
                created_at
                id
                topic
            }
        }
    }
`