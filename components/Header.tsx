import Image from 'next/image'
import React from 'react'
import { ChevronDownIcon, HomeIcon, SearchIcon, MenuIcon } from '@heroicons/react/solid'
import { BellIcon, ChatIcon, GlobeIcon, PlusIcon, SparklesIcon, SpeakerphoneIcon, VideoCameraIcon } from '@heroicons/react/outline'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

const Header = () => {
    const {data: session} = useSession()
    return(
        <div className='flex bg-white px-2 py-2 shadow-sm sticky top-0 z-50 items-center'>
            <div className='relative h-10 w-20 flex-shrink-0 cursor-pointer'>
                <Link href="/">
                    <Image 
                        objectFit='contain'
                        src="https://links.papareact.com/fqy" 
                        layout="fill"
                    />
                </Link>
            </div>
                <div className='flex items-center mx-7 xl:min-w-[300px]'>
                        <HomeIcon className='h-5 w-5'/>
                        <Link href="/">
                        <p className='flex-1 ml-2 hidden lg:inline cursor-pointer'>Home</p>
                        </Link>
                        <ChevronDownIcon className='h-5 w-5'/> 
                </div>

            {/* Search */}
            <form className='flex flex-1 items-center space-x-2 rounded-md border border-gray-200 bg-gray-100 px-3 py-1'>
                <SearchIcon className='h-6 w-6 text-gray-400' />
                <input className='flex-1 bg-transparent outline-none' type='text' placeholder='Search Reddit'/>
                <button hidden type="submit" />
            </form>

            {/* Icons */}
            <div className='hidden lg:inline-flex text-gray-500 items-center space-x-2 mx-5'>
                <SparklesIcon className='icon'/>
                <GlobeIcon className='icon' />
                <VideoCameraIcon className='icon' />
                <hr className='h-10 border border-gray-100' />
                <ChatIcon className='icon' />
                <BellIcon className='icon' />
                <PlusIcon className='icon' />
                <SpeakerphoneIcon className='icon' />
            </div>
            <div className='inline-flex lg:hidden text-gray-500 items-center space-x-2 ml-5'>
                <MenuIcon className='icon' />
            </div>

            {/* signin/signout */}
            {session ?
            <>
                <div onClick={() => signOut()} className='hidden lg:flex items-center space-x-2 border border-gray-100 p-2 cursor-pointer'>
                    <div className='relative h-5 w-5 flex-shrink-0'>
                        <Image src="https://links.papareact.com/23l"  layout='fill' alt="" objectFit='contain' />
                    </div>
                    <div className='flex-1 text-xs'>
                        <p className='truncate'> {session?.user?.name}</p>
                        <p className='text-gray-400'>Sign out</p>
                    </div>
                    <ChevronDownIcon className='h-5 flex-shrink-0 text-gray-400' />
                </div>
            </> :
            <>
                <div onClick={() => signIn()} className='hidden lg:flex items-center space-x-2 border border-gray-100 p-2 cursor-pointer'>
                    <div className='relative h-5 w-5 flex-shrink-0'>
                        <Image src="https://links.papareact.com/23l"  layout='fill' alt="" objectFit='contain' />
                    </div>

                    <p className='text-gray-400'>Sign In</p>
                </div>
            </>
            }
            
        </div>
    )
}

export default Header