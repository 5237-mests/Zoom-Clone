'use client';

import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk'
import React, { useState, useEffect } from 'react'
import { Button } from './ui/button';

const MeetingSetup = ({setIsSetupComplete}: {setIsSetupComplete: (value: boolean) => void}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);

  const call = useCall();

  useEffect(() => {
    if (isMicCamToggledOn) {
      call?.camera?.disable();
      call?.microphone?.disable();
    } else {
      call?.camera?.enable();
      call?.microphone?.enable();
    }
    
  }, [isMicCamToggledOn, call?.camera, call?.microphone])

  return (
    <div className='flex flex-col items-center justify-center gap-3 text-white w-full h-screen'>
      <h1 className="text-2xl font-bold">
        Setup
      </h1>
      <VideoPreview />
      <div className="flx h-16 items-center justify-center gap-3">
        <label className="flex items-center gap-2 justify-center font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
        Join with Microphone and Camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="bg-green-500 px-4 py-2.5 focus-visible:ring-0 focus-visible:ring-offset-0"
        onClick={() => {
          call?.join()

          setIsSetupComplete(true)
        }}
      >
        Join meeting
      </Button>
    </div>
  )
}

export default MeetingSetup