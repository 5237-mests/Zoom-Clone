//@ts-nocheck
'use client'
import { useGetCalls } from '@/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useState, useEffect   } from 'react';
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { useToast } from './ui/use-toast';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const { endedCalls, upcomingCalls, isLoading, callRecordings } = useGetCalls();

  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([])

  const { toast } = useToast();
  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'upcoming':
        return upcomingCalls;
      case 'recordings':
        return recordings;
      default:
        return [];
    }
  }

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  }

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(callRecordings.map(meeting => meeting.queryRecordings()));

        const recordings = callData
          .filter(call => call.recordings.length > 0)
          .flatMap(Call => Call.recordings);

        setRecordings(recordings);    
      } catch (error) {
        toast({title: 'Try again later.'})
      }
    }

    if(type === 'recordings') fetchRecordings();    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, callRecordings])
  

  const calls = getCalls();
  const noCallMessage = getNoCallsMessage();

  if(isLoading) return <Loader />

  return (
    <div className='grid gap-5 grid-cols-1 xl:grid-cols-2' >
      {calls && calls.length > 0 ?
        calls.map((meeting: Call | CallRecording, index) => (
          <MeetingCard
            key={index}
            icon={
              type === 'ended'
                ? '/icons/previous.svg'
                : type === 'upcoming'
                  ? '/icons/upcoming.svg'
                  : '/icons/recordings.svg'
            }
            title={(meeting as Call).state?.custom?.description?.substring(0, 26) || meeting?.filename?.substring(0, 20) || 'No description'}
            date={meeting?.state?.startsAt?.toLocaleString() || meeting?.state?.start_time?.toLocaleString() || new Date(meeting.start_time).toLocaleString()}
            isEndedMeeting={type === 'ended'}
            isUpcomingMeeting={type === 'upcoming'}
            isPreviousMeeting={type === 'ended'}
            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? 'Play' : 'Start'}
            handleClick={type === 'recordings' ? ()=> router.push(`${meeting.url}`) : ()=> router.push(`/meeting/${meeting.id}`)}
            link={type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
          />
        ))
        :
        <h1> {noCallMessage} </h1>
    }
    </div>
  )
}

export default CallList;
