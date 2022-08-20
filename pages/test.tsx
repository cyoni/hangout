import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import { getPlace } from '../lib/dbClient';

export default function Test() {
  const [result, setResult] = React.useState<string>()

  React.useEffect(()=>{
    const xx = async () => {
      const rst = await getPlace([500])
      console.log("rst: " + rst)
      setResult(rst)
    }
     xx()
  },[])


 
  return (
   <div>
    {JSON.stringify( result ) }
   </div>
  );
}
