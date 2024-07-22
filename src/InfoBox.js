import { CardContent, Card, Typography } from '@mui/material'
import "./InfoBox.css"
import React from 'react'

function InfoBox({title, cases, total,active, ...props}) {
  console.log("selected--"+cases+"");
  return (
    <Card onClick={props.click} className={`infoBox ${active && "selected--"+title+""}`}>
        <CardContent>
            <Typography className="infobox_title" color="textSecondary">{title}</Typography>

            <h2 className="infobox_cases">{cases}</h2>

            <Typography className="infobox_total" color="textSecondary">{total} total</Typography>

        </CardContent>
    </Card>
  )
}

export default InfoBox