import React from 'react'

function InfoBox({title, cases, total, onClick, isRed, active}){
  return(
    <div onClick={onClick} className={`infobox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}>

      <p className="infobox__title"><u>{title}</u></p>

      <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

      <p className="infobox__total">{total}</p>

    </div>
  )
}

export default InfoBox
