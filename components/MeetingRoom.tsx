import { cn } from '@/lib/utils';
import { CallControls, CallParticipantsList, CallStatsButton, CallingState, PaginatedGridLayout, SpeakerLayout, useCallStateHooks, useCall } from '@stream-io/video-react-sdk';
import React, { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users, HandIcon, Download } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';
import Loader from './Loader';


type CallLayoutType = 'speaker-left' | 'speaker-right' | 'grid';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');

  const router = useRouter();
  const call = useCall();

  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false)
  const [handRaised, setHandRaised] = useState(false)

  const raiseHand = async () => {
    // const call: call;
    setHandRaised(true)

    await call?.sendReaction({
      type: 'raise-hand',
      emoji_code: ':raise-hand:',
      custom: {
        clearImmediate: false,
      }
    })
  }

  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const downHand = async () => {
    setHandRaised(false);

    await call?.resetReaction(participants[0].sessionId)

  }


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
        <CallControls onLeave={() => router.push('/')}/>

        <DropdownMenu>
          <div className='flex items-center'>
              <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] py-2 px-4 hover:bg-[#4c535b]'>
                <LayoutList size={20} className='text-white'/>
            </DropdownMenuTrigger>
            
          </div>

          <DropdownMenuContent
            className="border-dark-1 bg-dark-1 text-white"
          >
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
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <div className='flex items-center'>
            <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] py-2 px-4 hover:bg-[#4c535b]'>
              <HandIcon size={20} className="text-white"/>
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent
            className="border-dark-1 bg-dark-1 text-white"
          >
            {
              handRaised ? (
                <div>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={downHand}
                  >
                    Down Hand
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-dark-1" />
                </div>) : (
                <div >
                  <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={raiseHand}
                  >
                    Raise Hand
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-dark-1" />
                </div>
              )
            }
          </DropdownMenuContent>
        </DropdownMenu>


        <CallStatsButton />

        <button onClick={() => setShowParticipants(prev=>!prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] py-2 px-4 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  )
}

export default MeetingRoom;
