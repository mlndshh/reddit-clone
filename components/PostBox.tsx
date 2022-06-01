import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import {useForm} from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import client from '../apollo-client'
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import toast from 'react-hot-toast'

type FormData = {
    postTitle: string
    postBody: string
    postImage: string
    subreddit: string
}

type Props = {
    subreddit?: string
}

const PostBox = ({subreddit}: Props) => {
    const {data: session} = useSession()
    const { register, setValue, handleSubmit, watch, formState: { errors } } = useForm<FormData>()
    const [addPost] = useMutation(ADD_POST, {
        refetchQueries: [
            GET_ALL_POSTS,
            'getPostList'
        ],
    })
    const [addSubreddit] = useMutation(ADD_SUBREDDIT)

    const [imageBoxOpen, setimageBoxOpen] = useState<boolean>(false)

    const onSubmit =  handleSubmit(async (formData) => {
        console.log(formData)
        const notification = toast.loading('Creating new post...')
        
        try {
            //query for subreddit topic
            const {
                data: { getSubredditListByTopic },
            } = await client.query({
                query:GET_SUBREDDIT_BY_TOPIC,
                variables: {
                    topic: subreddit || formData.subreddit
                },
            })

            const isSubreddit = getSubredditListByTopic.length>0
            
            if(!isSubreddit) {
                //CREATE subreddit
                console.log("new subeddit, creating")
                const {data: { insertSubreddit: newSubreddit }} = await addSubreddit({
                    variables: {
                        topic: formData.subreddit
                    }
                })

                console.log('creating post', formData)
                const image = formData.postImage || ''

                const {
                    data: { insertPost: newPost},
                } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: newSubreddit.id,
                        title: formData.postTitle,
                        username: session?.user?.name
                    } 
                })

                console.log('new post with new subreddit', newPost)
            }
            else{
                //use existing subreddit
                console.log("Using existing subreddit")
                console.log(getSubredditListByTopic)

                const image = formData.postImage || ''

                const {
                    data: { insertPost: newPost},
                } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: getSubredditListByTopic[0].id,
                        title: formData.postTitle,
                        username: session?.user?.name
                    } 
                })

                console.log('new post with existing subreddit', newPost)
            }

            //after post is added.
            setValue('postBody', '')
            setValue('postImage','')
            setValue('postTitle', '')
            setValue('subreddit', '')

            toast.success('New Post Created!', {
                id:notification
            })

        } catch (error) {
            toast.error("Something went wrong.", {
                id:notification
            })
        }
    })

    return (
        <form 
            onSubmit={onSubmit}
            className='sticky top-20 z-50 bg-white border rounded-md border-gray-300 p-2'
        >
            <div className='flex items-center space-x-3'>

                {/* avatar */}
                <Avatar/>
                <input
                    {...register('postTitle', {required: true})}
                    disabled={!session}
                    className="bg-gray-50 p-2 pl-5 outline-none rounded-md flex-1"
                    type="text" 
                    placeholder={session ? subreddit ? `Create a post in r/${subreddit}` : 'Create a post' : "Please sign in first"} 
                />

                <PhotographIcon 
                    onClick={() => setimageBoxOpen(!imageBoxOpen)} 
                    className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen && 'text-blue-300'}`}/>
                <LinkIcon className='h-6 text-gray-300'/>
            </div>

            {!!watch('postTitle') && (
                <div className='flex flex-col py-2'>
                    {/* Body */}
                    <div className='flex items-center px-2'>
                        <p className='min-w-[90px]'>Body:</p>
                        <input
                            className='m-2 flex-1 bg-blue-50 p-2 outline-none'
                            {...register('postBody')}
                            type='text' placeholder='Text(Optional)' />
                    </div>
                    
                    {/* subreddit */}
                    {!subreddit && (
                        <div className='flex items-center px-2'>
                            <p className='min-w-[90px]'>Subreddit:</p>
                            <input
                                className='m-2 flex-1 bg-blue-50 p-2 outline-none'
                                {...register('subreddit', {required: true})}
                                type='text' placeholder='i.e. nextjs' />
                        </div>
                    )}
                </div>
            )}

            {imageBoxOpen && (
                <div className='flex items-center px-2'>
                <p className='min-w-[90px]'>Image URL:</p>
                <input
                    className='m-2 flex-1 bg-blue-50 p-2 outline-none'
                    {...register('postImage')}
                    type='text' placeholder='Optional' />
            </div>
            )}

            {/* errors */}
            {Object.keys(errors).length>0 && (
                <div className='space-y-2 p-2 text-red-500'>
                     {errors.postTitle?.type === 'required' && (
                         <p>- A post title is required. </p>
                     )}
                     {errors.subreddit?.type === 'required' && (
                         <p>- A subreddit is required. </p>
                     )}
                </div>
            )}

            {!!watch('postTitle') && (
                <button 
                type='submit'
                className='w-full rounded-full bg-blue-400 p-2 text-white'>
                    Create Post
                </button>
            )}
        </form>
    )
}  

export default PostBox