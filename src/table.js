import React from 'react'
import { formatprint } from './util'

function table({countries}) {
  return (
    <div className='table'>
        {
            countries.map(({country, cases}) =>(
                <tr>
                    <td>
                        {country}
                    </td>
                    <td>
                        <strong>{formatprint(cases)}</strong>
                   </td>
                </tr>
            ))
        }
    </div>
  )
}

export default table