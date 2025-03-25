import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PostAddIcon from '@mui/icons-material/PostAdd';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
export const NavBarData = [
{
    icon: <HomeIcon style = {{ fontSize: 75 }} />,
    link: "/home"
},

{
    icon: <CalendarMonthIcon style = {{ fontSize: 75 }}  />,
    link: "/calender"
},

{
    icon: <GroupIcon style = {{ fontSize: 75 }}  />,
    link: "/clients"
},

{
    icon: <PostAddIcon style = {{ fontSize: 75 }}  />,
    link: "/programs"
},

{
    icon: <SettingsIcon style = {{ fontSize: 75 }}  />,
    link: "/settings"
},

]