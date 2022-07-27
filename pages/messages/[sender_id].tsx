import React from 'react'
import Avatar from '../../components/Avatar'
import Back from '../../components/Back'
import HeaderImage from '../../components/HeaderImage'

function Messages() {
  return (
    <div>
        <HeaderImage title="Messages" />
        <Back />
        <div className="w-[80%] border mx-auto p-5">
        {/* Send message box */}
        <div className="flex space-x-2">
          <Avatar className="h-10 w-10" />
          <textarea className="border outline-none p-2 rounded-md flex-1" />  
          <button className="btn justify-self-center px-4">Send</button>
        </div>
        
        </div>
    </div>
  )
}

export default Messages