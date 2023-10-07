import { SVGProps } from 'react'

const Spinner = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <circle
            cx={12}
            cy={12}
            r={10}
            stroke="currentColor"
            strokeWidth={4}
            className="stroke-azure"
        />
        <path
            fill="currentColor"
            className="fill-whiteSmoke stroke-whiteSmoke"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
    </svg>
)
export default Spinner
