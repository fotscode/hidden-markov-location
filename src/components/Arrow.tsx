import * as React from "react"

const directionMap = {
  up: "M4.468 1048.341h1.996v-9h9v-2h-11z",
  down: "M.536 1044.409v-1.997h9v-9h2v11z",
  left: "M15.464 1044.409v-1.997h-9v-9h-2v11z",
  right: "M11.532 1048.341H9.536v-9h-9v-2h11z",
}

export const Arrow = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width ? props.width : 75}
    height={props.height ? props.height : 75}
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      d= {directionMap[props.direction] ? directionMap[props.direction] : directionMap["up"]}
      style={{
        fill: "#fff",
        fillOpacity: 1,
        fillRule: "evenodd",
        stroke: "none",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        strokeOpacity: 1,
      }}
      transform="rotate(45 1254.793 524.438)"
    />
  </svg>
)

