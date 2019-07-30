import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { color } from 'src/theme/color'

const Quote = ({ fill = color.text, height = 25, width = 38 }) => (
    <Svg width={width} height={height} fill="none">
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.864.333h7.74c-.932 6.867-1.756 13.6-2.114 21.134H.3C1.59 14.133 4.277 7.2 8.864.333zm18.024 0h7.633c-.825 6.867-1.756 13.6-2.114 21.134H18.252c1.47-7.334 4.05-14.267 8.636-21.134z"
            fill={fill}
        />
    </Svg>
)

export default Quote
