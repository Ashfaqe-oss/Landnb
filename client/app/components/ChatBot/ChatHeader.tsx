'use client'

interface ChatHeaderProps {
    
}
 
const ChatHeader: React.FC<ChatHeaderProps> = () => {
    return ( 
        <div  className='w-full flex gap-3 justify-start items-center text-zinc-800 '>
            <div className='flex flex-col items-start text-sm'>
                <p  className='text-xs'>
                    Chat with
                </p>
                <div  className='flex gap-1.5 items-center'>
                    <div className='w-[10px] h-[10px] rounded-full bg-[#f43f5e]'></div>
                    <p className='font-medium'>
                        Landnb Bot
                    </p>
                </div>
            </div>
        </div>
     );
}
 
export default ChatHeader;