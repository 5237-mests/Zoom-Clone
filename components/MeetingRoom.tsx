import { cn } from '@/lib/utils';
import { CallControls, CallParticipantsList, CallingState, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users, Settings } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';
import Loader from './Loader';
import { DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@radix-ui/react-dropdown-menu';


type CallLayoutType = 'speaker-left' | 'speaker-right' | 'grid';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');

  const router = useRouter();

  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false)

  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition={'left'} />
      default:
        return <SpeakerLayout participantsBarPosition={'right'}/>
    }
  }

  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
      <div className="flex relative size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div className={cn('h-[calc(100vh-86px)] ml-2 hidden', {'show-block': showParticipants})}>
            <CallParticipantsList onClose={() => setShowParticipants(false)}/>
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls
          onLeave={() => router.push('/')}
        />
        
        <DropdownMenu>
          <div className='flex items-center'>
            <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] py-2 px-4 hover:bg-[#4c535b]'>
              <Settings size={20} className='text-white'/>
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent
              className="border-dark-1 bg-dark-1 text-white"
            >
            <div>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer rounded-2xl bg-[#19232d] py-2 px-4 hover:bg-[#4c535b] flex">
                    <LayoutList size={20} className="text-white" />
                    <p className='ml-2 text-md font-semibold'>Layout</p>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="border-dark-1 bg-dark-1 text-white ml-4">
                        {
                          ['speaker-left', 'speaker-right', 'grid'].map((item, index) => (
                            <div key={index}>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  setLayout(item.toLowerCase() as CallLayoutType)
                                }}
                              >
                                {item}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="border-dark-1" />
                            </div>
                          ))
                        }
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="border-dark-1" />
            
              <DropdownMenuGroup>
                <DropdownMenuLabel
                  className="cursor-pointer rounded-2xl bg-[#19232d] py-2 px-4 hover:bg-[#4c535b] flex"
                  onClick={() => setShowParticipants(prev => !prev)}
                >
                  <Users size={20} className="text-white" />
                  <p className='ml-2 text-md font-semibold'>Participants</p>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="border-dark-1" />
        
              <DropdownMenuItem
                className="cursor-pointer"
              >
                {!isPersonalRoom && <EndCallButton />}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-dark-1" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <CallStatsButton /> */}
      </div>
    </section>
  )
}

export default MeetingRoom;
