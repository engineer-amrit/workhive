import WholePageLoader from './WholePageLoader'
import { Suspense, type ReactNode } from 'react'

const LoaderWrapper = ({
    children
}: {
    children: ReactNode
}) => {
    return (
        <Suspense fallback={<WholePageLoader />}>
            {/* Your lazily loaded component goes here */}
            {children}
        </Suspense>
    )
}

export default LoaderWrapper
